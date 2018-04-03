---
title: "Cloudfront+Lambda@Edgeのサーバレスで動的なWEBコンテンツを作る節約術"
description: "CloudfrontとLambda@Edgeを用いたWEBコンテンツの作成方法を紹介します。静的なwebファイルのホスティングではなく、ロングテールSEOを狙ったパスパラメータ一による動的なURLに対応させます。"
date: 2018-04-02 00:00:00 +0900
categories: aws
tags: aws lambda cloudfront serverless
---

このブログ自体は `github-pages` と `cloudflare` を使って無料でホスティングをしているのですが、稀に **「動的なwebコンテンツを提供したい」** と思うことがあります。今回はお金を節約しつつ、動的なwebコンテンツを提供する方法を紹介します。


* Table Of Contents
{:toc}

## モチベーション
### 動的なwebコンテンツを作りたい！
Google Adsense等を使った広告収入で小遣い稼ぎをしたいと思った場合に、
`はてなブログ` のような無料ブログサービスや `Github Pages` を利用すると、主に静的ファイルでのコンテンツ配信が中心になるため、
1ページあたり1記事を作成する必要があり、1ページあたりの作成コストが高くなってしまいます。
動的なwebコンテンツを配信する機構があれば、リクエストパラメータないしはパスパラメータを使ってサーバ側で動的なページ生成を行うことで、
ロングテールでのページのクローリングを狙うことができます。
ちなみに、ロングテールを簡単に説明すると、 **単体の検索ボリュームでは少ないけど、複数カテゴリの検索クエリの組み合わせのバリエーションに対応することで、検索ボリュームの総和に対してリーチする** 方法です。

### 問題点：アクセスが少ない時期はランニングコストが高くつく
従来、動的なwebコンテンツを作成しようとする場合、**動的にページを生成するためのプログラムを動かすサーバが必要** でした。
レンタルサーバを借りることで環境を調達することが可能ですが、`WordPress` のような静的コンテンツの配信ではないので、`VPS` のようなサービスを契約しなければいけません。
その場合、以下のように通常のレンタルサーバよりもランニングコストがお高めになってしまいます。

|サービス名|月額料金(最低スペック)|
|====|====|
|[さくらのVPS](https://vps.sakura.ad.jp/)| 685JPY/month 〜|
|[GMOクラウド](https://vps.gmocloud.com/)| 780JPY/month 〜|

これではコンテンツ配信のための初期投資が大きくなりすぎてしまいますね。

### サーバレスで費用を抑えよう
今回はパブリッククラウドを使用することで初期費用を抑えることができます。もちろん、その変わりにプログラミングに関する知識が必要にはなります。
結論から先に言ってしまうと、利便性と最低利用料金のバランスが良い **案1 Cloudfront + Lambda@Edge** を採用しています。
いずれの場合も、最低利用料金+リクエスト量に応じた従量課金にコストが抑えられるので、VPSよりも割安です。
ざっくりですが勘案要素を以下にまとめました。

#### 案1 Cloudfront + Lambda@Edge

* メリット
    * サーバレス
    * CDNキャッシュが効く
* デメリット
    * Lambda@Edgeは無料利用枠がない
    * Node 6.10 しか利用できない
    * その他、通常のLambdaよりも[制限事項が多い](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge)

#### 案2 API Gateway + Lambda

* メリット
    * サーバレス
    * Lambdaがサポートしている複数言語での開発が可能
    * CDNキャッシュが効く
* デメリット
    * API Gatewayの最低利用料金がCloudfrontと比べて高い

#### 案3 GCPのGCE f1-micro インスタンス

* メリット
    * おそらく利用料金が最も安く抑えられる
* デメリット
    * ロケーションが遠いので、レイテンシが気になる
    * Cloud CDN と組み合わせるとf1-microインスタンス料金無料の旨味が消える
    * インスタンスの設定(ランタイムとかSSL証明書のインストールとか)が必要


## AWSで構築してみる
以降は案1での構築方法を記載していきます。

### IAM Roleの作成

Lambdaに付与するAMI Roleを作成します。
まず、以下のようなAssume Role Policy を作成します。

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "edgelambda.amazonaws.com",
          "lambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

作成したPolicyと `CloudWatchLogsFullAccess` のポリシーをアタッチしたRoleを作成します。
名前はとりあえず **EdgeLambdaForCloudfrontRole** としましょう。

### ドメインを設定する
Cloudfrontのディストリビューションのドメインをそのまま使うわけには行かないので、ドメインを設定します。
個人的にはドメインの取得に関してはお金を払って `.com` や `.net` のような信頼できるドメインの取得をオススメします。
ドメイン料金も抑えたい方は **「ドメイン 無料」** で検索すればいくらでも無料ドメインサービスが出てくるので、それを活用してください。

私が取得しているドメインは [Cloudflare](https://www.cloudflare.com/) で管理しているので、
Route53で取得しているドメインのサブドメインのHosted Zoneを作成し、NSレコードをcloudflare上に登録してあげます。

### Certification ManagerでSSL証明書を取得する

サブドメインの委譲が正しくできていれば(= Route53上の設定値でDNSが引けるようになれば) Certification Manager を用いてSSL証明書を取得しましょう。
SSL証明書の取得に関してはDNS Validationでやり方をオススメします。 詳しくは以前のポスト [AWS Certification ManagerのSSL証明書の検証にはDNS検証を使った方が良い]({% post_url 2018-01-31-acm-route53-validate %}) を見てみてください。
注意点として、**Certification Managerは us-east-1(Virginia)リージョンで取得する必要があります** 。
これは「Cloudfrontに適用可能なSSL証明書はVirginiaリージョンで発行されたもののみ」という仕様があるからです。

### Lambda関数の作成とpublish

次にLambda関数の実装を行います。 **Lambda@EdgeはNode 6.10のみをサポートしているため、Nodeでの実装が必要です** 。
軽量なwebアプリケーションを作成する手段として、手っ取り早いのは [express](https://www.npmjs.com/package/express) を使う方法です。
expressの使い方の説明は割愛しますが、実装時に注意すべき点だけ記載します。

#### Lambda@EdgeはCloudfrontのオリジンリクエスト時に実行させる

Lambda@EdgeとCloudfrontを連携させる場合に、Lambda@Edgeの実行タイミングを4つのうちから選択することができます。
詳細は[開発者ガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-cloudfront-trigger-events.html) に記載されています。

* CloudFront ビューワーリクエスト
    * リクエスト時にCloudfrontが受ける前にLambda@Edgeが処理をする(Lambda@Edge -> Cloudfront -> Origin)
* CloudFront オリジンリクエスト
    * リクエスト時にCloudfrontが受けた後にLambda@Edgeが処理をする(Cloudfront -> Lambda@Edge -> Origin)
* CloudFront オリジンレスポンス
    * レスポンス時にオリジンからのレスポンスをCloudfrontに返却する前にLambda@Edgeが処理をする(Cloudfront <- Lambda@Edge <- Origin)
* CloudFront ビューワーのレスポンス
    * レスポンス時にCloudfrontがクライアントにレスポンスを返却する前にLambda@Edgeが処理をする(Lambda@Edge <- Cloudfront <- Origin)

ここでは **CloudFront オリジンリクエスト** で実行することを選択しましょう。これにより、Originの代わりにEdge@Lambdaがレスポンスを返せるようになります。
`ビューワーリクエスト` にしてしまうと、CDNのキャッシュが活用できなくなりますし、 `オリジンレスポンス` にするとS3などでオリジンを作成しないといけなくなります。

#### Lambda@EdgeからCloudfrontへのレスポンス形式に注意する
オリジンリクエストを選択した場合、Lambda@EdgeからCloudfrontに返却するレスポンスの形式が以下のように定められているため、そちらに準拠する必要があります。

```
{
    body: 'content',
    bodyEncoding: 'text' | 'base64',
    headers: {
        'header name in lowercase': [{
            key: 'header name in standard case',
            value: 'header value'
         }],
         ...
    },
    status: 'HTTP status code',
    statusDescription: 'status description'
}
```

### Cloudfrontで配信する

## まとめ

## 参考にさせていただいたサイト
* [Amazon Cloudfront 開発者ガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses.html)


