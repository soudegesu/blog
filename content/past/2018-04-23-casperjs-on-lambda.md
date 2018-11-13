---
title: "AWS LambdaでCasperJSを実行してファイルアップロードを自動化する"
description: "AWS Lambda上でCasperJSを動かしてファイルアップロードの自動化を行いました。本来であればAPIでバイナリデータをPOSTできれば良かったのですが、アップロード先のシステムでAPIが存在しなかったため、CasperJSを使ってファイルをアップロードするという暴挙に出ました。AWS LambdaでCasperJSを実行する際の注意点などを書きます。"
date: 2018-04-23
thumbnail: /images/icons/lambda_icon.png
categories:
    - aws
tags:
    - aws
    - lambda
    - casperjs
url: /aws/casperjs-on-lambda/
twitter_card_image: /images/icons/lambda_icon.png
---

AWS上のデータを別サービスに連携するために、AWS LambdaからCasperJSを使ってファイル配置を自動化する仕組みを作ってみました。
APIでデータをPOSTできれば簡単なのですが、今回はGUI上からファイルをアップロードしないといけないため、技術の無駄遣いをしてみます。

## 日次でファイルをアップロードしたい

ことの発端は以前書いた記事 「[クロスアカウントで共有されたS3バケットはAWSコンソール上から参照可能なのか](/aws/s3-cross-account/)」 にて、
**S3のバケット共有の機能を使ってファイルの提供をしようと試みた** のですが、社内のセキュリティ統制的にNGを喰らってしまいましたので、
指定のファイルストレージサービスを経由してファイルの授受を行う必要が出てきました。

そのファイルストレージサービスというのが若干レガシーなシステムで、APIを使ったファイルのアップロードができません。
そのため、ヘッドレスブラウザでのGUI操作ができるライブラリを使用してファイルアップロードをしようと考えた次第です。

これを実装しないと、私が毎朝システムにログインしてファイルをアップロードするという苦行が発生するため、是が非でも作る必要がありました。

退屈なことはプログラムにやらせましょう。

<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/487311778X/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=487311778X&linkCode=as2&tag=soudegesu-22&linkId=22f6b91a2296dc4b4344bbc4b08fc5dd"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=487311778X&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL160_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=487311778X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>

## CasperJSとは
[CasperJS](http://casperjs.org/) は [PhantomJS](http://phantomjs.org/) のラッパーライブラリです。
PhantomJS 自体はwebkitをベースとしたヘッドレスブラウザです。
実ブラウザを起動するSeleniumよりも高速に動作するので、GUIを持つ必要のない処理（例えばGUIの自動テストや、今回のような機械的な処理)に向いています。
昨年頃に [Chromeもヘッドレスで起動できる](https://developers.google.com/web/updates/2017/04/headless-chrome?hl=ja) ようになっているため、
PhantomJSでなくても良いのですが、過去にPhantomJSを使った経験があったため、再びこれを採用しています。

ラッパーであるCasperJSを使う利点は、ブラウザ操作のユーティリティが揃っていることです。
セレクタに対するwaitや、イベントの発火、データ入力等のコードをシンプルに書くことができます。

というか、PhantomJS単体だと自前定義のfunctionが多くなるためオススメできません。

## Lambda + CasperJS で実現してみよう

早速実装してみましょう。今回作成したプログラムは [こちら](https://github.com/soudegesu/casper-lambda-test) です。
なお、このプログラム自体は [node-casperjs-aws-lambda](https://github.com/narainsagar/node-casperjs-aws-lambda) を参考にしています。

今回実装したアーキテクチャはざっくり以下のようなイメージです。

![casper_architecture](/images/20180423/casperjs.png)

実行環境やライブラリは以下になります。

* Node 6.10
* CasperJS 1.1.4
* PhantomJS 2.1.1

また、処理の流れは以下になります。

1. LambdaがETL処理をする
2. ETL処理終了後にS3にファイルをアップロード
3. BucketのPUTイベントを基にファイルアップロード用のLambdaが実行される
4. LambdaでCasperJSが動き、他サービスにファイルをアップロードする


## 実装時のポイント

### Lambdaに割り当てるリソースは大きめに、タイムアウトは長く設定する
ヘッドレスとは言え、CasperJSを実行するために、Lambdaに割り当てるメモリは大きめにした方が良いです。

加えて、Lambdaのタイムアウト値は最大値の5分に設定しておきましょう。もちろん、これらは実装する処理の重さに依存します。

### AWS LambdaにPhantomJSのパスを通す

`node_module` 内のPhantomJSはLambda上ではいい感じに見てくれなかったので、[PhantomJSのバイナリをダウンロード](http://phantomjs.org/download.html)して直接パスを通してあげました。

余談ですが、AWS Lambdaの環境変数一覧は [ここ](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/current-supported-versions.html) に纏められています。はじめて知りました。

### S3オブジェクトを一度Lambdaのコンテナ上にダウンロードする

S3のPUTイベントをトリガーに処理が実行されるのですが、`event` オブジェクトにはバケットの情報やオブジェクトキーの情報しかないため、
そこから一度、Lambdaコンテナの `/tmp/` 配下とかに一度ダウンロードします。

### Lambda実行の最後にS3バケットへ画面キャプチャをアップロードする

CasperJSのデバッグはコンソールに情報を出力するよりも `caputure` 関数を呼び出して、その瞬間の画面キャプチャを取得する方が捗ります。
ただ、Lambda上で実行している場合には、Lambdaの処理が終了するとコンテナも終了するため、処理の最後に任意のS3にアップロードしてあげます。

なお、キャプチャファイルはカレントディレクトリ( `/var/task` 配下)に出力しようとすると、書き込み権限がないエラーになってしまいましたので、 `/tmp/` に吐き出しています。

また、キャプチャーした画像ファイルは大抵複数できあがるので、`aws-sdk` でS3アップロードする処理は `Promisse` を使って書きました。

### ブラウザの言語設定を英語にした

CasperJSで操作するWebコンテンツがi18n対応されていたため、ヘッドレスブラウザの設定を英語にしました。
**CSSセレクタではなくてエレメント内のテキスト情報で要素を引きたい** ことが発生した場合に、マルチバイト文字だと引っかからなかったからです。

{{< highlight javascript "linenos=inline" >}}
// Change browser lang
casper.on('started', function () {
    this.page.customHeaders = {
        "Accept-Language": "en-US"
    }
});
{{< / highlight >}}

**ランタイムに依存しない** という意味でも設定しておいた方が良いと思います。


## まとめ
今回はAWS Lambda上でCasperJSを実行することで、S3上のファイルを別のストレージサービスへアップロードすることができました。
CasperJSからPhantomJSを呼び出せるようにPATHに追加したり、キャプチャ画像をアップロードするためのバケットを準備したり、
下準備に若干時間がかかりますが、一度作れば動きが理解できると思います。

Lambdaのタイムアウト時間の最大値である5分以内に処理を終了させる必要があるため、最初はタイムアウトしないか心配でした。
しかし、メモリも大きめに割り当てて上げると実行自体は数十秒くらいで終了したので、ヘッドレスブラウザ最強です。
CasperJSのコードも短かったのが良かったのかもしれません。

と、これを書きながら、「CasperJSのコードを複数のLambdaで分担してGUIのテストできたらかっこいいな」と感じました。

## 参考にさせていただいたサイト

* [CasperJS](http://casperjs.org/)
* [PhantomJS](http://phantomjs.org/)
* [node-casperjs-aws-lambda](https://github.com/narainsagar/node-casperjs-aws-lambda)


<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4883379930/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4883379930&linkCode=am2&tag=soudegesu-22&linkId=ae79fa81d72604fbe4a1f4f71e97c369"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4883379930&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4883379930" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
