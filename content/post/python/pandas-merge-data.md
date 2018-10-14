---
title: "PandasでDataFrameを追加する"
description: ""
date: "2018-10-14T16:31:14+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pandas"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

以前書いた [ExcelをPython（openpyxl）で操作する - PandasのDataFrameに変換](/post/python/pandas-with-openpyxl/) では [Pandas](https://pandas.pydata.org/) でExcelファイルの読み込みについて説明しました。

今回は読み込んだ複数のDataFrameの扱いについて説明します。

## データを横方向に追加する

DataFrameを横方向に追加する、つまり、別の列として追加する方法を説明します。

ただし、前提として、マージする側とされる側の行数が同じで、かつ、データの順序が同じである必要がありますが、
以下のような `sample` シートのデータと

![join_sample](/images/20181013/concat_sample.png)

以下のような `division` シートのデータを一つの行のデータに統合します。

![join_division](/images/20181013/concat_division.png)

`concat` 関数を用いて、オプション `axis=1` を指定すると、複数の `DataFrame` を横方向に統合できます。

```python
import pandas as pd

# sample シートを読み込む
df_sample = pd.read_excel('sample.xlsx', sheet_name='sample')
# division シートを読み込む
df_division = pd.read_excel('sample.xlsx', sheet_name='division')

# axis=1で横方向に追加
result = pd.concat([df_sample, df_division], axis=1)
result.head()
```

||ID|	名前|	性別	|部署ID	|部署名|
|---|---|-----|---|---|---|
|0	|1	|小林	|男	|1	|経理部|
|1	|2	|田中	|女	|2	|企画部|
|2	|3	|鈴木 |男	|3	|営業部|

## データを縦方向に追加する

逆に縦方向にデータを追加する場合には `axis=0` とします。

```python
import pandas as pd

# sample シートを読み込む
df_sample = pd.read_excel('sample.xlsx', sheet_name='sample')

# axis=0で行を追加
# 今回は df_sample のDataFrameを2回縦に繋げる
result = pd.concat([df_sample, df_sample], axis=0, ignore_index=True)
# headはデフォルトで5行しか出力しないため、10行出力に変更
result.head(10)
```

|	|ID|	名前|	性別|
|---|---|---|---|
|0|	1|	小林|	男|
|1|	2|田中	|女|
|2|	3|	鈴木|	男|
|3|	1|	小林|	男|
|4|	2|	田中|	女|
|5|	3|	鈴木|	男|

`ignore_index=True` オプションを指定することで、結合前の行のインデックス番号を無視し、新たにインデックス番号を振り直します。

## データを結合する

`merge` 関数を使うことで、複数の `DataFrame` に共通して存在するキーを使って、データを結合することができます。
これはSQLに馴染みのある人であればピンと来ると思いますが、SQLのJOIN句と概念的に同じです。

以下のような `sample` シートのデータと
![join_sample](/images/20181013/join_sample.png)

以下のような `division` シートのデータがあり、

![join_division](/images/20181013/join_division.png)

`部署ID` をキーとして、一つのデータに結合してみましょう。

```python
import pandas as pd

# sample シートを読み込む
df_sample = pd.read_excel('sample.xlsx', sheet_name='sample')
# division シートを読み込む
df_division = pd.read_excel('sample.xlsx', sheet_name='division')

# 部署IDをキーにJOINする
result = df_sample.merge(df_division, on='部署ID')
result.head()
```

`sample` シートのデータを軸として、`division` シートのデータを結合した行が出力されます。

||ID|	名前|	性別	|部署ID	|部署名|
|---|---|-----|---|---|---|
|0	|1	|小林	|男	|1	|経理部|
|1	|2	|田中	|女	|2	|企画部|
|2	|3	|鈴木 |男	|3	|営業部|

`merge` 関数には `how` オプションがあり、結合方法を指定できます。
デフォルトは `left` となっており、LEFT JOIN での結合になります。

なお、 似たような機能を持った `join` 関数が

```python
result = df_sample.join(df_division.set_index('部署ID'), on='部署ID')
```