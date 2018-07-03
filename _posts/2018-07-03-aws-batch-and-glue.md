---
title: "AWS Batchで前処理をしてGlue CrawlerでAthenaのスキーマを作成する"
description: "以前、 S3にエクスポートされたCloudWatch LogsのファイルをGlueのCrawlerでETLしようとして轟沈した話でGlueを少し触ってみたのですが、今回はAWS Batchで前処理をしてGlue CrawlerでAthenaのスキーマを自動生成しました、という話をしようと思います。"
date: 2018-07-02 00:00:00 +0900
categories: aws
tags: aws batch glue stepfunctions athena
header:
  teaser: /assets/images/icon/glue_icon.png
---

以前、 [S3にエクスポートされたCloudWatch LogsのファイルをGlueのCrawlerでETLしようとして轟沈した話](/aws/glue-process-cloudwatchlogs/) でGlueを少し触ってみたのですが、今回はAWS Batchで前処理をしてGlue Crawlerを使ってAthenaのスキーマを自動生成しました、という話をしようと思います。

* Table Of Contents
{:toc}

## モチベーション：データの検索を容易にしたい

PUSH配信基盤の構築やレコメンドエンジン、その他諸々の機械学習関係の処理を普段使っていない人でも、
何らかのシステムに携わっているのであれば、そこにはシステムが垂れ流すデータが存在し、それを「いい感じに見たいなー」と思うことは良くあります。

今回は一般的なWeb APIのシステムにおいて、

* 障害の調査依頼を容易にしたい
* リクエストの傾向を把握したい

といったモチベーションがあり、実装してみることにしました。

[Tableau](https://www.tableau.com/ja-jp) や [Redash](https://redash.io/) といった所謂BIツールで可視化してもいいのですが、
今回のケースでは検索を簡単にすればいいだけだったので、 **Athenaで検索できること** をゴールに設定しました。

## やってみる

### アーキテクチャ概要

さっそくやってみましょう。下図のようなアーキテクチャを構築しました。

![architecture]({{site.baseurl}}/assets/images/20180702/architecture.png)

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
  * aaaa
    * aaaaa
* 整形後データ置き場（Glue Crawlerが参照するバケット）

### ECSの実装

### AWS Batchの実装

### Glue Crawlerの設定

### 確認してみる


## まとめ


## 参考にさせていただいたサイト

* [AWS Step Functionsでジョブ・ステータス・ポーリングを実装する](https://dev.classmethod.jp/cloud/aws/aws-step-functions-job-status-polling-cloudformation/)
* [AWS Black Belt Online Seminar 2017 AWS Batch](https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-2017-aws-batch)



<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
