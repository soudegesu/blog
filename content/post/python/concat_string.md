---
title: "Pythonを使った文字列連結（文字列結合）の方法: +演算子/join関数/format関数/f-strings"
description: "Pythonで文字列連結（文字列結合）を行います。+演算子やjoin関数、format関数やf-stringsを使います。なお、Python3での利用を想定しています。"
date: "2019-10-28T08:41:04+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

Pythonで良く使う文字列操作の備忘メモです。今回はPythonで文字列連結（文字列結合）の方法を紹介します。
なお、ここではPython

<!--adsense-->

## '+' 演算子で連結する

まず一番シンプルなのが `+` 演算子を使った文字列結合になります。
`+` 演算子による文字列結合ができないプログラミング言語もありますが、Pythonは問題なくできます。

{{< highlight python "linenos=inline" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
print(a + b + c)

> aaabbbccc
{{< / highlight >}}

<!--adsense-->

## 文字列リテラル同士で連結する

Pythonは文字列リテラル同士であれば `+` 演算子を使わなくても、文字列同士を連結することができます。
ただ、たいていは変数に格納された文字列を使うケースが多いので、正直この使い方をした経験はありません。

{{< highlight python "linenos=inline" >}}
txt = 'aaa' 'ccc'
print(txt)

> aaacccc
{{< / highlight >}}

<!--adsense-->

## リストをjoin()関数で連結する

次にリスト内の格納された文字列の要素を連結します。
以下のようにfor文で連結することもできますが、記述が冗長になります。

{{< highlight python "linenos=inline" >}}
arr = ['aaa', 'bbb', 'ccc']
txt = ''
for t in arr:
    txt += t
print(txt)

> aaabbbccc
{{< / highlight >}}

ここで、 `str` 型の `join()` 関数を使うことで簡単に連結できます。

{{< highlight python "linenos=inline" >}}
arr = ['aaa', 'bbb', 'ccc']
# 空文字で文字列結合する
txt = ''.join(arr)
print(txt)

> aaabbbccc
{{< / highlight >}}

上の例では空文字(`''`)によって文字列を結合していますが、任意の結合文字を指定することができます。
例えば、カンマ区切りでの文字列として結合するためには、以下のように実装します。

{{< highlight python "linenos=inline" >}}
arr = ['aaa', 'bbb', 'ccc']
txt = ','.join(arr)
print(txt)

> aaa,bbb,ccc
{{< / highlight >}}

<!--adsense-->

## format()関数で連結する

{{< highlight python "linenos=inline" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = '{}{}{}'.format(a, b, c)
print(txt)

> 'aaabbbccc'
{{< / highlight >}}

{{< highlight python "linenos=inline" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = '{0}{2}{1}'.format(a, b, c)
print(txt)

> 'aaacccbbb'
{{< / highlight >}}

<!--adsense-->

## f-stringsで連結する

Python `3.6` 以上では

{{< highlight python "linenos=inline" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = f'{a}{b}{c}'
print(txt)

> 'aaabbbccc'
{{< / highlight >}}

## 早いのはどのやり方か
