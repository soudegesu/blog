---
title: "Cirqの回路図の概念を理解する"
description: ""
date: "2018-11-19T06:20:30+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "cirq"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

以前の記事 [Q# 量子コンピューティングプログラミング言語を試す](/q_sharp/what-is-q-sharp/) では、
Microsoftが開発した量子コンピューティングのプログラミング言語である 
[Q#](https://www.microsoft.com/en-us/quantum/) を試してみました。

2018/11現在、[thoughtworksのTechnology Radar](https://www.thoughtworks.com/radar/languages-and-frameworks) で [Q#](https://www.microsoft.com/en-us/quantum/) が **ASSESS** に登録されたこともあり、量子コンピューティングへの期待が高まりつつあります。

一方で、Microsoft以外の取り組みも調査しておこうと思いました。
その中でも、Googleが提供している量子プログラミングライブラリ [Cirq](https://cirq.readthedocs.io/en/latest/index.html)
は以前から個人的な興味度合いの高いライブラリでした。

そのため、まずは、[Cirq](https://cirq.readthedocs.io/en/latest/index.html) における回路図の概念を理解することに重点を置きます。

注意点として、[Cirq](https://cirq.readthedocs.io/en/latest/index.html) は鋭意開発中なライブラリ（ 2018/11時点で `0.3.1.35` ）です。
本記事の情報と、最新の情報の相違があった場合にはご了承ください。

## 回路図の2つの概念： `Circuit` と `Schedule`

まずは、[Cirq](https://cirq.readthedocs.io/en/latest/index.html) における重要な概念とされる `Circuit` と `Schedule` について学びます。

まず、`Circuit` も `Schedule` も量子回路図のモデルを表します。
ただし、 `Schedule` には時間情報が含まれています。

概念的には `Circuit` は `Moments` のコレクションです。
一つの `Moment` は `Operations` のコレクションであり、
`Operations` は同じタイムスライス中でのすべての振る舞いを意味します。
`Operation` は `Qubits` の演算を指します。

[Cirq](https://cirq.readthedocs.io/en/latest/index.html) において、`qubits` は 基底クラスの `QubitId` のサブクラスである。
`QubitId` の各サブクラスは用途に応じて異なるもとして定義されている。
例えば、

## 参考にさせていただいたサイト
* [Circuits - Cirq 0.1 documentation](https://cirq.readthedocs.io/en/latest/circuits.html)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B07GW8J2GY&linkId=c88e27a1f16e9a9ac83136d87c5c7836&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B07GJPPPJW&linkId=0b95c87ec5cb854066916894aa36f877&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B07H5VTDFK&linkId=0807afde28327cfbad4fa2ee3533f481&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>

