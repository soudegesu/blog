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

### アクセスが少ない時期はランニングコストが高くつく

### サーバレスで費用を抑えよう

## AWSで構築してみる
### IAM Roleの作成

### Route53でサブドメインを移譲してもらう

### Certification ManagerでSSL証明書を取得する

### Lambdaの作成とpublish

### Cloudfrontで配信する

## まとめ

