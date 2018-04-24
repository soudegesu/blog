---
title: "RDS Auroraの脆弱性/セキュリティ対応ってどうなっているのか？"
description: "RDS Auroraのセキュリティ対応って"
date: 2018-04-25 00:00:00 +0900
categories: aws
tags: aurora
---

RDS AuroaはMySQL互換のインスタンスとPostgreSQL互換のインスタンスが選べますが、セキュリティパッチってどうなってるの？とふと思ったので調べてみました。

* Table Of Contents
{:toc}

## 経緯：セキュリティバスターズからの依頼
そこそこ大きい会社になってくると、セキュリティを専門とする部署があって、
[CVE](http://cve.mitre.org/) の情報を収集しては **「こんな脆弱性が発表されたぞ！君たちのプロダクトは大丈夫なのか！？報告したまえ！」**
みたいなやりとりが発生します。情報を展開してくれるのは大変ありがたいのですが、やりたまえって、なんかそういうエージェント仕込むやつでもいいから少しは手伝ってくだされ。

例のごとく、**「MySQLの脆弱性が発表されたぞ！これな！」** というお達しと共に

```
CVE-2018-XXXX
CVE-2018-XXXX
CVE-2018-XXXX
```

対象と思しきCVEのリストが展開されるわけです。

純粋なMySQLではないにせよ、MySQL互換のAuroraを使用している場合、我々は公表されたMySQLの脆弱性にどう対処するのが良いのか？とふと思ったわけです。

## Auroraの仕組み

そもそも「互換性がある」 からと言って、内部的な仕組みが違うので、一概に言えないのが難しい所です。
下の図を見ると少しわかるのですが、ストレージ部分のアーキテクチャはAurora独自な感があるので、[CVE-2018-2755](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-2755) みたいなレプリケーションにまつわる脆弱性は違うのではないかな、と推察しました。

{% oembed https://www.slideshare.net/AmazonWebServicesJapan/amazon-aurora-aurora#7 %}

{% oembed https://www.slideshare.net/AmazonWebServicesJapan/amazon-aurora-aurora#9 %}

##


## まとめ


## 参考にさせていただいたサイト
* [Introducing the Aurora Storage Engine](https://aws.amazon.com/blogs/database/introducing-the-aurora-storage-engine/)
* [Amazon Aurora - Auroraの止まらない進化とその中身](https://www.slideshare.net/AmazonWebServicesJapan/amazon-aurora-aurora)
