---
title: "PDFをPython（PyPDF2）で操作する - 複数ページをマージして透かしを入れる"
description: "PyPDF2を使って複数ページをマージする方法を紹介します。今回は透かし入りのPDFを作成するサンプルです。"
date: "2018-12-05T10:23:41+09:00"
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

以前に書いた以下の記事では、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を用いて、PDFファイルからテキスト情報を抽出するまでを行うことができました。

* [PDFをPython（PyPDF2）で操作する - PDF・暗号化PDFファイルの読み込み](/post/python/open-pdf-with-pypdf2/)
* [PDFをPython（PyPDF2）で操作する - PDFからテキストを抽出する](/post/python/extract-text-from-pdf-with-pypdf2/)

今回は [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) のページをマージする機能を使って、ファイルの中に「すかし」を入れる方法を実現したいと思います。

## 事前準備

前回同様、 [アメリカ大統領からの大統領令のページ](https://www.federalregister.gov/presidential-documents/executive-orders) からダウンロードしたファイルを使います。

見た目はこんな感じです。全部で3ページほどあります。こちらを `executive_order.pdf` とします。

![executive_order](/images/20181205/executive_order.png)

加えて、今回、「社外秘的なSomething」と印字された別のPDFファイルを準備します。
こちらが「透かし」になるPDFファイルです。こちらを `confidential.pdf` とします。

![confidential](/images/20181205/confidential_pdf.png)

## PDFファイルのマージ

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) で2つのファイルをマージしましょう。
サンプルコードは以下のようになりました。

{{< highlight python "linenos=inline" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'
CONFIDENTIAL_FILE_PATH = './files/confidential.pdf'
OUTPUT_FILE_PATH = './files/executive_order_merged.pdf'

with open(FILE_PATH, mode='rb') as f, open(CONFIDENTIAL_FILE_PATH, mode='rb') as cf, open(OUTPUT_FILE_PATH, mode='wb') as of:
    # マージするConfidential
    conf_reader = PyPDF2.PdfFileReader(cf)
    conf_page = conf_reader.getPage(0)    
    # マージ対象のファイル
    reader = PyPDF2.PdfFileReader(f)    
    writer = PyPDF2.PdfFileWriter()    
    for page_num in range(0, reader.numPages):
        obj = reader.getPage(page_num)
        obj.mergePage(conf_page)
        
        writer.addPage(obj)
    
    # ファイルへの書き込み
    writer.write(of)
{{< / highlight >}}

順を追って、簡単に説明します。
まず、`confidential.pdf` ファイルから `getPage(0)` で「社外秘的なSomething」が印字されている最初のページを取得します。
次に、`executive_order.pdf` ファイルのすべてのページオブジェクトで `mergePage` 関数を呼び出し、
先程取得した「社外秘的なSomething」ページを結合してわけです。

最後に `PdfFileWriter` を使って、 `executive_order_merged.pdf` という別名のファイルで書き込みを行います。

## 結果を確認する

マージされたPDFはどうなったのでしょうか。結果は以下のようになりました。

![executive_order_merged](/images/20181205/executive_order_merged_pdf.png)

きちんと透かしが入っていますね。きちんと３ページ全てに透かしが入っていました。
（キャプチャを取得するのがめんどくさかったので、１枚しかキャプチャは取得していません。）

## まとめ

今回は [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使ってPDFのページをマージする方法を紹介しました。
ページオブジェクトの　`mergePage` 関数を呼び出すだけなので、非常にお手軽に実現できます。

私も最初は「マージなんて何に使うんだろう？」と思っていましたが、共通のフッターを入れたり、
署名を入れたりと、案外使う場面はありそうですね。


<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=c147d28e189fdaae2d03d9fa71dd1ea2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=fffb54546b0abb4066b8c70034e45cee&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=479738946X&linkId=a0f1182a7478439bc70e51d189ec3179&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>



