---
title: "Flutter初心者はCodelabsをまずやってみよう!!"
description: "Flutter初心者である私がCodelabsでサンプルアプリケーションを実装してみました。今回はCodelabsでトレーニングしてみた感想をまとめます。"
date: "2018-08-21T08:39:33+09:00"
thumbnail: "/images/icons/flutter_icon.png"
categories:
  - dart
tags:
  - dart
  - flutter
draft: true
isCJKLanguage: true
twitter_card_image: http://www.soudegesu.com/images/soudegesu.jpg
---

## 環境構築の後はCodelabsだ！

以前書いた記事 [Flutterでモバイルアプリケーション（Android/iOS）の開発環境を構築する](/dart/android-with-flutter/) で[Flutter](https://flutter.io/) の環境構築ができました。

せっかくなので、サンプルアプリを作ってみたいですよね。

[Flutter](https://flutter.io/) 初心者である私が [Codelabs](https://codelabs.developers.google.com/) でサンプルアプリケーションを実装してみたので。その感想をまとめます。

## Codelabsって何よ？

[Codelabs](https://codelabs.developers.google.com/) はGoogle社が提供しているコンテンツです。
Googleが提供するサービスやプラットフォームの初心者向けに、ガイドやチュートリアル、ハンズオンのコンテンツが提供されています。

いわゆるDevRelの一環ですね。さすがです、Google。

今回は [Codelabs](https://codelabs.developers.google.com/) の中でも [Flutter](https://flutter.io/) に関係するものを試してみます。

カテゴリを [Flutter](https://flutter.io/) にしてフィルタリングすると以下のように絞りこまれました。

![codelabs_flutter](/images/20180821/codelabs_flutter.png)

2018/08現在、[Flutter](https://flutter.io/) に関連する [Codelabs](https://codelabs.developers.google.com/) の教材は大きく分けて以下の2種類があります。

* [Flutter](https://flutter.io/) のサンプルアプリを作る系
* [Flutter](https://flutter.io/) におけるデザインを学ぶ系

今回は前者ですかね。私は以下の4つをやってみました。

1. [Write Your First Flutter App, part 1](https://codelabs.developers.google.com/codelabs/first-flutter-app-pt1/index.html?index=..%2F..%2Findex#0)
2. [Write Your First Flutter App, part 2](https://codelabs.developers.google.com/codelabs/first-flutter-app-pt2/index.html?index=..%2F..%2Findex#0)
3. [Building Beautiful UIs with Flutter](https://codelabs.developers.google.com/codelabs/flutter/index.html?index=..%2F..%2Findex#0)
4. [Firebase for Flutter](https://codelabs.developers.google.com/codelabs/flutter-firebase/index.html?index=..%2F..%2Findex#0)

## やってみた感想

今回、ソースコードは各リンク先に掲載されているので、個人リポジトリの晒しはありません。

### Write Your First Flutter App, part 1 & 2

[Write Your First Flutter App, part 1](https://codelabs.developers.google.com/codelabs/first-flutter-app-pt1/index.html?index=..%2F..%2Findex#0) と
[Write Your First Flutter App, part 2](https://codelabs.developers.google.com/codelabs/first-flutter-app-pt2/index.html?index=..%2F..%2Findex#0) についてはいたって普通でした。

リストビューを表示して、タップしたアイテムはFavoriteアイコンで保存され、別のビューで確認ができる、という簡単なものです。

![list_view](https://codelabs.developers.google.com/codelabs/first-flutter-app-pt2/img/b17de15fa7831a1c.png)

ここでは以下を学ぶことができました。

* 画面上のUIコンポーネントは `Widget` として表現される
  * 状態の変更が発生しない [StatelessWidget](https://docs.flutter.io/flutter/widgets/StatelessWidget-class.html) と状態の変更が発生する [StatefulWidget](https://docs.flutter.io/flutter/widgets/StatefulWidget-class.html) が存在する
  * 標準で搭載されているUIコンポーネントも `Widget` を継承している

なお、[Material Components Widgets](https://flutter.io/widgets/material/) のページを予め読んでおくと、
ソースコードのクラス名と提供されるUIの意味合いの理解が捗るのでオススメです。

### Building Beautiful UIs with Flutter

[Building Beautiful UIs with Flutter](https://codelabs.developers.google.com/codelabs/flutter/index.html?index=..%2F..%2Findex#0) では簡単なメッセージングUIを作成します。

と言っても、サーバ通信をするわけではないので、自分の打ち込んだメッセージがひたすらスタックしていくアプリです。

![chat_view](https://codelabs.developers.google.com/codelabs/flutter/img/9d2366169e72a4a6.png)

ここでは以下を学ぶことができました。

* 少し凝ったUIコンポーネントの設計の仕方
  * 標準で搭載されている [Column](https://docs.flutter.io/flutter/widgets/Column-class.html) や [Container](https://docs.flutter.io/flutter/widgets/Container-class.html) 等を使ってレイアウトを組み上げる
* Controller系のクラスで動作の制御をする
  * [AnimationController](https://docs.flutter.io/flutter/animation/AnimationController-class.html) を使ったアニメーションを制御する
  * [TextEditingController](https://docs.flutter.io/flutter/widgets/TextEditingController-class.html) を使って入力フォームの値にアクセスする
* ユーザ操作時の状態による処理のハンドリング（バリデーションとか）
  * 空文字の場合は入力を受け付けない、とか、ロジックが煩雑になる所

### Firebase for Flutter



## 参考にさせていただいたサイト
* [Building Beautiful UIs with Flutter](https://codelabs.developers.google.com/codelabs/flutter/index.html?index=..%2F..%2Findex#0)
* [Firebase と Flutter を使ってみる](https://firebase.google.com/docs/flutter/setup?hl=ja)
