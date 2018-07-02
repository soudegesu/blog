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

## 実装してみる

### アーキテクチャ概要

### バケットの作成

### ECSの実装

### AWS Batchの実装

### Glue Crawlerの設定

### 確認してみる


## まとめ


## 参考にさせていただいたサイト

* [AWS Step Functionsでジョブ・ステータス・ポーリングを実装する](https://dev.classmethod.jp/cloud/aws/aws-step-functions-job-status-polling-cloudformation/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
