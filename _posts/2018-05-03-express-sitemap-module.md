---
title: "Expressのサイトマップ作成にはsitemapモジュールが良さそう"
description: "以前書いた「Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう」の記事でNode.jsのexpressアプリケーションを作成しました。大抵、webコンテンツを作る時にメインフレームワーク以外のその他のプラグインで何を使おうか迷ってしまいます。今回はexpress用のサイトマップのプラグインについてまとめました。"
date: 2018-05-03 00:00:00 +0900
categories: nodejs
tags: nodejs express sitemap
---

以前書いた 「[Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう](/aws/hosting-with-cloudfront-lambda-edge-serverless/)」 の記事で、Node.jsの [express](http://expressjs.com/ja/) アプリケーションを作成しました。

大抵、webコンテンツを作る時にメインフレームワーク以外のその他のプラグインで何を使おうか迷ってしまいます。
今回はexpress用のサイトマップのプラグインについてまとめました。

* Table Of Contents
{:toc}

## モチベーション
### サイトマッププラグインどうしよう

きちんとGoogleにインデクシングしてほしいので、`sitemap.xml` を作成する必要があります。

webページを作成するたびにサイトマップを自前で編集するのは苦行の極みなので、
大方、webフレームワークに対応しているサイトマップジェネレータのライブラリを使うことが多いです。

expressでwebコンテンツを作ったのが [以前の記事](/aws/hosting-with-cloudfront-lambda-edge-serverless/) が初めてだったので express に対応しているサイトマップ用のnode_moduleを探す必要がありました。

### ２つの有力候補

**「express sitemap」** で検索したところ、2つのライブラリがnpmのサイトから名乗りを上げてきました。

* [express-sitemap](https://www.npmjs.com/package/express-sitemap)
* [sitemap](https://www.npmjs.com/package/sitemap)

どちらもDescriptionを読むと、expressに対応していることが分かります。
[express-sitemap](https://www.npmjs.com/package/express-sitemap) と [sitemap](https://www.npmjs.com/package/sitemap) のどちらが自分のコンテンツに適しているか調べる必要が出てきました。

## サイトマップを実装だ!!

### 改めてやりたいことを確認

まず、改めてやりたいことを整理します。構成は [以前の記事](/aws/hosting-with-cloudfront-lambda-edge-serverless/) をベースに考えます。

前提として、
1. CloudfrontがHTTPSのリクエストを受け付ける
2. Lambda@edge上のNode 6.10環境でexpressが動作する
3. Lambda@edgeはCloudfrontのOrigin Requestのタイミングで動作し、レスポンスを返す
4. `3.` のため、S3 Originは使わない
5. S3を使わないので、サイトマップもexpressが動的なページとして返す

S3を使わない理由は **節約** です!!

アーキテクチャの概要は以下のようになります。

![architecture]({{site.baseurl}}/assets/images/20180503/architecture.png)

### express-sitemap を試す

まずは、名前がそれっぽい [express-sitemap](https://www.npmjs.com/package/express-sitemap) から試しましょう。
基本的な使い方はnpmのドキュメントを読みましょう。


### sitemap を試す



## まとめ

<br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/4873116066/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873116066&linkCode=as2&tag=soudegesu-22&linkId=613ba4b793129cc4fd454566e935627e"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873116066&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873116066" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>