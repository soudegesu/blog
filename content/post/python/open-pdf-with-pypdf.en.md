---
title: "Use PyPDF2 - open PDF file or encrypted PDF file"
description: ""
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

## Motivation

Since I want to work PDF file with Python on my work, I investigate what library can do that and how to use it.

<!--adsense-->

## Preparation

The runtime and module version are as below.

* python 3.6
* PyPDF2 1.26.0

### Install PyPDF2

To work PDF file with Python, [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) is often used.

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) can

* Extract text from PDF file
* Work existing PDF file and create new one

Let's install with `pip` command.

{{< highlight bash "linenos=inline" >}}
pip install PyPDF2
{{< / highlight >}}

### Prepare PDF file

Prepare a new PDF file for working. Download [Executive Order](https://www.federalregister.gov/presidential-documents/executive-orders) in this time.
It looks like below. There are three pages in all.

![executive_order](/images/20181130/executive_order.png)

<!--adsense-->

## Read PDF file

In this section, Open and read a normal PDF file.
Print number of pages in the PDF file in the following sample code.

{{< highlight python "linenos=inline" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

Open the PDF file as binary read mode after importing installed `PyPDF2`.
And then, Create a `PdfFileReader` object to work PDF.

Check the result.

{{< highlight bash >}}
Number of pages: 3
{{< / highlight >}}

<!--adsense-->

## Read PDF file with password(Encrypted PDF)

In this section, Open and read an **encrypted PDF file** that has a password when opening a file. To create an encrypted PDF file, set a password with enabling encryption option when saving a PDF file.

### Failed example

Save a PDF file named `executive_order_encrypted.pdf` with a password `hoge1234`. 
Open the PDF file and execute with a previous program that read the **PDF without password**.

{{< highlight python "linenos=inline" >}}
# Failed example
import PyPDF2

FILE_PATH = './files/executive_order_encrypted.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

The following error message will be printed.

{{< highlight bash >}}
PdfReadError: File has not been decrypted
{{< / highlight >}}

### Decrypt an encrypted PDF file

The `decrypt` function given a password string to an argument decrypts an encrypted PDF file.
It is a better way to check if the file is encrypted with `isEncrypted` function before calling `decrypt` function.

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

<!--adsense-->

## Troubleshooting: `NotImplementedError` is displayed in calling `decrypt` function

The following error message may be displayed when working an encrypted PDF file.

{{< highlight bash >}}
NotImplementedError: only algorithm code 1 and 2 are supported
{{< / highlight >}}

The error message means that [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) doesn't have an implementation to decrypt an algorithm that encrypts the PDF file. 
If this happens, it's difficult to solve the problem with [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) only.

### Decrypt with qpdf

Using [qpdf](https://github.com/qpdf/qpdf) is a quick solution.
[qpdf](https://github.com/qpdf/qpdf) is a tool to work PDF file on command line interface.
We can download its installer for Windows from [SourceForge](https://sourceforge.net/projects/qpdf/), or install it for Mac with `brew install qpdf` command.

Sample code that [qpdf](https://github.com/qpdf/qpdf) decrypts a PDF file is below.

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

## Conclusion

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
