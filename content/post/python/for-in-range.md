---
title: "Pythonのrange関数を使ったfor文の書き方"
description: "Pythonでrange関数を使ってfor文をきれいに書こう"
date: "2019-10-25T08:41:41+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

Pythonでは他のプログラミング言語と比べて、ユーティリティ関数の実装が多くあります。
今回はその中でもPythonの `range()` 関数を使ったfor文の処理を紹介します。

<!--adsense-->

## 動作環境

今回は以下の環境にて動作確認をしています。

* Python 3.8

## range()関数とは

`range()` は数列を作るために用いるPythonの組み込み関数です。
主にfor文と組み合わせて使います。

`range()` 関数には引数の与え方がいくつかあり、それによって生成する数列のルールを制御します。

## range()関数の使い方

### range()関数に引数を１つあたえて、０始まりの数列を生成する

まずは一番基本となる使い方です。 `range()` 関数に整数値の引数を１つ与えましょう。

以下では `range(5)` を呼び出しています。 引数を１つ与えた場合には `0` を始まりとして、`引数に与えた数 - 1（今回だと4）` までの数列を関数が生成することを確認できます。

{{< highlight python "linenos=inline" >}}
for i in range(5):
    print(i)

> 0
> 1
> 2
> 3
> 4
{{< / highlight >}}

<!--adsense-->

### range()関数に引数を２つあたえて、任意の数字始まりの数列を生成する

`range()` 関数に整数値の引数を２つ与えた場合には、 `第１引数の数字` を始まりとして、`第２引数に与えた数 - 1` までの数列を生成できます。

{{< highlight python "linenos=inline" >}}
for i in range(2, 5):
    print(i)

> 2
> 3
> 4
{{< / highlight >}}

`range(0, N)` とすると `range(N)` と等価になります（ `N` は任意の整数値）

{{< highlight python "linenos=inline" >}}
# range(5)と等価
for i in range(0, 5):
    print(i)

> 0
> 1
> 2
> 3
> 4
{{< / highlight >}}

また、第１引数の値よりも第２引数の値が大きい必要があります。
内部的には暗黙的に１ずつ加算していくため、よしなに1ずつ減算する振る舞いはしてくれません。

{{< highlight python "linenos=inline" >}}
# 数列が生成されない例
for i in range(10, 0):
    print(i)

>
{{< / highlight >}}

<!--adsense-->

### range()関数に引数を３つあたえて、任意の数字始まりかつ任意の加算ステップの数列を生成する

`range()` 関数に整数値の引数を３つ与えた場合には、 `第１引数の数字` を始まりとして、`第２引数に与えた数 - 1` までの数列を `第３引数の数字刻みで` 生成できます。

以下では2から8までの整数値の間で2ずつ加算していく数列を作っています。

{{< highlight python "linenos=inline" >}}
for i in range(2, 8, 2):
    print(i)

> 2
> 4
> 6
{{< / highlight >}}

第３引数に負の整数を与えれば減算する数列を作ることもできます。

{{< highlight python "linenos=inline" >}}
for i in range(5, 0, -1):
    print(i)

> 5
> 4
> 3
> 2
> 1
{{< / highlight >}}

残念ながら、少数を扱う数列は生成できません。

{{< highlight python "linenos=inline" >}}
for i in range(1, 5, 0.2):
    print(i)

> TypeError: 'float' object cannot be interpreted as an integer
{{< / highlight >}}


### リスト内包表記と組み合わせて使う

`range()` 関数とリスト内包表記を組み合わせて、数値配列を初期化することもできます。

{{< highlight python "linenos=inline" >}}
arr = [i for i in range(1, 10, 3)]
print(arr)

> [1, 4, 7]
{{< / highlight >}}

<!--adsense-->

## range()関数を使うメリット

数列を簡単に生成できる `range()` 関数ですが、 `range()` 関数で生成されるオブジェクトは **数字の格納された配列ではありません** 。
以下では `range` クラスオブジェクトの存在を確認できます。

{{< highlight python "linenos=inline" >}}
hoge = range(1, 10)
print(hoge)

> range(1, 10)

print(type(hoge))

> <class 'range'>

{{< / highlight >}}

[Pythonの公式サイト](https://docs.python.org/ja/3/tutorial/controlflow.html#the-range-function) でもその旨が記載されています。
以下、引用です。

> range() が返すオブジェクトは、いろいろな点でリストであるかのように振る舞いますが、本当はリストではありません。これは、イテレートした時に望んだ数列の連続した要素を返すオブジェクトです。しかし実際にリストを作るわけではないので、スペースの節約になります。

なるほど、数値のリストを自前で作るよりもメモリ効率が良いということですね。

## 参考にさせていただいたサイト

* [4. その他の制御フローツール](https://docs.python.org/ja/3/tutorial/controlflow.html#the-range-function)
