---
title: "ブログをJekyllからHugoに移行した理由と苦労した点"
description: ""
date: "2018-08-22T08:00:34+09:00"
thumbnail: "/images/icons/hugo_icon.png"
categories:
  - "blog"
tags:
  - "hugo"
draft: true
isCJKLanguage: true
---

このブログは Github Pages でホスティングされています。
先日、このブログのサイトジェネレータを [Jekyll](https://jekyllrb.com/) から [Hugo](https://gohugo.io/) に変更しました。
実行に移した経緯と苦労した点を紹介します。

## そもそもなんでJekyllを使っていたか

「変更するくらいなら、最初からそれ使えよ」という話ではあるのですが、当時の私にもそれなりの考えがあったのです。

### 理由１： Githug PagesがJekyllのページをジェネレートしてくれるから

[Gitubの公式](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/) でも紹介されていますが、
[Jekyll](https://jekyllrb.com/) の設定を含んだリポジトリをGithub上にpushして、リポジトリの設定を変更するとGithub側でGithub Pagesを生成してくれます。

そのため、**自前でサイトをジェネレートして、生成されたコンテンツをcommitしてpushする** という手間が削減できるのです。この一手間を削減できることに旨味を感じていました。

### 理由２： テーマやプラグインが多かったから

[http://jekyllthemes.org/](http://jekyllthemes.org/) に [Jekyll](https://jekyllrb.com/) のテーマが掲載されているのですが、
それなりに充実していて、ぱっと使えるものが多かったのです。

## なんでHugoに変更しようと思ったか

次になぜ [Hugo](https://gohugo.io/) に変更しようと思ったかを書きます。

### 理由１： Github Pagesで使えないJekyllプラグインが必要になった

導入した後で気づいたのですが、 Github Pages使用可能なJekyll Pluginは [Adding Jekyll plugins to a GitHub Pages site](https://help.github.com/articles/adding-jekyll-plugins-to-a-github-pages-site/) に掲載されています。

最初は掲載されているプラグインで十分でした。
しかし、後から [Slideshare](https://www.slideshare.net/) のスライドを貼り付けるために [Oembed](https://oembed.com/)フォーマットに対応した [jekyll-oembed](https://github.com/18F/jekyll-oembed) プラグインを入れたり、国際化対応のために [jekyll-i18n](https://github.com/liamzebedee/jekyll-i18n) プラグインを入れたりと、欲望が湧いてきました。

サポート外のプラグインを使うには、Github側でのビルドを諦めるしかありません。
つまり、**ローカルマシン（ないしは何らかのビルド環境）上で生成したコンテンツをリポジトリにpushする** 必要があるのです。

これは当初Jekyllを採用した旨味が消えてしまうことになります。

### 理由２： Jekyllのビルドが遅くなった

`jekyll serve` コマンドを実行することで、下書きの出来栄え確認しながら編集することができます。
リポジトリに蓄積される記事の量が増えるにつれて **ビルドの時間が遅くなっていきました** 。
最近では1回ビルドするのに **30秒** 程度かかってしまうこともあり、ブログを書くモチベーションに影響してしまいました。

これはファイル保存の都度、全てのコンテンツをリビルドするのが直接的な原因だと思います。
ビルドに時間がかかることで有名な [Sass](https://sass-lang.com/) も使われています。

ひとつひとつ問題の切り分けを行うよりは、より高速な実行環境に切り替えた方が良いだろう、と考えました。

### 理由３： Hugoのテーマやプラグインが揃ってきた

以前 [Hugo](https://gohugo.io/) を検討していたときには、[Hugo](https://gohugo.io/) のバージョンも低く、
公開されているテーマも少なかったため、プロダクトとしての将来が不安だったのですが、最近ではかなり良くなりました。

### 理由４： ページレイアウトの修正が用意

ページレイアウトの修正や設定ファイルからのパラメータを渡すなどのカスタマイズ実装が [Hugo](https://gohugo.io/) の方が簡単でした。

そもそも、[Hugo](https://gohugo.io/) の公式ドキュメントにはYoutubeのハンズオン動画も掲載されるなど、初心者にもとっかかりのよいコンテンツ構成になっています。

かつて [Jekyll](https://jekyllrb.com/) のレイアウトのカスタマイズを試みたのですが、泥沼にはまり大変苦労したのはいい思い出です。

## 移行してみて苦労したこと

