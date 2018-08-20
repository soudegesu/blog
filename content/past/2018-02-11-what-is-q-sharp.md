---
title: "Q# 量子コンピューティングプログラミング言語を試す"
description: "量子コンピューティングプログラミング言語であるQ#を試してみました。環境構築で発生した問題と、量子コンピューティングの基礎を抑えるための参考リンクもいくつか"
date: 2018-02-11
categories:
    - q_sharp
tags:
    - q#
url: /q_sharp/what-is-q-sharp/
---

もともとは **仮想通貨** を調べていた時に、 **量子耐性** という言葉を発見し、量子耐性から **量子耐性のあるアルゴリズム** や量子プログラミング言語である **Q#** に行き着きました。
Wikipediaなどを見てみると、**Q#** はどちらかといえば研究者向けの言語らしいので、普段の業務との関連性は少なそうですが、せっかくなので触ってみようと思います。

## Q#の環境構築
開発環境の構築に関しては大きく補足することは無さそうです。[公式サイト](https://docs.microsoft.com/en-us/quantum/quantum-installconfig?view=qsharp-preview)も手順が手厚めに記載されています。

ただし、セットアップの途中で気づいたのですが、 **Macは Microsoft Quantum Development KitのExtensionをインストールできない** ことが判明しました。手順の序盤に記載があったのですが、すっかり読み飛ばしていました。 現時点のVisual Studio for Mac がこのExtensionをサポートしていない、というのです。
仕方がないので、Mac使いの私はAzure上にWindowsのインスタンスを構築し、Remote Desktop接続にて作業をすることにしました。

### Azure上でのWindowsインスタンスセットアップ

Microsoft Azureは30日間フリーで使えるクレジットを準備してくれているので、Visual Studioのサンプルコードを実行する程度であればお金の心配はしなくても良いです。Outlookのアカウントがあれば簡単にセットアップできます(手元にクレカや携帯電話は必要です)。
インスタンス構築時には `Visual Studio 2017` がバンドルされているイメージを使用すると簡単に始められるため、私はそれを利用しました。

### Microsoft Quantum Development Kitのインストール
[Microsoft Quantum Development Kit](https://www.microsoft.com/en-us/quantum/development-kit) をダウンロードすることで `Q#` のコードが動かせるようになります。公式サイトではwebサイトからの `.vsix` ファイル(Visual Studio)入手の手順を紹介していますが、
今回はヘッダーメニューの [Tools] > [Extensions and Updates..] から検索してインストールしました。

![extension_and_updates](/images/20180211/extension_and_updates.png)

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

![prompt_success](/images/20180211/prompt_success.png)

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

```bash
Reference to unknown namespace Microsoft.Quantum.Primitive
```

調査してみたところ `.NETのバージョンが古い` ことが原因でした。
 `.NET Framework` を `4.6.1` に変更することで namespaceの解決ができるようになりました。

## Q#の標準ライブラリを見てみる
普段、高級言語で仕事をしている身からすると、少し変わった型がプリミティブとして用意されているので、紹介しておきます。

### 少し変わったプリミティブ型
#### Qubit
量子コンピューティングに必要な量子ビット(Quantum Bit)を表現するための型。

#### Pauli
ブロッホ球での回転を考えるときに使用するパウリ行列を表す型。
何軸で回転させるかによって `PauliI`, `PauliX`, `PauliY`, `PauliZ` のいずれかを選択することになるのですが、
それをまとめてPauliとして扱います。

#### Result
Qubitを観測(Measurement)した際の結果が格納される型。
観測することで `0` か `1` に収束されるので、`Zero` か `One` しかありません。

### 標準関数も少し見てみる

`Microsoft.Quantum.Primitive` パッケージには演算のための関数が予め準備されていました。
Microsoftのサンプルコードで使われている `T` や `H` 、 `CNOT` といったゲートを構築するためのものがあり、
別のパッケージには `Math` 系のパッケージもありました。

関数が表す式は [公式のライブラリリファレンス](https://docs.microsoft.com/en-us/qsharp/api/prelude/microsoft.quantum.primitive?view=qsharp-preview)
に記載されています。端的ですが、変に言葉で説明するよりも良いのでしょうね。理解が及んでいない式は別途調べました。

## まとめ
### Q#の理解自体はそこまで難しくない
私はアルゴリズムや低レベルの機械計算を専門としてはいないため、応用するには学習時間が要しそうですが、
今時点での言語仕様は比較的理解しやすいと感じました。量子力学の基礎となる数式の意味が理解できれば、
量子ゲート作成に必要な演算部分は `Q#` から提供されているため、あとは組み合わせるだけになります。
なお、[IBM Q](https://www.research.ibm.com/ibm-q/) にはGUIもあるのですが、
pythonのSDKとして [qiskit-sdk-py](https://github.com/QISKit/qiskit-sdk-py) も提供しています。
シミュレーションを目的とし、コード化による共有ができ、サクッと動かしてみたい、という方はこちらの方がいいのかもしれませんね。
(すみません、こちらは動作確認していません)

### 今後Q#はどのように活用されるのか

ソフトウェアを動かすにはどのように組み込まれるのか、に関するアイディアはMicrosoftの [The Software Stack](https://docs.microsoft.com/en-us/quantum/quantum-concepts-9-softwarestack?view=qsharp-preview) にて言及されていました。
量子コンピュータが得意とするアルゴリズムはQ#で組み、従来のコンピュータが得意とする計算はそちらに処理を委ねるハイブリッドな構成が提案されています。
今回は量子コンピュータプログラミング言語が活かせる演算までは踏み込みませんが、定期的に情報をウォッチしていきたいですね。

## 参考にさせていただいたサイト

* [新プログラミング言語「Q#」で量子テレポーテーション](http://ut25252.hatenablog.com/entry/2017/12/15/222821)
* [2. 量子計算の基本原理[1-14]](https://www.ipa.go.jp/security/enc/quantumcomputers/contents/doc/chap2.pdf)
* [量子コンピュータと量子ゲートと私](https://qiita.com/eccyan/items/180fb909a55a59bb4e1b)
* [量子情報科学序論 IBM Qを動かして学ぶ量子コンピュータ](http://lyncs.hateblo.jp/entry/2017/12/16/000103)
* [The Q# Programming Language](https://docs.microsoft.com/en-us/quantum/quantum-qr-intro?view=qsharp-preview)
* [Q# environment inconsistencies(Stackoverflow)](https://stackoverflow.com/questions/47910347/q-environment-inconsistencies)

