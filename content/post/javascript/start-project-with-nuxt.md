---
title: "Nuxt.jsではじめるJavaScript - Nuxt.jsを使う前に気をつけたいこと"
description: "Nuxt.jsを使ってみて得られた知見を共有します。まずはNuxt.jsを使う前に気をつけたいことを説明します。"
date: "2019-08-07T08:38:55+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: /images/nuxt_icon.png
---

わけあって [Nuxt.js](https://ja.nuxtjs.org/) に触れる機会があったため、得られた知見やTipsをまとめていこうと思います。
まずは、[Nuxt.js](https://ja.nuxtjs.org/)を使う前に覚悟しておいてほしいことをまとめます。

<!--adsense-->

## すべては無茶振りから始まった

たいていのことは無茶振りから始まりますよね。今回もそうです。
受けた依頼は  **「非エンジニアがエンジニアの集団に放り込まれても話についていけるように鍛えてやってほしい。1ヶ月で。」** というものでした。まじかよ。

フロントやバックエンド含めて広範な知識をブートキャンプで教える必要があったため、カリキュラムの簡略化の意図もあってフロント側のフレームワークは [Nuxt.js](https://ja.nuxtjs.org/) を使うことにしました。

## Nuxt.jsって何よ

[Nuxt.js](https://ja.nuxtjs.org/) を知るにはまず [Vue.js](https://jp.vuejs.org/index.html) を知る必要があるので少し触れておきます。

2019年現在では、[Vue.js](https://jp.vuejs.org/index.html) は [Angular](https://angular.jp/) や [React](https://ja.reactjs.org/) と並んで有名なJavaScriptのフロントのフレームワークです。
[Vue.js](https://jp.vuejs.org/index.html) が提供してくれる仕組み、というかフレームワークとしてのルールは理解がしやすいこともあり、初心者でもとっつきやすいと言われています。
その後しばらく [Vue.js](https://jp.vuejs.org/index.html) でWEBアプリケーションの開発を進めていくと [Vue.js](https://jp.vuejs.org/index.html) 単体では機能的に物足りなくなってきます。
例えばルーティングやデータの受け渡しやページのメタ情報の設定などが該当しますが、それを補うために別のライブラリを追加インストールする必要が出てくるのです。

そんな「どうせ近々必要になるよね？」というライブラリも予め内包した形で [Vue.js](https://jp.vuejs.org/index.html) を提供してくれているのが [Nuxt.js](https://ja.nuxtjs.org/)です 。
[Nuxt.js](https://ja.nuxtjs.org/)ではCLIからプロジェクトの雛形を作成できたり、[Vue.js](https://jp.vuejs.org/index.html) の仕組みに [Nuxt.js](https://ja.nuxtjs.org/) としてのフレームワークのルールも開発者に強制するので、ルールに従うだけでプロジェクトの立ち上がりを早く行うことができます。

詳細は [公式](https://ja.nuxtjs.org/guide) を見ていただくと良いでしょう。

<!--adsense-->

## Nuxt.jsを使ってみて

長々と導入を書きましたが、本記事の主題はここです。 [Nuxt.js](https://ja.nuxtjs.org/) をしばらく使ってみてよかった点、そうでもなかった点を書いてみます。
なお、 [Nuxt.js](https://ja.nuxtjs.org/) というか [Vue.js](https://jp.vuejs.org/index.html) の話に寄ってしまう箇所もありますが、フレームワークが強依存してしいるため、まとめて記載している点はお許してください。

### 良かった点

#### プロジェクトの立ち上がりがまじで早い

まずはこれです。[Nuxt.js](https://ja.nuxtjs.org/) が提供するCLIで簡単にプロジェクトのセットアップができます。
自身のユースケースに応じたプロジェクトの設定を対話形式で選択していくだけで、どどーっとディレクトリが生まれます。そして後は `npm` なり `yarn` なりで起動すればOKです。

#### ディレクトリ構成のルールに準拠すれば良い

たいていのフレームワークの場合はルーティング設定を書く専用のファイルが存在しますが、[Nuxt.js](https://ja.nuxtjs.org/) では `pages` ディレクトリ配下に置かれたディレクトリやファイル名に準拠してURLのパスが構築されます。教える側としてはいちいちRouterの話をしなくていいので助かります。

#### 1ファイル内の構成の見通しが良い

vue-componentの仕様に従ってもりもり書いていくだけですから、ぱっと見わかりやすいです。

### そうでもなかった点

#### TypeScriptと相性が良くないかも

[公式ではTypeScriptのサポートが謳われています](https://ja.nuxtjs.org/guide/typescript/) が、実際使ってみると少しハマります。
TypeScriptで書いてみると、classの内部は実装がスカスカになるのに対して、アノテーション内部に実装が寄ってしまいます。
そうなってしまうならESで書いた方が全体的にスッキリするかな、という印象を持ちました。

ちなみにこの問題は `vue-property-decorator` や `vuex-module-decorators` などのライブラリを使うと緩和することができます。

#### 本格的なアプリケーション開発にはそれなりの勉強が必要

例えば状態管理部分がそうです。 ページ間やコンポーネント間のデータの受け渡しの方法はいくつかあるのですが、プロダクションレベルのアプリケーションを作るのであれば `Vuex` というライブラリを使うことになります。これはReactでいう `Redux` 的なやつで、データ受け渡しに関する作法があり、それなりに学習コストを必要とします。
[Vuexの公式](https://vuex.vuejs.org/ja/) でもその旨は記載されています。

> いつ、Vuexを使うべきでしょうか？
>
> Vuex は、共有状態の管理に役立ちますが、さらに概念やボイラープレートのコストがかかります。これは、短期的生産性と長期的生産性のトレードオフです。

<!--adsense-->

## 所感

「[Nuxt.js](https://ja.nuxtjs.org/) や [Vue.js](https://jp.vuejs.org/index.html) はシンプルで簡単だよ！」って話を良く聞いたので触ってみましたが、個人的にはそうでもないかなーという印象でした。
[Nuxt.js](https://ja.nuxtjs.org/) は初めてフロントのMVCフレームワークに挑戦する人への最初敷居はかなり低くめに設定されていますが、
その後の「やりたいことを実現するために学ぶこと」は[Angular](https://angular.jp/) や [React](https://ja.reactjs.org/)と大差がないので、
入り口の敷居が低かったぶん、学習コストの低さに対するイメージのギャップが相対的にハードに感じるかもしれません。
そう簡単に「簡単」って言っちゃいけないなーと思いました。

## 参考にさせてただいたサイト

* [Nuxt.js - ユニバーサル Vue.js アプリケーション](https://ja.nuxtjs.org/)
