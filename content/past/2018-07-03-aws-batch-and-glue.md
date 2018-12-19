---
title: "AWS Batchで前処理をしてGlue CrawlerでAthenaのスキーマを作成する"
description: "以前、 S3にエクスポートされたCloudWatch LogsのファイルをGlueのCrawlerでETLしようとして轟沈した話でGlueを少し触ってみたのですが、今回はAWS Batchで前処理をしてGlue CrawlerでAthenaのスキーマを自動生成しました、という話をしようと思います。"
date: 2018-07-02
thumbnail: /images/icons/glue_icon.png
categories:
    - aws
tags:
    - aws
    - batch
    - glue
    - stepfunctions
    - athena
url: /aws/aws-batch-and-glue/
twitter_card_image: /images/icons/glue_icon.png
---

以前、 [S3にエクスポートされたCloudWatch LogsのファイルをGlueのCrawlerでETLしようとして轟沈した話](/aws/glue-process-cloudwatchlogs/) でGlueを少し触ってみたのですが、今回はAWS Batchで前処理 + Glue CrawlerでAthenaのスキーマを自動生成しました、という話をしようと思います。

<!--adsense-->

## モチベーション：データを容易に検索したい

PUSH配信基盤の構築やレコメンドエンジン、その他諸々の機械学習関係の処理を普段使っていない人でも、
何らかのシステム開発に携わっているのであれば、システムが垂れ流すデータを見て、それを「いい感じに見たいなー」と思うことは良くあります。

今回は一般的なWeb APIのシステムにおいて、

* 障害の調査をより簡易にしたい
* リクエストの傾向を把握したい

といったモチベーションがあり、実装してみることにしました。

[Tableau](https://www.tableau.com/ja-jp) や [Redash](https://redash.io/) といった所謂BIツールで可視化してもいいのですが、
今回のケースでは検索を簡単にすれば十分なので、 **Athenaで検索できること** をゴールに設定しました。

## やってみる

### アーキテクチャ概要

さっそくやってみましょう。下図のようなアーキテクチャを構築しました。

![architecture](/images/20180702/architecture.png)

大まかな処理の流れを説明すると

1. S3バケットにファイルが置かれる
2. Object Put EventでLambdaが起動し、StepFunctionsを実行
3. StepfunctionsがAWS Batchのステートメントを管理
  1. AWS Batchの実行
  2. Batch Jobのステータス確認
4. AWS Batchで起動されるECSで前処理を実施し、成果物をS3にPUT
5. Glue CrawlerがS3のファイルからAthenaスキーマを自動生成

なお、図中の赤枠部分はクラスメソッドさんの 「[AWS Step Functionsでジョブ・ステータス・ポーリングを実装する](https://dev.classmethod.jp/cloud/aws/aws-step-functions-job-status-polling-cloudformation/)」 を参考に実装していますので、
説明は割愛します。

### バケットの作成

まずは図中のS3バケットを2つ作成します。用途としては以下です。

* 整形前データ置き場
* 整形後データ置き場（Glue Crawlerが参照するバケット）

### AWS Batchの実装

前処理を行うAWS Batchの実装をしましょう。
Batchと言いつつも、内部的にはECSが起動して処理を行うため、AWS Batchの設定にはECSに対する一定の理解も必要です。

#### ECRの作成

まずは、AWS Batchで実行させるECSコンテナのDockerイメージをECRにPushします。

今回は前処理をPython 3.6で実行させたいので、 `python:3.6.5-alpine` のイメージを使ってDockerfileを作成します。
コンテナ内の `/opt/etl` 配下にpythonプログラムを置くイメージです。

{{< highlight vim "linenos=inline" >}}
FROM python:3.6.5-alpine

MAINTAINER soudegesu

COPY ./etl /opt/etl
COPY ./requirements.txt /opt/requirements.txt

RUN pip install --upgrade pip
RUN pip install -r /opt/requirements.txt
{{< / highlight >}}

ビルドしたdocker imageをECRにpushすればOKです。

#### コンピューティング環境の設定

AWS Batchから起動させるコンピューティング環境の設定をします。
これはAWS batchから起動するECSインスタンスの設定です。

Terraformで設定例を書くと以下のようになります。

{{< highlight go "linenos=inline" >}}
resource "aws_batch_compute_environment" "etl" {
    compute_environment_name = "etl"
    compute_resources {
        instance_role = "${ECSインスタンスのRole}"
        instance_type = [
            ${EC2インスタンスタイプ}"
        ]
        max_vcpus = 16
        min_vcpus = 2
        desired_vcpus = 2
        security_group_ids = ["${SecurityGroupのID}"]
        subnets = ["${SubnetのID}"]
        type = "EC2"
    }
    service_role = "arn:aws:iam::${アカウント番号}:role/service-role/AWSBatchServiceRole"
    type = "MANAGED"
}
{{< / highlight >}}

#### ジョブキューの作成

次にジョブキューの設定を行います。キューに格納されたジョブの実行の優先順位や、実行時のコンピューティングリソースの紐付けを定義しておきます。

Terraformで設定例を書くと以下のようになります。

{{< highlight go "linenos=inline" >}}
resource "aws_batch_job_queue" "etl" {
    name = "etl"
    state = "ENABLED"
    priority = 1
    compute_environments = [
        "${aws_batch_compute_environment.etl.arn}"
    ]
}
{{< / highlight >}}

#### バッチのジョブ定義

次に実行するジョブの定義をします。

ジョブと言っても、ECSのタスク定義の情報に加えて、コンテナ起動後に実行するコマンドを書いたりします。

Terraformで設定例を書くと以下のようになります。

コンテナ内で任意のプログラムを実行する場合には `command` プロパティ部に設定を行います。
引数部分に `Ref::` という見慣れないものがありますが、これは後述します。

{{< highlight go "linenos=inline" >}}
resource "aws_batch_job_definition" "etl" {
    name = "etl"
    type = "container"
    container_properties = <<EOF
{
    "command": ["python",
        "/opt/etl/main.py",
        "-b",
        "Ref::bucket",
        "-k",
        "Ref::objKey"
    ],
    "environment": [
         {
            "name": "TMP",
            "value": "/tmp"
         },
         {
            "name": "UPLOAD_BUCKET",
            "value": "${バケット名}"
         }
    ],
    "image": "${var.account_id}.dkr.ecr.${var.region}.amazonaws.com/etl:${var.image_tag}",
    "memory": 1024,
    "vcpus": 2,
    "ulimits": [
      {
        "hardLimit": 1024,
        "name": "nofile",
        "softLimit": 1024
      }
    ]
}
EOF

}
{{< / highlight >}}

なお、ここで実行される `main.py` の処理概要は以下になります。

1. 基データのあるバケットからデータを取得する
2. データレコードは **JSONフォーマット** に加工する
3. ETL済みデータのあるバケットへアップロードする
    * S3バケットに **Hiveフォーマット（ `dt=yyyy-MM-dd-HH-mm` ） でパーティション（フォルダ）を作成** する
    * ファイルは `.gz` でアップロードする

#### ジョブを実行するLambdaの実装

AWS Batchのジョブを実行するだけのサンプルコードを書きます。

{{< highlight python "linenos=inline" >}}
import json
import boto3
import logging
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def lambda_handler(event, context):

    job_name = os.environ['JOB_NAME']
    job_queue = os.environ['JOB_QUEUE']
    job_definition = os.environ['JOB_DEFINITION']
    bucket_name = os.environ['BUCKET_NAME']
    obj_key = os.environ['OBJECT_KEY']
    parameters = {
        'bucket': str(bucket_name),
        'objKey': str(obj_key)
    }

    batch = boto3.client('batch')
    try:
        response = batch.submit_job(jobQueue=job_queue, jobName=job_name, jobDefinition=job_definition, parameters=parameters)
        jobId = response['jobId']
        return {
            'jobId': jobId
        }
    except Exception as e:
        logger.error(e)
        raise Exception('Error submitting Batch Job')

{{< / highlight >}}

要点としては `submit_job` 関数の `parameters` 引数で渡されたデータが、
先程のバッチジョブ定義の `Ref::` を置換することで、動的なデータの受け渡しを実現しています。

（今回のケースで言えば `bucket` と `objKey` が置換されます）


{{< highlight json "linenos=inline" >}}
    "command": ["python",
        "/opt/etl/main.py",
        "-b",
        "Ref::bucket",
        "-k",
        "Ref::objKey"
    ],
{{< / highlight >}}

ここまで来れば、ETL済みのバケットへ以下のような構成でデータがアップロードされているはずです。

![hive](/images/20180702/hive.png)

### Glue CrawlerからAthenaのスキーマを作成する

GlueのCrawlerはデータソースに任意のデータベースやS3を指定することができ、
そのデータからAthenaのスキーマを自動生成してくれる機能を持っています。

Terraform AWS Providerが2018/06にGlue Crawlerに対応したこともあり、Terraformで書いてみましょう。

まずはデータベースの設定です。これはAthenaのデータベースになります。

{{< highlight go "linenos=inline" >}}
resource "aws_glue_catalog_database" "sample" {
    name = "${データベース名}"
}
{{< / highlight >}}

次にCrawlerの設定です。

今回のユースケースであれば `role` は最低限 `AWSGlueServiceRole` がついていれば問題ありません。

`schedule` にてCrawlerが対象のS3のパスを見に行くスケジュールの指定ができますし、
スキーマ変更があった場合の振る舞いを定義（今回は「データが無くなっていたら削除する」に指定）できます。

{{< highlight go "linenos=inline" >}}
resource "aws_glue_crawler" "sample" {
    database_name = "${aws_glue_catalog_database.sample.name}"
    name = "${Crawler名}"
    role = "${Glue用のRole}"

    s3_target {
        path = "${S3バケットのパス}"
    }

    schedule = "cron(0 21 * * ? *)"

    schema_change_policy = {
        delete_behavior = "DELETE_FROM_DATABASE"
    }
}
{{< / highlight >}}

Crawlerを実行すると、「Databases」 > 「Tables」 の中にいくつかデータテーブルができていることがわかります。
これがAthenaのテーブルとリンクします。

![glue_console](/images/20180702/glue_console.png)

作成されたテーブルの詳細を見てみると、`Classification` の部分が `json` となっています。
パーティション内のデータをJSON形式のデータと認識してスキーマを定義してくれたということです。

ネストされたJSONプロパティは `struct` として定義されていることもわかります。

![table_detail](/images/20180702/table_detail.png)

なお、コンソールからテーブルを選択して、「Action」 > 「View data」 を選択すると、Athenaコンソールの紐づいているデータベースへ画面遷移します。

![table_detail](/images/20180702/table_detail.png)

ここまで来れば、後は普通にクエリを書けるようになりますね。

## まとめ

今回はAWS Batchと AWS Glueを用いてAthenaのスキーマを生成するまでを行いました。
AWS BatchはStepFunctionsと組み合わせて利用することで、バッチ処理結果に伴うハンドリングができるので、堅めの処理をしたいときにはいいかもしれません。

今回のユースケースに限って言えば、AWS BatchではなくFargateの方が適切だったようにも思えます。（2018/7にFargateが東京リージョンに来ました）

予めGlueのCrawlerは、前処理でS3パーティションやデータ構造を工夫してあげるだけで、データカタログ（Athenaのスキーマ）を勝手に作ってくれるので大変便利です。

今回は、データカタログを作るまでで終わりますが、そこからGlue本来のSparkへの処理に繋げることもできますし、SageMakerでパーティションのS3バケットを覗き込ませることもできるでしょう。

Glueの採用事例が更に増えていくことに期待ですね！

## 参考にさせていただいたサイト

* [AWS Step Functionsでジョブ・ステータス・ポーリングを実装する](https://dev.classmethod.jp/cloud/aws/aws-step-functions-job-status-polling-cloudformation/)
* [AWS Black Belt Online Seminar 2017 AWS Batch](https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-2017-aws-batch)
* [ジョブ定義のパラメータ - AWS Batch](https://docs.aws.amazon.com/ja_jp/batch/latest/userguide/job_definition_parameters.html)


<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
