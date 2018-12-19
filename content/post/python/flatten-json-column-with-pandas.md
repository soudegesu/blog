---
title: "PandasでJSON形式の列データを複数列に展開する"
description: "PandasのDataFrame内の列データがJSON文字列の形式で格納されている場合に複数列にデータを展開したい場合の対処法を紹介します。自前の変換ロジックを挟む必要がありますが、特徴量エンジニアリングを行う上で便利な手法なのでおすすめです。"
date: "2018-11-10T07:57:16+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pandas"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

過去、[Pandas](https://pandas.pydata.org/) を使った列データの処理について様々書きました。

* [PandasでNaNの列を処理する](/post/python/pandas_with_nan_columns/)
* [Pandasで列データの前処理を行う小技集](/post/python/pandas-preprocess-columns/)

今回もデータの下処理のうちの１つ、「列データが`JSON` 文字列の場合」を考えます。

<!--adsense-->

## JSON文字列が格納されている列データを複数列に展開したい

以下のように、列名が `json_col` という `DataFrame` を準備します。
なお、 `json_col` 列の中身は **`JSON` 形式の文字列** であるとします。

{{< highlight python "linenos=inline" >}}
import pandas as pd

data = {
    'json_col': ['{"name": "soudegesu", "age": "30"}', '{"name": "hogehoge", "age": "10"}']
}

df = pd.DataFrame(data)
df.head()
{{< / highlight >}}

|	   |json_col                             |
|----|-------------------------------------|
|0   |	{"name": "soudegesu", "age": "30"} |
|1   |	{"name": "hogehoge", "age": "10"}  |

今回のゴールは `json_col` 列を持った `DataFrame` を、 **キー毎に別の列へ展開した `DataFrame` に変換すること** とします。

以下になればOKです。

|	    |age|	name|
|-----|-----|-----|
|0	  |30|	soudegesu|
|1	  |10|	hogehoge|

では早速やってみましょう。

### 案１： `apply` と `json_normalize` を使う

まず、 [apply](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html) と [json_normalize](https://pandas.pydata.org/pandas-docs/version/0.22/generated/pandas.io.json.json_normalize.html) の2つの関数を使う方法を紹介します。

これは、既に読み込まれた `DataFrame` に対して適用する場合に有用です。

{{< highlight python "linenos=inline" >}}
from pandas.io.json import json_normalize
import json 

df_json = json_normalize(df['json_col'].apply(lambda x: json.loads(x)))
df_json.head()
{{< / highlight >}}

|	    |age|	name|
|-----|-----|-----|
|0	  |30|	soudegesu|
|1	  |10|	hogehoge|

ここでポイントになるのは、 `df['json_col']` で取得した `Series` オブジェクトに対して

*  [apply](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html) 関数を使って
各行のデータを辞書型に変換する
* [json_normalize](https://pandas.pydata.org/pandas-docs/version/0.22/generated/pandas.io.json.json_normalize.html) を使ってキーを展開した `DataFrame` に変換する

の2点になります。

### 案２：`converters` オプションと `json_normalize` を使う

次はデータを `csv` ファイルから読み込むことを前提として話をします。

[Pandas](https://pandas.pydata.org/) の [read_csv](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_csv.html) 関数にある `converters` というオプションを使います。
イメージとしては、案１の [apply](https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html) での変換処理を、`csv` ファイルのデータを `DataFrame` に変換するタイミングで行う感じです。

{{< highlight python "linenos=inline" >}}
from pandas.io.json import json_normalize
import json 
import pandas as pd

df = pd.read_csv(
    './hoge.csv',  #元データがhoge.csvに保存されているとします
    converters={column: json.loads for column in ['json_col']},
)

df_json = json_normalize(df['json_col'])
df_json.head()
{{< / highlight >}}

こちらの方法でも変換できました。

|	    |age|	name|
|-----|-----|-----|
|0	  |30|	soudegesu|
|1	  |10|	hogehoge|

<!--adsense-->

## ネストしているJSONはどのように展開されるのか

先程、2つの方法を紹介しましたが、 **ネストしたJSONはどのように展開してくれるのか** 気になりますよね。
試してみましょう。

{{< highlight python "linenos=inline" >}}
import pandas as pd

data = {
    'json_col': ['{"name": "soudegesu", "age": "30", "address": {"area": "東京"}}', '{"name": "hogehoge", "age": "10", "address": {"area": "北海道"}}']
}
df = pd.DataFrame(data)
df_json = json_normalize(df['json_col'].apply(lambda x: json.loads(x)))
df_json.head()
{{< / highlight >}}

|	  |address.area|	age|	    name|
|---|------------|-----|----------|
|0	|東京         |	  30|	soudegesu|
|1	|北海道       |	  10|	 hogehoge|

列名が `[キー名].[キー名]` で展開されることがわかります。

<!--adsense-->

## 配列が含まれるJSONはどのように展開されるのか

最後に **配列が含まれるJSONはどのように展開されるのか** を確認します。

{{< highlight python "linenos=inline" >}}
import pandas as pd

data = {
    'json_col': ['{"name": "soudegesu", "age": "30", "tag": ["おっちょこちょい", "よく寝る"]}', '{"name": "hogehoge", "age": "10", "tag": ["せっかち", "よく食べる"]}']
}
df = pd.DataFrame(data)
df_json = json_normalize(df['json_col'].apply(lambda x: json.loads(x)))
df_json.head()
{{< / highlight >}}

|	  |age|	name     |	tag                     |
|---|---|----------|--------------------------|
|0  |	30|	soudegesu|	[おっちょこちょい, よく寝る]|
|1  |	10|	hogehoge |	[せっかち, よく食べる]     |

なるほど。**展開はされるが、列に配列のまま出力される** というところですね。

<!--adsense-->

## まとめ

今回は `DataFrame` の列データが **JSON文字列** の場合の処理の仕方をまとめました。
ステップとしては以下の2つを踏むことで、JSON内のデータを複数の列に展開することができます。

1. 文字列を辞書型に変換する（`apply` や `converters` オプション）
2. 辞書型を複数列に展開する（`json_normalize`）

ネストしたJSONでも問題なく展開されますが、JSONに配列が含まれる場合には別途展開するロジックが必要になりそうです。

  <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311845X&linkId=b60ae7aec7f56d1de444c282e90767c0&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
  </iframe>
  <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118417&linkId=732ef37c0a2e8ce9f0b90876cd0f35c5&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
  </iframe>
  <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117984&linkId=cd99b22d583c0f7b93de3fc599cb7ec0&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
  </iframe>
  <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=58ef591acabd7808b56ee5cfc8eb2d0d&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
  </iframe>
  <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117941&linkId=dc2bb0024e74ec4b061b8365ec781a98&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
  </iframe>