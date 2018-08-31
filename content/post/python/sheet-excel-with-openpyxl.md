---
title: "ExcelをPython（openpyxl）で操作する - シートの作成と設定変更編"
description: ""
date: "2018-08-31T08:53:18+09:00"
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

前回の [ExcelをPython（openpyxl）で操作する - ファイルの作成と保存編](/post/python/create-excel-with-openpyxl/) では [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使ってExcelファイルの作成を行いました。

今回はExcelのシートの操作について説明します。

## 実行環境

実行環境とのそのバージョンは前回同様以下になります。

* python 3.6
* openpyxl 2.5.6

## シートの操作をやってみる

1つのワークブックの中に複数シートを持たせると状況にはよく遭遇します。
ここではシートの操作についてまとめます。

### シートを新規追加する

新規でシートを追加するには `create_sheet` 関数を使います。
（ここではワークブックは新規に作成しています）

```python
from openpyxl.workbook import Workbook

wb = Workbook()

# 最後尾にシートを追加
ws1 = wb.create_sheet("シート1")
# 先頭にシートを追加
ws2 = wb.create_sheet("シート2", 0)

ws1.title = "シート1のタイトル"
ws2.title = "シート２のタイトル"

# ワークブック内のシート名をすべて表示
print(wb.sheetnames)

wb.save(filename = 'sample_book.xlsx')
```

第2引数に数字を与えることで、 **シートを挿入する位置** を調整できます。
数字を与えない場合には、最後尾に追加されます。

例えば、`シート2` は `0` 番目の位置、つまり、先頭のシートとして挿入されることを期待しています。

![insert_sheet](/images/20180831/insert_sheet.png)

## 既に存在するシートにアクセスする

新規作成に限らず、既に存在するシートにアクセスする場合を考えます。

エクセルシートは `Worksheet` オブジェクトとして扱われ、`Workbook` オブジェクトから **シート名を指定する** ことでアクセスができます。

例えば、以下のようなコードを実行すると **シート１** のタイトルが取得できることがわかります。

```python
ws1 = wb["シート1のタイトル"]
print(ws1.title)
```
