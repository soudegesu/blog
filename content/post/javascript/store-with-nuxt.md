---
title: "Nuxt.jsをはじめよう - Vuexを使ってデータを渡す"
description: "URLのクエリパラメータやパスパラメータでデータを渡すのではなく、Vuexを使ってデータを渡します。actionからmutationを呼び出し、mutationでstateのデータを保存します。Vuexはモジュールモードを使っています。"
date: "2019-08-09T11:02:16+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: "images/icons/nuxt_icon.png"
---

[前回の記事](/post/javascript/send-and-recieve-data-in-nuxt/) ではクエリパラメータやパスパラメータを使って画面間のデータの受け渡しについて紹介しました。今回は [Vuex](https://vuex.vuejs.org/ja/) を使ってデータの受け渡しを行いたいと思います。

<!--adsense-->

## Vuexとは

[Vuex](https://vuex.vuejs.org/ja/) は複数のコンポーネント間で状態を共有するために使われる状態管理のライブラリです。
Vueのコンポーネントから状態管理の部分を[Vuex](https://vuex.vuejs.org/ja/)側に寄せることで、コンポーネント間のプロパティ渡しの連鎖による複雑さを回避できます。そのために [Vuex](https://vuex.vuejs.org/ja/) が定めた状態管理のルールに従ってコードを書く必要があります。

## storeディレクトリ配下にモジュールを配置する

[Nuxt.js](https://ja.nuxtjs.org/) では `Vuex`ストアは `store` ディレクトリ配下にファイルを配置することで管理ができます。ここでは  `./store/next.js` として以下のファイルを作成するのですが、[Nuxt.js](https://ja.nuxtjs.org/)では `store`ディレクトリ配下のパスがストアに名前空間を与えます。つまり `next` という名前空間になります。

{{< highlight javascript "linenos=inline" >}}
export const state = () => ({
    pageName: ''
})

export const actions = {
    add ({commit}, value) {
        commit('addPageName', value)
    }
}

export const mutations = {
    addPageName (state, value) {
        state.pageName = value
    }
}
{{</ highlight >}}

`state` では実際に保持される状態を定義し、`mutations` には `state` の変更処理を書きます。 また `actions` にはバックエンドサーバ等からデータを取得する処理に加えてミューテーションをコミットする処理を書きます。 

<!--adsense-->

## componentからactionを呼び出す

定義された `Vuex` ストアを使いましょう。コンポーネント側から状態を更新するときには `action` を呼び出します。
以下では `Go to Next` のリンク押下のタイミングにて `add` 関数が呼び出され、そのタイミングにて `next` という名前空間のストアにある `add` actionに処理が渡されます。

これにより `pageName` というstateに `next` という文字列が格納されます。

{{< highlight html "linenos=inline" >}}
<template>
<div>
  <div>Here is First Page</div>
  <nuxt-link to="/next" @click.native="add('next')" > Go to Next</nuxt-link>
</div>
</template>

<script>
export default {
  methods: {
    add(value) {
      this.$store.dispatch('next/add', value)
    }
  }
}
</script>
{{</ highlight >}}

<!--adsense-->

## 別のコンポーネントでStateを参照する

最後に別のコンポーネントから更新されたstateを確認します。 `<template>` ブロック内で `$store.state.名前空間.状態名` でアクセスすることができます。

{{< highlight html "linenos=inline" >}}
<template>
<div>
    Here is Next page
    <div>
    {{ $store.state.next.pageName }} 
    </div>
</div>
</template>
{{</ highlight >}}

<!--adsense-->

## 使ってみた感想

[Vuex](https://vuex.vuejs.org/ja/) の構造や思想は `Flux` や `Redux` から影響を受けていることもあり、これらの利用経験がある人は理解がスムーズにいくでしょう。
[Nuxt.js](https://ja.nuxtjs.org/) では標準で [Vuex](https://vuex.vuejs.org/ja/) が組み込まれています。内部的に `Vuex.Store` のインスタンスを作成してくれているので、必要な最低限コードを書けば良い状態にしてくれているのは秀逸ですね。
