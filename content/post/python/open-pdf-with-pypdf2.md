---
title: "PDFをPython（PyPDF2）で操作する - PDF・暗号化PDFファイルの読み込み"
description: "PythonでPDFファイルを開く方法をPyPDF2って紹介します。普通のPDFファイルと暗号化されたパスワード付きPDFファイルで開き方が異なるので、それぞれの場合と、PyPDF2で発生するエラーの問題についても触れます。"
date: "2018-11-30T10:54:40+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pdf"
  - "pypdf2"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

今回はPDFファイルをPythonで操作する方法を紹介したいと思います。

## 事前準備

まずは事前準備を行いましょう。
なお、実行環境との依存モジュールのバージョンは以下として話を進めます。

* python 3.6
* PyPDF2 1.26.0

### PyPDF2のインストール

PythonでPDFファイルの操作をする時には [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使います。

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) は

* PDFファイルからの情報の抽出
* 既存のPDFを操作し、新しいファイルを生成する

を得意としています。

それでは、 `pip` コマンドでモジュールをインストールしましょう。

{{< highlight bash "linenos=inline" >}}
pip install PyPDF2
{{< / highlight >}}

### PDFファイルの準備

読み込めそうなPDFファイルを入手しましょう。

今回は [アメリカ大統領からの大統領令のページ](https://www.federalregister.gov/presidential-documents/executive-orders) から任意の大統領令のPDFファイルをダウンロードします。

見た目はこんな感じです。全部で3ページほどありました。

![executive_order](/images/20181130/executive_order.png)

## PDFファイルを読み込む

ファイル読み込みを早速やってみましょう。 
以下のサンプルコードでは、PDFファイル内のページ数を標準出力に表示します。

{{< highlight python "linenos=inline" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

まずは、インストールした `PyPDF2` モジュールをインポートします。
その後、PDFファイルを **バイナリの読み込みモード** で開きます。
開いたファイルオブジェクトから、PDFを取り扱うための `PdfFileReader` オブジェクトを作成します。

問題なく、以下のように表示されました。

{{< highlight bash >}}
Number of pages: 3
{{< / highlight >}}

## パスワード付きPDFファイル（暗号化PDFファイル）を読み込む

次にパスワード付きのPDFファイルを読み込みます。
PDF保存時の **暗号化オプション** にて、任意のパスワードを設定したファイルのことを指します。

### 失敗パターン

先程の大統領令のPDFファイルにパスワード（`hoge1234`）を付けて保存したものを `executive_order_encrypted.pdf` とし、
パスワード **なし** の時に読み込んだコードで実行してみます。

{{< highlight python "linenos=inline" >}}
# PDFの読み込みに失敗するコード
import PyPDF2

FILE_PATH = './files/executive_order_encrypted.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

復号化が必要性が以下のようなエラーメッセージから判断できます。

{{< highlight bash >}}
PdfReadError: File has not been decrypted
{{< / highlight >}}

### 暗号化PDFファイルを復号化する

ここで言う「復号化」は **パスワードを解除すること** を意味しています。
`decrypt` 関数で復号化を行います。引数にはパスワード文字列を渡します。

なお、 `decrypt` 関数を呼び出す前に `isEncrypted` を呼び出し、
ファイルが暗号化されているか否かをチェックした方が親切でしょう。

{{< highlight python "linenos=inline,hl_lines=7-9" >}}
import PyPDF2

ENCRYPTED_FILE_PATH = './files/executive_order_encrypted.pdf'

with open(ENCRYPTED_FILE_PATH, mode='rb') as f:        
    reader = PyPDF2.PdfFileReader(f)
    if reader.isEncrypted:
        reader.decrypt('hoge1234')
        print(f"Number of page: {reader.getNumPages()}")
{{< / highlight >}}

{{< highlight bash >}}
Number of pages: 3
{{< / highlight >}}

## `decrypt` 時に `NotImplementedError` が表示される場合の対処法

暗号化PDFを扱う際、以下のエラーに遭遇するかもしれません。

{{< highlight bash >}}
NotImplementedError: only algorithm code 1 and 2 are supported
{{< / highlight >}}

これは、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) が復号化するためのロジックを実装していないことが原因で発生するエラーです。こうなっては [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) 単体で解決するのは難しくなります。

### Pythonコードから qpdf をキックして復号化する

いくつか調べてわかったのですが、てっとり早いのは [qpdf](https://github.com/qpdf/qpdf) を組み合わせて使う方法でした。
[qpdf](https://github.com/qpdf/qpdf) はPDFの操作をCLI上から行うためのツールです。

Windows版であれば [SourceForge](https://sourceforge.net/projects/qpdf/) からインストーラを使い、Macであれば `brew install qpdf` で使えるようになります。

話を戻すと、`NotImplementedError` の原因は、復号化の処理が [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) に実装されていないことだったので、復号化の処理のみを [qpdf](https://github.com/qpdf/qpdf) で行えばよいのです。

{{< highlight python "linenos=inline,hl_lines=14-19"  >}}
import PyPDF2
import os

ENCRYPTED_FILE_PATH = './files/executive_order_encrypted.pdf'
FILE_OUT_PATH = './files/executive_order_out.pdf'

PASSWORD='hoge1234'

with open(ENCRYPTED_FILE_PATH, mode='rb') as f:        
    reader = PyPDF2.PdfFileReader(f)
    if reader.isEncrypted:
        try:
            reader.decrypt(PASSWORD)
        except NotImplementedError:
            command=f"qpdf --password='{PASSWORD}' --decrypt {ENCRYPTED_FILE_PATH} {FILE_OUT_PATH};"
            os.system(command)            
            with open(FILE_OUT_PATH, mode='rb') as fp:
                reader = PyPDF2.PdfFileReader(fp)
                print(f"Number of page: {reader.getNumPages()}")
{{< / highlight >}}

Pythonコードから `qpdf` コマンドをOSのコマンドとして実行し、
**複合化したPDFファイルをパスワードなしの別ファイルとして保存** します。
その後、もう一度 `PdfFileReader` にてファイルを読み込ませる、という算段です。

なお、このサンプルコードですと、 `with` 句によってファイルが自動クローズされてしまうため、実際にはもう少しコードのスコープを整理してあげる方が汎用性の面で良いと思います。

## まとめ

今回は [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使ってPDFファイルを開く方法をまとめました。

* ファイル読み込みには `PdfFileReader` を使う
* 暗号化PDFには `decrypt` 関数で復号化する
* 復号化時に `NotImplementedError` が出る場合には、復号化の処理は [qpdf](https://github.com/qpdf/qpdf) で行う

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=c147d28e189fdaae2d03d9fa71dd1ea2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=fffb54546b0abb4066b8c70034e45cee&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=479738946X&linkId=a0f1182a7478439bc70e51d189ec3179&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
