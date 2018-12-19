---
title: "Docker buildコマンドのimage作成〜コンテナ起動まで"
description: "Dockerfileとdocker buildコマンドを使用して、docker runでコンテナを起動するところまで行います。"
date: 2017-01-31
thumbnail: /images/icons/docker_icon.png
categories:
    - docker
tags:
    - docker
url: /docker/image/build
twitter_card_image: /images/icons/docker_icon.png
---

自宅PC(mac)で簡単なアプリケーションを作ろうと思い、Dockerを使ってmysqlを構築しようとした際の備忘録として残しておきます。

<!--adsense-->

## Dockerfile を作成する

まず、dockerのバージョンが古かったので、[公式サイト](https://www.docker.com/products/docker#/mac)からmac用のdockerを再度ダウンロードし、アップデートしておきます。

{{< highlight bash "linenos=inline" >}}
docker version

Client:
 Version:      1.13.0
 API version:  1.25
 Go version:   go1.7.3
 Git commit:   49bf474
 Built:        Wed Jan 18 16:20:26 2017
 OS/Arch:      darwin/amd64

Server:
 Version:      1.13.0
 API version:  1.25 (minimum version 1.12)
 Go version:   go1.7.3
 Git commit:   49bf474
 Built:        Wed Jan 18 16:20:26 2017
 OS/Arch:      linux/amd64
 Experimental: true

{{< / highlight >}}

以下のような簡単なDockerfileを作成し、プロジェクトのルートにおいておきます。
今回は[mysql公式のdocker image](https://github.com/docker-library/docs/tree/master/mysql)を使用することにしましょう。

{{< highlight vim "linenos=inline" >}}
FROM mysql
MAINTAINER soudegesu

RUN echo "finished setup !!"

{{< / highlight >}}

<!--adsense-->

## Dockerfile をビルドしてイメージを作成する

`docker build` コマンドを実行すると以下のようなエラーが出ました。

{{< highlight bash "linenos=inline" >}}
docker build -t soudegesu/mysql:0.0.1 .

Sending build context to Docker daemon 57.86 MB
Error response from daemon: The Dockerfile (Dockerfile) cannot be empty
{{< / highlight >}}

Dockerfileが配置されているディレクトリでコマンドを実行したので、Dockerfileを勝手に認識してくれるはずだったような。。
念のため、`-f` オプションを指定して、直接ファイルを指定してみたところ上手くいきました。

{{< highlight bash "linenos=inline" >}}
docker build -f ./Dockerfile -t soudegesu/mysql:0.0.1 .

Sending build context to Docker daemon 57.86 MB
Step 1/3 : FROM mysql
latest: Pulling from library/mysql
5040bd298390: Pull complete
(以下略)
{{< / highlight >}}

本当に先程のコマンドがNGだったのか怪しいので、docker imageを削除して、もう一度トライしてみましょう。

{{< highlight bash "linenos=inline" >}}
docker rmi soudegesu/mysql:0.0.1

Untagged: soudegesu/mysql:0.0.1
Deleted: sha256:5cdbd0f32baa9bd25e39532ae9e660e35c0d9e57740406536b05bb7dbfbd4226
Deleted: sha256:b60d4e0b4ad869c06c6e874095d813c5d91990f0266897163d714b201501b577

docker build -t soudegesu/mysql:0.0.1 .

Sending build context to Docker daemon 57.86 MB
Step 1/3 : FROM mysql
 ---> 7666f75adb6b
Step 2/3 : MAINTAINER soudegesu
 ---> Using cache
 ---> ebb2015c5850
Step 3/3 : RUN echo "finished setup !!"
(以下略)
{{< / highlight >}}

<!--adsense-->

## コンテナを起動して確認する

次に `docker run` コマンドでコンテナを起動しましょう。 コンテナ起動後にコンテナ内で操作を行う場合に以下のオプションは良く利用されます。
* -i：コンテナの標準入力を開きます
* -t：tty（端末デバイス）を確保します

{{< highlight bash "linenos=inline" >}}
docker run -it soudegesu/mysql:0.0.1 /bin/bash

root@08671cc122c7:/#

{{< / highlight >}}

OSを確認してみましょう。公式のmysqlのdocker imageはMoby Linuxを使っているようですね。

{{< highlight bash "linenos=inline" >}}
root@0e512378b63d:/# cat /proc/version

Linux version 4.9.4-moby (root@1d811a9194c4) (gcc version 5.3.0 (Alpine 5.3.0) ) #1 SMP Wed Jan 18 17:04:43 UTC 2017
{{< / highlight >}}

`mysql` コマンドが生きているか確認しましょう。

{{< highlight bash "linenos=inline" >}}
root@08671cc122c7:/# mysql

ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)
{{< / highlight >}}

このままだとコンテナを立ち上げただけなので、mysql自体起動していません。

実はdocker run する際に オプションを指定してあげる必要があるようです。

{{< highlight bash "linenos=inline" >}}
docker run --name soudegesu -e MYSQL_ROOT_PASSWORD=soudegesu -d soudegesu/mysql:0.0.1
{{< / highlight >}}



