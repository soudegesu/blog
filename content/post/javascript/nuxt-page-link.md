---
title: "Nuxt.jsをはじめよう - nuxt-linkで画面遷移をする"
description: ""
date: "2019-08-09T06:51:05+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: "images/icons/nuxt_icon.png"
---

[前回の記事](/post/javascript/initialize-nuxt-projext/) では Nuxt.jsプロジェクトの初期化を行いました。
今回は [Nuxt.js](https://ja.nuxtjs.org/) で画面遷移や画面間でのデータ渡しをします。

<!--adsense-->

## 事前準備：画面を複数準備する

まずは **遷移元ページ** と **遷移先ページ** の2種類のページを作成します。
[Nuxt.js](https://ja.nuxtjs.org/) の場合、 `/pages` ディレクトリ内に任意のディレクトリと `.vue` ファイルを配置することで、そのファイルパスがURLの文字列になる仕様となっています。

今回は以下のように `index.vue` と `next.vue` を配置します。

```
pages
├── index.vue
└── next.vue
```

`index.vue` は以下

{{< highlight html "linenos=inline" >}}
<template>
<div>
  <div>Here is First Page</div>
</div>
</template>
{{</ highlight>}}

`next.vue` は以下のように実装します。

{{< highlight html "linenos=inline" >}}
<template>
<div>
    Here is Next page
</div>
</template>
{{</ highlight>}}

`npm run dev` でアプリケーションを起動し、 ブラウザから `http://localhost:3000/` `http://localhost:3000/next` に直接アクセスできれば準備はOKです。

<!--adsense-->

## 別画面に遷移する

`index.vue` の画面から `next.vue` の画面に遷移させるタグを書きましょう。

### アプリケーション内の遷移はnuxt-linkタグ

今回のケースではアプリケーション内のリンクになるので、 `<nuxt-link>` タグを使います。

`index.vue` を以下のように編集します。

{{< highlight html "linenos=inline" >}}
<template>
<div>
  <div>Here is First Page</div>
  <nuxt-link to="/next" > Go to Next</nuxt-link>
</div>
</template>
{{</ highlight>}}

`nuxt-link` の `to` で遷移先のパスを指定します。これだけです。

なお、 `<nuxt-link>` タグにはエイリアスがあって、 `<n-link>` `<NuxtLink>` `<NLink>` のいずれの書き方でも同じ動きをします。

### 別アプリケーションへの遷移はaタグ

外部サービスへのリンクはどうでしょうか。試しにgithubへの遷移を書いてみます。

{{< highlight html "linenos=inline" >}}
<template>
<div>
  <div>Here is First Page</div>
  <!-- ここ -->
  <nuxt-link to="https://github.io" > Go to Github</nuxt-link>
</div>
</template>
{{</ highlight>}}

この状態でリンクをクリックしてみると `http://localhost:3000/https:/github.io` に遷移して 404 Not Foundになります。
外部サービスへのリンクは、素直に `<a>` タグで実装する必要がありそうです。

<!--adsense-->

## nuxt-link のメリット

`a` タグではなく、 `nuxt-link` タグを使うメリットはいくつかあります。公式では以下のような説明があったので引用します。

> Nuxt.js アプリケーションの応答性を高めるため、viewport（ブラウザの表示領域）内にリンクが表示されたとき、
> Nuxt.js はコード分割されたページを自動的に先読みします

また、`nuxt-link` は Vue.jsにおける `router-link` を拡張したものであるため、`router-link` のメリットも享受できます。
`router-link` のメリットは以下のような記載がありました。

* HTML5のHistoryモードとハッシュモードの切り替えや、IE9のハッシュモードへの対応でも同じ書き方で対応できる
* HTML5のHistoryモードならイベントをフックできる
* HTML5のHistoryモードにおいて `base` オプションでコンテキストパスを指定して `to` 側での記載を省略する、といった使い方もできる  

## 参考にさせていただいたサイト

* [Nuxt.js - ユニバーサル Vue.js アプリケーション](https://ja.nuxtjs.org/)
* [router-link](https://router.vuejs.org/api/#router-link)