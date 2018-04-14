---
title: "継続的デリバリのためにfeatureのリリースと改善系のリリースは分けよう"
description: "継続的デリバリを実現するためには、継続的インテグレーションの仕組みと再現性のあるデプロイメントパイプライン基盤の整備が必要です。商用作業におけるビジネスリスクを更に小さくするためのメソッドとして、リリース対象の成果物のまとまりという観点でまとめてみました。"
date: 2018-04-14 00:00:00 +0900
categories: continuous-delivery
tags: continuous-delivery agile
---

[継続的デリバリ(Continuous Delivery)](http://www.ryuzee.com/contents/blog/4241)はITの現場で一般的なものと浸透してきました。
継続的デリバリを実現するためには、継続的インテグレーションの仕組みと
再現性のあるデプロイメントパイプライン基盤の整備が必要です。
これにより出荷可能なプロダクトを頻繁にリリースすることが可能になります。
今回は頻繁にリリース可能な環境下における、リリース成果物の話をしたいと思います。

---

* Table Of Contents
{:toc}
  
## デプロイは失敗  
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

### 失敗した時のダメージは「軽減」しかできない
仮にデプロイ後の動作確認で何らか問題が見つかったとしましょう。  
その場合、サービスされているシステムはそのままに、デプロイしたリソースを切り戻すことになるでしょう。  
問題が発生したリソースは撤収され、ビジネスにネガティブなインパクトを与えることはありませんでした。
  
  
  
あー良かった良かった。
  
  
...本当にそうなのでしょうか？
  

  
もし、今回リリースする成果物のfeatureが
* プレスリリースを打っていたら？
* 法人のお客様に約束をしていたら？
どうなるでしょうか。
  
そうですね。プロダクトにおける重要なマイルストーンを含む場合、「新しいfeatureを提供する」というポジティブなビジネスインパクトを妨げる**機会損失** というネガティブなビジネスインパクトを与えているはずです。

優れたアジャイル開発チームであれば「[顧客が本当に必要だったもの](https://matome.naver.jp/odai/2133468389280396901)」
を理解し、肌でも感じていますが、**取り組むべき価値のあるfeatureから順次提供している** はずです。
  
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4873117321/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873117321&linkCode=am2&tag=soudegesu-22&linkId=ca20d76273c1a09d878e5bd16acf1f2e"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873117321&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873117321" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
  
  
更に突き詰めていくと、 **「デプロイ作業の工数が無駄になった」** とか、会社によっては **「障害報告の工数が無駄になった」** 
みたいな人件費の話も出てきて、結局ダメージをゼロにはできません。軽減するしかできないのです。

やっぱりデプロイは失敗できないじゃないか！ちくしょう！

## 失敗したときのダメージを「軽減」すること
### 量を減らし、回数を増やす

1度にリリースする成果物の量を減らし

### Decoupling improvement from feature(改善とフィーチャーは分離しよう)


### エンドユーザにバグ取りに貢献してもらう


## まとめ
