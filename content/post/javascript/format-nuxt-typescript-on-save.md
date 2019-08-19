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

まずは、[ESLint](https://eslint.org/) と [Prettier](https://prettier.io/) をインストールします。

`npx create-nuxt-app` コマンドでプロジェクト初期化時する際に [ESLint](https://eslint.org/) と [Prettier](https://prettier.io/) を選択していると、必要なファイルやライブラリがインストールされた状態でスタートできます。

{{< highlight bash "linenos=inline" >}}
? Choose linting tools
❯◉ ESLint
 ◉ Prettier
 ◯ Lint staged files
{{< / highlight >}}

プロジェクト初期化時に設定をしておらず、後から追加したい場合には以下を実行すると良いでしょう。

{{< highlight bash "linenos=inline" >}}
npm install --save-dev babel-eslint eslint eslint-config-prettier eslint-loader eslint-plugin-vue eslint-plugin-prettier prettier
{{< / highlight >}}

次にルール適用に使うPluginをインストールします。


まずは [ESLint](https://eslint.org/) をTypeScriptや[Prettier](https://prettier.io/)と組み合わせて使うためのモジュールをインストールします。

{{< highlight bash "linenos=inline" >}}
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
{{< / highlight >}}

次にTypeScriptの型定義をインストールします。

{{< highlight bash "linenos=inline" >}}
npm i -D @types/prettier @types/eslint-plugin-prettier @types/eslint @types/babel-core
{{< / highlight >}}

最後にルールをインストールします。

{{< highlight bash "linenos=inline" >}}
npm i -D @vue/eslint-config-prettier @vue/eslint-config-typescript
{{< / highlight >}}

## 設定ファイルの編集

次にインストールしたモジュールを使うための設定を行います。 `.eslintrc.json` に設定を行います。
`parser` に `vue-eslint-parser`、 `parserOptions` に `@typescript-eslint/parser` を追加し、 `extends` に外部のルールを設定していきます。個別にカスタマイズしたいルールは `rules` プロパティに記載していきます。

{{< highlight json "linenos=inline,hl_lines=7-19" >}}
{
  "root": true,
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "@typescript-eslint/parser"
  },
  "extends": [
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:vue/recommended",
    "@vue/prettier",
    "@vue/typescript"
  ],
  "plugins": ["vue"],
  "rules": {
    "semi": [2, "never"],
    "no-unused-vars": ["error", { "args": "none" }],
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "semi": false
      }
    ]
  }
}
{{< / highlight >}}

## Linterの実行

`package.json` ファイルに `lint` `lintfix` コマンドを追加します。

{{< highlight json "linenos=inline" >}}
  "scripts": {
    "lint": "eslint --ext .ts,.js,.vue --ignore-path .gitignore .",
    "lintfix": "eslint --fix --ext .ts,.js,.vue --ignore-path .gitignore .",
  }
{{< / highlight >}}

Lintを実行してみます。

{{< highlight bash "linenos=inline" >}}
npm run lint

/XXXXXXXXXX/api/routes/users.ts
   9:22  warning  Missing return type on function   @typescript-eslint/explicit-function-return-type
   9:33  warning  'next' is defined but never used  @typescript-eslint/no-unused-vars
  14:26  warning  Missing return type on function   @typescript-eslint/explicit-function-return-type
  14:37  warning  'next' is defined but never used  @typescript-eslint/no-unused-vars

/XXXXXXXXXX/nuxt.config.ts
  60:11  warning  Missing return type on function     @typescript-eslint/explicit-function-return-type
  60:12  warning  'config' is defined but never used  @typescript-eslint/no-unused-vars
  60:20  warning  'ctx' is defined but never used     @typescript-eslint/no-unused-vars

/XXXXXXXXXX/store/modules/user.ts
  28:20  warning  Missing return type on function  @typescript-eslint/explicit-function-return-type

✖ 8 problems (0 errors, 8 warnings)
{{< / highlight >}}

`eslint --fix` をラップした `npm run lintfix` コマンドによって、機械的に修正可能な警告は自動で修正できます。

## Visual Studio Codeの設定


## 参考サイト

* [ESLint](https://eslint.org/)
* [Prettier](https://prettier.io/)
* [開発ツール](https://ja.nuxtjs.org/guide/development-tools/)
* [Step by Stepで始めるESLint](https://qiita.com/howdy39/items/6e2c75861bc5a14b2acf)
