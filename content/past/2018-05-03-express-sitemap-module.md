---
title: "Expressのサイトマップ生成用npmモジュール（express-sitemapとsitemap）を比較しよう"
description: "以前書いた「Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう」の記事でNode.jsのexpressアプリケーションを作成しました。大抵、webコンテンツを作る時にメインフレームワーク以外のその他のプラグインで何を使おうか迷ってしまいます。今回はexpressアプリケーションのサイトマップ生成用npmモジュールを比較してみました。"
date: 2018-05-03
categories:
  - nodejs
tags:
  - nodejs
  - express
---

以前書いた 「[Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう](/aws/hosting-with-cloudfront-lambda-edge-serverless/)」 の記事で、Node.jsの [express](http://expressjs.com/ja/) アプリケーションを作成しました。

大抵、webコンテンツを作る時にメインフレームワーク以外のその他のプラグインで何を使おうか迷ってしまいます。
今回はexpressアプリケーションのサイトマップ生成用npmモジュールを比較してみました。

* Table Of Contents
{:toc}

## モチベーション
### サイトマップの作成どうしよう

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

## サイトマップを導入だ!!

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

以下のようなコードサンプルを試します。
なお、URLパス中に言語を指定するタイプの `i18n` 対応を想定して書いてみます。

```javascript
const map = require('express-sitemap')
const fs = require('fs')
const i18n = require('i18n')
const express = require('express')
const app = express()

app.get('/sitemap.xml', (req, res) => {
  res.set('Content-Type', 'text/xml');
  res.send( fs.readFileSync(require('path').resolve(__dirname, './sitemap.xml'), "utf8"));
});

app.get('/', (req, res) => {
  res.redirect('/' + i18n.getLocale(req) + '/');
})

app.get(/^\/(ja|en)\/$/, function(req, res){
  res.render('index.ejs');
});

app.get(/^\/(ja|en)\/alerm\/$/, function(req, res){
  res.render('alerm/index.ejs');
});

app.get('/aaaa', function(req, res){
  res.render('alerm/index.ejs');
});

const sitemap = map({
  http: 'https',
  url: 'www.tools.soudegesu.com',
  generate: app,
  route: {
    '/': {
      lastmod: '2018-04-01',
      changefreq: 'always',
      priority: 1.0,
      alternatepages: [
      {
        rel: 'alternate',
        hreflang: 'ja',
        href: 'https://www.tools.soudegesu.com/ja/'
      },
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://www.tools.soudegesu.com/en/'
      }]
    },
  },
}).toFile();

module.exports = app
```

`sitemap.xml` にアクセスすると以下のように出力されていることがわかります。

```xml
#curl http://localhost:3000/sitemap.xml

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>https://www.tools.soudegesu.com*</loc>
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/sitemap.xml</loc>
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/</loc>
        <lastmod>2018-04-01</lastmod>
        <changefreq>always</changefreq>
        <priority>1</priority>
        <xhtml:link rel="alternate" hreflang="ja" href="https://www.tools.soudegesu.com/ja/" />
        <xhtml:link rel="alternate" hreflang="en" href="https://www.tools.soudegesu.com/en/" />
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/^\/(ja|en)\/$/</loc>
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/^\/(ja|en)\/alerm\/$/</loc>
    </url>
    <url>
        <loc>http://www.tools.soudegesu.com/aaaa</loc>
    </url>    
</urlset>
```

特徴としては **定義していないURL定義はexpress-sitemapがよしなにXMLに出力してくれます** 。

一方で、**expressがURLパターンに正規表現を使ってルーティングをしている場合には出力が微妙** ですね。
自分の記憶が正しければ、 `loc` ブロックは単一のURLを指定する必要があった気がしますので、
うっかりインデクシングエラーになる可能性がありそうです。

具体的に言うと、以下の部分が該当します。

```xml
    <url>
        <loc>https://www.tools.soudegesu.com/^\/(ja|en)\/$/</loc>
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/^\/(ja|en)\/alerm\/$/</loc>
    </url>
    <url>
        <loc>http://www.tools.soudegesu.com/aaaa</loc>
    </url>
```

### sitemap を試す

次に [sitemap](https://www.npmjs.com/package/sitemap) を試しましょう。
コードサンプルは以下のような感じです。

```javascript
const sitemap = require('sitemap')
const express = require('express')
const i18n = require('i18n')
const app = express()

const sitemap = sm.createSitemap({
  hostname: 'https://www.tools.soudegesu.com',
  urls: [
    {
      url: 'https://www.tools.soudegesu.com/',
      links: [
        {
          lang: 'en',
          url: 'https://www.tools.soudegesu.com/en/'
        },
        {
          lang: 'ja',
          url: 'https://www.tools.soudegesu.com/ja/'
        }
      ]
    },
    {
      url: 'https://www.tools.soudegesu.com/en/alerm/',
      links: [
        {
          lang: 'en',
          url: 'https://www.tools.soudegesu.com/en/alerm/'
        },
        {
          lang: 'ja',
          url: 'https://www.tools.soudegesu.com/ja/alerm/'
        }
      ]      
    }
  ]
});


app.get('/sitemap.xml', (req, res) => {
  map.tickle();
  map.XMLtoWeb(res);
});

app.get('/', (req, res) => {
  res.redirect('/' + i18n.getLocale(req) + '/');
})

app.get(/^\/(ja|en)\/$/, function(req, res){
  res.render('index.ejs');
});

app.get(/^\/(ja|en)\/alerm\/$/, function(req, res){
  res.render('alerm/index.ejs');
});

app.get('/aaaa', function(req, res){
  res.render('alerm/index.ejs');
});

module.exports = app
```

以下のような `sitemap.xml` が出力されました。

```xml
#curl http://localhost:3000/sitemap.xml

<?xml version="1.0" encoding="UTF-8"?>
<urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    <url>
        <loc>https://www.tools.soudegesu.com/</loc>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.tools.soudegesu.com/en/" />
        <xhtml:link rel="alternate" hreflang="ja" href="https://www.tools.soudegesu.com/ja/" />
    </url>
    <url>
        <loc>https://www.tools.soudegesu.com/en/alerm/</loc>
        <xhtml:link rel="alternate" hreflang="en" href="https://www.tools.soudegesu.com/en/alerm/" />
        <xhtml:link rel="alternate" hreflang="ja" href="https://www.tools.soudegesu.com/ja/alerm/" />
    </url>
</urlset>
```

sitemapの場合は **定義されていないURLはよしなに出力してくれない** 感じですね。

## まとめ
2つのnpmモジュールを比較しました。使ってみた結論としては、

**ライブラリ側でよしなにやってほしい、かつ、パスのルーティングルールがシンプルな場合には [express-sitemap](https://www.npmjs.com/package/express-sitemap) を使う**

**全て自前で定義したい場合には [sitemap](https://www.npmjs.com/package/sitemap) を使う**

が良さそうです。

なお、 **i18n(多言語)対応を行う場合は、いずれのモジュールでも、自前でURL定義の記載が必要でした** 。

私のコンテンツはインデックスエラーが起きてほしくないため、 [sitemap](https://www.npmjs.com/package/sitemap) を使うことにしました。

<br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/4873116066/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873116066&linkCode=as2&tag=soudegesu-22&linkId=613ba4b793129cc4fd454566e935627e"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873116066&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873116066" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>