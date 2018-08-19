---
title: "継続的デリバリのためにfeatureのリリースと改善系アイテムのリリースは分けよう"
description: "継続的デリバリを実現するためには、継続的インテグレーションの仕組みと再現性のあるデプロイメントパイプライン基盤の整備が必要です。商用作業におけるビジネスリスクを更に小さくするためのメソッドとして、リリース対象の成果物のまとまりという観点でまとめてみました。"
date: 2018-04-16
categories:
    - continuous-delivery
tags: 
    - continuous-delivery
    - agile
---

[継続的デリバリ(Continuous Delivery)](http://www.ryuzee.com/contents/blog/4241)はITの現場で一般的なものと浸透してきました。
継続的デリバリを実現するためには、継続的インテグレーションの仕組みと
再現性のあるデプロイメントパイプライン基盤の整備が必要です。
これにより出荷可能なプロダクトを頻繁にリリースすることが可能になります。
今回は頻繁にリリース可能な環境下において、より安全にサービスをデリバリするための個人的な考えをまとめたものです。

---

* Table Of Contents
{:toc}
  
## デプロイの失敗を考える  
### Decoupling deployment from release(デプロイとリリースは分離しよう)

かつて、Technology Readerのtechniquesに [Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release) というものが紹介されていました。
これは、ITの現場で「商用作業」または「本番リリース」と言われている作業を2つのプロセスに分割して行うことを提案しています。
  
1. 商用環境へのシステムの展開(デプロイ)
2. デプロイされたシステムをサービスインさせる(リリース)

デプロイしてもエンドユーザに成果物は提供されません。リリースして初めて利用可能になります。
つまり、リリースしない限りはビジネスに与える影響がないのです。デプロイ後に成果物の動作確認をし、問題があれば切り戻せば良いのです。
  
これはビジネス上のリスクを軽減するための方法としてとても画期的な発想で、私もプロダクト開発に携わる時には可能な限り [Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release) ができるシステム構成やデプロイメント基盤の構築を心がけています。
  
チームのメンバーにも「デプロイ」と「リリース」という単語を明確に意味を分けて使うようにお願いしているし、彼らも納得してそうしてくれているので有り難い限りです。
  
エンジニアが「自分の行っている行為がビジネスラインに与える影響」を意識するのはとても良いことで、
単にビジネスインパクトといっても、

**「新しいfeatureを提供する」というポジティブなビジネスインパクト** もあれば、  
**「システム障害」「セキュリティインシデント」のようなネガティブなビジネスインパクト** もありますから、  

ポジティブなものは「どうやって最大化するか」を、ネガティブなものは「どうやって最小化するか」を
考えながら仕事をするのはエンジニア冥利に尽きるわけです。

[Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release) はどちらかと言えば後者の、ネガティブなビジネスインパクトを軽減するためのテクニックに分類できると私は理解しています。

### 失敗した時の「被ダメージ」
仮にデプロイ後の動作確認で何らか問題が見つかったとします。  
その場合、サービスされているシステムはそのままに、デプロイしたリソースを切り戻すことになるでしょう。  
問題が発生したリソースは撤収され、ビジネスにネガティブなインパクトを与えることはありませんでした。
  
  
  
あー良かった良かった。
  
  
...本当にそうなのでしょうか？
  

  
もし、今回リリースする成果物のfeatureが
* プレスリリースを打っていたら？
* 法人のお客様に約束をしていたら？

どうなるでしょうか。
  
そうですね。プロダクトにおける重要なマイルストーンを含む場合、「新しいfeatureを提供する」というポジティブなビジネスインパクトを妨げる **機会損失** というネガティブなビジネスインパクトを与えているはずです。

優れたアジャイル開発チームであれば「[顧客が本当に必要だったもの](https://matome.naver.jp/odai/2133468389280396901)」
を肌でも感じていますが、**取り組むべき価値のあるfeatureから順次提供している** はずです。この観点を踏まえると、「マイルストン通りfeatureを提供できないこと」は「重度のシステム障害が起こる」よりはマシですが、問題に変わりはありません。
  
  
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4873117321/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873117321&linkCode=am2&tag=soudegesu-22&linkId=ca20d76273c1a09d878e5bd16acf1f2e"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873117321&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873117321" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
  

  
## 失敗したときの被ダメージを「軽減」する

結局、エンジニアは自分の置かれた環境と判断材料を基にして **リスクの発生のしやすさ** と **顕在化した時の被ダメージ** を頭の片隅において仕事をしているのです。
先程の例は更に突き詰めていくと、 **「デプロイ作業の工数が無駄になった」** とか、会社によっては **「障害報告の工数が発生した」** みたいな人件費の話も出てきて、**失敗による被ダメージは「軽減する」ことしかできない** ことが伺えます。
  
  
ではダメージを軽減するにはどうするか。いくつかのヒントを以下に書きます。
  
### 一度にリリースする量を減らす

1回にリリースする成果物の量(バッチサイズ)を減らすことです。featureを2つも3つも入れないことです。
例えば、3つのfeatureのうち1つ問題があったら、もれなく3つ分の機会損失が発生します。
そのため、リリース可能な1つずつのfeatureをシリアルに提供し、シリアルになる分、短いサイクルで提供するのです。

![separate]({{site.baseurl}}/assets/images/20180416/separate.png)

これはDevOps界隈でもフィードバックループを循環させる方法としてよく聞きます。

### Decoupling improvement from feature(改善とフィーチャーは分離しよう)

バッチサイズを調整するという観点で、リリースされる成果物の性質にも目を向けてみます。
「**その成果物自体にビジネスインパクトがあるかどうか**」 という判断軸で分割してみましょう。

1. ポジティブなビジネスインパクトを与える
    * プロダクトにおけるfeature
2. 直接的なビジネスインパクトをもたらさない
    * セキュリティパッチ適用
    * ライブラリバージョンアップ
    * OS差し替え
    * システム構成変更

ここで言いたいのは、「いわゆる**feature**と、いわゆる**システム改善**はリリースタイミングを分割した方が良い」ということです。
なぜならば、システム改善のデプロイに失敗して切り戻したとしても、既に提供されているfeatureには影響を出さずに済むからです。

![os_patch]({{site.baseurl}}/assets/images/20180416/os_patch.png)

## 失敗リスクを細分化する

Decoupling improvement from feature のような考え方でリリース物に色分けをすると、リスクの分散構造が理解しやすくなるという副産物があります。
例えば、 **feature開発のために、ライブラリをこっそりバージョンアップしてしまう現象** は現場でよく見かけます。

![feature_stone]({{site.baseurl}}/assets/images/20180416/feature_stone.png)
  
  
ライブラリのバージョンアップ自体は改善アイテムに分類することができ、 **個別のタイミングでデプロイすべき** なのです。
(時系列的にはfeatureの前にデプロイされているべきです)

デプロイを分割することによって、featureのリリースを行う時点では、既にライブラリのバージョンアップやDBマイグレーションは成功しているので、これらの失敗リスクを加味する必要がなくなります。

## まとめ
継続的デリバリを安定して行うための考え方をまとめました。
* デプロイとリリースのプロセスは分ける
* 一回のリリース物のサイズを小さくする
* 「直接的なビジネスインパクトがあるかどうか」という判断軸でリリース物を分割するのもアリ
  
  

小さな変化を積み重ねることで、最終的には大きな変更を成し遂げることができると考えています。

今後の個人的なタスクとしては `Springbootの1.5→2.x系へのバージョンアップ` や、`Amazon Linux → Amazon Linux2`への移行、`Java 11以降へのマイグレーション` といったイベントが目白押しなので、意識しながら作業していきたいです。
  
  
  
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4873118352/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873118352&linkCode=am2&tag=soudegesu-22&linkId=e1b8ecca6e0185cd2701dc949c301805"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873118352&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873118352" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
