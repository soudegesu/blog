---
title: "AWS LambdaでCasperJSを動かしてファイルアップロードを自動化する"
description: "AWS Lambda上でCasperJSを動かしてファイルアップロードの自動化を行いました。本来であればAPIでバイナリデータをPOSTできれば良かったのですが、アップロード先のシステムでAPIが存在しなかったため、CasperJSを使ってファイルをアップロードするという暴挙に出ました。AWS LambdaでCasperJSを実行する際の注意点などを書きます。"
date: 2018-04-23 00:00:00 +0900
categories: aws
tags: aws lambda nodejs casperjs
---

AWS上のデータを別サービスに連携するために、AWS LambdaからCasperJSを使ってブラウザの操作を自動化してファイルを配置する仕組みを作ってみました。
APIでデータをPOSTできれば簡単なのですが、今回はGUI上からファイルをアップロードしないといけないため、技術の無駄遣いをしてみます。

* Table Of Contents
{:toc}

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

![casper_architecture]({{site.baseurl}}/assets/images/20180423/casperjs.png)

実行環境やライブラリは以下のようになり、

* Node 6.10
* CasperJS 1.1.4

処理の流れとしては以下になります。

1. LambdaがETL処理をする
2. ETL処理終了後にS3にファイルをアップロード
3. BucketのPUTイベントを基にファイルアップロード用のLambdaが実行される
4. LambdaでCasperJSが動き、他サービスにファイルをアップロードする


## 実装時の注意点

### AWS LambdaにPhantomJSのパスを通す

### Lambda実行の最後にS3バケットへ画面キャプチャをアップロードする



## まとめ


## 参考にさせていただいたサイト
* [CasperJS](http://casperjs.org/)
* [PhantomJS](http://phantomjs.org/)
* [node-casperjs-aws-lambda](https://github.com/narainsagar/node-casperjs-aws-lambda)


<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4883379930/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4883379930&linkCode=am2&tag=soudegesu-22&linkId=ae79fa81d72604fbe4a1f4f71e97c369"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4883379930&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4883379930" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
