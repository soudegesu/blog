---
title: "springboot-webfluxのバックプレッシャーを体験してみよう"
description: "springboot2から利用可能になったwebfluxを調べました。従来のspringboot-mvcと振る舞い上の違いであるバックプレシャーを実際に試してみました。"
date: 2018-03-16 00:00:00 +0900
categories: java
tags: java spring webflux reactor
---

2018/3にリリースされた `springboot2` から `spring5` がバンドルされるようになりました。
リリースの中でも注目機能と言われている `webflux` 、とりわけ `webflux` が内包しているリアクティブプログラミングライブラリである `Reactor` はspringユーザであれば気になるはずです。今回はそれを触ってみます。 


* Table Of Contents
{:toc}

## 今回作成したリポジトリ
今回作成したリポジトリは [こちら](https://github.com/soudegesu/springboot-webflux-test) です。
全てローカル環境で動かせるように `docker-compose` でコンポーネント化してあるものの、 `netty4` は当方のMac OS上ではいい感じに動いてくれないので、負荷試験をするときはLinuxサーバ上に展開することをオススメします。

## Webflux??

## パフォーマンスを計測する

## まとめ

## 参考にさせていただいたサイト

