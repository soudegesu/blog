---
title: "Pandasで列データの前処理を行う小技集"
description: "Pandasでデータの前処理を行う方法を紹介します。0埋めや、ワンホットエンコーディング、2進数文字列の扱いなどの小技をまとめます"
date: "2018-10-18T07:45:45+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pandas"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

[PandasでNaNの列を処理する](/post/python/pandas_with_nan_columns/) では `NaN` のデータとなってしまう列データの処理に関して説明しました。

今回は、列のデータを前処理するために使う他の小技をまとめたいと思います。

<!--adsense-->

## 列を0埋めする（zfill）

**実はIDは5桁の数字なんだよ！** といった  **固定長の数値文字列** を扱う場面の話をします。

例えば、以下のようなデータがあるとします。

{{< highlight python "linenos=inline" >}}
import pandas as pd

df = pd.read_csv('./sample.csv')
df.head()
{{< / highlight >}}

|   |ID	|名前	|年齢	|性別	|趣味|
|---|---|-----|----|----|---|
|0	|1	|小林	 |20	|男	 |野球観戦|
|1	|2	|田中	 |35	|女	 |飲み会|
|2	|3	|佐藤	 |29	|男	 |NaN|
|3	|4	|鈴木	 |44	|女	 |編み物|


元のCSVファイル中のID列が `00001`、 `00002` のように数値文字列形式でデータを格納しているのであれば、
`read_csv` 関数実行時に、列のデータ型を `dtype` オプションで指定してあげることで安全に取り出すことができます。

しかし、そもそもデータ的に欠落している場合にはどうしようもないので、自前で0埋め処理をする必要があります。

これには `zfill` 関数を使います。`zfill` を行う前に `astype` 関数などで文字列型に変換した上で実施しましょう。

{{< highlight python "linenos=inline" >}}
# 0埋めで5桁の数字文字列に変更
df['ID'].astype('str').str.zfill(5)

> 0    00001
> 1    00002
> 2    00003
> 3    00004
{{< / highlight >}}

<!--adsense-->

## カテゴリ変数をワンホットエンコーディングする（get_dummies）

次にデータがカテゴリ変数で表現されている場合です。
カテゴリ変数とは、**カテゴリを数値で表しているデータ** のことを意味します。

例えば、以下のデータでは `性別` の列をカテゴリ変数として表しています。

||ID	|名前|	年齢|	性別|	趣味|
|---|---|---|----|---|--------|
|0	|1	|小林|	20|	1|	野球観戦|
|1	|2	|田中|	35|	2|	飲み会|
|2	|3	|佐藤|	29|	1|	NaN|
|3	|4	|鈴木|	44|	2|	編み物|

人間は「`性別` の列は1が男性で2が女性かな（もしくはその逆）」と暗黙的に推測してしまいますが、機械はそうはいきません。
1と2が「カテゴリ」を表現する数字であることを知るよしがないのです。

そのため、カテゴリを表現するデータをそれぞれ別の列に分解する手法があります。
ワンホットエンコーディングと呼ばれています。

[Pandas](https://pandas.pydata.org/) では `get_dummies` 関数を使って実現します。

{{< highlight python "linenos=inline" >}}
import pandas as pd

pd.get_dummies(df['性別'], prefix='性別')
{{< / highlight >}}

|	|性別_1|	性別_2|
|---|---|---|
|0	|1	|0|
|1	|0	|1|
|2	|1	|0|
|3	|0	|1|

これで、性別の値が1かどうか、性別の値が2かどうか、の2つの列に分割することができました。

<!--adsense-->

## 2進数の文字列を複数の列に分解する（from_records）

最後に `1` と `0` の2進数の文字列でデータを表現している場合です。

少しイメージが湧きにくいですが、例えば以下のように、**1つの質問の中で、複数回答が可能なアンケートのデータを1列で表現している** 場合のデータなどがそうでしょう。

{{< highlight python "linenos=inline" >}}
import pandas as pd

df = pd.read_csv('./sample2.csv', dtype={'ID': 'int', '好きなスポーツ': 'str'})
df.head()
{{< / highlight >}}

|	  |ID	|好きなスポーツ|
|---|---|-------|
|0  |1	|10010  |
|1  |2	|00111  |
|2  |3	|10101  |
|3  |4	|11111  |

選択した回答項目とビットの位置が連動しています。
`ID=1` のユーザが `好きなスポーツ` の質問を以下のように回答したイメージです。

<input type="checkbox" value="1" checked>野球　<input type="checkbox" value="1">サッカー　<input type="checkbox" value="1">水泳　<input type="checkbox" value="1" checked>相撲　<input type="checkbox" value="1">ラグビー

ただし、`ID=1` のユーザも `ID=3` のユーザも野球が好きにも関わらず、数字的に等しくない (10010 != 10101) ありません。
このようなバイナリ形式の文字列は特徴量として扱いにくいのです。

どうするかというと、`DataFrame.from_records` 関数を使って **1つ1つのビットを別の列として分解してあげれば** 良いでしょう。

{{< highlight python "linenos=inline" >}}
import pandas as pd

# 「好きなスポーツ」列を分割します
sport = pd.DataFrame.from_records(df['好きなスポーツ'], columns=['野球', 'サッカー', '水泳', '相撲', 'ラグビー'])
sport.head()
{{< / highlight >}}

|	| 野球	|サッカー	|水泳	|相撲	|ラグビー|
|---|---|---|---|---|---|
|0|	1|	0|	0|  1|	0|
|1|	0|	0|	1|	1|	1|
|2|	1|	0|	1|	0|	1|
|3|	1|	1|	1|	1|	1|

野球が好きかどうか、サッカーが好きかどうか、の列に分割することができました。

<!--adsense-->

## まとめ

列のデータがどのような形式か、意味かによって、適切に加工してあげるかは大切ですね。
他にも何かテクニックがあればまとめていきたいと思います。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=9f638725021ad496a17c5219a6672cd2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117984&linkId=1f44de3fdd307ab42e2ff48aefcde747&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
