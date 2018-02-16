---
title: "Q# 量子コンピューティングプログラミング言語の環境構築と学びのステップ"
description: ""
date: 2018-02-11 00:00:00 +0900
categories: q#
tags: q# quantum computing 量子コンピューティング
lang: ja
---

もともとは **仮想通貨** を調べていた時に、 **量子耐性** という言葉を発見し、量子耐性から **量子耐性のあるアルゴリズム** や量子プログラミング言語である **Q#** に行き着きました。
Wikipediaなどを見てみると、**Q#** はどちらかといえば研究者向けの言語らしいので、普段の業務との関連性は少なそうですが、せっかくなので触ってみようと思います。

* Table Of Contents
{:toc}

## Q#の環境構築
開発環境の構築に関しては大きく補足することは無さそうです。[公式サイト](https://docs.microsoft.com/en-us/quantum/quantum-installconfig?view=qsharp-preview)も手順が手厚めに記載されています。

ただし、私の普段使いのPCがMacであるためセットアップの途中で気づいたのですが、 **Macは Microsoft Quantum Development KitのExtensionをインストールできない** ことが判明しました。手順の序盤に記載があったのですが、すっかり読み飛ばしていました。 現時点のVisual Studio for Mac がこのExtensionをサポートしていない、というのです。
仕方がないので、Azure上にWindowsのインスタンスを構築し、Remote Desktop接続にて作業をすることにしました。

### Azure上でのWindowsインスタンスセットアップ

Microsoft Azureは30日間フリーで使えるクレジットを準備してくれているので、Visual Studioのサンプルコードを実行する程度であればお金の心配はしなくても良いですし、Outlookのアカウントがあれば簡単にセットアップできます(手元にクレカや携帯電話は必要です)。
インスタンス構築時には `Visual Studio 2017` がバンドルされているイメージを使用すると簡単に始められるため、私はそれを利用しました。

### Microsoft Quantum Development Kitのインストール
[Microsoft Quantum Development Kit](https://www.microsoft.com/en-us/quantum/development-kit) をダウンロードすることで `Q#` のコードが動かせるようになります。公式サイトではwebサイトからの `.vsix` ファイル(Visual Studio)入手の手順を紹介していますが、
今回はヘッダーメニューの [Tools] > [Extensions and Updates..] から検索してインストールしました。

![extension_and_updates]({{site.baseurl}}/assets/images/20180211/extension_and_updates.png)

### サンプルコードのインポート
その後、[サンプルコード](https://github.com/microsoft/quantum)を `fork` したものを `clone` します。
(私の場合、学んだことをissueに書き連ねていきたいので、こうしました) 

Visual Studio上では `Team` というメニューでVCSにアクセスできるので、そこからインポートを行い、
その後 `.sln` ファイルをダブルクリックしてプロジェクトを開きます。

### サンプルコードの実行(なるほど、わからん)
プロジェクト内にいくつかディレクトリがあり、いくつかのサンプルコードが配置されています。
それを「Set as Startup Project」に設定した後、 `F5` のショートカットキーでRunさせることができます。
おもむろにプロンプトが立ち上がり、何かが実行されているのですが、なるほどどうしてよく分かりません。
とりあえず、動作環境が構築できたことはわかりました。

![prompt_success]({{site.baseurl}}/assets/images/20180211/prompt_success.png)

## 基本を抑える

やはり前知識無しで進めていくのは厳しいものがあるので、基本を抑えに行きましょう。

### Qubit 量子コンピューティングの基本を抑える
私の場合、そもそも量子コンピューティング自体への理解が皆無ですので、そこを補填する必要がありました。
そのため、`N.H.Shimada` さんのブログの記事「[新プログラミング言語「Q#」で量子テレポーテーション](http://ut25252.hatenablog.com/entry/2017/12/15/222821)」やIPAより公開されている「[2. 量子計算の基本原理[1-14]](https://www.ipa.go.jp/security/enc/quantumcomputers/contents/doc/chap2.pdf)」、`lyncs`さんの [量子情報科学序論 IBM Qを動かして学ぶ量子コンピュータ](http://lyncs.hateblo.jp/entry/2017/12/16/000103)、加えて `@eccyan` さんの「[量子コンピュータと量子ゲートと私](https://qiita.com/eccyan/items/180fb909a55a59bb4e1b)」 を読みながら知識を増やしていきます。

ここでは主に以下の3点を学習しました。

* Qubit(Quantum bit)
    * 重ね合わせ
    * 量子もつれ
    * 観測

ここでQubitについてまとめると先駆者の方々の丸パクリになってしまいそうでしたので、各リンク先の内容をご参照ください。

### [注意点]Reference to unknown namespace xxx が出る場合
サンプルコードを動かした後、新規のプロジェクトでプログラムを実行しようと思ったのですが、
以下のようなエラーが表示され、ビルドに失敗しました。

```
Reference to unknown namespace Microsoft.Quantum.Primitive
```

調査してみたところ `.NETのバージョンが古い` ことが原因でした。
[Stackoverflow](https://stackoverflow.com/questions/47910347/q-environment-inconsistencies)を参考に `.NET Framework` を `4.6.1` に変更することで namespaceの解決ができるようになりました。

## Q#の型


## 今後Q#はどのように組み込まれるのか

今後のソフトウェアレイヤーにはどのように組み込まれるのか、に関するアイディアがMicrosoftの [The Software Stack](https://docs.microsoft.com/en-us/quantum/quantum-concepts-9-softwarestack?view=qsharp-preview) にて言及されていました。
量子コンピュータは量子プロセッサ的なものと、従来の他のデバイスとハイブリッドで使うことになるのではなかろうか、とのこと

## まとめ


## 参考にさせていただいたサイト
* [新プログラミング言語「Q#」で量子テレポーテーション](http://ut25252.hatenablog.com/entry/2017/12/15/222821)
* [2. 量子計算の基本原理[1-14]](https://www.ipa.go.jp/security/enc/quantumcomputers/contents/doc/chap2.pdf)
* [量子コンピュータと量子ゲートと私](https://qiita.com/eccyan/items/180fb909a55a59bb4e1b)
* [量子情報科学序論 IBM Qを動かして学ぶ量子コンピュータ](http://lyncs.hateblo.jp/entry/2017/12/16/000103)
* [The Q# Programming Language](https://docs.microsoft.com/en-us/quantum/quantum-qr-intro?view=qsharp-preview)
* [Q# environment inconsistencies(Stackoverflow)](https://stackoverflow.com/questions/47910347/q-environment-inconsistencies)

