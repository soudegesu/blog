---
title: "S3にエクスポートされたCloudWatch LogsのファイルをGlueのCrawlerでETLしようとして轟沈した話"
description: "S3にエクスポートした CloudWatch Logs のログファイルをAWS GlueでETLしようと挑戦してみました。結論から言うと、GlueのCrawlerがログをいい感じにパースできなかったので、失敗しました、という話です。"
date: 2018-05-30
categories:
  - aws
tags:
  - s3
  - cloudwatchlogs
  - glue
url: /aws/glue-process-cloudwatchlogs/
twitter_card_image: https://www.soudegesu.com/images/icon/glue_icon.png
---

S3にエクスポートした CloudWatch Logs のログストリームをAWS GlueでETLしようと挑戦してみました。
結論から言うと、GlueのCrawlerでログをいい感じにパースできなかったので、失敗しました、という話です。

## モチベーション

### S3のファイルをETLしたい

「 [Step FunctionsでCloudWatch LogsのロググループをS3へエクスポートする](/aws/export-cloudwatchlogs-to-s3/) 」 の記事にて、
CloudWatch LogsのログストリームをS3へエクスポートしました。

次のステップとしては、データ分析しやすいようにETLしようというわけです。

### ETLといえばGlue

AWS上でETL処理を行うのであれば、聞いたことがあるのはやはり [AWS Glue](https://aws.amazon.com/jp/glue/) でしょう。

Apache Sparkをベースとしており、せっかくだから使ってみたかったわけです。

## やってみよう

以下のような構成で処理させようと考えていました。

![architecture](/images/20180530/architecture.png)

### 基データのログフォーマット

CloudWatch LogsはログデータがJSONフォーマットになっていると、
JSON pathのような検索ができたり、ログを展開したときにpretty printしてくれるのでよく使ってしまいます。

![cloudwatch_logs](/images/20180530/cloudwatch_logs.png)

今回処理させたいデータも、この **JSONフォーマットのログをCloudWatch Logsのエクスポート機能でS3にファイル出力したもの** です。

### Crawlerの設定でつまずく

[AWS Glue と Amazon S3 を使用してデータレイクの基礎を構築する](https://aws.amazon.com/jp/blogs/news/build-a-data-lake-foundation-with-aws-glue-and-amazon-s3/) にも記載がありますが、
Glueには **Crawler** という設定があり、指定したデータソースの更新を確認し、データカタログを **よしなに作ってくれる機能** があります。

ただ、どう「よしなに」作ってくれるかというと、 [公式ドキュメント](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/add-classifier.html)
記載の通り、テキストのフォーマット毎に指定のロジックがあり、それに準じて処理するデータ形式を判断しているようです。

これを見て **「よっしゃ、いい感じにJSONになるのね」** と早合点して、ポチポチ設定を進めていったのが問題でした。

### ログフォーマットが変わっている？

Crawlerが S3バケットのファイルからデータカタログを作成してくれたわけですが、以下のように 「[ion](http://amzn.github.io/ion-docs/) でした」
という結果が出てきました。

![ion](/images/20180530/ion.png)

「あれ？jsonではないの？」

そう思って、S3上の .gz ファイルの中身を見てみると以下のような形式になっていました。

```
2018-05-27T00:00:00.107Z {ログのJSON文字列}
2018-05-27T00:01:36.107Z {ログのJSON文字列}
(以下略)
```

**CloudWatch Logsからログデータをエクスポートすると、タイムスタンプ情報も出力されてしまい、 JSON形式でなくなっていた** わけですね。

### Grokも模索してみたが。。

Crawlerがログファイルを分類するために、自前の [カスタム分類子](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/custom-classifier.html) を設定することもできます。

![crawler_classifier](/images/20180530/crawler_classifier.png)

* Grok
* XML
* JSON

の3つが定義されているのですが、XMLとJSONはすでにテキスト形式がそのフォーマットに加工されている必要があるので、使えそうにありません。
よく Log Stash などで使われる **Grok形式** が一番カスタマイズ性が高いのですが、この設定を用いても
要素が可変になるJSONを処理することはできませんでした。

### サポートにも相談してみたが。。

「私のGlueの設定が悪いのかも」と一縷の望みを託して、AWSのサポートにも聞いてみたのですが、「Glue単体で今回のログフォーマットは処理できない」と回答をいただきました。

## まとめ

GlueのCrawlerでいい感じにデータカタログを作るのに失敗しました。

デフォルトの分類子、または、自前で定義したカスタム分類子によってGlueのCrawlerはデータカタログを作成してくれます。
しかし、すべてのフォーマットに対して柔軟に処理できるわけではないので、フォーマットによってはGlueが処理しやすいように前段で自前ETLを挟んであげる必要がありそうです。

特に今回のような、 **CloudWatch LogsのログがJSON形式で、エクスポート機能でS3に外出ししたファイル（ログの一部がJSON形式）** の場合には相性が悪いということがわかりました。

## 参考にさせていただいたサイト

* [AWS Glue と Amazon S3 を使用してデータレイクの基礎を構築する](https://aws.amazon.com/jp/blogs/news/build-a-data-lake-foundation-with-aws-glue-and-amazon-s3/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e91e78f505e53d2986a0635db4aad1ce&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
</div>
