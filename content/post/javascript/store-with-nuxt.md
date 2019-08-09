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
