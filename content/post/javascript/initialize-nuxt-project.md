---
title: "Nuxt.jsではじめるJavaScript - Nuxt.jsのプロジェクトを新規作成する"
description: "Nuxt.jsのプロジェクトを初期化して、WEBアプリケーションの開発を始めましょう。npxコマンドを使うことで簡単にプロジェクトの初期化ができます。"
date: "2019-08-08T08:32:35+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

[前回の記事](/post/javascript/start-project-with-nuxt/) では Nuxt.jsを使う前の注意点をかるっとまとめました。
今回は [Nuxt.js](https://ja.nuxtjs.org/) を使って新規プロジェクトの作成をやってみます。

<!--adsense-->

## 動作環境

* Node `12.4.0`
  * `npx` コマンドを使うためには Node `5.2` 以上が必要です。

## Nuxt.jsプロジェクトの新規作成

以下では `nuxt-test` という名前のプロジェクトを作成します。

{{< highlight bash "linenos=inline" >}}
npx create-nuxt-app nuxt-test
{{< / highlight >}}

コマンド実行後、プロジェクト初期化のための情報を聞かれるので対話形式で入力していきます。

UIフレームワークはいっぱい選択できるので迷ってしまいます。ぱっと目を通したところ、コンポーネントの多さで言えば [Buefy](https://buefy.org/)と[Element](https://element.eleme.io/) あたりが有用そうでした。

{{< highlight bash "linenos=inline" >}}
✨  Generating Nuxt.js project in nuxt-test
? Project name nuxt-test
? Project description My impressive Nuxt.js project
? Author name soudegesu
? Choose the package manager Npm
? Choose UI framework Buefy
? Choose custom server framework None (Recommended)
? Choose Nuxt.js modules Axios, Progressive Web App (PWA) Support
? Choose linting tools Prettier
? Choose test framework Jest
? Choose rendering mode Single Page App
{{< / highlight >}}

初期化が完了すると、最後にローカル環境の起動コマンドやテスト実行コマンドが表示されます。

{{< highlight bash "linenos=inline" >}}
🎉  Successfully created project nuxt-test

  To get started:

	cd nuxt-test
	npm run dev

  To build & start for production:

	cd nuxt-test
	npm run build
	npm run start

  To test:

	cd nuxt-test
	npm run test
{{< / highlight >}}

<!--adsense-->

## Nuxt.jsプロジェクトのローカル環境での起動

さっそく起動コマンドを実行してみましょう。

{{< highlight bash "linenos=inline" >}}
cd nuxt-test
npm run dev
{{< / highlight >}}

ブラウザで `http://localhost:3000` にアクセスします。

{{< figure src="/images/20190808/nuxt-test.png" class="center" >}}

[Buefy](https://buefy.org/) のデフォルト画面が表示されていればOKです。

## Nuxt.jsプロジェクトのディレクトリ構成

ディレクトリ構成を見てみましょう。[Nuxt.js](https://ja.nuxtjs.org/) がめっちゃ生成していることがわかります。

{{< highlight bash "linenos=inline" >}}
tree -L 1

.
├── README.md
├── assets
├── components
├── jest.config.js
├── layouts
├── middleware
├── node_modules
├── nuxt.config.js
├── package-lock.json
├── package.json
├── pages
├── plugins
├── static
├── store
└── test
{{< / highlight >}}

ディレクトリごとに配置すべきリソースは決まっているので、 それぞれの用途は [ディレクトリ構造 - Nuxt.js](https://ja.nuxtjs.org/guide/directory-structure) を見れば確認できます。

## 参考にさせていただいたサイト

* [Nuxt.js - ユニバーサル Vue.js アプリケーション](https://ja.nuxtjs.org/)
