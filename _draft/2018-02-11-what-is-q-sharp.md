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
開発環境の構築に関しては大きく補足することは無いのですが、ひとまず[公式サイト](https://docs.microsoft.com/en-us/quantum/quantum-installconfig?view=qsharp-preview)も手順が手厚めに記載されていますし、特に詰まることなく構築できるはず、、、と思っていた矢先に、
現時点でMacは Microsoft Quantum Development KitのExtensionをインストールできないことが判明。(Visual Studio for Mac が非対応)
少し残念ではありますが、Azure上にWindowsのインスタンスを構築して、Remote Desktop接続にて作業をすることにしました。

1. [Visual Studio](https://www.visualstudio.com/ja/downloads/?rr=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fquantum%2Fquantum-installconfig%3Fview%3Dqsharp-preview) をインストールする(IDEの入手)

2. [Microsoft Quantum Development Kit](https://www.microsoft.com/en-us/quantum/development-kit) のページへ行き、**Microsoft Quantum Development Kit** をダウンロードする(Visual StusioのQ#環境のためのExtension)

![download_quantum_tool_kit]({{site.baseurl}}/assets/images/20180211/download_quantum_tool_kit.png)

3. [サンプルコード](https://github.com/microsoft/quantum)を `clone` する 

## まとめ
とりあえず、Mac OSがサポートされたら、この記事を更新しようかな、と思いました。
