---
title: "Pythonのdatetimeとpytzで文字列と日時やタイムゾーンの変更などをいい加減覚えたい"
description: "Pythonのdatetimeやpytzを使った文字列と日付の変換をまとめます。仕事がら別のミドルウェアやデータソースから取得したepochtimeや日付文字列をPythonのdatetimeやpytzを使って変換する処理を書くことがあるのですが、毎回ネットで調べているのでいい加減覚えよるためにまとめます"
date: 2018-04-22 00:00:00 +0900
categories: python
tags: python
---

仕事がらpythonを使って、データのコンバータを作成することも度々あるのですが、**pythonのdatetimeやpytzを使った日時と文字列の変換** や **タイムゾーンの変更** などを毎回毎回ネットで調べているので、いい加減覚えないと業務効率上差し支えそうです。
今回は自分の備忘録的な意味も込めて文書化しようと思います。

* Table Of Contents
{:toc}

## 環境情報

今回のPythonの実行環境は以下になります。

* python 3.5
* pytz 
* jupyter notebook

## 頻繁によく使う変換
### 文字列からdatetime

* 
```
import datetime

date_str = '2018-04-17 12:30:12.333+0900'
result = datetime.datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S.%f%z')
result

> datetime.datetime(2018, 4, 17, 12, 30, 12, 333000, tzinfo=datetime.timezone(datetime.timedelta(0, 32400)))
```
### datetimeから文字列


## タイムゾーンの変更


## まとめ


## 参考にさせていただいたサイト

