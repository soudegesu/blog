---
title: "Pythonで日付文字列からのdatetime変換やタイムゾーンの変更などをいい加減覚えたい"
description: "Pythonで日付文字列からdatetimeへの変換とタイムゾーン変換をまとめます。仕事がら別のミドルウェアやデータソースから取得したepochtimeや日付文字列をPythonのdatetimeやpytzを使って変換する処理を書くことがあるのですが、毎回ネットで調べているのでいい加減覚えよるためにまとめます"
date: 2018-04-22
thumbnail: /images/icons/python_icon.png
categories:
    - python
tags:
    - python
url: /python/python-datetime/
twitter_card_image: /images/icons/python_icon.png
---

仕事がらpythonを使って、データのコンバータを作成することも度々あるのですが、**pythonのdatetimeを使った文字列から日時への変換** や **タイムゾーンの変更** を毎回ネットで調べているので、いい加減覚えないと業務効率上差し支えそうです。

今回は自分の備忘録的な意味も込めて書こうと思います。

なお、Pythonでは日付時刻の処理を行う場合に `datetime` や `date`、 `time` などの型を使って処理をしますが、今回は `datetime` を使います。

<!--adsense-->

## 環境情報

今回のPythonの実行環境は以下になります。

* python 3.6
* pytz
* jupyter notebook

<!--adsense-->

## epochtimeからdatetime
epochtimeを表す `数値型` から `datetime` に変換します。

epochtimeはUnix時間とも言われますが、世界標準時の1970年1月1日午前0時0分0秒からの経過秒数を整数値で表したものです。
詳細はwikipediaを見た方が早いと思いますので、 [こちら](https://ja.wikipedia.org/wiki/UNIX%E6%99%82%E9%96%93) をみてください。

UTCからの経過秒数を表現していることから、その数字からタイムゾーン付きのデータに変換することは容易です。

強いて言えば、epochtimeの数値データが **エポック秒** なのか **エポックミリ秒** なのかの確認をしておくと良いでしょう。
桁数を見るか、関数に実データを放り込んで判別することが多いです。

datetime型の `fromtimestamp` 関数を使えば記述もシンプルに済ませることができます。

### epochtimeからdatetime

`fromtimestamp` 関数を使った変換のサンプルは以下になります。

{{< highlight python "linenos=inline" >}}
import datetime

e = 1524349374
dt = datetime.datetime.fromtimestamp(e)

print(dt)
>> 2018-04-22 07:22:54
{{< / highlight >}}

### ミリ秒を含むepochtimeからdatetime

少数点以下にミリ秒を含んでいても問題なく変換できます。

{{< highlight python "linenos=inline" >}}
# epochtimeからdatetime(ミリ秒含む)
import datetime

mills = 1524349374.099776
dt2 = datetime.datetime.fromtimestamp(mills)

print(dt2)
>> 2018-04-22 07:22:54.099776
{{< / highlight >}}

### エポックミリ秒からdatetime

整数部分でミリ秒部分が表現されている(エポックミリ秒表記)場合には、何桁までがミリ秒を表しているのか確認した後、割ってあげます。

{{< highlight python "linenos=inline" >}}
# epochmillitimeからdatetime
import datetime

mills = 1524349374099
dt3 = datetime.datetime.fromtimestamp(mills / 1000)

print(dt3)
>> 2018-04-22 07:22:54.099000
{{< / highlight >}}

<!--adsense-->

## 文字列からdatetime

次に文字列からdatetimeに変換します。

### タイムゾーンあり日付文字列からdatetime

`strptime` 関数を使えば簡単に変換できます。
ミリ秒は `%f` 、 タイムゾーンは `%z` を使えばパースしてくれます。

{{< highlight python "linenos=inline" >}}
# タイムゾーンあり
import datetime

utc_date_str = '2018-04-01 20:10:56.123+0900'
dt = datetime.datetime.strptime(utc_date_str, '%Y-%m-%d %H:%M:%S.%f%z')

print(dt)
>> 2018-04-01 20:10:56.123000+09:00
{{< / highlight >}}

### タイムゾーンなし日付文字列からdatetime

厄介なのが、 **タイムゾーンのない日付文字列をdatetimeに変換する** 場合です。
**日付文字列がどのタイムゾーンのデータを表しているか** を調べる必要があります。
少し邪道感ありますが、データ仕様（タイムゾーンが何か）を確認した後に文字列結合してしまうのが楽ちんです。

{{< highlight python "linenos=inline" >}}
# タイムゾーンなし日付文字列(文字列結合)
import datetime

utc_date_str = '2018-04-01 20:10:56'
# JSTとして取扱う
dt = datetime.datetime.strptime(utc_date_str + '+0900', '%Y-%m-%d %H:%M:%S%z')

print(dt)
print(dt.tzinfo)
>> 2018-04-01 20:10:56+09:00
>> UTC+09:00
{{< / highlight >}}

別パターンは `dateutil` を使うパターンも書いておきます。
`dateutil` の `parse` 関数を使用する際に `tzinfos` を引数に与えることで指定のtimezoneで処理をしてくれる書き方です。
先程の例と比べて、パッと見でどこのタイムゾーンかが識別しやすくなる、という利点があります。

{{< highlight python "linenos=inline" >}}
# タイムゾーンなし日付文字列(dateutilを使う)
import datetime
from dateutil.parser import parse
from dateutil.tz import gettz

tzinfos = {'JST' : gettz('Asia/Tokyo')}
date_str = '2018-04-01 20:10:56'
str_to_dt = parse(date_str + ' JST', tzinfos=tzinfos)
print(str_to_dt)
{{< / highlight >}}

<!--adsense-->

## 日時データを扱う上で注意すべきこと
### naiveとaware

そもそもPythonで日時データを扱う場合には、**naive** と **aware** の2種類のオブジェクトがあることに注意が必要です。

以下、Pythonの公式ドキュメントから引用します。

* aware オブジェクト


> aware オブジェクトは他の aware オブジェクトとの相対関係を把握出来るように、
> タイムゾーンや夏時間の情報のような、アルゴリズム的で政治的な適用可能な時間調節に関する知識を持っています。
> aware オブジェクトは解釈の余地のない特定の実時刻を表現するのに利用されます。

* naive オブジェクト

> naive オブジェクトには他の日付時刻オブジェクトとの相対関係を把握するのに足る情報が含まれません。
> あるプログラム内の数字がメートルを表わしているのか、マイルなのか、それとも質量なのかがプログラムによって異なるように、
> naive オブジェクトが協定世界時 (UTC) なのか、現地時間なのか、それとも他のタイムゾーンなのかはそのプログラムに依存します。
> Naive オブジェクトはいくつかの現実的な側面を無視してしまうというコストを無視すれば、簡単に理解でき、うまく利用することができます。


つまり、タイムゾーンに依存したデータを扱いたい場合には `aware` オブジェクトが必要なことを意味します。


しかし厄介なのが、型とaware/naiveオブジェクトの関係です。型に対して利用するオブジェクトが一意に決まりません。

|型      |オブジェクト|
|--------|----------|
|date    |naive|
|time    |naive または aware|
|datetime|naive または aware|

`time` 型と `datetime` 型がそれぞれ、 `aware` と `naive` かは以下で確認できます。

|オブジェクト    |awareになる条件|naiveになる条件|
|--------------|-------------|--------------|
| time         |オブジェクト tの `t.tzinfo` が None でなく `t.tzinfo.utcoffset(None)` が None を返さない場合|aware以外の場合|
| datetime     |オブジェクト dの `d.tzinfo` が None でなく `d.tzinfo.utcoffset(d)` が None を返さない場合| `d.tzinfo` が None であるか `d.tzinfo` が None でないが `d.tzinfo.utcoffset(d)` が None を返す場合|

### マシン上のタイムゾーンで処理しないように注意する

awareとnaiveに留意せずにタイムゾーン変換の処理を書くと、動作環境によって得られる結果が変わってしまうため、注意が必要です。

{{< highlight python "linenos=inline" >}}
# 文字列から日付(実行マシン上のタイムゾーンに引きずられる)
import datetime
from pytz import timezone
import pytz

# タイムゾーンなし文字列からdatetimeに変換する
date_str = '2018-04-01 20:10:56'
# この処理で得られるstr_to_dtはnaive
str_to_dt = datetime.datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
print("Str to dt")
print(str_to_dt)                      # 2018-04-01 20:10:56
print(str_to_dt.timestamp())          # 1522581056.0
print(str_to_dt.tzname())             # None

# 以下、naiveな時刻をベースに演算すると、ずれる
utc = timezone('UTC')
utc_dt = str_to_dt.astimezone(utc)
print("UTC dt")
print(utc_dt)                         # 2018-04-01 11:10:56+00:00
print(utc_dt.timestamp())             # 1522581056.0
print(utc_dt.tzname())                # UTC
print(utc_dt.tzinfo.utcoffset(utc_dt))# 0:00:00

jst = timezone('Asia/Tokyo');
jst_dt = str_to_dt.astimezone(jst);
print("JST dt")
print(jst_dt)                         # 2018-04-01 20:10:56+09:00
print(jst_dt.timestamp())             # 1522581056.0
print(jst_dt.tzname())                # JST
print(jst_dt.tzinfo.utcoffset(jst_dt))# 9:00:00

{{< / highlight >}}

この例ではタイムゾーンなしの文字列からdatetime型の `str_to_dt` を作成するのですが、
そこから `astimezone` 関数を使って任意のタイムゾーンへ変換しようとする際に、
実行環境上のタイムゾーンから、変換先のタイムゾーンへの相対的な計算が行われます。

そのため、パブリッククラウドで複数リージョンを使っている場合などには、
プログラムの展開先によって振る舞いが異なる可能性があるため、注意が必要でしょう。

<!--adsense-->

## まとめ

今回はPythonで日付文字列からdatetime型に変換するときの方法を書きました。

日付文字列を変換する場合には **文字列の中にタイムゾーン情報が含まれているか** を気をつけて処理をすると良いです。

得られるオブジェクトが `aware` か `naive` なのかを意識した上でタイムゾーン変換の処理を行わないと、うっかり手痛い変換ミスになってしまうので注意が必要だからです。

私の場合、基本的には「データ仕様を確認して、タイムゾーンあり文字列として変換してしまう」方で処理をしようと思いました。

## 参考にさせていただいたサイト

* [Python docs](https://docs.python.jp/3/library/datetime.html)

<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/479738946X/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=479738946X&linkCode=am2&tag=soudegesu-22&linkId=4d6041eaf55821514ce2f3c16f0b9a5c"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=479738946X&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=479738946X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
