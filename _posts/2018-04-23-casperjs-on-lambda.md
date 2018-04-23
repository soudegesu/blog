---
title: "AWS LambdaでCasperJSを動かしてファイルアップロードを自動化する"
description: "AWS Lambda上でCasperJSを動かしてファイルアップロードの自動化を行いました。本来であればAPIでバイナリデータをPOSTできれば良かったのですが、アップロード先のシステムでAPIが存在しなかったため、CasperJSを使ってファイルをアップロードするという暴挙に出ました。AWS LambdaでCasperJSを実行する際の注意点などを書きます。"
date: 2018-04-23 00:00:00 +0900
categories: aws
tags: aws lambda nodejs casperjs
---

AWS上のデータを別サービスに連携するために、AWS LambdaからCasperJSを使ってブラウザの操作を自動化してファイルを配置する仕組みを作ってみました。
APIでデータを送りつければ済む話であれば簡単なのですが、今回はGUI上からファイルをアップロードしないといけないため、技術の無駄遣いをしてみます。

* Table Of Contents
{:toc}

## モチベーション

### 日次でファイルをアップロードしたい

ことの発端は以前書いた記事 「[クロスアカウントで共有されたS3バケットはAWSコンソール上から参照可能なのか](/aws/s3-cross-account/)」 にて、
**S3のバケット共有の機能を使ってファイルの提供をしようと試みた** のですが、社内のセキュリティ統制的にNGを喰らってしまいましたので、
指定のファイルストレージサービスを経由してファイルの授受を行う必要が出てきました。

そのファイルストレージサービスというのが若干レガシーなシステムで、APIを使ったファイルのアップロードができないため、
ヘッドレスブラウザ等のGUI操作ができるライブラリを使用してファイルアップロードをしようと考えた次第です。

これを実装しないと、私が毎朝システムにログインしてファイルをアップロードするという苦行が発生するあめ、是が非でも作る必要がありました。

### CasperJSとは
[CasperJS](http://casperjs.org/) は [PhantomJS](http://phantomjs.org/) のラッパーライブラリです。
PhantomJS 自体はwebkitをベースとしたヘッドレスブラウザです。
実ブラウザを起動するSeleniumよりも高速に動作するので、GUIを持つ必要のない処理（例えばGUIの自動テストや、今回のような機械的な処理)に向いています。
昨年頃に [Chromeもヘッドレスで起動できる](https://developers.google.com/web/updates/2017/04/headless-chrome?hl=ja) ようになっているため、
PhantomJSでなくても良いのですが、過去に使った経験があったため、これを採用しています。
PhantomJS単体だと、実際のGUI操作の

## 実装してみる


### Lambda + CasperJS


### 実装時の注意点


## まとめ

## 参考にさせていただいたサイト



<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4883379930/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4883379930&linkCode=am2&tag=soudegesu-22&linkId=ae79fa81d72604fbe4a1f4f71e97c369"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4883379930&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4883379930" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
