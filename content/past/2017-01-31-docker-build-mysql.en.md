---
title: "Create a Docker image with docker build command"
description: "Introduce how to use docker build command, docker run, and launch the container"
date: 2017-01-31
thumbnail: /images/icons/docker_icon.png
categories:
    - docker
tags:
    - docker
url: /en/docker/image/build
twitter_card_image: /images/icons/docker_icon.png
---

This post is a personal note for building mysql container using Docker.

## Update Docker daemon

In my case, the version of docker was old, so I downloaded docker for Mac from the [official website](https://www.docker.com/products/docker#/mac) and updated docker daemon.

Check docker version.

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

## Edit Dockerfile

Create a simple Dockerfile as follows and place it at the project root.

I use [offical mysql image](https://github.com/docker-library/docs/tree/master/mysql) in this time.

{{< highlight vim "linenos=inline" >}}
FROM mysql
MAINTAINER soudegesu

RUN echo "finished setup !!"

{{< / highlight >}}

## Build docker image

I ran the command at project root where the Dockerfile was located, docker should recognize Dockerfile.

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
...
{{< / highlight >}}

## Start docker container

Start container with `docker run` command. 
The following CLI options are often used for operating inside the container after the container startup.

* `-i` ：Keep STDIN open even if not attached
* `-t` ：Allocate a pseudo-TTY

{{< highlight bash "linenos=inline" >}}
docker run -it soudegesu/mysql:0.0.1 /bin/bash

root@08671cc122c7:/#

{{< / highlight >}}

I can see that the official mysql docker image is running on Moby Linux.

{{< highlight bash "linenos=inline" >}}
root@0e512378b63d:/# cat /proc/version

Linux version 4.9.4-moby (root@1d811a9194c4) (gcc version 5.3.0 (Alpine 5.3.0) ) #1 SMP Wed Jan 18 17:04:43 UTC 2017
{{< / highlight >}}

Check whether the `mysql` command can be used. An error occurred.

{{< highlight bash "linenos=inline" >}}
root@08671cc122c7:/# mysql

ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)
{{< / highlight >}}

mysql is not running. I added the following CLI option and started it again.

{{< highlight bash "linenos=inline" >}}
docker run --name soudegesu -e MYSQL_ROOT_PASSWORD=soudegesu -d soudegesu/mysql:0.0.1
{{< / highlight >}}



