---
title: "Nuxt.jsをはじめよう - クエリパラメータやパスパラメータを使ってデータを渡す"
description: "Nuxt.jsのページ間でデータを受け渡す方法を紹介します。クエリパラメータやパスパラメータ、storeを使う方法などユースケースに合わせて選択します。今回はクエリパラメータやパスパラメータを使ってデータを渡します。"
date: "2019-08-09T08:31:36+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: "images/icons/nuxt_icon.png"
---

[前回の記事](/post/javascript/nuxt-page-link/) では画面遷移の仕方を紹介しました。
画面間でデータのを受け渡しをする方法を紹介します。[Nuxt.js](https://ja.nuxtjs.org/) というか [Vue.js](https://jp.vuejs.org/index.html) の仕様も含まれています。

<!--adsense-->

## 画面間でデータを渡す

画面間でデータの受け渡しをする方法はいくつかあります。URLのクエリパラメータで渡す方法やパスパラメータによる方法、またフレームワーク側でデータを保持する方法などです。[Nuxt.js](https://ja.nuxtjs.org/) においてこれらのやり方をまとめてみました。

### クエリパラメータを使う

URLのクエリパラメータとしてデータを取得したい場合には `$route` オブジェクトの `query` プロパティから取得ができます。

以下のように `pageName=next` というデータを `nuxt-link` から渡します。

{{< highlight html "linenos=inline" >}}
<nuxt-link to="/next?pageName=next" > Go to Next</nuxt-link>
{{</ highlight >}}

データを受け取る側では `<template>` ブロック内で `$route.query.パラメータ名` によってデータを取得できます。 

{{< highlight html "linenos=inline" >}}
<template>
<div>
    <div>
    {{ $route.query.pageName }} 
    </div>
</div>
</template>
{{</ highlight >}}

また、 `<script>` ブロック内でクエリパラメータを取得したい場合には `context` オブジェクトから取得することも可能です。 

{{< highlight html "linenos=inline" >}}
<script>
export default {
    asyncData (context) {
        console.log(context.query.pageName)
    },
    fetch(context) {        
        console.log(context.query.pageName)
    }
}
</script>
{{</ highlight >}}

<!--adsense-->

### パスパラメータを使う

次にURLのパスパラメータを使う方法です。[Nuxt.js](https://ja.nuxtjs.org/) では `pages` ディレクトリ配下のファイルパスがそのままページのURLとして採用されます。
しかし、ファイル名やディレクトリ名を `アンダースコアはじまりの名前で指定する` と、動的なパラメータであると認識してくれるのです。

例えば、 `pages` ディレクトリ配下に `_id/index.vue` ファイルを作成します。
`_id` はアンダースコアはじまりなので、ここが動的なパスパラメータとなります。

```bash
./pages
└── _id
   └── index.vue
```

`_id/index.vue` 内の `<template>` ブロックから参照するには `$route.params.パラメータ名` で指定します。

{{< highlight html "linenos=inline" >}}
<template>
    <div>
        ID is {{ $route.params.id }}
    </div>    
</template>
{{</ highlight >}}

`<script>` ブロック内でクエリパラメータを取得したい場合には `context` オブジェクトから取得することも可能です。 

{{< highlight html "linenos=inline" >}}
<script>
export default {
    asyncData (context) {
        console.log(context.params.id)
    },
    fetch(context) {        
        console.log(context.params.id)
    },
}
</script>
{{</ highlight >}}

## 参考にさせていただいたサイト

* [Nuxt.js - ユニバーサル Vue.js アプリケーション](https://ja.nuxtjs.org/)
* [ルーティング](https://ja.nuxtjs.org/guide/routing#%E5%8B%95%E7%9A%84%E3%81%AA%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0)