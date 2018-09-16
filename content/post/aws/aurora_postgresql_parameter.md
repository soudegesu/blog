---
title: "RDS Aurora（PostgreSQL互換）のwalパラメータの有効性について"
description: ""
date: "2018-09-17T07:00:59+09:00"
thumbnail: /images/icons/rds_icon.png
categories:
  - "aws"
tags:
  - "rds"
  - "aws"
isCJKLanguage: true
twitter_card_image: /images/icons/rds_icon.png
---

2018/2月頃から東京リージョンでも、[RDS Aurora（PostgreSQL互換）が使用可能](https://aws.amazon.com/jp/blogs/news/amazon-aurora-with-postgresql-compatibility-is-available-in-the-asia-pacific-tokyo-region/) になりました。

今回は RDS Aurora（PostgreSQL互換） のパラメータチューニング中に、ふと疑問に思ったことを書きます。

なお、エンジンバージョンは `aurora-postgresql9.6` として以下はまとめていきます。

## WALを使ったレプリケーション

PostgreSQLには WAL（Write Ahead Logging）という仕組みがあります。いわゆるトランザクションログのことを指しますが、
通常のPostgreSQLでクラスタを組んだ場合には、WALのデータをスレーブが同期することでレプリケーションを可能にしています。

## Auroraは共有ストレージ

レプリケーションを実現するためにWALが必要、と先ほど述べましたが、
一方で今回使うRDS Auroraはストレージノード自体をWriter/Reader機で共有するため、
**「そもそも、WALを使ったレプリケーションはサポートされているのか？」** と考えたわけです。

加えて、RDS Auroraのパラメータグループを確認してみると、指定可能なパラメータにWALに纏わるものが含まれます。

例えば、以下のようなパラメータが該当します。

* wal_receiver_status_interval
* wal_receiver_timeout
* wal_sender_timeout

結局、WALを使ってレプリケーションをしているか否か、よくわかりません。

## サポートに聞いてみよう

というわけで、AWSのサポートに問い合わせを行いました。

結論を言うと

* 通常利用の限りでは `wal_receiver_status_interval` `wal_receiver_timeout` `wal_sender_timeout` は調整しても **使われない**
  * WAL Sender/Receiver等の **プロセスが起動していない** ため
  * つまり、WALによるレプリケーションは行わない（Aurora独自のレプリケーションの仕組みを使う）
* **RDS for PostgreSQLからRDS Aurora（PostgreSQL互換）をリードレプリカとして作成する場合は**、`wal_receiver_status_interval` `wal_receiver_timeout` `wal_sender_timeout` が有効になる
  * PostgreSQLのWAL Sender/Receiverプロセスが起動し、PostgreSQLの方式にてレプリケーションが行われるため

## まとめ

RDS for PostgreSQLからAuroraをレプリカに複製する場合にはWALが有効になるということでした。これは考慮していませんでした。
通常のAuroraクラスターのユースケースではそもそもWALのプロセスが動作していないため、チューニング時には気にしないのが良さそうです。

また一つ賢くなりました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B01IB6Q1CA&linkId=b4ca40feb7751f1112ee85917e0b2533"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=1260108279&linkId=c4ac74c453d2e72a86aec32e11bd9a82"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4797392568&linkId=5026f77348a642a4054d5ac9a12a0bf4"></iframe>
