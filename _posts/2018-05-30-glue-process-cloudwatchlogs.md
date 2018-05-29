---
title: "AWS GlueでCloudWatch LogsのログファイルをETLしようとして失敗した話"
description: "S3に退避した CloudWatch Logs のログストリームをAWS GlueでETLしようと挑戦してみました。結論から言うと、GlueのCrawlerがログをいい感じにパースできなかったので、失敗しました、という話です。"
date: 2018-05-30 00:00:00 +0900
categories: aws
tags: s3 cloudwatchlogs glue
header:
  teaser: /assets/images/icon/glue_icon.png
---

S3に退避した CloudWatch Logs のログストリームをAWS GlueでETLしようと挑戦してみました。
結論から言うと、GlueのCrawlerがログをいい感じにパースできなかったので、失敗しました、という話です。

* Table Of Contents
{:toc}

## モチベーション

### S3のファイルをETLしたい

「 [Step FunctionsでCloudWatch LogsのロググループをS3へエクスポートする](/aws/export-cloudwatchlogs-to-s3/) 」 の記事にて、
CloudWatch LogsのログストリームをS3へエクスポートできました。

次のステップとしては、データ分析しやすいようにETLしようというわけです。

### ETLといえばGlue

AWS上でETL処理を行うのであれば、聞いたことがあるのはやはり [AWS Glue](https://aws.amazon.com/jp/glue/) でしょう。

Apache Sparkをベースとしており、私も利用が初めてなので、せっかくだから使ってみようと考えたわけです。


## 参考にさせていただいたサイト
* [AWS Glue と Amazon S3 を使用してデータレイクの基礎を構築する](https://aws.amazon.com/jp/blogs/news/build-a-data-lake-foundation-with-aws-glue-and-amazon-s3/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e91e78f505e53d2986a0635db4aad1ce&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
</div>
