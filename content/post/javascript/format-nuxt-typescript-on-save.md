---
title: "Nuxt.jsをはじめよう - ESLint+Prettierでコードをフォーマットする"
description: ""
date: "2019-08-19T08:27:57+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: images/icons/nuxt_icon.png"
---

[前回の記事](/post/javascript/write-nuxt-with-typescript/) ではTypeScriptで [Nuxt.js](https://ja.nuxtjs.org/) のコードを書き直しました。
今回は [ESLint](https://eslint.org/) と [Prettier](https://prettier.io/) によってコードフォーマットを適用します。

<!--adsense-->

## コードをきれいに保つ

コードフォーマッターやLinterの利用はJavaScriptのプロジェクトでは一般的になってきました。
今まで作ってきた [Nuxt.js](https://ja.nuxtjs.org/) のプロジェクトにおいても、コードフォーマッターやLinterの設定を施したいと思います。

[ESLint](https://eslint.org/) はソースコード静的解析し、良くない書き方を警告してくれるLinterです。
また、[Prettier](https://prettier.io/) はルールに則ってソースコードを整形してくれるコードフォーマッターです。

Linterとコードフォーマッター間の設定ルールを統一しておくことでと、特に複数人で開発するシーンでは、個々人のソースコードの書き方の差分を補正してくれるため大変重宝します。
逆にLinterとコードフォーマッター間のルールがずれていると、常にLinterから警告が出続けることとなり開発スピードを落とすことになりかねませんので注意しましょう。

それではさっそく設定していきます。

## ESLintとPrettierのルールをインストール


## 設定の追加


## Visual Studio Codeの設定


## 参考サイト

* [ESLint](https://eslint.org/)
* [Prettier](https://prettier.io/)
* [開発ツール](https://ja.nuxtjs.org/guide/development-tools/)