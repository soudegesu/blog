---
title: "Pythonのdatetimeとpytzで文字列からの日時やタイムゾーンの変換などをいい加減覚えたい"
description: "Pythonのdatetimeやpytzを使った文字列と日付の変換をまとめます。仕事がら別のミドルウェアやデータソースから取得したepochtimeや日付文字列をPythonのdatetimeやpytzを使って変換する処理を書くことがあるのですが、毎回ネットで調べているのでいい加減覚えよるためにまとめます"
date: 2018-04-22 00:00:00 +0900
categories: python
tags: python
---

仕事がらpythonを使って、データのコンバータを作成することも度々あるのですが、**pythonのdatetimeやpytzを使った文字列から日時への変換** や **タイムゾーンの変更** を毎回ネットで調べているので、いい加減覚えないと業務効率上差し支えそうです。

今回は自分の備忘録的な意味も込めて書こうと思います。

* Table Of Contents
{:toc}

## 環境情報

今回のPythonの実行環境は以下になります。

* python 3.6
* pytz 
* jupyter notebook

## 頻繁によく使う変換

データのクレンジング作業などで時系列データを取り扱う場合には、特定のミドルウェアや他人のコンバータによって出力されたデータの仕様を調査した上で加工処理を変更することが多いです。Pythonでは `datetime` と `time` の2つの型を使って処理をしますが、今回は `datetime` を使います。

### epochtimeからdatetime
epochtimeを表す `数値型` から `datetime` に変換します。

epochtimeはUnix時間とも言われますが、世界標準時の1970年1月1日午前0時0分0秒からの経過秒数を整数値で表したものです。
詳細はwikipediaを見た方が早いと思いますので、 [こちら](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93) をみてください。

UTCからの経過秒数を表現していることから、その数字からタイムゾーン付きのデータに変換することは容易です。

強いて言えば、epochtimeの数値データが **エポック秒** なのか **エポックミリ秒** なのかの確認が必要です。
だいたいは桁数を見るか、実際に関数にデータを放り込んで判別することが多いです。
プログラム的に記述はシンプルに済ませることができ、 datetime型の `fromtimestamp` 関数を使えば変換が可能です。

* epochtimeからdatetime

```
import datetime

e = 1524349374
dt = datetime.datetime.fromtimestamp(e)
print(dt)

# >> 2018-04-22 07:22:54
```

* ミリ秒を含むepochtimeからdatetime

```
# epochtimeからdatetime(ミリ秒含む)
import datetime

mills = 1524349374.099776
dt2 = datetime.datetime.fromtimestamp(mills)
print(dt2)

# >> 2018-04-22 07:22:54.099776
```

* エポックミリ秒

ミリ秒部分も整数で提供されている(エポックミリ秒表記)の場合には、ミリ秒が何桁まで表しているのか確認してた後、割ってあげます。

```
# epochmillitimeからdatetime
import datetime

mills = 1524349374099
dt3 = datetime.datetime.fromtimestamp(mills / 1000)
print(dt3)

# >> 2018-04-22 07:22:54.099000
```

### 文字列からdatetime

次に文字列からdatetimeに変換します。

* 文字列から日付(タイムゾーンあり)

`strptime` 関数を使えば簡単に変換できます。
ミリ秒は `%f` 、 タイムゾーンは `%z` を使えばパースしてくれます。

```
# タイムゾーンあり
import datetime

utc_date_str = '2018-04-01 20:10:56.123+0900'
dt = datetime.datetime.strptime(utc_date_str, '%Y-%m-%d %H:%M:%S.%f%z')

print(dt)
# >> 2018-04-01 20:10:56.123000+09:00
```

* 文字列から日付(タイムゾーンなし)

一番やっかいなのが、 **タイムゾーンのない日付文字列をdatetimeに変化する** 場合です。
いずれにせよ、 **日付文字列がどのタイムゾーンのデータを表しているか** を調べる必要があります。
それを基に

```
# 文字列から日付(最初からJSTとして扱う)
import datetime

utc_date_str = '2018-04-01 20:10:56'
dt = datetime.datetime.strptime(utc_date_str + '+0900', '%Y-%m-%d %H:%M:%S%z')

print(dt)
print(dt.tzinfo)
# >> 2018-04-01 20:10:56+09:00
# >> UTC+09:00
```

```
# 文字列から日付(dateutilを使う)
import datetime
from dateutil.parser import parse
from dateutil.tz import gettz

tzinfos = {'JST' : gettz('Asia/Tokyo')}
date_str = '2018-04-01 20:10:56 JST'
str_to_dt = parse(date_str, tzinfos=tzinfos)
print(str_to_dt)
```

## narativeとaware


## まとめ


## 参考にさせていただいたサイト
* [Python docs](https://docs.python.jp/3/library/datetime.html)
