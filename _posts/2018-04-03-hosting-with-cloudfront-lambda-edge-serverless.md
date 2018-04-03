---
title: "Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう[貧テック]"
description: "CloudfrontとLambda@Edgeを用いたWEBコンテンツの作成方法を紹介します。パスパラメータ一で動的なURL構成に対応可能で、ロングテールSEOも狙えるようになります。また、サーバレスによってランニングコストを抑えることもできるのでオススメです。"
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
`はてなブログ` のような無料ブログサービスや `Github Pages` を利用すると、主に静的ファイルでのコンテンツ配信が中心になります。
1ページあたり1記事を作成する必要があり、1ページあたりの作成コストが高くなるデメリットがあるため、
リクエストパラメータないしはパスパラメータを使ってサーバ側で動的なページ生成を行う機構があれば、
ロングテールでのページのクローリングを狙うことができます。
ちなみに、ロングテールをざっくり説明すると、 **単体の検索ボリュームでは少ないけど、複数カテゴリの検索クエリの組み合わせのバリエーションに対応することで、検索ボリュームの総和に対してリーチする** 方法です。

### 問題点：アクセスが少ない時期はランニングコストが高くつく
従来、動的なwebコンテンツを作成しようとする場合、**ページ生成プログラムを動かすためのサーバが必要** でした。
環境調達の方法としては「レンタルサーバを借りる」のが一般的ですが、バンドルされている [WordPress](https://ja.wordpress.org/) で要件が充足されないケースがある場合には、`VPS` サービスを契約しなければいけません。
VPSサービスは通常のレンタルサーバよりもランニングコストが少しお高めになってしまいます。

参考までに2種類のサービス料金を記載しますが、コンテンツ配信のための月額料金がボディブローのようにじわじわ効いてくることが容易に想像できます。

|サービス名|月額料金(最低スペック)|
|====|====|
|[さくらのVPS](https://vps.sakura.ad.jp/)| 685JPY/month 〜|
|[GMOクラウド](https://vps.gmocloud.com/)| 780JPY/month 〜|

### サーバレスで費用を抑えよう
前提として、**プログラミングに関する知識が必要にはなります** が、パブリッククラウドを使用することでサーバのランニングコストを抑えることができます。
ざっくりですがパブリッククラウドを用いた構成案と勘案要素を以下にまとめました。いずれの案においても、**最低利用料金 + リクエスト量に応じた従量課金** というコスト構造になるので、VPSよりも割安なのですが、今回は利便性と最低利用料金のバランスが良い **案1 Cloudfront + Lambda@Edge** を今回採用しました。

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

Lambdaに付与するIAM Roleを作成します。
まず、以下のようなAssume Role Policy を作成します。
 `Lambda` と `Lambda@Edge` は別ものとして扱われているため、 `edgelambda.amazonaws.com` の記載が必要です。

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
個人的にはお金を払い、 `.com` や `.net` のような信頼のあるドメインを確保することをオススメします。
ドメイン料金も抑えたい方は **「ドメイン 無料」** で検索すればいくらでも無料ドメインサービスが出てくるので、それを活用してください。

私が取得しているドメインは [Cloudflare](https://www.cloudflare.com/) で管理しているので、
Route53で取得しているドメインのサブドメインのHosted Zoneを作成し、NSレコードをCloudflare上に登録してあげます。

### Certification ManagerでSSL証明書を取得する

サブドメインの委譲が正しくできていれば(= Route53上の設定値でDNSが引けるようになれば) Certification Manager を用いてSSL証明書を取得しましょう。
SSL証明書の取得に関してはDNS Validationでやり方をオススメします。 詳しくは以前のポスト [AWS Certification ManagerのSSL証明書の検証にはDNS検証を使った方が良い]({% post_url 2018-01-31-acm-route53-validate %}) を見てみてください。
注意点として、**SSL証明書は us-east-1(Virginia)リージョンで取得する必要があります** 。
これは「Cloudfrontに適用可能なSSL証明書はVirginiaリージョンで発行されたもののみ」という仕様のためです。

### Lambda関数の作成とpublish

次にLambda関数の実装を行います。 **Lambda@EdgeはNode 6.10のみをサポートしているため、Nodeでの実装が必要です** 。
軽量なwebアプリケーションを作成する手段として、手っ取り早いのは [express](https://www.npmjs.com/package/express) を使う方法です。
expressの使い方の説明は割愛しますが、実装時に注意すべき点だけ記載します。

#### Lambda@EdgeはCloudfrontのオリジンリクエスト時に実行させる

Lambda@EdgeとCloudfrontを連携させる場合に、Lambda@Edgeの実行タイミングを4つのうちから選択することができます。
詳細は[開発者ガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-cloudfront-trigger-events.html) に記載されています。

* CloudFront ビューワーリクエスト
    * リクエストをCloudfrontが受ける前にLambda@Edgeが処理をする(Lambda@Edge -> Cloudfront -> Origin)
* CloudFront オリジンリクエスト
    * リクエストをCloudfrontが受けた後にLambda@Edgeが処理をする(Cloudfront -> Lambda@Edge -> Origin)
* CloudFront オリジンレスポンス
    * オリジンからのレスポンスをCloudfrontに返却する前にLambda@Edgeが処理をする(Cloudfront <- Lambda@Edge <- Origin)
* CloudFront ビューワーのレスポンス
    * Cloudfrontがクライアントにレスポンスを返却する前にLambda@Edgeが処理をする(Lambda@Edge <- Cloudfront <- Origin)

**CloudFront オリジンリクエスト** で実行することを選択しましょう。これにより、Originの代わりにLambda@Edgeがレスポンスを返せるようになります。
`ビューワーリクエスト` にしてしまうと、CDNのキャッシュが活用できなくなりますし、 `オリジンレスポンス` にすると一度リクエストを受けるためのオリジンをS3などで作成しないといけなくなります。

#### Lambda@EdgeからCloudfrontへのレスポンス形式に注意する
`オリジンリクエスト` の場合、Lambda@EdgeからCloudfrontに返却するレスポンスの形式が以下のように定められているため、そちらに準拠する必要があります。

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

これを愚直に実装するのは少々手間がかかるので、 [aws-serverless-express-edge](https://github.com/jgautheron/aws-serverless-express-edge) というnpmモジュールを使ってしまうのが早いです。

### Cloudfrontで配信する

最後にCloudfrontの配信設定を行います。Cloudfront自体の使い方は公式のドキュメントを読んでいただければ問題ないので、ここでも注意点にだけ触れておきます。

#### Lambda関数はpublishして使う

Lambda@EdgeをCloudfrontと連携させる場合、**Lambda関数はpublishしておく必要があります** 。
Cloudfrontでは実行するLambda@EdgeのARNをバージョン番号込みで指定する必要があり、`$LATEST` による指定はサポート外であるため、
Lambda関数の更新の都度バージョンを上げていくスタイルになります。
一番良い方法としてオススメなのは、[Terraform](https://www.terraform.io/) を使ってCloudfrontとLambdaのコード化をしてしまうことです。

Cloudfrontは設定項目が多いためTerraformに書き起こすのに時間がかかりますが、後々の更新コストを加味して早めに対応しておきましょう。

* LambdaのTerraformサンプル

```
resource "aws_lambda_function" "hogehoge" {
    filename = "../hogehoge.zip"
    function_name = "hoeghoge"
    publish = true
    role = "${EdgeLambdaForCloudfrontRoleのARN}"
    handler = "index.handler"
    source_code_hash = "${data.archive_file.hogehoge.output_base64sha256}"
    runtime = "nodejs6.10"
    timeout = 30
}

data "archive_file" "hogehoge" {
    type = "zip"
    source_dir  = "../workspace"
    output_path = "../hogehoge.zip"
}

```

* CloudfrontのTerraformサンプル

```
resource "aws_cloudfront_distribution" "hogehogefront_cloudfront" {
    origin {
        domain_name = "xxxx.soudegesu.com"
        origin_id   = "Custom-your-xxxx.soudegesu.com"
        custom_origin_config {
            http_port = 80
            https_port = 443
            origin_protocol_policy = "http-only"
            origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
        }
    }
    aliases = ["xxxx.soudegesu.com"]
    enabled = true
    is_ipv6_enabled = true
    comment = "tools distribution"

    default_cache_behavior {
        allowed_methods  = ["GET", "HEAD", "OPTIONS"]
        cached_methods   = ["GET", "HEAD"]
        target_origin_id = "Custom-xxxx.soudegesu.com"

        forwarded_values {
            query_string = false

            cookies {
                forward = "none"
            }
        }

        viewer_protocol_policy = "redirect-to-https"
        min_ttl = 86400
        default_ttl = 604800
        max_ttl = 2592000
        compress = true
        lambda_function_association {
            event_type = "origin-request"
            lambda_arn = "${aws_lambda_function.hogehoge.qualified_arn}"
        }
    }

    viewer_certificate {
        acm_certificate_arn = "${ACMのARN}"
        minimum_protocol_version = "TLSv1.1_2016"
        ssl_support_method = "sni-only"
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }
}
```

ポイントなのは Cloudfront側の以下の部分で、

```
    lambda_function_association {
        event_type = "origin-request"
        lambda_arn = "${aws_lambda_function.hogehoge.qualified_arn}"
    }

```

`qualified_arn` を指定すると、バージョン込のフルのARNにて変数展開がされます。
これにより、terraformを実行するだけで、LambdaのデプロイとCloudfrontの更新の両方ができるようになります。

#### キャシュクリアをする(2回目以降のデプロイ時)

CloudfrontはCDNサービスなので、デプロイ後にキャッシュをクリアして上げた方がよいです。

AWSコンソールからCloudfrontのInvalidationsのタブを押します。

![invalidations]({{site.baseurl}}/assets/images/20180403/invalidations.png)

全てのURLのキャッシュをクリアしたいので、「*」を指定すればOKです。

![invalidation_target]({{site.baseurl}}/assets/images/20180403/invalidation_target.png)

なお、このキャッシュクリアに関してCloudfrontの料金ページでは、

```
月間で無効をリクエストしたパスの最初の 1,000 パスまでは追加料金なし。それ以降は、無効をリクエストしたパスごとに 0.005 USD かかります。
```

と記載されているので、URLのパターンが増えてきたら、削除対象の指定パターンはもう少し工夫した方がいいかもしれません。

## まとめ

今回、Cloudfront + Lambda@Edgeを用いてサーバレスでのwebコンテンツを配信する仕組みを構築しました。
実際にサンプルコンテンツを作成してみたのが [こちら](http://www.tools.soudegesu.com/) になります。
ブラウザの言語設定の情報を基に `ja` か `en` かにリダイレクトする機能(俗に言うi18n対応っぽいもの)を実現しています。

1週間程寝かせてみた後のAWS Billing Dashboardは以下のようになりました。$1到達していないですね。素晴らしい。

![billing dashboard]({{site.baseurl}}/assets/images/20180403/billing_dashborad.png)

立ち上げ期のアクセスが少ないコンテンツでは、ランニングコストが大きくならないようにサーバレスで節約していきたいですね！

## 参考にさせていただいたサイト
* [Amazon Cloudfront 開発者ガイド](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses.html)


