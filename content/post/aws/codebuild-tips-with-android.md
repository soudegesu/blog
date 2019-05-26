---
title: "クラウド上でアプリをビルドしたい！CodeBuildでAndroidアプリをビルドするときのTips"
description: "CodeBuildでAndroidアプリをビルドする方法を紹介します。Android SDKが複数必要な場合にも対応しています。CodeBuildの標準出力を日本語化する場合の説明もあります"
date: "2019-05-27T09:22:45+09:00"
thumbnail: /images/icons/codebuild_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "codebuild"
  - "android"
isCJKLanguage: true
twitter_card_image: /images/icons/codebuild_icon.png
---

`CodeBuild` の小ネタです。AWS CodeBuildはyamlの定義に従ってビルド処理をマネージドサービスです。
今回はAndroidアプリをCodeBuildでビルドする時のTipsを紹介します。

<!--adsense-->

## ビルド対象のAndroid SDKを指定する

まず、Androidアプリをビルドする必要なのはAndroid SDKですね。
CodeBuildでのビルド時にもインストールされている必要がありますので、設定方法を説明します。

### AWS提供のイメージを使う

一番簡単なのが、AWSが提供しているコンテナイメージをそのまま使う方法です。
サポートされているイメージをAWS CLIで確認してみましょう。

{{< highlight bash "linenos=inline" >}}
aws codebuild list-curated-environment-images
{{</ highlight >}}

json形式でデータが返ってきます。中を見ると、コンテナのイメージ名が含まれていることがわかります。
（以下のサンプルでいうと、 `aws/codebuild/eb-java-7-amazonlinux-64:2.1.3` がそれにあたります。）
このイメージ名はCodeBuildの設定を行う際に使います。

{{< highlight json "linenos=inline" >}}
{
    "platforms": [
        {
            "platform": "AMAZON_LINUX",
            "languages": [
                {
                    "language": "JAVA",
                    "images": [
                        {
                            "name": "aws/codebuild/eb-java-7-amazonlinux-64:2.1.3",
                            "description": "AWS ElasticBeanstalk - Java 7 Running on Amazon Linux 64bit v2.1.3",
                            "versions": [
                                "aws/codebuild/eb-java-7-amazonlinux-64:2.1.3-1.0.0"
                            ]
                        },
(以下略)
{{</ highlight >}}


以前は `aws/codebuild/android-java-8:26.1.1`  のようにAndroidイメージが提供されていたのですが、少し仕様が変わったようですね。

[CodeBuild のビルド仕様に関するリファレンス](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#runtime-versions-buildspec-file) を確認すると、「 `ubuntu/standard/2.0` を使って、 `buildspec.yml` 内の `runtime-versions` で指定しなさい」と記載されているので、そのようにします。

{{< highlight yaml "linenos=inline" >}}
phases:
  install:
    runtime-versions:
      java: openjdk8
      android: 28
{{</ highlight>}}

ただし、`ubuntu/standard/2.0` が2019/05現在でサポートしているのはAndroid `28.x` なので、古いバージョンは指定できないことに注意が必要です。

### 複数のAndroid SDK、または古いSDKが必要な場合

CodeBuildがデフォルトで提供しているAndroid SDK 以外のバージョンを使いたい場合には、`buildspec.yml` 内で個別にインストールする必要があります。
以下では `install` フェーズに `sdkmanager` コマンドを使って任意のバージョンをインストールしています。
指定方法は `sdkmanager --list` で出力されたものに限ります。

{{< highlight yaml "linenos=inline" >}}
  install:
    commands:
      - sdkmanager --list
      - sdkmanager "build-tools;26.0.0"
{{</ highlight>}}

<!--adsense-->

## CodeBuildの標準出力を日本語化する

CodeBuildのジョブを設定した実際に動かしてみると、文字化けしていることがあります。
これはUbuntuのイメージの中に日本語化パックが入っていないことが原因なので、個別にインストールしましょう。

以下がサンプルコードです。 `language-pack-ja-base` や `language-pack-ja` をインストール後、有効化しています。

{{< highlight yaml "linenos=inline" >}}
phases:
  install:
    commands:
      - apt-get -y update
      - apt-get -y install language-pack-ja-base language-pack-ja
  pre_build:
    commands:
      - locale-gen ja_JP.UTF-8
      - /usr/sbin/update-locale LANG=ja_JP.UTF-8 LANGUAGE="ja_JP:ja"
      - export LANG=ja_JP.UTF-8
      - export LANGUAGE=”ja_JP:ja”
{{</ highlight>}}

## 参考にさせていただいたサイト

* [CodeBuild のビルド仕様に関するリファレンス](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html#runtime-versions-buildspec-file)