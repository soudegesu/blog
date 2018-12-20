---
title: "ブログをJekyllからHugoへ移行した理由と移行手順"
description: "このブログは Github Pages でホスティングされています。先日、このブログのサイトジェネレータをJekyllからHugoに変更しました。実行に移した経緯と手順を紹介します。"
date: "2018-08-22T08:00:34+09:00"
thumbnail: "/images/icons/hugo_icon.png"
categories:
  - "blog"
tags:
  - "hugo"
isCJKLanguage: true
twitter_card_image: https://www.soudegesu.com/images/icons/hugo_icon.png
---

このブログは Github Pages でホスティングされています。
先日、このブログのサイトジェネレータを [Jekyll](https://jekyllrb.com/) から [Hugo](https://gohugo.io/) に変更しました。
実行に移した経緯と手順を紹介します。

<!--adsense-->

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

ページレイアウトの修正や設定ファイルからのパラメータを渡しなどのカスタマイズ実装が [Hugo](https://gohugo.io/) の方が簡単でした。

[Hugoの公式ドキュメント](https://gohugo.io/) はYoutubeのハンズオン動画も掲載されるなど、初心者にもとっかかりのよいコンテンツ構成に劇的に進化していることも一役買っていると思います。

かつて [Jekyll](https://jekyllrb.com/) のレイアウトのカスタマイズを試みたのですが、欲しい情報になかなかたどり着かず、泥沼にはまり大変苦労したのはいい思い出です。

<!--adsense-->

## 移行手順

次に、移行手順とハマりポイントを書いていきます。

### Jekyllからのマイグレーションコマンドを使う


[Hugo](https://gohugo.io/) には [Jekyll](https://jekyllrb.com/) の [コンテンツをマイグレーションするためのコマンド](https://gohugo.io/commands/hugo_import_jekyll/) が用意されています。素晴らしい。

{{< highlight bash "linenos=inline" >}}
hugo import jekyll --forece ${Jekyllプロジェクトのパス} ${Hugoプロジェクトのパス}
{{< / highlight >}}

実行すると、[Hugo](https://gohugo.io/) の基本的なフォルダ構成が生成され、今まで書いたコンテンツも `${Hugoプロジェクトのパス}/content/post` に展開されます。

### 好きなテーマを入れる

[Hugo Themes](https://themes.gohugo.io/) から好きなテーマを探して、 `${Hugoプロジェクトのパス}/themes` ディレクトリ内で `git clone` してあげれば良いです。
超簡単です。

テーマのリポジトリのREADMEファイルに `config.toml(.yaml)` の書き方も記載されていたので、タブの改良やGoogle Analyticsのコードも設定していきます。

### shortcodes に合わせた書き方に変更する

`hugo import` コマンド実行後に 「 `hugo server --theme=herring-cove` でビルドしてみてね！」 と表示されるのですが、これを実行するとビルドに失敗します。

1つはオプションで指定している `--theme=herring-cove` が存在しないことなので簡単な話なのですが、

もう1つは [Jekyllの使っているLiquid template](https://shopify.github.io/liquid/) を [Hugoのshortcodes](https://gohugo.io/content-management/shortcodes/) として解釈していたためであることがわかりました。

大きく分けると3パターンあったため、これを全ての記事ファイルに対して修正を行いました。

* Liquid template の {% row %} {% rowend %} がそのまま表示されてしまう
* Liquid template から呼び出していた Jekyll Plugin の箇所でエラー
* Liquid template で参照している変数が存在しない

### パーマリンクへの対応

デフォルトでは `${Hugoプロジェクトのパス}content/post` ディレクトリ配下のMarkdownファイルをビルドして記事を生成するのですが、 URLの構成もデフォルトでは `/post/${ディレクトリ名}/${ファイル名}` になってしまいます。

以前は `/${カテゴリ}/${ファイル名}` という構成のURLにしていたので、パーマリンクの対応が別途必要でした。

[URL Management](https://gohugo.io/content-management/urls/) と [Content Organization](https://gohugo.io/content-management/organization/) を参考に、 記事中のMarkdownファイル内で `url` プロパティを使うことでパーマリンクを設定します。

例えば以下のようになります。

{{< highlight vim "linenos=inline" >}}
---
title: "AMI作成のPackerプロジェクトのワタシ的ベストプラクティス！"
date: 2018-08-17
categories:
    - aws
tags:
    - aws
    - packer
url: /aws/my-packer-best-practice/
---
{{< / highlight >}}

### ディレクトリ構成の変更

[Jekyll](https://jekyllrb.com/) で作成した記事は、[Hugo](https://gohugo.io/) で今後作成するコンテンツとは別ディレクトリで管理した方が見通しが良さそうなので、
`hugo import` した記事は `${Hugoプロジェクトのパス}/content/past` というディレクトリに移動し、`config.toml` で `${Hugoプロジェクトのパス}/content/past` ディレクトリ配下もビルド対象にするように指定しました。

{{< highlight vim "linenos=inline" >}}
postSections = ["post", "past"]
{{< / highlight >}}

{{< highlight bash "linenos=inline" >}}
content --- post  # Hugoで作成した記事
         `- past  # 過去にJekyllで作成した記事
{{< / highlight >}}

これでようやくそれっぽくなりました。

## まとめ

今回は [Jekyll](https://jekyllrb.com/) から [Hugo](https://gohugo.io/) に変更した理由と手順をまとめました。

サイトのデザインも刷新されて、ビルド時間も **60ms前後** と爆速です。今の所不自由もないため、ブログを更新するモチベーションも維持できそうです。

やったぜ！
