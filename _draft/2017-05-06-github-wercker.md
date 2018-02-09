---
title: "HUGOで作成したコンテンツをWerckerCIでビルドしてgithub pagesにブログとして公開する"
description: "WerckerCIを使用してHUGOで作成された静的サイトをgithub pagesに適用してブログを公開します"
date: 2017-05-06 23:56:00 +0900
categories: blog
tags: hugo blog site github WerckerCI
permalink: /blog/hugo/publish-to-github/werckerci
---

[前回の記事]({{ site.baseurl }}{% post_url 2010-05-05-hugo %})
でHUGOを用いた静的サイトの生成ができるようになりました。
今回はHUGOで生成したコンテンツをCIサービスを経由してgithub pageでホスティングできるようにしたいと思います。
`jekyll` の場合はgithub pagesでそもそも使用されているため、jekyllを使用したリポジトリを`git push`するだけでよいのですが、HUGOの場合には別途公開するための準備が必要ということです。

* Table Of Contents
{:toc}

## ゴール
* WerckerCI を使用してHUGOの静的サイトのビルドを自動化する
* github pagesでホスティングできるようにする

## 事前準備
始める前に、以下を予め作成及びインストールしておく必要があります。
* githubアカウント
    * github上にHUGOで作成したコンテンツのリポジトリがあるものとする
* Wercker CIアカウント
    * githubアカウントと連携させておく 
* git

## .gitignoreに成果物ディレクトリを追加する
HUGOでコンテンツをビルドした際、デフォルトで `publish` ディレクトリが成果物の生成ディレクトリになりますので、`.gitignore` に追加をして除外しておきます。

```
echo '/publish' >> .gitignore
```

## WerckerCIでビルドする
### wercker.yml の作成




## まとめ


## 参考にさせていただいたページ
* [Hugo + Github Pages + Wercker CI = ¥0（無料）でコマンド 1 発（自動化）でサイト・ブログを公開・運営・分析・収益化](http://qiita.com/yoheimuta/items/8a619cac356bed89a4c9)
* [Automated deployments with Wercker](http://gohugo.io/tutorials/automated-deployments/)