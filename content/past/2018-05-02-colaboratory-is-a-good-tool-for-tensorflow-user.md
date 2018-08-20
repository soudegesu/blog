---
title: "Colaboratoryは機械学習エンジニアための最高のツールだった"
description: "普段Jupter notebookで統計処理や機械学習ライブラリを触っている開発者の方は多いはず。今回は巷で話題のColaboratoryを触り、その特徴をまとめてみました。"
date: 2018-05-02
categories:
    - python
tags:
    - colaboratory
    - machine-learning
    - tensorflow
    - python
url: /python/colaboratory-is-a-good-tool-for-tensorflow-user/
---

普段 [Jupter notebook](http://jupyter.org/) で統計処理や機械学習ライブラリを触っている開発者の方は多いはず。今回は巷で話題の [Colaboratory](https://colab.research.google.com/) を触ってみました。

## Colaboratoryとは

[Colaboratory](https://colab.research.google.com/) はGoogleから提供されている[Jupter notebook](http://jupyter.org/) 環境です。

実行環境はGoogle側のクラウドを使わせていただけるので、ユーザの **環境構築は不要** です。

ちなみに、Googleアカウントが無くても利用できますが、Googleアカウントと連携した方がメリットが大きいので、
作成することをオススメします。

![colaboratory_top](/images/20180502/colaboratory_top.png)

以降では、早速使ってみたColaboratoryの特徴をまとめました。

## Colaboratoryの特徴
### 利用料がタダ

まず、これが最大のメリットと言えるでしょう。
[よくある質問](https://research.google.com/colaboratory/faq.html) にも記載があったので引用します。

> **Is it free to use?**
>
> Yes. Colaboratory is a research project that is free to use.

無料です。最高です。

なお、特に記載が見当たらなかったので、後述の **GPU利用も無料** で利用できると思います。これは有りがたい。

### GPUも使える

なんと、**実行環境にGPUも選択できるのです** 。

ローカルマシンだと、全力でファンが回転して、ブラウジングにすら支障が出ます。

ただでさえクラウド上に計算リソースを逃がせるだけでもありがたいのに、GPUを使わせてもらえるなんて最高です。

設定の手順としては以下の2ステップで終了です。

<br>

* **メニューから [Runtime] > [Change runtime type] を選択**

<br>

![switch_to_gpu_1](/images/20180502/switch_to_gpu_1.png)

<br>

* **Hardware accelerator を「GPU」に変更して「Save」**

<br>

![switch_to_gpu_2](/images/20180502/switch_to_gpu_2.png)

<br>

notebook上で以下のコードを実行すれば、GPUに変更されたことを確認できます。

```
import tensorflow as tf
tf.test.gpu_device_name()
```

デバイス名が表示されていますね。(CPUの場合は空文字が返ってきます)

![switch_to_gpu_3](/images/20180502/switch_to_gpu_3.png)

### Google Driveと連携できる

Google のサービスだけあって、Google Driveとの連携も容易です。
notebookが `.ipynb` 形式で連携できるのが嬉しいポイントです。

Colaboratoryで作成したプログラムは自分のGoogle Driveに `.ipynb` で保存されます。

![save_to_drive](/images/20180502/save_to_drive.png)

<br>

逆に、既にローカルマシン上に存在する `.ipynb` ファイルのアップロードには メニューから [Upload notebook] を選択し、
ファイルをドラッグ&ドロップするだけで読み込むことができます。

![upload_notebook](/images/20180502/upload_notebook.png)

<br>

もちろん、Google Drive上にアップロードした `.ipynb` ファイルをColaboratoryで開くことも可能です。
Google Drive上のアイコンが見た目的に違いますし、開こうとするとポップアップが出たりしますが、大丈夫でした。

### デフォルトでスニペットが揃っている

Colaboratory はJupyter notebookのGUIを少し拡張していて、コードスニペットの機能を持っています。
コードスニペットを呼び出して、notebookのcellに埋め込むことができます。
特にGoogle Driveと連携する場合などには、Google APIの呼び出しのコード片を貼り付けるだけで済むので重宝します。

![use_snipet](/images/20180502/use_snipet.png)

ショートカットキーもバインドされていて、 `Command/Ctrl + Alt + P` でスニペットウィンドウが表示されるので
覚えておくのが良さそうです。

### 実行環境が選択できる

少し特殊なユースケースですが、ランタイムをColaboratoryからローカルマシンに切り替えることができます。
例えば、Colaboratoryで作成したコードをローカルマシンのGPUで動かしたい場合などが該当します。

設定手順は少し特殊なので以下にまとめます。

#### ローカルマシンの設定

* jupyter notebookをインストールしておく

```bash
pip install jupyter\[notebook\]
```

* serverextensionを有効にする

```bash
pip install jupyter_http_over_ws
jupyter serverextension enable --py jupyter_http_over_ws
```

* Colaboratoryのアクセスを許可する

```bash
jupyter notebook --NotebookApp.allow_origin='https://colab.research.google.com' --port=8888
```

#### Colaboratoryの設定

上の手順でローカルマシン上でJupyter notebookが起動している状態にします。

その後、画面右上側の「Connect」 メニューで「Connect to local runtime...」 を選択します。

<br>

![switch_runtime](/images/20180502/switch_runtime.png)

<br>

これでローカルマシンをランタイムとして実行できます。

## 注意事項

Colaboratory を使う上での注意点を少しまとめました。

### 長時間の実行には向かない

ColaboratoryではGPUも使うことができて大変ありがたいのですが、長時間専有して使うことは推奨されていないようです。
[よくある質問](https://research.google.com/colaboratory/faq.html) にも、
長時間の実行、特に仮想通貨のマイニングには使わないように、と記載がされていました。

> **How may I use GPUs and why are they sometimes unavailable?**
>
> Colaboratory is intended for interactive use. Long-running background computations, particularly on
> GPUs, may be stopped. Please do not use Colaboratory for cryptocurrency mining. Doing so is
> unsupported and may result in service unavailability. We encourage users who wish to run continuous
> or long-running computations through Colaboratory’s UI to use a local runtime.

ちなみに、 [GPUを12時間以上実行しようとしたツワモノ](https://stackoverflow.com/questions/49438284/google-colaboratory-with-gpu) の存在を確認しましたが、
連続稼働時間については公式から具体的な言及がなされていないので、Colaboratoryを商用環境的な用途では使わない方が懸命かもしれません。


### コードをクラウド環境に乗せることになる

これはColaboratoryに限らず、クラウドサービス利用における一般的な話になりますが、
ソースコード管理やデータの取扱いのガバナンスが厳しい企業では利用は難しいかもしれません。

たとえ、用途が一時的であっても、クラウド上に自社の貴重な資産がアップロードされることになるからです。

### ランタイム切り替え時にはモジュールの差分を意識する

当たり前ですが、ランタイムをColaboratoryからローカル環境に切り替える場合には、
ローカル環境にインストールしているPython モジュールとColaboratoryに差分があることを理解しておきましょう。

具体的に言うと、以下のコードをColaboratoryとローカルのJupyter notebook上の両方で実行してみるとわかります。

```python
import pkg_resources
[pkg for pkg in pkg_resources.working_set]
```

* ColaboratoryにデフォルトでインストールされているPythonモジュール

```python
[xgboost 0.7.post4 (/usr/local/lib/python3.6/dist-packages),
 wheel 0.31.0 (/usr/local/lib/python3.6/dist-packages),
 Werkzeug 0.14.1 (/usr/local/lib/python3.6/dist-packages),
 webencodings 0.5.1 (/usr/local/lib/python3.6/dist-packages),
 wcwidth 0.1.7 (/usr/local/lib/python3.6/dist-packages),
 urllib3 1.22 (/usr/local/lib/python3.6/dist-packages),
 uritemplate 3.0.0 (/usr/local/lib/python3.6/dist-packages),
 traitlets 4.3.2 (/usr/local/lib/python3.6/dist-packages),
 tornado 4.5.3 (/usr/local/lib/python3.6/dist-packages),
 testpath 0.3.1 (/usr/local/lib/python3.6/dist-packages),
 terminado 0.8.1 (/usr/local/lib/python3.6/dist-packages),
 termcolor 1.1.0 (/usr/local/lib/python3.6/dist-packages),
 tensorflow 1.7.0 (/usr/local/lib/python3.6/dist-packages),
 tensorboard 1.7.0 (/usr/local/lib/python3.6/dist-packages),
 sympy 1.1.1 (/usr/local/lib/python3.6/dist-packages),
 statsmodels 0.8.0 (/usr/local/lib/python3.6/dist-packages),
 six 1.11.0 (/usr/local/lib/python3.6/dist-packages),
 simplegeneric 0.8.1 (/usr/local/lib/python3.6/dist-packages),
 setuptools 39.1.0 (/usr/local/lib/python3.6/dist-packages),
 seaborn 0.7.1 (/usr/local/lib/python3.6/dist-packages),
 scipy 0.19.1 (/usr/local/lib/python3.6/dist-packages),
 scikit-learn 0.19.1 (/usr/local/lib/python3.6/dist-packages),
 scikit-image 0.13.1 (/usr/local/lib/python3.6/dist-packages),
 rsa 3.4.2 (/usr/local/lib/python3.6/dist-packages),
 requests 2.18.4 (/usr/local/lib/python3.6/dist-packages),
 requests-oauthlib 0.8.0 (/usr/local/lib/python3.6/dist-packages),
 pyzmq 16.0.4 (/usr/local/lib/python3.6/dist-packages),
 PyYAML 3.12 (/usr/local/lib/python3.6/dist-packages),
 PyWavelets 0.5.2 (/usr/local/lib/python3.6/dist-packages),
 pytz 2018.4 (/usr/local/lib/python3.6/dist-packages),
 python-dateutil 2.5.3 (/usr/local/lib/python3.6/dist-packages),
 pyparsing 2.2.0 (/usr/local/lib/python3.6/dist-packages),
 Pygments 2.1.3 (/usr/local/lib/python3.6/dist-packages),
 pyasn1 0.4.2 (/usr/local/lib/python3.6/dist-packages),
 pyasn1-modules 0.2.1 (/usr/local/lib/python3.6/dist-packages),
 ptyprocess 0.5.2 (/usr/local/lib/python3.6/dist-packages),
 psutil 5.4.5 (/usr/local/lib/python3.6/dist-packages),
 protobuf 3.5.2.post1 (/usr/local/lib/python3.6/dist-packages),
 prompt-toolkit 1.0.15 (/usr/local/lib/python3.6/dist-packages),
 portpicker 1.2.0 (/usr/local/lib/python3.6/dist-packages),
 plotly 1.12.12 (/usr/local/lib/python3.6/dist-packages),
 pip 10.0.1 (/usr/local/lib/python3.6/dist-packages),
 Pillow 4.0.0 (/usr/local/lib/python3.6/dist-packages),
 pickleshare 0.7.4 (/usr/local/lib/python3.6/dist-packages),
 pexpect 4.5.0 (/usr/local/lib/python3.6/dist-packages),
 patsy 0.5.0 (/usr/local/lib/python3.6/dist-packages),
 pandocfilters 1.4.2 (/usr/local/lib/python3.6/dist-packages),
 pandas 0.22.0 (/usr/local/lib/python3.6/dist-packages),
 pandas-gbq 0.4.1 (/usr/local/lib/python3.6/dist-packages),
 opencv-python 3.4.0.12 (/usr/local/lib/python3.6/dist-packages),
 olefile 0.45.1 (/usr/local/lib/python3.6/dist-packages),
 oauthlib 2.0.7 (/usr/local/lib/python3.6/dist-packages),
 oauth2client 4.1.2 (/usr/local/lib/python3.6/dist-packages),
 numpy 1.14.3 (/usr/local/lib/python3.6/dist-packages),
 notebook 5.2.2 (/usr/local/lib/python3.6/dist-packages),
 nltk 3.2.5 (/usr/local/lib/python3.6/dist-packages),
 networkx 2.1 (/usr/local/lib/python3.6/dist-packages),
 nbformat 4.4.0 (/usr/local/lib/python3.6/dist-packages),
 nbconvert 5.3.1 (/usr/local/lib/python3.6/dist-packages),
 mpmath 1.0.0 (/usr/local/lib/python3.6/dist-packages),
 mistune 0.8.3 (/usr/local/lib/python3.6/dist-packages),
 matplotlib 2.1.2 (/usr/local/lib/python3.6/dist-packages),
 MarkupSafe 1.0 (/usr/local/lib/python3.6/dist-packages),
 Markdown 2.6.11 (/usr/local/lib/python3.6/dist-packages),
 Keras 2.1.6 (/usr/local/lib/python3.6/dist-packages),
 jupyter-core 4.4.0 (/usr/local/lib/python3.6/dist-packages),
 jupyter-client 5.2.3 (/usr/local/lib/python3.6/dist-packages),
 jsonschema 2.6.0 (/usr/local/lib/python3.6/dist-packages),
 Jinja2 2.10 (/usr/local/lib/python3.6/dist-packages),
 ipython 5.5.0 (/usr/local/lib/python3.6/dist-packages),
 ipython-genutils 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 ipykernel 4.6.1 (/usr/local/lib/python3.6/dist-packages),
 idna 2.6 (/usr/local/lib/python3.6/dist-packages),
 httplib2 0.11.3 (/usr/local/lib/python3.6/dist-packages),
 html5lib 0.9999999 (/usr/local/lib/python3.6/dist-packages),
 h5py 2.7.1 (/usr/local/lib/python3.6/dist-packages),
 grpcio 1.11.0 (/usr/local/lib/python3.6/dist-packages),
 googleapis-common-protos 1.5.3 (/usr/local/lib/python3.6/dist-packages),
 google-resumable-media 0.3.1 (/usr/local/lib/python3.6/dist-packages),
 google-colab 0.0.1a1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-translate 1.3.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-storage 1.8.0 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-language 1.0.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-core 0.28.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-bigquery 1.1.0 (/usr/local/lib/python3.6/dist-packages),
 google-auth 1.4.1 (/usr/local/lib/python3.6/dist-packages),
 google-auth-oauthlib 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 google-auth-httplib2 0.0.3 (/usr/local/lib/python3.6/dist-packages),
 google-api-python-client 1.6.7 (/usr/local/lib/python3.6/dist-packages),
 google-api-core 1.1.1 (/usr/local/lib/python3.6/dist-packages),
 gast 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 future 0.16.0 (/usr/local/lib/python3.6/dist-packages),
 entrypoints 0.2.3 (/usr/local/lib/python3.6/dist-packages),
 decorator 4.3.0 (/usr/local/lib/python3.6/dist-packages),
 cycler 0.10.0 (/usr/local/lib/python3.6/dist-packages),
 crcmod 1.7 (/usr/local/lib/python3.6/dist-packages),
 chardet 3.0.4 (/usr/local/lib/python3.6/dist-packages),
 certifi 2018.4.16 (/usr/local/lib/python3.6/dist-packages),
 cachetools 2.0.1 (/usr/local/lib/python3.6/dist-packages),
 bleach 1.5.0 (/usr/local/lib/python3.6/dist-packages),
 beautifulsoup4 4.6.0 (/usr/local/lib/python3.6/dist-packages),
 astor 0.6.2 (/usr/local/lib/python3.6/dist-packages),
 absl-py 0.2.0 (/usr/local/lib/python3.6/dist-packages)]
```

* Jupyter notebookにデフォルトでインストールされているPythonモジュール

```python
[widgetsnbextension 3.2.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 webencodings 0.5.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 wcwidth 0.1.7 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 traitlets 4.3.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 tornado 5.0.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 testpath 0.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 terminado 0.8.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 six 1.11.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 simplegeneric 0.8.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 setuptools 28.8.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Send2Trash 1.5.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 qtconsole 4.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pyzmq 17.0.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 python-dateutil 2.7.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Pygments 2.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ptyprocess 0.5.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 prompt-toolkit 1.0.15 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pip 10.0.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pickleshare 0.7.4 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pexpect 4.5.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 parso 0.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pandocfilters 1.4.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 notebook 5.4.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 nbformat 4.4.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 nbconvert 5.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 mistune 0.8.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 MarkupSafe 1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter 1.0.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-core 4.4.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-console 5.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-client 5.2.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jsonschema 2.6.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Jinja2 2.10 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jedi 0.12.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipywidgets 7.2.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipython 6.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipython-genutils 0.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipykernel 4.8.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 html5lib 1.0.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 entrypoints 0.2.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 decorator 4.3.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 bleach 2.1.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 backcall 0.1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 appnope 0.1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages)]
```

機械学習ライブラリや数値計算系ライブラリ、Google APIなどがColaboratoryには入っていますね。
必要に応じてローカル環境にもライブラリをインストールしましょう。

## まとめ

今回はColaboratoryの特徴をまとめてみました。
実行環境として必要な基盤はほとんど揃っているため、簡単に開発をスタートできるのが大変嬉しいです。
加えて、従来と比較して、Googleのサービスと容易に連携させることができるので、例えば、Google Spread Sheetに基データをストアしている方などは大変重宝するでしょう。
ただし、Googleのクラウドサービスですから、仕事での利用を視野に入れている人は、所属企業のガバナンスを確認した上で使うと良いでしょう。

## 参考にさせていただいたサイト

* [Frequently Asked Questions](https://research.google.com/colaboratory/faq.html)
* [Local runtimes](https://research.google.com/colaboratory/local-runtimes.html)

<br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/4873118344/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873118344&linkCode=as2&tag=soudegesu-22&linkId=972efa59090adfce72f22528173f3769"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873118344&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873118344" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
