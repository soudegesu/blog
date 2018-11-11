---
title: "ExcelをPython（openpyxl）で操作する - セルの読み書き"
description: "openpyxlを使ってExcelシート内のセルの読み書きをしましょう。"
date: "2018-09-02T09:38:14+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "excel"
  - "openpyxl"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

前回の [ExcelをPython（openpyxl）で操作する - シートの作成、シート属性値変更](/post/python/sheet-excel-with-openpyxl/) では [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使って **Excelシートの作成** と **Excelシートの属性値変更** を行いました。

今回は、シート内の **セルの値の読み書き** をしましょう。

## セルに値を入力する

`Worksheet` オブジェクトに対して **列+行** のプロパティでセルにアクセスすることができます。

例えば、以下のようなコードの場合、2つのセルへ入力を行います。

{{< highlight python "linenos=inline" >}}
from openpyxl import Workbook
from openpyxl.compat import range
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active

# `B` 列の `2` 行目に `hogehogehoge` を入力
ws['B2'] = 'hogehogehoge'
# `F` 列の `5` 行目に `fugafugaufga` を入力
ws['F5'] = 'fugafugaufga'

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

![fill_cell](/images/20180902/fill_cell.png)

または、 `cell` 関数を使っても入力できます。

`cell` 関数の場合は列はアルファベットではなく、数字で入力する必要があります。

{{< highlight python "linenos=inline" >}}
ws.cell(row=2, column=2, value='hogehogehoge')
ws.cell(row=5, column=6, value='fugafugaufga')
{{< / highlight >}}

## セルの値を読み込む

セルの値を読み込むには、入力時と同様に **列+行** のプロパティでセルにアクセスした後に `value` プロパティで取得できます。

例えば、以下のように書くと、変数 `b2` に文字列 `hogehogehoge` が格納されます。

{{< highlight python "linenos=inline" >}}
b2 = ws['B2'].value
{{< / highlight >}}

入力のときと同様に、読み込みについても `cell` 関数で代用できます。

{{< highlight python "linenos=inline" >}}
b2 = ws.cell(column=2, row=2).value
{{< / highlight >}}

## 行を処理する

`iter_rows` 関数で行単位でデータを取得できます。

`iter_rows` 関数では `min_row` `max_row` `min_col` `max_col` を引数に与えることができ、
**ループ処理の対象とするシート内の行や列の範囲** を設定することができます。

実際にファイルを取り扱う場面では、1行目のA列目からデータがびっしり入っていることはあまりないので、読み込み範囲指定は重宝します。

なお、`max_row` `max_col` を入力しない場合には、データの入っている最大の位置までが操作対象になります。

試しに、先程の `sample_book.xlsx` に対して、各行のすべてのセルの値を表示してみます。

{{< highlight python "linenos=inline" >}}
# 2行目を開始行として、1行単位で処理をする
for row in ws.iter_rows(min_row=2):
    # 行からセルを1個ずつ取得し、処理をする
    for cell in row:
        print(f"{cell.col_idx}列目：{cell.value}")
    print('------------------------------------------')
{{< / highlight >}}

結果は以下のようになります。

{{< highlight python "linenos=inline" >}}
1列目：None
2列目：hogehogehoge
3列目：None
4列目：None
5列目：None
6列目：None
------------------------------------------
1列目：None
2列目：None
3列目：None
4列目：None
5列目：None
6列目：None
------------------------------------------
1列目：None
2列目：None
3列目：None
4列目：None
5列目：None
6列目：None
------------------------------------------
1列目：None
2列目：None
3列目：None
4列目：None
5列目：None
6列目：fugafugaufga
------------------------------------------
{{< / highlight >}}

## 列を処理する

`iter_cols` 関数で列単位でデータを取得できます。

操作感としては `iter_rows` 関数と同様ですが、ループ対象が列になります。

{{< highlight python "linenos=inline" >}}
# 2列目を開始行として、1列単位で処理をする
for col in ws.iter_cols(min_row=2):
    # 列からセルを1個ずつ取得し、処理をする
    for cell in col:
        print(f"{cell.row}行目：{cell.value}")
    print('------------------------------------------')
{{< / highlight >}}

結果は以下のようになります。

{{< highlight python "linenos=inline" >}}
2行目：None
3行目：None
4行目：None
5行目：None
------------------------------------------
2行目：hogehogehoge
3行目：None
4行目：None
5行目：None
------------------------------------------
2行目：None
3行目：None
4行目：None
5行目：None
------------------------------------------
2行目：None
3行目：None
4行目：None
5行目：None
------------------------------------------
2行目：None
3行目：None
4行目：None
5行目：None
------------------------------------------
2行目：None
3行目：None
4行目：None
5行目：fugafugaufga
------------------------------------------
{{< / highlight >}}

## 行単位でデータを入力する

`append` 関数により、行単位でデータを入力することができます。

関数への引数にはリスト型のデータを渡してことで、左詰めでデータが入っていきます。

{{< highlight python "linenos=inline" >}}
wb = Workbook()
ws = wb.active

data = [
        ['A', 100, 1.0],
        ['B', 200, 2.0],
        ['C', 300, 3.0],    
        ['D', 400, 4.0],        
]

for row in data:
    # 1行ずつデータが挿入される
    ws.append(row)

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

![bulk_insert](/images/20180902/bulk_insert.png)

## まとめ

今回は [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使って以下を行いました。

* セルの入力
* セルの読み込み
* 行/列ごとの処理
* 行単位での入力

少しづつExcelをプログラムで操作する旨味が感じられてきたのではないでしょうか！

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=dead5d9ca736c61a64b07ba1b39b3222&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div><br>
