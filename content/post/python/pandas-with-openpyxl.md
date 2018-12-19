---
title: "ExcelをPython（openpyxl）で操作する - PandasのDataFrameに変換"
description: "今回はExcelのデータをPandasのデータ形式に変換する方法を紹介します。"
date: "2018-10-13T06:52:26+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "excel"
  - "openpyxl"
  - "pandas"  
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

以前、[openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使ってExcelファイルの操作に関する記事をいくつか書きました。

* [ExcelをPython（openpyxl）で操作する - ファイルの新規作成、保存、開く](/post/python/create-excel-with-openpyxl/)
* [ExcelをPython（openpyxl）で操作する - シートの作成、シート属性値変更](http://www.soudegesu.com/post/python/sheet-excel-with-openpyxl/)
* [ExcelをPython（openpyxl）で操作する - セルの読み書き](/post/python/cell-excel-with-openpyxl/)

今回はExcelのデータを [Pandas](https://pandas.pydata.org/) のデータ形式に変換する方法を紹介します。

なぜ [Pandas](https://pandas.pydata.org/) かというと、 [Pandas](https://pandas.pydata.org/) によって、様々な **データ分析のための処理を簡単に行える** からです。

## 事前準備

### モジュールのインストール

まずは必要なモジュールをインストールします。

{{< highlight bsah "linenos=inline" >}}
pip install openpyxl pandas
{{< / highlight >}}

### サンプルデータの準備

次にサンプルデータを準備します。今回は以下のようなデータを持った `sample.xlsx` を作成します。

1行目にヘッダ行が **ない** 以下のような `no_header `シートと

![no_header_sample_sheet](/images/20181013/no_header_sample_sheet.png)

1行目にヘッダ行が **ある** 、 `sample` シートを準備します。

![sample_sheet](/images/20181013/sample_sheet.png)

<!--adsense-->

## openpyxl から PandasのDataFrameへ変換

では早速、[openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) でシートのデータを読み取り、 `DataFrame` に変換しましょう。

`DataFrame` は、[Pandas](https://pandas.pydata.org/) 上で2次元のデータを表す場合に使います。
Excelのデータは行と列の2次元データなので、[openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) の `Worksheet` オブジェクトを `DataFrame` オブジェクトに変換するイメージです。

### ヘッダー行なしデータの場合

ヘッダー行のないシートの場合には、 `DataFrame` に `ws.values` を渡すだけでできます。

{{< highlight python "linenos=inline" >}}
from openpyxl import load_workbook
import pandas as pd

# ワークブックを読み込む
wb = load_workbook('sample.xlsx')
# no_headerシートにアクセスする
ws = wb['no_header']

# value値をDataFrameに変換
df = pd.DataFrame(ws.values)
{{< / highlight >}}

変換できているか確認してみましょう。

{{< highlight python "linenos=inline" >}}
# DataFrame内の最初の3行のみ表示
df.head(3)
{{< / highlight >}}

|  |0	 |1	   |2  |
|----|----|----|----|
| 0|	1|	小林|	男|
| 1|	2|	田中|	女|
| 2|	3|	鈴木|	男|

ヘッダー行がないので、列番号がヘッダーとして表示されます。

### ヘッダー行ありデータの場合

ヘッダー行ありのデータの場合には少し、処理を追加する必要があります。
`DataFrame` 作成時に `columns` オプションを指定することで、カラム名を与える事ができます。

このとき、 `columns` オプションに与える配列の長さ（=列の数）と、`DataFrame` 生成時の実体データの配列の長さ（=列の数）は
等しい必要があります。

{{< highlight python "linenos=inline" >}}
from openpyxl import load_workbook
import pandas as pd

wb = load_workbook('sample.xlsx')
ws = wb['sample']

data = ws.values
# 最初の行をヘッダーとして取得する
columns = next(data)[0:]
# 以降のデータからDataFrameを作成する
df = pd.DataFrame(data, columns=columns)
{{< / highlight >}}

同様に結果を見てみましょう。

{{< highlight python "linenos=inline" >}}
# DataFrame内の最初の3行のみ表示
df.head(3)
{{< / highlight >}}

|  |ID	 |名前	   |性別  |
|----|----|----|----|
| 0|	1|	小林|	男|
| 1|	2|	田中|	女|
| 2|	3|	鈴木|	男|

きちんとヘッダー名も表示されました。

<!--adsense-->

## PandasでExcelファイルを読み込む

先程は [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) で読み込んだデータを `DataFrame` に変換しました。

実はこの操作は [Pandas](https://pandas.pydata.org/) の `read_excel` 関数を使うことで同様の処理ができます。

内部的には [xlrd](https://github.com/python-excel/xlrd) や [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) に依存しているので、モジュールのインストールが必要です。

{{< highlight bash "linenos=inline" >}}
pip install openpyxl pandas xlrd
{{< / highlight >}}

以下のように `read_excel` 関数を呼び出すだけで完了です。

{{< highlight python "linenos=inline" >}}
import pandas as pd

df = pd.read_excel('sample.xlsx', sheet_name='sample')
df.head()
{{< / highlight >}}

<!--adsense-->

## まとめ 

Excelのデータを [Pandas](https://pandas.pydata.org/) の `DataFrame` として扱う方法を紹介しました。
[openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) の `Worksheet` オブジェクトから `DataFrame` へ変換する方法もあれば、[Pandas](https://pandas.pydata.org/) の `read_excel` 関数を用いる方法もあります。 

特にこだわりがないのであれば、 `read_excel` 関数を使った方がシンプルだと思います。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=9f638725021ad496a17c5219a6672cd2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117984&linkId=1f44de3fdd307ab42e2ff48aefcde747&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=dead5d9ca736c61a64b07ba1b39b3222&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>

