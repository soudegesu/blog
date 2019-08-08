---
title: "AWS CodeCommitからgit cloneする方法"
description: ""
date: "2019-08-08T12:49:50+09:00"
thumbnail: "/images/icons/codecommit_icon.png"
categories:
  - "aws"
tags:
  - "aws"
  - "codecommit"
isCJKLanguage: true
twitter_card_image: /images/icons/codecommit_icon.png
---

AWS CodeCommitを使うプロジェクトに参画する機会があり、使い方を備忘録としてまとめようと思います。

<!--adsense-->

## CodeCommitからgit cloneしたい

AWSコンソールからCodeCommitを選択し、リポジトリの `Clone URL` メニューからURLをクリップボードにコピーをします。

{{< figure src="/images/20190808/clone_codecommit.png" class="center" >}}

その後、 `git clone ${URL}` をするとリポジトリをcloneできるかと思いきや、CodeCommitの場合には事前にもうひと手間必要なのです。

## credentialsとgit configの編集

まず、リポジトリはCodeCommit上にあるので、AWSリソースへのアクセス権限が必要です。
AWSコンソールのIAMのメニューからCodeCommitへアクセス可能なユーザのアクセスキーを取得し `~/.aws/credentials` に記載します。

{{< highlight bash "linenos=inline" >}}
[${プロファイル名}]
aws_access_key_id = ${ACCESS_KEY_ID}
aws_secret_access_key = ${SECRET_ACCESS_KEY}
region = ${REGIOIN}
{{< / highlight >}}

その後、 `git config` コマンドでgitの設定を書き換えます。

{{< highlight bash "linenos=inline" >}}
git config --global credential.helper "!aws codecommit --profile ${プロファイル名} credential-helper $@"
git config --global credential.UseHttpPath true
{{< / highlight >}}

これで `git clone ${URL}` ができるようになります。

<!--adsense-->

## エラーメッセージが出た場合の対処

`git clone ${URL}` 時に以下のようなエラーに出くわしました。

{{< highlight bash "linenos=inline" >}}
git: 'credential-aws' is not a git command. See 'git --help'.
{{< / highlight >}}

この場合、`git config` コマンドでの設定が失敗している可能性があります。 `.gitconfig` の内容を確認します。

{{< highlight vim "linenos=inline" >}}
vi ~/.gitconfig
{{< / highlight >}}

`credential` のブロックで `git config --global` で設定した内容が正しく指定されているかを確認しましょう。

{{< highlight vim "linenos=inline" >}}
[credential]
	helper = "!aws codecommit --profile ${PROFILE名} credential-helper $@"
	UseHttpPath = true
{{< / highlight >}}

