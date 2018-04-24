---
title: "MySQL/PostgreSQLの脆弱性が発表された時に、RDS Aurora使いはどう対処すべきか"
description: "アプリケーションの脆弱性対応って調査にも時間がかかりますし、大変ですよね。RDS Auroraのようなマネージドサービスの場合、互換性のあるデータベースエンジン(MySQLやPostrgeSQL)の脆弱性が発表されたら、どうしたらよいのでしょうか。少し気になったので調べてみました。"
date: 2018-04-24 00:00:00 +0900
categories: aws
tags: aurora
---

アプリケーションの脆弱性対応は調査にも時間がかかりますし、大変ですよね。RDS Auroraのようなマネージドサービスの場合、互換性のあるデータベースエンジン(MySQLやPostrgeSQL)の脆弱性が発表されたら、どうしたらよいのでしょうか。少し気になったので調べてみました。

* Table Of Contents
{:toc}

## [経緯]セキュリティバスターズからの依頼
そこそこ大きい会社になってくると、セキュリティを専門とする部署があって、
[CVE](http://cve.mitre.org/) の情報を収集しては 

**「こんな脆弱性が発表されたぞ！君たちのプロダクトは大丈夫なのか！？報告したまえ！」**

みたいなやりとりが発生します。情報を展開してくれるのは大変ありがたいのですが、やりたまえって、なんかそういうエージェント仕込むやつでもいいから少しは手伝ってくだされ。

例のごとく、

**「MySQLの脆弱性が発表されたぞ！これな！」** 

というお達しと共に

```
CVE-2018-XXXX
CVE-2018-XXXX
CVE-2018-XXXX
(以下略)
```

対象と思しきCVEのリストが展開されるのです。

純粋なMySQL/PostgreSQLでないにせよ、OSSのデータベースエンジンに互換性のあるAuroraを使用している場合、我々は公表された脆弱性にどう対処するのが良いのか？とふと思ったわけです。

なお、私の使っているAuroraのバージョンは `1.15.1` 、互換のあるMySQLのバージョンは `5.6.10-log` でした。

## Auroraの仕組み

そもそも「互換性がある」 からと言って、内部的な仕組みは違うので、一概に言えないのが難しい所です。

例えば、下のスライドを見ると少しわかるのですが、ストレージ部分のアーキテクチャはAurora独自な感があるので、[CVE-2018-2755](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-2755) みたいなレプリケーションに関連する脆弱性は対象にならないのではないか、と推察したりもできます。

{% oembed https://www.slideshare.net/AmazonWebServicesJapan/amazon-aurora-aurora/7 %}

## サポートに聞いてみよう

ただ、推察の域を出ないので、AWSのサポートに聞いてみました。

結果、結論を簡単にまとめると、

* MySQLのバージョンに存在する脆弱性は一概にAuroraにもあるとは限らない
* AWSのセキュリティ適用状況は [Latest Bulletins](https://aws.amazon.com/security/security-bulletins/) を確認して欲しい
* インスタンスへのセキュリティパッチの適用状況についてはユーザが確認することはできない
* メンテナンスウィンドウにて必須のパッチの適用がスケジューリングされ、時限的に適用される(緊急の場合にはその限りではない)

マネージドサービスだし、「まかせておけ」ということか。

## Latest Bulletins を見てみよう

過去にどのような対応があったかを見てみます。
[Latest Bulletins](https://aws.amazon.com/security/security-bulletins/) はRDSだけでなく、
他のAWSサービス全般のセキュリティアップデートが表示されます。

その中から、過去のRDSの対応した脆弱性を探してみます。

* [Amazon RDS Security Advisory (CVE-2016-6663 and CVE-2016-6664)](https://aws.amazon.com/security/security-bulletins/amazon-rds-security-advisory-cve-2016-6663-cve-2016-6664/)
* [Amazon RDS - MySQL Security Advisory (CVE-2016-6662)](https://aws.amazon.com/security/security-bulletins/amazon-rds-mysql-security-advisory-cve-2016-6662/)
* [Amazon RDS for Oracle Security Advisory](https://aws.amazon.com/security/security-bulletins/cve-2014-2478/)
* [Amazon RDS – MySQL Security Advisory](https://aws.amazon.com/security/security-bulletins/mysql-5-5-and-5-6-security-advisory/)

Auroraのものは見つかりませんでした。

CVEの脆弱性とリンクされている上の2つを確認してみると、CVEがアップデートされてから半年後くらいに対応した感じでしょうか。
AWSサービス単位でまとめられているわけでもないので、とりあえず、この情報だけでは脆弱性対処の早い/遅いの判断もできなさそうです。

## まとめ

今回はRDS Auroraのセキュリティへの対応を調べてみました。
結論を言うと、**ユーザはAWS側におまかせする形になる** ので、ブラックボックスになってしまいます。

もし特定の脆弱性が気になるようなら、サポートセンター経由で個別に相談するのもよいでしょうし、
MySQLエンジンのバージョンを上げれそうであれば、それで対処してしまう、という割り切りもありかな、とぼんやり思いました。

逆に、脆弱性と思しき事象がある場合には、メールにて報告をする窓口も設けられていたので(調査のお手伝いをする必要がありますが)、がっぷりおつで対峙するのも手かもしれませんね。

## 参考にさせていただいたサイト
* [Introducing the Aurora Storage Engine](https://aws.amazon.com/blogs/database/introducing-the-aurora-storage-engine/)
* [Amazon Aurora - Auroraの止まらない進化とその中身](https://www.slideshare.net/AmazonWebServicesJapan/amazon-aurora-aurora)

<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/486594043X/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=486594043X&linkCode=as2&tag=soudegesu-22&linkId=aa4c69d72db754bc626b9aa59c0d415a"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=486594043X&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=486594043X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>