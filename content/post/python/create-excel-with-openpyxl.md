---
title: "ExcelをPython（openpyxl）で操作する - ファイルの新規作成、保存、開く"
description: "今回はExcelファイルをPythonで操作する方法を紹介したいと思います。"
date: "2018-08-30T18:34:52+09:00"
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

今回はExcelファイルをPythonで操作する方法を紹介したいと思います。

## 実行環境

実行環境とのそのバージョンは以下になります。

* python 3.6
* openpyxl 2.5.6

## openpyxlのインストール

今回は [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使用したいと思います。

[openpyxlの公式サイト](https://openpyxl.readthedocs.io/en/stable/index.html) では 「Excel 2010 の操作ができるよ！」
と書いてありますが、私のMacにインストールされている Mac Excel 2016 でもとりあえず動作しました。

さっそくインストールしましょう。

```bash
pip install openpyxl
```

## 新規Excelファイルの作成

千里の道も一歩から。まずは新規でファイルを作成しましょう。

### モジュールのインポート

まずは [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) が使えるようにモジュールをインポートします。

```python
from openpyxl import Workbook
```

### ワークブックの作成

`Workbook` が **エクセルファイルの実態** を指すオブジェクトになるようですね。 変数 `wb` に格納します。

```python
# ワークブックの作成
wb = Workbook()
```

### シート名の変更

とりあえず、シート名の変更でもやってみましょう。
エクセルは新規でファイル作成をすると、最初からシートがついてきます。
最初のシートの名前を **「シートの名前」** に変更してみましょう。

```python
# アクティブなシートを選択して、シート名を変更
ws =  wb.active
ws.title = "シートの名前"
```

### ファイルの保存

最後にファイルを保存します。 ファイル名は　`sample_book.xlsx` とかにします。

```python
# sample_bookという名前でファイルを保存
wb.save(filename = 'sample_book.xlsx')
```

### できあがりを確認する

ファイルが正しく保存されているか確認しましょう。

実行したプログラムと同じフォルダに存在するはずです。

![download_file](/images/20180830/download_file.png)

いましたね。

次にファイルを開いてみましょう。

![rename_sheet](/images/20180830/rename_sheet.png)

ただしくシート名がリネームされていますね！

## 既に存在するファイルを開くときは？

[Python](https://www.python.org/) でExcelを操作するモチベーションは **「既に存在するExcelファイルの操作をプログラムから行いたい（自動化したい）」** ケースが多いので、ここでは既存のエクセルファイルの開き方に触れておきます。

`load_workbook` 関数にファイルのパスを指定することで `Workbook` オブジェクトを簡単に取得できます。

```python
from openpyxl import load_workbook
wb = load_workbook('sample_book.xlsx')
print(wb.sheetnames)
# ['シートの名前'] が出力されます
```

## まとめ

今回は [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使って以下を行いました。

* Excelファイルの作成
* Excelファイルの保存
* Excelファイルのデフォルトのシート名変更
* Excelファイルを開く

本来やりたいことはここから先だと思いますので、少しづつまとめていきたいと思います。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=9f638725021ad496a17c5219a6672cd2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117984&linkId=1f44de3fdd307ab42e2ff48aefcde747&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=dead5d9ca736c61a64b07ba1b39b3222&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>

