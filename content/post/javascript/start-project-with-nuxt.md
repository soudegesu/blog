---
title: "Nuxt.jsではじめるJavaScript - Nuxt.jsを使う前に気をつけたいこと"
description: ""
date: "2019-08-07T08:38:55+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
draft: true
isCJKLanguage: true
twitter_card_image: /images/nuxt_icon.png
---

わけあって [Nuxt.js](https://ja.nuxtjs.org/) に触れる機会があったため、得られた知見やTipsをまとめていこうと思います。
まずは、[Nuxt.js](https://ja.nuxtjs.org/)を使う前に覚悟しておいてほしいことをまとめます。

## すべては無茶振りから始まった

たいていのことは無茶振りから始まりますよね。今回もそうです。
受けた依頼は  **「非エンジニアがエンジニアの集団に放り込まれても話についていけるように鍛えてやってほしい。1ヶ月で。」** というものでした。まじかよ。

フロントやバックエンド含めて広範な知識をブートキャンプで教える必要があったため、カリキュラムの簡略化の意図もあってフロント側のフレームワークは [Nuxt.js](https://ja.nuxtjs.org/) を使うことにしました。

## Nuxt.jsって何よ

[Nuxt.js](https://ja.nuxtjs.org/) を知るにはまず [Vue.js](https://jp.vuejs.org/index.html) を知る必要があるので少し触れておきます。

2019年現在では、[Vue.js](https://jp.vuejs.org/index.html) は [Angular](https://angular.jp/) や [React](https://ja.reactjs.org/) と並んで有名なJavaScriptのフロントのフレームワークです。
[Vue.js](https://jp.vuejs.org/index.html) が提供してくれる仕組み、というかフレームワークとしてのルールは理解がしやすいこともあり、初心者でもとっつきやすいと言われています。
WEBアプリケーションの開発を進めていくと [Vue.js](https://jp.vuejs.org/index.html) 単体では機能的に物足りなくなってきます。
例えばルーティングやデータの受け渡しやページのメタ情報の設定などが該当しますが、それを補うために別のライブラリを追加インストールする必要が出てくるのです。

[Nuxt.js](https://ja.nuxtjs.org/)は [Vue.js](https://jp.vuejs.org/index.html) をベースとして、先程の「どうせ近々必要になるよね？」というライブラリも予め内包した形で提供してくれています。
加えて、CLIからプロジェクトの雛形を作成できたり、[Vue.js](https://jp.vuejs.org/index.html) の仕組みに [Nuxt.js](https://ja.nuxtjs.org/) としてのフレームワークのルールも開発者に強制するので、ルールに従うだけで立ち上がりを早く行うことができます。

詳細は [公式](https://ja.nuxtjs.org/guide) を見ていただくと良いでしょう。

## Nuxt.jsを使ってみて

長々と導入を書きましたが、本記事の主題はここです。 [Nuxt.js](https://ja.nuxtjs.org/) をしばらく使ってみてよかった点、そうでもなかった点を書いてみます。
なお、 [Nuxt.js](https://ja.nuxtjs.org/) というか [Vue.js](https://jp.vuejs.org/index.html) の話に寄ってしまう箇所もありますが、フレームワークが依存してしまっているためまとめて記載している点お許してください。

### 良かった点

#### プロジェクトの立ち上がりがまじで早い

まずはこれです。[Nuxt.js](https://ja.nuxtjs.org/) が提供するCLIで簡単にプロジェクトのセットアップができます。
自身のユースケースに応じたプロジェクトの設定を対話形式で選択していくだけで、どどーっとディレクトリが生まれます。そして後は `npm` なり `yarn` なりで起動すればOKです。

#### ディレクトリ構成のルールに準拠すれば良い

たいていのフレームワークの場合ではルーティング設定を書く専用のファイルが存在しますが、[Nuxt.js](https://ja.nuxtjs.org/) では `pages` ディレクトリ配下に置かれたディレクトリやファイル名に準拠してURLのパスが構築されます。教える側としてはいちいちRouterの話をしなくていいので助かります。

#### 1ファイル内の構成の見通しが良い

vue-componentの仕様に従ってもりもり書いていくだけですから、ぱっと見わかりやすいです。

### そうでもなかった点

#### TypeScriptと相性が良くないかも

[公式](https://ja.nuxtjs.org/guide/typescript/) ではTypeScriptのサポートが謳われていますが、実際使ってみると少しハマります。
TypeScriptで書いてみると、classの内部は実装がスカスカでアノテーション内部に実装が寄ってしまいます。
そうなってしまうならESで書いた方が全体的にスッキリするかな、という印象を持ちました。

#### 本格的なアプリケーション開発にはそれなりの勉強が必要

例えば、状態管理部分がそうです。 `Vuex` というライブラリを使うことになるのですが、これはReactでいう `Redux` 的なやつで、それなりに学習コストがかかります。
[Vuexの公式](https://vuex.vuejs.org/ja/) でもその旨は記載されています。

> いつ、Vuexを使うべきでしょうか？
>
> Vuex は、共有状態の管理に役立ちますが、さらに概念やボイラープレートのコストがかかります。これは、短期的生産性と長期的生産性のトレードオフです。

「そりゃそうでしょ」

## 参考にさせてただいたサイト

* [Nuxt.js - ユニバーサル Vue.js アプリケーション](https://ja.nuxtjs.org/)
