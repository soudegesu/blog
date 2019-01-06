---
title: "Use PyPDF2 - extract text data from PDF file"
description: ""
date: "2018-12-02T17:29:29+09:00"
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

## Introduction

In previous article titled '[Use PyPDF2 - open PDF file or encrypted PDF file](/en/post/python/open-pdf-with-pypdf2/)', I introduced how to read PDF file with `PdfFileReader`. Extract text data from opened PDF file this time.

<!--adsense-->

## Preparation

前回同様、 [アメリカ大統領からの大統領令のページ](https://www.federalregister.gov/presidential-documents/executive-orders) からダウンロードしたファイルを使います。

見た目はこんな感じです。全部で3ページほどあります。

![executive_order](/images/20181202/executive_order.png)

## ページへのアクセス

まずは、読み込んだPDFファイルから操作対象のページを定める必要があります。
ここでは、「任意のページにアクセスする方法」と「すべてのページにアクセスする方法」の2種類を紹介します。

### 任意のページにアクセスする

読み込んだPDFファイルの任意のページにアクセスする方法です。
サンプルコードは以下のようになります。

{{< highlight python "linenos=inline,hl_lines=7" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    page = reader.getPage(0) #最初のページにアクセスする
{{< / highlight >}}

`PdfFileReader` で読み込んだ後、 `getPage` 関数でアクセスするページを指定します。
引数の数字は `0` 始まりになり、今回は全3ページのPDFなので、`0` `1` `2` が指定可能です。

### PDFすべてのページにアクセスする

次にPDFファイルすべてのページにアクセスする方法です。
サンプルコードは以下になります。

{{< highlight python "linenos=inline,hl_lines=7-8" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    for page in reader.pages:
        pass
{{< / highlight >}}

`PdfFileReader` クラスには `pages` というプロパティがあり、それは `PageObject` クラスのリストです。
`pages` プロパティをループすることで、最初のページから順に処理ができます。
（上のサンプルではとりあえず `pass` にしていますが、ここに何らかの処理が入ります。）

<!--adsense-->

## ページからテキストを抽出する

操作対象のページが決まれば、次にテキストを抽出しましょう。

{{< highlight python "linenos=inline,hl_lines=8" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    page = reader.getPage(0)
    print(page.extractText())
{{< / highlight >}}

`extractText` 関数で、ページ内のテキストを文字列型として取得します。

```
Presidential Documents
55243 Federal Register
Vol. 83, No. 213
Friday, November 2, 2018
Title 3Ñ
The President
Executive Order 13850 of November 1, 2018
Blocking Property of Additional Persons Contributing to the
Situation in Venezuela
By the authority vested in me as President by the Constitution and the
laws of the United States of America, including the International Emergency
Economic Powers Act (50 U.S.C. 1701
et seq.
) (IEEPA), the National Emer-
gencies Act (50 U.S.C. 1601
et seq.
), section 212(f) of the Immigration and
Nationality Act of 1952 (8 U.S.C. 1182(f)) (INA), the Venezuela Defense
of Human Rights and Civil Society Act of 2014 (Public Law 113Ð278),
as amended (the Venezuelan Defense of Human Rights Act), and section
301 of title 3, United States Code,
I, DONALD J. TRUMP, President of the United States of America, in order
to take additional steps with respect to the national emergency declared
in Executive Order 13692 of March 8, 2015, and relied upon for additional
steps taken in Executive Order 13808 of August 24, 2017, Executive Order
13827 of March 19, 2018, and Executive Order 13835 of May 21, 2018,
particularly in light of actions by the Maduro regime and associated persons
to plunder VenezuelaÕs wealth for their own corrupt purposes, degrade Ven-
ezuelaÕs infrastructure and natural environment through economic mis-
management and confiscatory mining and industrial practices, and catalyze
a regional migration crisis by neglecting the basic needs of the Venezuelan
people, hereby order as follows:
Section 1
. (a) All property and interests in property that are in the United
States, that hereafter come within the United States, or that are or hereafter
come within the possession or control of any United States person of the
following persons are blocked and may not be transferred, paid, exported,
withdrawn, or otherwise dealt in: any person determined by the Secretary
of the Treasury, in consultation with the Secretary of State:
(i) to operate in the gold sector of the Venezuelan economy or in any
other sector of the Venezuelan economy as may be determined by the
Secretary of the Treasury, in consultation with the Secretary of State;
(ii) to be responsible for or complicit in, or to have directly or indirectly
engaged in, any transaction or series of transactions involving deceptive
practices or corruption and the Government of Venezuela or projects or
programs administered by the Government of Venezuela, or to be an
immediate adult family member of such a person;
(iii) to have materially assisted, sponsored, or provided financial, material,
or technological support for, or goods or services to or in support of,
any activity or transaction described in subsection (a)(ii) of this section,
or any person whose property and interests in property are blocked pursu-
ant to this order; or
(iv) to be owned or controlled by, or to have acted or purported to
act for or on behalf of, directly or indirectly, any person whose property
and interests in property are blocked pursuant to this order.
(b) The prohibitions in subsection (a) of this section apply except to
the extent provided by statutes, or in regulations, orders, directives, or
licenses that may be issued pursuant to this order, and notwithstanding
any contract entered into or any license or permit granted prior to the
date of this order.
VerDate Sep<11>2014 18:13 Nov 01, 2018Jkt 247001PO 00000Frm 00003Fmt 4705Sfmt 4790E:\FR\FM\02NOE0.SGM02NOE0
```

文字列が抽出できました。`Title 3Ñ` や `ezuelaÕs` など一部の記号が文字化けしているようです。
また、ページ内の文章全体を１つの文字列として抽出するため、抽出した文字列を自然言語処理で更に加工するなど工夫が必要そうですね。


## まとめ

今回は [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使って読み込んだPDFファイルのページからテキストを抽出しました。 `extractText` 関数を呼び出すだけなので、処理自体の難しさはありませんが、処理したテキストを更に加工するなどの工夫が必要でしょう。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=c147d28e189fdaae2d03d9fa71dd1ea2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=fffb54546b0abb4066b8c70034e45cee&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=479738946X&linkId=a0f1182a7478439bc70e51d189ec3179&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
