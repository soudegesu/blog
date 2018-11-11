---
title: "ExcelをPython（openpyxl）で操作する - シートの作成、シート属性値変更"
description: "前回のExcelをPython（openpyxl）で操作する - ファイルの作成と保存ではopenpyxlを使って、Excelファイルの作成を行いました。今回はシートの操作を行ってみましょう。"
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

前回の [ExcelをPython（openpyxl）で操作する - ファイルの作成と保存](/post/python/create-excel-with-openpyxl/) では [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使って **Excelファイルの作成** を行いました。

今回は、Excelファイルの **シートの操作** を行ってみましょう。

## 実行環境

実行環境とのそのバージョンは前回同様以下になります。

* python 3.6
* openpyxl 2.5.6

## シートの新規追加

新規でシートを追加するには `create_sheet` 関数を使います。

{{< highlight python "linenos=inline" >}}
from openpyxl.workbook import Workbook

wb = Workbook()

# 最後尾にシートを追加
ws1 = wb.create_sheet("シート1")
ws1.title = "シート1のタイトル"

# 先頭にシートを追加
ws2 = wb.create_sheet("シート2", 0)
ws2.title = "シート２のタイトル"

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

`create_sheet` 関数は第2引数に数字を与えることで、 **シートを挿入する位置** を調整できます。
第2引数を与えない場合には、最後尾に追加されます。

例えば、`シート2` は `0` 番目の位置、つまり、先頭のシートとして挿入されることを期待しています。

![insert_sheet](/images/20180831/insert_sheet.png)

## すべてのシート名を取得する

Excelファイル内に存在するすべてのシート名を確認するには `Workbook` オブジェクトの `sheetnames` プロパティを参照します。

{{< highlight python "linenos=inline" >}}
wb.sheetnames
# 結果はリストで取得できる
# ['シート２のタイトル', 'Sheet', 'シート1のタイトル']
{{< / highlight >}}

また、 `Workbook` オブジェクトに対して `for` ループを使うことで、 各シートを `Worksheet` オブジェクトとして取得することもできます。 

{{< highlight python "linenos=inline" >}}
for ws in wb:
    print(ws.title)
{{< / highlight >}}

## シートの選択

`Workbook` オブジェクトから **シート名を指定する** ことで、操作したい対象のシートを取得できます。

{{< highlight python "linenos=inline" >}}
# wbはWorkbookオブジェクトを表す
ws1 = wb["シート1のタイトル"]
{{< / highlight >}}

## シートの属性値の変更

### タブの色を変更

シートのタブの色を変更したい場合には、 シートの属性情報（ `sheet_properties` ）にアクセスして
`tabColor` プロパティにカラーコードを入力します。

{{< highlight python "linenos=inline" >}}
ws1.sheet_properties.tabColor = "1072BA"
{{< / highlight >}}

![tab_color](/images/20180831/tab_color.png)

### フィルタモードの設定

指定したシートに対して、自動でフィルタモードを適用します。
フィルタが適用可能なシートの構造になっている必要があります。

{{< highlight python "linenos=inline" >}}
ws1.sheet_properties.filterMode = True
{{< / highlight >}}

### その他の属性値

`sheet_properties` 内には他にも様々なシートの属性値が存在します。

用途がニッチなので、紹介だけにとどめます。

|属性値|型|用途|
|-----|-----|-----|
|codeName|str|CodeNameを指定します|
|enableFormatConditionsCalculation|bool|条件付き書式が自動的に適用されるかどうかを決定する値を取得または設定します|
|published|bool|ドキュメント内のアイテムまたはアイテムのコレクションを Web ページ形式で保存します|
|syncHorizontal|bool|水平方向のスクロール時に、作業中のシートを同期します|
|syncVertical|bool|垂直方向のスクロール時に、作業中のシートを同期します|

## まとめ

今回は [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) を使って以下を行いました。

* シートの作成
* シートの選択
* シートの属性値の設定

シートは他にも保護ができたり、コピーができたり多くの操作があるので、こちらも別途まとめようと思います。

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=dead5d9ca736c61a64b07ba1b39b3222&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div><br>
