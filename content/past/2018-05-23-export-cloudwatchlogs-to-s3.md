---
title: "Step FunctionsでCloudWatch LogsのロググループをS3へエクスポートする"
description: "CloudWatch LogsにはロググループをS3にエクスポートする機能がついています。しかし、エクスポート機能には同時実行数制限があるので、 今回は Step Functions を使ってS3へのログのエクスポートを実現しました。"
date: 2018-05-23
thumbnail: /images/icons/stepfunction_icon.png
categories:
    - aws
tags:
    - s3
    - cloudwatchlogs
    - stepfunction
    - lambda
url: /aws/export-cloudwatchlogs-to-s3/
twitter_card_image: /images/icons/stepfunction_icon.png
---

CloudWatch LogsにはロググループをS3にエクスポートする機能がついています。
しかし、エクスポート機能には同時実行数制限があるので、 今回は Step Functions を使ってS3へのログのエクスポートを実現しました。

<!--adsense-->

## モチベーション

### ログをS3にエクスポートしたい

CloudWatch Logsのコンソールは特定の文字列を含むログを検索するのは得意ですが、ログの集計や可視化には向いていません。
S3にログを集積し、そこをDWHにしてETL処理を施して可視化したりするのが事例としてよく見かけるので、
今回は **Cloudwatch LogsのいくつかのログストリームをS3にエクスポートしたい** と考えました。

### Subscription Filterが使われている、、だと!?

CloudWatch LogsからS3へログストリームを転送する簡易な方法は [Kinesis Firehose](https://docs.aws.amazon.com/ja_jp/firehose/latest/dev/what-is-this-service.html) を使う方法です。

リアルタイムでログを流し込めますし、処理中に Lambda 関数を挟むことができるので大変便利ですが、ここで一つ問題がありました。

それは **既に Subscription Filter が埋まっていた** ことです。

![cloudwatchlogs_subscription](/images/20180523/cloudwatchlogs_subscription.png)

（上は既にKinesis StreamにSubscription Filterを奪われた図）

CloudWatch Logsを外部のAWSリソースにストリーム接続させるには `Subscription Filter` を設定する必要があるのですが、仕様上、 **1ログストリームに対して1Subscription Filterしか設定できません。**

大抵、CloudWatch Logsの重要なログストリームほど、Subscription Filterが既に何者かによって設定されていて、運用上すんなり引っ剥がせないのです。

### Create Export Taskは同時に1実行まで

そこで、CloudWatch Logsの **ログストリームをS3にエクスポートする機能** を使おうと考えるわけです。

エクスポートする時間帯をUTCでレンジ指定することで、対象期間のログストリームを任意のバケットにエクスポートする **タスク** を登録できます。

![export_task](/images/20180523/export_task.png)

ただこれにも制約があります。**エクスポート機能は1度に1回しか実行できない** のです。
エクスポートするためのタスクを生成した後、そのエクスポートタスクのステータスが `COMPLETED` になるまで、
次のエクスポートを設定できません。

実装目線で言えば、**エクスポートタスクの終了を待ち合わせて、次のログストリームをエクスポートタスクを設定する** 必要がありそうです。

<!--adsense-->

## Step Functionsで create export task APIを呼びまくる

というわけでやってみましょう。今回実装した処理の流れはざっくり以下です。

1. CloudWatch Events で定期的に（Dailyとか） Step Functions を実行
2. Step Functionsから Lambda を キック
3. Lambda では CloudWatch Logs の create export task を実行
4. create export task で S3にログがエクスポートされる

![export_to_s3](/images/20180523/export_to_s3.png)

順を追って見ていきましょう。手順的には後段から作る必要があるので、それに準じて説明します。

### S3バケットを準備する

まずは、ログがエクスポートされるS3バケットを作成しましょう。

バケットは普通に作れば良いとして、 **バケットポリシーを以下のように指定する** のがポイントです。

{{< highlight json "linenos=inline" >}}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": {
                "Service": "logs.${リージョン名}.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::${バケット名}/*",
            "Condition": {
                "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        },
        {
            "Sid": "2",
            "Effect": "Allow",
            "Principal": {
                "Service": "logs.${リージョン名}.amazonaws.com"
            },
            "Action": "s3:GetBucketAcl",
            "Resource": "arn:aws:s3:::${バケット名}"
        }
    ]
}
{{< / highlight >}}

### Lambdaの実装

次に CloudWatch Logsのexport task apiをコールするためのLambda Functionを作成します。
以下にコードサンプルを載せます。

{{< highlight python "linenos=inline" >}}
#!/usr/bin/env python
# -*- coding:utf-8 -*-

import logging
import boto3
from datetime import datetime
from datetime import timedelta
from dateutil.parser import parse
import pytz
import time
import os

def _is_executing_export_tasks():
    '''
    export taskが実行中かどうかチェック
    '''
    client = boto3.client('logs')
    for status in ['PENDING', 'PENDING_CANCEL', 'RUNNING']:
        response = client.describe_export_tasks(limit = 50, statusCode=status)
        if 'exportTasks' in response and len(response['exportTasks']) > 0:
            return True
    return False

def _get_target_date(event):
    '''
    CloudWatch Eventsの(実行日時 - 1)日をエクスポート対象にする
    '''
    target = None
    tokyo_timezone = pytz.timezone('Asia/Tokyo')

    utc_dt = datetime.strptime(event['time'], '%Y-%m-%dT%H:%M:%SZ')
    tokyo_time = utc_dt.astimezone(tokyo_timezone)
    target = tokyo_time - timedelta(days=1)
    t = target.replace(hour=0, minute=0, second=0, microsecond=0)

    target_date = t.strftime('%Y%m%d')
    from_time = int(t.timestamp() * 1000)
    to_time = int((t + timedelta(days=1) - timedelta(milliseconds=1)).timestamp() * 1000)
    return from_time, to_time, target_date

def _get_log_group(next_token):
    '''
    ロググループを取得する
    '''
    client = boto3.client('logs')
    if next_token is not None and next_token != '':
        response = client.describe_log_groups(limit = 50, nextToken = next_token)
    else:
        # nextTokenは空文字を受け付けない
        response = client.describe_log_groups(limit = 50)

    if 'logGroups' in response:
        yield from response['logGroups']
    # ロググループが多くて50件(最大)を超えるようなら再帰呼出し
    if 'nextToken' in response:
        yield from _get_log_group(next_token = response['nextToken'])

def _is_bucket_object_exists(bucket_name, bucket_dir):
    client = boto3.client('s3')
    response = client.list_objects_v2(Bucket = bucket_name, Prefix = (bucket_dir))
    return 'Contents' in response and len(response['Contents']) > 0

def _export_logs_to_s3(bucket_name, bucket_dir, from_time, to_time, log_group_name):
    client = boto3.client('logs')
    response = client.create_export_task(taskName = bucket_dir, logGroupName = log_group_name, fromTime = from_time, to = to_time, destination = bucket_name, destinationPrefix = bucket_dir)

def lambda_handler(event, context):
    bucket_name = os.environ['BUCKET_NAME']
    from_time, to_time, target_date = _get_target_date(event=event)

    if _is_executing_export_tasks():
        return {
            "status": "running",
            "time": event['time']
        }

    for log_group in _get_log_group(next_token=None):
        bucket_dir = log_group['logGroupName'] + '/' +target_date
        if log_group['logGroupName'].find('/') == 0:
            bucket_dir = log_group['logGroupName'][1:]

        if _is_bucket_object_exists(bucket_name = bucket_name, bucket_dir = bucket_dir):
            continue
        _export_logs_to_s3(bucket_name = bucket_name, log_group_name = log_group['logGroupName'], from_time= from_time, to_time = to_time, bucket_dir = bucket_dir)
        return {
            "status": "running",
            "time": event['time']
        }

    return {
        "status": "completed",
        "time": event['time']
    }
{{< / highlight >}}

ポイントは **Lambdaに戻り値を設定する** ことです。
今までLamdaで戻り値を指定しても使いみちは殆ど無かったのですが、ここでは役に立つのです。

**Step Functionsでは戻り値を受け取り、それを後段のタスクに渡すことができます。**

### Step Functionsの実装

次にステートマシンを定義します。今回のメインはこれです。

定義したステートマシンは以下のようになっています。

![statemachine](/images/20180523/statemachine.png)

各ステートの説明はざっくり以下になります。

1. `Export Awslogs to S3` ：create export taskをする
2. `Finished exporting?` ：処理中または処理可能なログストリームが存在するかチェックする
3. `Success` ：ステートマシンの終了
4. `Wait a minute` ：export taskが終わりそうな時間を適当に待つ

{{< highlight json "linenos=inline" >}}
{
  "Comment": "Export Cloudwatch LogStream recursively",
  "StartAt": "Export Awslogs to S3",
  "TimeoutSeconds": 86400,
  "States": {
    "Export Awslogs to S3": {
      "Type": "Task",
      "Resource": "${Lambdaのarn}",
      "Next": "Finished exporting?"
    },
    "Finished exporting?": {
      "Type": "Choice",
      "Choices":[{
        "Variable": "$.status",
        "StringEquals": "running",
        "Next": "Wait a minute"
      },{
        "Variable": "$.status",
        "StringEquals": "completed",
        "Next": "Success"
      }]
    },
    "Wait a minute": {
      "Type": "Wait",
      "Seconds": 5,
      "Next": "Export Awslogs to S3"
    },
    "Success": {
      "Type": "Succeed"
    }
  }
}
{{< / highlight >}}

ポイントとしては、**Waitのステートを入れている** ところです。

create export task のAPIは同時に実行できないので、`COMPLETE` するまでの概算秒数を入れています。

**Lambdaには実行時間の上限があるのと、稼働時間に応じた課金になる** ので、Lambda関数の中でsleepするのは好ましくありません。

もちろん、秒数は概算で問題なく、エクスポートが `COMPLETE` 以外の場合には
`Export Awslogs to S3` → `Finished exporting?` → `Wait a minute` をぐるぐる回るようにしておくのが良いでしょう。
とは言え、無限ループにならないようにタイムアウト値 `TimeoutSeconds: 86400` (24時間)を指定しています。
少し長いかもしれないので、要調整です。

### CloudWatch Eventsの設定

CloudWatch Eventsでタイムベースのトリガー指定をします。

Step Functionsのarnを指定するだけなので、そこまで凝った所はありません。

![cloudwatch_events](/images/20180523/cloudwatch_events.png)

このときに指定するロールには、信頼関係に `events.amazonaws.com` を指定し、
最低限以下のポリシーが必要です。

{{< highlight json "linenos=inline" >}}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "states:StartExecution"
            ],
            "Resource": [
                "${Step Functionsのarn}"
            ]
        }
    ]
}
{{< / highlight >}}

### 動かしてみる

ロググループがたくさんエクスポートされていきます。
ちなみに、AWSアカウント内のロググループを全てエクスポートしたら、下のようになりました。
（表示列は設定変更しています）

![stacked_task](/images/20180523/stacked_task.png)

<!--adsense-->

## まとめ

今回はStep Functionsを使って、複数のCloudWatch LogsのロググループをS3にエクスポートする機能を作りました。

Lambdaを再帰的に実行する簡易なステートマシンですが、
Waitを外出ししているため、 **Lambdaの実行時間制限をカバーしてくれています。**

ステートマシンでは **Lambdaの戻り値を使うことできる** ため、 **Lambda関数自体も更に分割することが可能** です。
今までの重厚なLambda関数をより視覚的にもわかりやすくすることができるのは魅力ですね。

Step FunctionsはLambda以外にも様々なAWSリソースと連携ができるので、
ステートマシンを軸としたサーバレスな事例が多く紹介されてくることでしょう。

## 参考にさせていただいたサイト

* [[新機能]Amazon Kinesis FirehoseでS3にデータを送ってみた #reinvent](https://dev.classmethod.jp/cloud/aws/put-data-on-s3-through-firehose/)
* [Step Functions の詳細](https://docs.aws.amazon.com/ja_jp/step-functions/latest/dg/how-step-functions-works.html)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e91e78f505e53d2986a0635db4aad1ce&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
</div>
