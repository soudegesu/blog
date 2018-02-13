---
title: "Q# 量子コンピューティングプログラミング言語の環境構築と動かし方"
description: ""
date: 2018-02-11 00:00:00 +0900
categories: q#
tags: q# quantum computing 量子コンピューティング
lang: ja
---

* Table Of Contents
{:toc}

## Q# って何だろう
もともとは **仮想通貨** を調べていた時に、 **量子耐性** という言葉を発見し、量子耐性から量子耐性のあるアルゴリズムや量子プログラミング言語である **Q#** といったものに情報が派生していきました。
Wikipediaなどを見てみると、**Q#**はどちらかといえば研究者向けの言語らしいので、普段の業務との絡みは少なそうであるけど、せっかくなので触ってみようと思います。

## Q#の環境構築
開発環境の構築に関しては大きく補足することは無さそうです。[公式サイト](https://docs.microsoft.com/en-us/quantum/quantum-installconfig?view=qsharp-preview)も手順が手厚めに記載されています。

ただし、私の普段使いのPCがMacであるためセットアップの途中で気づいたのですが、 **Macは Microsoft Quantum Development KitのExtensionをインストールできない** ことが判明。手順の序盤にも記載があったのですが、すっかり読み飛ばしていました。 現時点のVisual Studio for Mac がこのExtensionをサポートしていない、というのです。
仕方がないので、Azure上にWindowsのインスタンスを構築し、Remote Desktop接続にて作業をすることにしました。

### Azure上でのWindowsインスタンスセットアップ

なお、Microsoft Azureは30日間フリーで使えるクレジットを準備してくれているので、Outlookのアカウントがあれば簡単にセットアップできます。
インスタンス構築時には `Visual Studio 2017` がバンドルされているイメージを使用すると簡単にできます。

### Microsoft Quantum Development Kitのインストール
[Microsoft Quantum Development Kit](https://www.microsoft.com/en-us/quantum/development-kit) をダウンロードすることで `Q#` のコードが動かせるようになります。公式サイトではwebサイトからの `.vsix` ファイル(Visual Studio)の手順を紹介していますが、
今回はヘッダーメニューの [Tools] > [Extensions and Updates..] から検索してインストールしました。

![extension_and_updates]({{site.baseurl}}/assets/images/20180211/extension_and_updates.png)

### サンプルコードのインポート
その後、[サンプルコード](https://github.com/microsoft/quantum)を `fork` したものを `clone` します。
(私の場合、学んだことをissueに書き連ねていきたいので、こうしました) 

Visual Studio上では `Team` というメニューでVCSにアクセスできるので、そこからインポートを行い、
その後 `.sln` ファイルをダブルクリックしてプロジェクトを開きます。


## まとめ
とりあえず、Mac OSがサポートされたら、この記事を更新しようかな、と思いました。
