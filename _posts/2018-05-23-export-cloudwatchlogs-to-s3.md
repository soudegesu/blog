---
title: "Step FunctionsでCloudWatch LogsのロググループをS3へエクスポートする"
description: "CloudWatch LogsにはロググループをS3にエクスポートする機能がついています。しかし、エクスポート機能には同時実行数制限があるので、 今回は Step Functions を使ってS3へのログのエクスポートを実現しました。"
date: 2018-05-23 00:00:00 +0900
categories: aws
tags: s3 cloudwatchlogs stepfunction lambda
header:
  teaser: /assets/images/icon/stepfunction_icon.png
---

CloudWatch LogsにはロググループをS3にエクスポートする機能がついています。
しかし、エクスポート機能には同時実行数制限があるので、 今回は Step Functions を使ってS3へのログのエクスポートを実現しました。

* Table Of Contents
{:toc}

## モチベーション

### ログをS3にエクスポートしたい

CloudWatch Logsのコンソールは特定の文字列を含むログを検索するのは得意ですが、ログの集計や可視化には向いていません。
S3にログを集積し、そこをDWHにしてETL処理を施して可視化したりするのが事例としてよく見かけるので、
今回はCloudwatch LogsのいくつかのログストリームをS3にエクスポートしたいと考えました。

### Subscription Filterが使われている、、だと!?

CloudWatch LogsからS3へログストリームを転送する簡易な方法は [Kinesis Firehose](https://docs.aws.amazon.com/ja_jp/firehose/latest/dev/what-is-this-service.html) を使う方法です。

リアルタイムでログを流し込めますし、処理中に Lambda 関数を挟むことができるので大変便利ですが、ここで一つ問題がありました。

それは **既に Subscription Filter が埋まっていた** ことです。

![cloudwatchlogs_subscription]({{site.baseurl}}/assets/images/20180523/cloudwatchlogs_subscription.png)

（上は既にKinesis StreamにSubscription Filterを奪われた図）

CloudWatch Logsを外部のAWSリソースにストリーム接続させるには `Subscription Filter` を設定する必要があるのですが、仕様上、 **1ログストリームに対して1Subscription Filterしか設定できません。**

大抵、CloudWatch Logsの重要なログストリームほど、Subscription Filterが既に何者かによって設定されていて、運用上すんなり引っ剥がせないのです。

### Create Export Taskは同時に1実行まで

そこで、CloudWatch Logsの **ログストリームをS3にエクスポートする機能** を使おうと考えるわけです。

![export_task]({{site.baseurl}}/assets/images/20180523/export_task.png)

ただこれにも制約があります。**エクスポート機能は1度に1回しか実行できない** のです。
エクスポートするためのタスクを生成した後、そのエクスポートタスクのステータスが `COMPLETED` になるまで、
次のエクスポートを設定できません。

実装目線で言えば、**エクスポートタスクの終了を待ち合わせて、次のログストリームをエクスポートタスクを設定する** 必要がありそうです。

## やってみよう

### Lambda Functionの実装

### StepFunctionsの実装

### CloudWatch Eventsの設定

## まとめ

## 参考にさせていただいたサイト
* [[新機能]Amazon Kinesis FirehoseでS3にデータを送ってみた #reinvent](https://dev.classmethod.jp/cloud/aws/put-data-on-s3-through-firehose/)
