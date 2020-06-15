---
title: "ARMアーキテクチャのLinuxマシンでAWS CLI v2をインストールする"
description: "2020/01 にAWS CLI v2がGAになりました。今回は私がAWS CLI v2で少しハマったポイントを共有します。2020/05現在ではx86アーキテクチャのみ配布のインストーラでのインストールをサポートしており、ARMアーキテクチャ向けには提供されていないのです"
date: "2020-05-07T09:46:10+09:00"
categories:
  - "aws"
tags:
  - "aws"
isCJKLanguage: true
---

2020/01 にAWS CLI v2がGAになりました。今回は私がAWS CLI v2で少しハマったポイントを共有します。
なお、この情報は2020/05現在のものであり、いずれ変更される気がしています。

**→ 2020/6現在、確認したところARMもAWS CLI v2がサポートされていました。**

## 環境情報

- Jetson Nano
  - OSは Ubuntu 18.04

<!--adsense-->

## AWS CLI v2がインストールできない

[Linux での AWS CLI バージョン 2 のインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-prereq) ドキュメントを読むと、一連のインストール手順を知ることができます。

そんな中、インストール手順を完遂し、 `aws` コマンドを実行すると以下のメッセージが表示されました。

{{< highlight bash "linenos=inline" >}}
/usr/local/bin/aws: cannot execute binary file: Exec format error
{{</ highlight >}}

## ARMアーキテクチャの場合にはpipでインストールできる

実は 2020/05 現在では、AWS CLI v2のインストールファイルはx86アーキテクチャのマシン向けのものがzip形式で配布されているだけで、
ARMアーキテクチャのマシンには対応していません。Jetson NanoはARMアーキテクチャなのでインストールに失敗したわけです。

一方で、 [aws/aws-cliのissue](https://github.com/aws/aws-cli/issues/4943) を見たところ、
ARMアーキテクチャのマシンにてPythonの `pip` コマンドを使ってインストールしてい強者を発見しました。これでできるようです。

{{< highlight bash "linenos=inline" >}}
pip install git+https://github.com/boto/botocore.git@v2 --upgrade
pip install git+https://github.com/aws/aws-cli.git@v2 --upgrade
{{</ highlight >}}

しかし、AWS CLI v2の利点の一つでもある **インストール作業時にPythonに依存しない** という点を逸脱している感があるので、
どうしても試してみたい方は `pip` コマンドでインストールしてみてはいかがでしょうか。

## 参考にさせていただいたサイト

- [Linux での AWS CLI バージョン 2 のインストール](https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-prereq)
