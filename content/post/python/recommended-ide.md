---
title: "Python初心者にオススメのIDE（エディタ）"
description: "Pythonのコードを書く時に初心者にオススメのIDEをまとめました。用途に応じて使い分けすることで、開発効率をアップさせることができるでしょう。"
date: "2018-11-27T09:49:50+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

初めてPythonを触る方に **「Pythonで開発する時にIDEは何を使えば良いでしょうか？」** とよく聞かれます。

手元でささっと動かすだけであれば、自身の手に馴染んだIDEを使ったり、エディタにPythonのプラグインをインストールするのが手っ取り早いでしょうが、初心者の方には **やりたいこと（作りたいもの）を聞いてから、用途に応じてオススメのエディタを伝えています** 。
今回はいくつかあるPythonのIDEの中で、初心者向けのものと、個人的に考えるユースケースを紹介します。

## IDEとは

そもそもIDEは **Integrated Development Environment** の略であり、日本語では「統合開発環境」と呼ばれています。
そもそもプログラミングでは実行可能なプログラムを完成させるまでに、プログラムを記述し、コードをコンパイルし、実行し、デバッグするというおおまかな流れがあります。IDEはこれらのプロセスを単一のツール上で行うことができるため、「統合」と銘打っていると理解しています。

## エディタとは

「エディタ」という単語もIDEを語る文脈の中で登場します。エディタ（editor）というくらいですから、
その名の通り、一般には「（プログラムやテキストなどの）記述や編集」に特化したツールのことを指します。
書くことに特化したツールであるため、インストール時の初期状態では編集しかできませんが、
プラグイン（拡張機能）を追加することでIDEと同等の機能を持たせることができます。

<!--adsense-->

## PyCharm

まず最初に紹介するのは、Jetbrains社が提供するPython用IDEの [PyCharm](https://www.jetbrains.com/pycharm/) です。

![pycharm](/images/20181127/pycharm.png)

他のエディタと比べてPyCharmは高機能なIDEと言えます。特にコード補完やデバッガの優秀さが特徴で、 **Pythonで中〜大規模なアプリケーションを開発する時にオススメします。** 
例えば、[django](https://www.djangoproject.com/)を使ったWebアプリケーションや、Pythonのライブラリのソースコードを読む場合などです。

PyCharmには無料版と有償版の2種類が存在し、[無料版と有償版の機能比較](https://www.jetbrains.com/pycharm/features/editions_comparison_matrix.html) ページが公開されています。
Pythonで本格的なwebアプリケーションを作る場合には有償版の購入を検討しても良いでしょうが、 **大抵の場合は無料版の機能で十分足りる** でしょう。

唯一の欠点としては、高機能な分、起動に時間がかかることです。

<!--adsense-->

## Visual Studio Code

次はMicrosoft社が提供するソースコードエディタ、[Visual Studio Code](https://code.visualstudio.com/) です。
プログラミングで使うことを目的としたエディタで、とても使い勝手が良いです。

![vscode](/images/20181127/vscode.png)

[Visual Studio Code](https://code.visualstudio.com/) は汎用性の高いエディタで、プラグインをインストールすることで、
どの言語にも対応できるようになります。Microsoft社からPythonのプラグインが提供されているので、それをインストールすると良いでしょう。

![vscode_python_extention.png](/images/20181127/vscode_python_extention.png)

**小〜中規模なPythonコード** を書くのであれば [Visual Studio Code](https://code.visualstudio.com/) をオススメします。
例えば、簡単なWebスクレイピングプログラムや、AWS Lambdaの関数を作成する場合です。

[Visual Studio Code](https://code.visualstudio.com/) の特徴としては、**動作の軽快さ** があります。
サクッと立ち上げて、サクッと書くなら一番だと感じています。余談ですが、私はGoも [Visual Studio Code](https://code.visualstudio.com/) で書いています。

<!--adsense-->

## Jupyter Notebook

次に [Jupyter Notebook](http://jupyter.org/) を紹介します。Jupyterの読みは「ジュパイター」でも「ジュピター」でも通じます。
昔は **IPython Notebook** という名前のツールでした。

[Jupyter Notebook](http://jupyter.org/) はブラウザ上で動作するIDEになります。

[Jupyter Notebook](http://jupyter.org/) はwebページからインストーラをダウンロードするのではなく、Pythonの `pip` コマンドでインストールをします。

{{< highlight bash "linenos=inline" >}}
pip install -U pip  #pipのバージョンを最新にする
pip install jupyter #jupyter をインストールする
{{< / highlight >}}

インストールが完了すると `jupyter` コマンドが使えるようになるので、 [Jupyter Notebook](http://jupyter.org/) を起動します。

{{< highlight bash "linenos=inline" >}}
jupyter notebook
{{< / highlight >}}

コマンド実行後にブラウザが起動し、 `http://localhost:8888` にてアクセスができるようになります。

![jupyter_home](/images/20181127/jupyter_home.png)

[Jupyter Notebook](http://jupyter.org/) の特徴は、コードブロック単位（セル）でプログラムが実行できることと、表や図の描画に優れていることです。
そのため、 コーディングと並行して **データの可視化が必要な場合** にオススメします。
例えば、機械学習やデータファイル（エクセルやCSV）を取り扱う場面が該当します。

![jupyter_iris](/images/20181127/jupyter_iris.png)

欠点として、先程説明したユースケースにおいては、ファイル拡張子が [Jupyter Notebook](http://jupyter.org/) 専用の `.ipynb` になってしまうことが挙げられます。`.ipynb` ファイルから、Pythonの実行ファイルである `.py` ファイルへ変換することも可能ですが、各セルのコードを画一的に出力するだけなので、実用性はありません。 **.pyファイルの作成には向いていないと言えます** 。
加えて、**他のIDEと比べるとコード補完が弱い** ことも気にしておく必要があります。

<!--adsense-->

## Google Colaboratory

最後に番外編として、[Colaboratory](https://colab.research.google.com/) を上げておきます。
これは [Jupyter Notebook](http://jupyter.org/) を Google社がカスタマイズしたWebサービスで、
GPUやTPUといった特殊なプロセッサを使ってプログラムを実行させることができます。

こちらは以前の記事、「[Colaboratoryは機械学習エンジニアための最高のツールだった] (/python/colaboratory-is-a-good-tool-for-tensorflow-user/) 」 にまとめているので、時間のある時に読んでみてください。

## まとめ

今回、私が考える初心者向けのPythonのIDEを紹介しました。

まとめると、

* 本格的なPythonアプリケーションを実装するなら [PyCharm](https://www.jetbrains.com/pycharm/)
  * 無料版でも問題ない
  * Webアプリケーションフレームワークを使って実装するなら有償版を検討する価値はある
* コードをサクッと書くなら [Visual Studio Code](https://code.visualstudio.com/)
* 機械学習のようなデータ処理なら [Jupyter Notebook](http://jupyter.org/)
  * GPUやTPUを使いたいなら [Colaboratory](https://colab.research.google.com/) を選択するのもあり

です。是非いろいろ試してみて、自分の手に馴染む開発環境を手に入れてください！
