---
title: "Jupyter Notebookでコードの自動補完をする"
description: "Jupyter Notebookではデフォルトでコード補完が利きません。ライブラリのコードを補完するために個別に設定が必要です。"
date: "2019-08-21T07:51:20+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

[Jupyter Notebook](https://jupyter.org/) はPythonの開発環境として良く利用されますが、デフォルトではコード補完が有効になっていません。
そのためパッケージのimport時には少し困ってしまいます。今回はJupyter Notebookでコード補完をする小ネタを紹介します。

<!--adsense-->

## コードを自動補完したい！

IDEを使う上で、コーディングをサクサク進めるためにコード補完は重要な機能です。
IDEや人によって **オートコンプリート** と言ったり、 **自動補完** と言ったり、 **インテリセンス** と言ったり表現は様々ですが機能としては一緒です。

[Jupyter Notebook](https://jupyter.org/) でコーディングするときに自動補完が有効になる方法を調査したので、備忘録として残しておきます。

## 方法その１: `IPCompleter.greedy` を使う

まず一番簡単な方法を紹介します。

任意のNotebookファイルを開き、以下のマジックコマンドを実行するだけです。

{{< highlight python "linenos=inline" >}}
%config IPCompleter.greedy=True
{{< / highlight >}}

`Tab` キーを押すことで入力補完が表示されます。

ただし、打キー後に候補表示されるまでワンテンポ遅れます。手元の環境では1-2秒程待たされました。

<!--adsense-->

## 方法その２: `Nbextensions` の自動補完を使う

次に [Jupyter Notebook](https://jupyter.org/) の拡張機能をまとめて導入するためのライブラリを使う方法を紹介します。
以下のコマンドでは [Jupyter Notebook](https://jupyter.org/) が既にインストールされていることを前提とします。

{{< highlight bash "linenos=inline" >}}
# ライブラリをインストール
pip install jupyter-contrib-nbextensions
pip install jupyter-nbextensions-configurator

# 拡張機能を有効化する
jupyter contrib nbextension install
jupyter nbextensions_configurator enable
{{< / highlight >}}

その後、[Jupyter Notebook](https://jupyter.org/)を再起動すると、 **Nbextentions** というタブが追加されていることがわかります。

![nbextentions.png](/images/20190821/nbextentions.png)

コード補完に使う [Hinterland](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions/hinterland) を有効化します。

入力中に自動で候補が出てきますし、`Tab` キーを押すことで入力候補を表示します。
方法１の `IPCompleter.greedy` と比較して候補の表示が素早いのでこちらがいいかもしれません。

![completion.png](/images/20190821/completion.png)

<!--adsense-->

## まとめ

[Jupyter Notebook](https://jupyter.org/) 上でのコード補完の方法を紹介しました。体感としては **方法２の`Nbextensions` の自動補完を使う方をオススメします。** 補完も早いですし、タイピングの途中でも候補表示を出してくれるので親切です。

## 参考にさせていただいたサイト

* [Introduction to IPython configuration](https://ipython.org/ipython-doc/3/config/intro.html)
* [Migrating from IPython Notebook](https://jupyter.readthedocs.io/en/latest/migrating.html#since-jupyter-does-not-have-profiles-how-do-i-customize-it)
