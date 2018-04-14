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
今回は頻繁にリリース可能な環境下において、1回のリリースに含まれる成果物の話をしたいと思います。

---

* Table Of Contents
{:toc}
  
## Decoupling deployment from release(デプロイとリリースは分離しよう)

かつて、Technology Readerのtechniquesに [Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release) というものが紹介されていました。
これは、ITの現場で「商用作業」または「本番リリース」と言われている作業を2つのプロセスに分割して行うことを提案しています。
  
1. 商用環境へのシステムの展開(デプロイ)
2. デプロイされたシステムをサービスインさせる(リリース)
  
これはビジネス上のリスクを軽減するための方法としてとても画期的な発想で、私もプロダクト開発に携わる時には可能な限り [Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release) ができるシステム構成やCD基盤の構築を心がけています。
チームのメンバーにも「デプロイ」と「リリース」という単語を明確に意味を分けて使うようにお願いしているし、彼らも納得してそうしてくれているので有り難い限りです。

エンジニアが「自分の行っている行為そのものが与えるビジネスインパクト」を意識するのはとても良いことで、
単にビジネスインパクトといっても、
**「新しいfeatureを提供する」というポジティブなビジネスインパクト** もあれば、
**「システム障害」「セキュリティインシデント」のようなネガティブなビジネスインパクト** もあるので、
ポジティブなものは「どうやって最大化するか」を、ネガティブなものは「どうやって最小化するか」を
考えながら仕事をするのはエンジニア冥利に尽きるわけです。

[Decoupling deployment from release](https://www.thoughtworks.com/radar/techniques/decoupling-deployment-from-release)はどちらかと言えば後者向けのテクニックに分類できると私は理解しています。

## 上手く
* 


## Decoupling improvement from feature(改善とフィーチャーは分離しよう)

## Github flowを採用している場合には

##
