---
title: "PandasでNaNの列を処理する"
description: "PandasにおけるNaNの取扱いの仕方を説明します。列データにNaNがあるかを見つける方法や、集計、NaNのある行データの削除、デフォルト値への置換など。"
date: "2018-10-15T08:39:08+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pandas"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

[Pandas](https://pandas.pydata.org/) でデータを扱うことで、データ分析の前処理が格段に楽になります。

列データにおける `NaN` の処理を例に、[Pandas](https://pandas.pydata.org/)の便利さの説明をしたいと思います。

<!--adsense-->

## NaNとは

**NaN（Not a Number）** は浮動小数点型における異常な値のことを意味します。
わかりやすい例で言うと、0での割り算が該当します。これは実数では表せないため、 `NaN` になります。

[Pandas](https://pandas.pydata.org/) において `NaN` は **値が欠損している** 場合によく遭遇する表現です。
具体例で見ていきましょう。以下のようなサンプルデータ（`sample.csv`）を作成します。

{{< highlight csv "linenos=inline" >}}
ID,名前,年齢,性別,趣味
1,小林,20,男,野球観戦
2,田中,35,女,飲み会
3,佐藤,29,男
4,鈴木,44,女,編み物
{{< / highlight >}}

データを `read_csv` 関数で読み出して `DataFrame` とした後、表示してみます。

{{< highlight python "linenos=inline" >}}
import pandas as pd

df = pd.read_csv('./sample.csv')
df.head()
{{< / highlight >}}

佐藤さんは **趣味** の列のデータが欠損しているので `NaN` と表示されていますね。


|   |ID	|名前	|年齢	|性別	|趣味|
|---|---|-----|----|----|---|
|0	|1	|小林	 |20	|男	 |野球観戦|
|1	|2	|田中	 |35	|女	 |飲み会|
|2	|3	|佐藤	 |29	|男	 |NaN|
|3	|4	|鈴木	 |44	|女	 |編み物|


例えば、**必須回答** と **任意回答** の項目があるアンケート分析の場面においては、任意回答項目の列に `NaN` が頻出することは想像に難くないでしょう。
要件に応じて欠損値を正しく処理するのは、とても重要な作業です。

<!--adsense-->

## 各列にNaNが存在するかを確認する

ここから、 `NaN` のハンドリグをまとめていきます。

まずは、各列の中に `NaN` があるかをパッと判断できると嬉しいでしょう。`isna` 関数を使えば簡単に確認できます。

{{< highlight python "linenos=inline" >}}
df.isna().any()

> ID    False
> 名前    False
> 年齢    False
> 性別    False
> 趣味     True
{{< / highlight >}}

`any()` と組み合わせることで、**1つでもNaNがあればTrue** と出力指定ができます。
上の出力で言えば、**趣味** のカラムは1つ以上欠損しているので `True` です。

`df.isna().all()` としてしまうと、 **全ての値がNaNであればTrue** となってしまうので、注意しましょう。

## 各列にNaNが何件あるかを確認する

`NaN` の件数を集計したい場合には `sum()` を使えば良いです。

{{< highlight python "linenos=inline" >}}
df.isna().sum()

> ID    0
> 名前    0
> 年齢    0
> 性別    0
> 趣味    1
> dtype: int64
{{< / highlight >}}

<!--adsense-->

## NaNの取り扱いを決める

次に実際に `NaN` となっているデータの取扱いを考えます。

### NaNが存在する行を削除する

以下は、全ての列に対して1つでも `NaN` がある **行** を削除する例です。

{{< highlight python "linenos=inline" >}}
df[df.isna().any(axis=1) == False]
{{< / highlight >}}

`axis=1` とすることで、行に対する `True/False` を取得している点が肝になります。
`False` となっている行、つまり、 `NaN` が存在しない行のみ表示しています。

これは `dropna` 関数を使った時の以下の処理と等価です。

{{< highlight python "linenos=inline" >}}
df.dropna(axis=0)
{{< / highlight >}}

しかし実際問題、 全ての列においてNaN判定をする処理はあまり見かけないので、 **特定の列がNaNの行を削除** する場合には以下のようにします。

{{< highlight python "linenos=inline" >}}
# ここでは「趣味」列を対象にする
df[df['趣味'].isna() == False]
{{< / highlight >}}

### NaNに対してデフォルト値を設定する

`NaN` のデータに対してデフォルト値を設定するには `fillna` 関数を使います。

{{< highlight python "linenos=inline" >}}
df.fillna('なし')
{{< / highlight >}}

全ての `NaN` のデータを `なし` に置換することができます。

|   |ID	|名前	|年齢	|性別	|趣味|
|---|---|-----|----|----|---|
|0	|1	|小林	 |20	|男	 |野球観戦|
|1	|2	|田中	 |35	|女	 |飲み会|
|2	|3	|佐藤	 |29	|男	 |なし|
|3	|4	|鈴木	 |44	|女	 |編み物|


列ごとにデフォルト値を変えたい場合には、引数に辞書型を渡してあげると良いです。

{{< highlight python "linenos=inline" >}}
# 「趣味」列がNaNであれば「なし」をデフォルト値とする
df.fillna({'趣味': 'なし'})
{{< / highlight >}}

|   |ID	|名前	|年齢	|性別	|趣味|
|---|---|-----|----|----|---|
|0	|1	|小林	 |20	|男	 |野球観戦|
|1	|2	|田中	 |35	|女	 |飲み会|
|2	|3	|佐藤	 |29	|男	 |なし|
|3	|4	|鈴木	 |44	|女	 |編み物|

<!--adsense-->

## まとめ

[Pandas](https://pandas.pydata.org/) を使うことで、欠損値のある行や列に対して、削除を行ったり、デフォルト値を追加したり、処理を行うことができます。
分析対象データの目的に応じて、`NaN` をうまく取り扱えるようになりましょう！

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=9f638725021ad496a17c5219a6672cd2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117984&linkId=1f44de3fdd307ab42e2ff48aefcde747&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=dead5d9ca736c61a64b07ba1b39b3222&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
