---
title: "TensorFlowのオンライン学習サイトを利用してみる"
date: 2017-02-19 01:36:00 +0900
categories: tensorflow 
lang: ja
---

## 機械学習を身につけたい意欲
ここ1年で"AI"や"人工知能"のワードを耳にする機会は大変増えました。
NHKの朝のニュースでも頻繁に見るくらいですので、世間一般の方でも「なんかすごい技術」として認知はされているのでしょう。
先日、ダボス会議が開催された際に、以下のような発言がなされたことがニュースとなったことも記憶に新しいことと思います。

* [「ダボス会議」で世界のトップリーダーたちが懺悔 「AIの成長が早すぎて超ヤバい。認識が甘かった」](http://tocana.jp/2017/02/post_12245_entry.html)

これから加速度的に発展し、社会進出してくる機械学習を用いた製品やサービス。
このムーブメントはIT業界に関わらず、他の業界にも浸透していくことでしょう。

私のような今まで機械学習を業務で利用していなかったエンジニアも、程度の差こそあれ、機械学習の理解に努めなければ
完全なブラックボックス製品を使うだけの1エンドユーザーに終わってしまうのではないか、という焦りがあります。

アルゴリズムを見つけたり、最適化したり、というのはハードルが高いので、「ライブラリが使える」ようになることを直近の目標にしたいと思います。

## 筆者のレベル感
* python はまぁ書ける
* [coureraの機械学習のコース](https://www.coursera.org/learn/machine-learning/home/welcome)は受講済
* [ゼロから作るDeepLearning](https://www.amazon.co.jp/%E3%82%BC%E3%83%AD%E3%81%8B%E3%82%89%E4%BD%9C%E3%82%8BDeep-Learning-Python%E3%81%A7%E5%AD%A6%E3%81%B6%E3%83%87%E3%82%A3%E3%83%BC%E3%83%97%E3%83%A9%E3%83%BC%E3%83%8B%E3%83%B3%E3%82%B0%E3%81%AE%E7%90%86%E8%AB%96%E3%81%A8%E5%AE%9F%E8%A3%85-%E6%96%8E%E8%97%A4-%E5%BA%B7%E6%AF%85/dp/4873117585/ref=sr_1_fkmr0_1?ie=UTF8&qid=1487429614&sr=8-1-fkmr0&keywords=%E3%82%BC%E3%83%AD%E3%81%8B%E3%82%89+%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92) は一通り読み切った
* TensorFlowの公式サイトのMNISTサンプルは実行して「お、おぅ。。」となって中断している

## TensorFlowを学べるサイト
オンラインでTensorFlowを学べるサイトがあるのかを探してみたところ、kadenzeというサイト「Creative Applications of Deep Learning with TensorFlow」という学習コースがありました。
* [Creative Applications of Deep Learning with TensorFlow](https://www.kadenze.com/courses/creative-applications-of-deep-learning-with-tensorflow/info)

全体としては1h程度の動画 ✕ 5枠にて構成されていました。
最初のコースは無料で受講できるようなので、早速登録してみることに。

会員登録作業が一通り終わると、「講義で利用するリソースがgithub上に上がっているのでcloneしてね」ということが判明。
それが以下。

* [pkmital/CADL](https://github.com/pkmital/CADL)

リポジトリ内にjupyter notebook用のファイル(.ipynb)があるので、自分のマシンにjupyter notebookとtensorflowがインストールされていればすんなり起動&実行が可能です。(Dockerもあると良い)
結構、notebookファイル内にmarkdown形式の説明文が記載されているので、もしかしたら動画を見なくても感じがつかめるかもしれません。

## 動画を見てみた感想
* 全編英語(当たり前ですが)
* 英語字幕の設定が可能
  - ただし、動画毎に字幕設定が必要(設定が引き継げない)のが若干面倒
* 約1h時間の枠内で更に細かい動画に分割されていた。(introduction 2min、 about XXX 14minのように)
* いきなり文脈が飛ぶときがあって、置いていかれることがある
  - 「なぜ」の部分の説明が割愛されているときがある
  - そこはForum使って議論 & QA しなさい、といった感じなのでしょうか
* .ipynbのソースに解答が既に打ち込まれてしまっているので、動画を追いかけながらタイプしたい方は別途環境を構築した方がよいかも。

## まとめ
実はまだ5枠全部受けきれてないです。
自身での内容の整理も含めて、これからまとめていきたいと思います。