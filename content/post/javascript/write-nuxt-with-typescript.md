---
title: "Nuxt.jsをはじめよう - TypeScriptでコードを書く"
description: "Nuxt.jsのコードをTypeScriptで書いてみましょう。Configファイルの設定の仕方やコンポーネントの書き方など。"
date: "2019-08-13T14:11:17+09:00"
thumbnail: "images/icons/nuxt_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "nuxtjs"
isCJKLanguage: true
twitter_card_image: "images/icons/nuxt_icon.png"
---

[前回の記事](/post/javascript/store-with-nuxt/) では [Vuex](https://vuex.vuejs.org/ja/) を使った状態管理の仕方を書きました。
今回は[Nuxt.js](https://ja.nuxtjs.org/)のコードをTypeScriptで書くための設定や書き方などを紹介します。

<!--adsense-->

## Nuxt.jsのTypeScriptサポート

[Nuxt.js](https://ja.nuxtjs.org/) ではTypeScriptをサポートしています。JavaScriptを使った開発において、TypeScriptは静的な型付けをしてくれる言語であるため潜在的なエラーをコーディング段階で排除できることから人気があります。

[公式でもTypeScriptのサポートを謳って](https://ja.nuxtjs.org/guide/typescript) おり、今回はそれを参考にしつつTypeScriptへの書き換えを行っていきましょう。

なお、2019/08現在では `npx create-nuxt-app` コマンドを通じてTypeScriptプロジェクトを生成することはできないので、手動で設定を追加していく必要があります。

## TypeScriptのモジュールインストール

まずはTypeScriptをトランスパイルするためにモジュールをインストールします。

{{< highlight bash "linenos=inline" >}}
npm i -D @nuxt/typescript
npm i ts-node
npm i -S vue-property-decorator
{{</ highlight >}}

[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) は公式から提供されたモジュールではないのですが、Nuxt.jsの公式が使うことを推奨しているモジュールのためインストールしておきます。このモジュールにより、`.vue` ファイルの `<script>` ブロックをよりClassっぽく書くことができます。

<!--adsense-->

## Configファイルの書き換え

次に、プロジェクトルートに `tsconfig.json` ファイルを作成します。
既にファイルが存在する場合は省略して構いません。

{{< highlight bash "linenos=inline" >}}
touch tsconfig.json
{{</ highlight >}}

次にプロジェクトルートにある `nuxt.config.js` を `nuxt.config.ts` にリネームを行います。

{{< highlight bash "linenos=inline" >}}
mv nuxt.config.js nuxt.config.ts
{{</ highlight >}}

その後、`nuxt.config.ts` の内で `NuxtConfiguration` 型の定数をexportしてあげます。この `config` の中に `nuxt.config.js` の中身をそのままコピーしてあげれば良いです。

{{< highlight javascript "linenos=inline" >}}
import NuxtConfiguration from '@nuxt/config'

const config: NuxtConfiguration = {
// ここに中身を引っ越す
}
export default config;
{{</ highlight >}}

<!--adsense-->

## Vueコンポーネントの書き換え

次にVueコンポーネントを書き換えます。まずは `<script>` ブロックに `lang="ts"` を追加してTypeScriptであることを教えてあげます。

{{< highlight javascript "linenos=inline" >}}
<script lang="ts">
{{</ highlight >}}

次にClassを実装してexportします。ざっくりサンプルを記載します。
以下のコードではTypeScript化にしたことでスッキリした点を記載します。

* `@Component(components:〜)` によって依存するVueコンポーネントを完結に記載できる
* `<template>` ブロック内で呼び出す関数はClass内の関数として定義できる
* 依存する `Vuex` ストアも明示的にimportするので理解しやすい
* TypeSafeな実装にすることができる

{{< highlight javascript "linenos=inline" >}}
<template>
  <div class="container">
    <div class="columns">
      <Monitor />
      <Menu />
    </div>
    <Msg :message="initMsg" />
    <div class="buttons are-medium">
      <a class="button is-primary is-outlined" @click="regist('A')" >A</a>
      <a class="button is-link is-outlined" @click="regist('B')">B</a>
      <a class="button is-info is-outlined" @click="regist('C')">C</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { userModule } from '@/store/modules/user'

@Component({
  components: {
    Monitor: () => import('../components/Monitor.vue'),
    Menu: () => import('../components/Menu.vue'),
    Msg: () => import('../components/Msg.vue')
  }
})
export default class Next extends Vue {
  initMsg: string = 'Welcome to netx page!!'

  public async regist(value) {
    await userModule.save()
    this.$router.push('/users/')
  }
}
</script>

{{</ highlight >}}

注意点としては、`@Component` アノテーションの中では `computed` や `methods` といったパラメータも受け付けられるので、アノテーション中に処理をモリモリ書いていくとTypeScriptにした旨味が減るように思います。

若干学習コストを払いますが [vue-property-decoratorのdoc](https://github.com/kaorun343/vue-property-decorator) を読みながらClassで書く方法を模索すると良いです。

<!--adsense-->

最後にStoreのコードもTypeScript化してみます。ここでは [vuex-module-decorators](https://github.com/championswimmer/vuex-module-decorators) を使って書いていますが、このモジュールは[vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) と違ってNuxt.jsの公式から推奨されているわけではないので、利用するかどうかはおまかせします。


{{< highlight javascript "linenos=inline" >}}
import { VuexModule, Module, Action, Mutation, getModule,} from 'vuex-module-decorators';
import store from "@/store/store"
import axios from 'axios';

export interface User {
  name: string
}

interface UserState {
  users: Array<User>;
}

@Module({ dynamic: true, store, namespaced: true, name: 'user'})
class UserModule extends VuexModule implements UserState {

  users: Array<User> = [];

  get all(): Array<User> {
    return this.users;
  }

  @Mutation
  updateUser(users: Array<User>): void {
    this.users = users
  }

  @Action({})
  async save() {    
    const users = await axios.get<Array<User>>(process.env.apiBaseUrl + '/users')
    this.updateUser(users.data)
  }
}
export const userModule = getModule(UserModule)
{{</ highlight >}}

## 参考にさせていただいたサイト

* [TypeScript サポート](https://ja.nuxtjs.org/guide/typescript)
