---
title: "はじめよう！Visual Studio Code Live Share！"
description: "Visual Studio Code Live Shareのセットアップ手順や、使ってみた感想をまとめました。"
date: "2019-06-07T08:07:14+09:00"
categories:
  - "vscode"
tags:
  - "vscode"
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

普段職場では、ペアプログラミングやモブプログラミングを目的に応じて使いけています。
今回は複数人での開発作業に新しい風を巻き起こすかもしれないツールを紹介します。

<!--adsense-->

## Visual Studio Code Live Shareとは

プログラミング向けのエディタとしてMicrosoftに開発された [Visual Studio Code](https://azure.microsoft.com/ja-jp/products/visual-studio-code/) があります。これの拡張機能として、Visual Studio Code Live Share が存在します。これはVisual Studio Codeでの共同作業を **複数人でリアルタイムに行うことを可能にした超便利拡張機能** です。

GSuiteやOffice365のようなオフィスワーク向けの共同作業機能は一昔まえから存在しましたが、開発に特化したツールでサポートされるのは2019年6月現在では希少だと思います。

## Live Share Extentionをインストールしてみる

早速インストールしてみましょう。
Visual Studio Codeを開き。左メニューから拡張機能のマーケットプレイスを開きます。ショートカットは `Shift + command + X` です。

そこで `Live Share` と入力するとフィルタされて出てきます。
`Live Share` と `Live Share Extention Pack` の2つをインストールしましょう。

![live_share_extention](/images/20190607/live_share_extention.png)

`Live Share Extention Pack` の方に含まれているのは、
音声共有機能、チャット機能、エディタの色を変更する拡張機能のようです。

![include_extention_pack](/images/20190607/include_extention_pack.png)

なお、デフォルトではインストールされませんが、Live Shareがオススメしているプラグインが他にもあります。
これらは適宜必要であれば入れてください。

![recommended_extentions](/images/20190607/recommended_extentions.png)

これでセットアップは終了です。簡単ですね。

<!--adsense-->


## Live Share を使ってみる

Live Shareを使ってみましょう。Visual Studio Code のフッターメニューにある `Live Share` を押してみます。

![footer_menu](/images/20190607/footer_menu.png)

するとおもむろにブラウザが起動し、サインイン画面が表示されます。

![sign_in](/images/20190607/sign_in.png)

好きなアカウントでサインインすると、フッターメニューのアイコンがセッション共有中のマークに変わるので、クリックしてみましょう。

![sharing_in](/images/20190607/sharing_in.png)

するとコマンドパレットが表示されますので `Invite Others` を選択します。すると自身のクリップボードにセッションに参加するための招待URLがコピーされます。

![sharing_menu](/images/20190607/sharing_menu.png)

招待URLの形式は `https://prod.liveshare.vsengsaas.visualstudio.com/join?XXXXXXXXXXXXXXXXXXXXXXXXXXXX` でした。
これを相手方に伝えて、参加してもらいます。

最後に適当なファイルを作成して、ファイルを編集してみましょう。

![workspace_master](/images/20190607/workspace_master.png)

セッションに参加している別のVisual Studio Codeからは以下のように見えていて、
セッション参加者の誰が編集しているかもわかります。

![workspace](/images/20190607/workspace.png)

<!--adsense-->

## Live Share が活きるユースケースを考える

Live Shareによって何ができるか考えてみました。

### リモートでのペア・モブプログラミング

音声の共有やチャット機能も付随していることから、リモートで他のエンジニアをサポートすることができます。
従来、ペアプログラミングやモブプログラミングは同一のロケーションで行うのが一般的でした。
画面共有ソフトを使って行うリモートでのプログラミングサポートもありますが、画面共有ソフトの画質やネットワーク品質に左右されることが多く、なかなか満足に行えませんでした。
Live Shareでは画面共有ソフトと違って動画像を送ってないので、遅延も少なくデータのやりとりができていると推測しています。

### テストコードの実装とプロダクションコードの並行した実装

同一ロケーションでのコーディングあっても、Live Shareが活きる場面がありそうです。
それがテストコードとプロダクションコードの並行実装です。

プロダクションコードを書くチームと、テストコードを書くチームの2チームを作って、同じセッションに参加する。
そしてお互いのコードを見ながら実装していく、というものです。
これは「設計を固めるためのテストコード」でも「プロダクションコードの振る舞いを固めるテストコード」でも、どちらでも使えそうですね。

<!--adsense-->

## 注意点

唯一難点があるとすると、**サインインのアカウントがGithubかMicrosoftアカウントのみしかサポートしていない** というものでしょう。これは致命的な気がしています。
企業で使うのであれば、Github Enterpriseを使っていたり、認証にActive Directoryを通しているケースもあるので、これらのサポートを期待しています。
（Githubのissueでは対応優先度は低いとの記載がありました）

### 参考にさせていただいたサイト

* [Visual Studio Live Share とは](https://docs.microsoft.com/ja-jp/visualstudio/liveshare/)