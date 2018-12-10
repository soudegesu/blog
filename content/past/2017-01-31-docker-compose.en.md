---
title: "Start mysql docker container with docker-compose"
description: "Use the docker-compose command to start mysql's docker container"
date: 2017-01-31
thumbnail: /images/icons/docker_icon.png
categories:
  - docker
  - docker-compose
url: /en/docker/docker-compose/mysql
twitter_card_image: /images/icons/docker_icon.png
---

In the previous article, I can start mysql docker container by using the `docker run` command after executing `docker build`.

Personally, I like the lesser option of cli, so this time I'd like to start docker-compose a bit easier to start up.

## Install docker-compose

Let's install docker-toolbox from the following site.
Docker-compose is also included in the download.

* [https://docs.docker.com/toolbox/](https://docs.docker.com/toolbox/)

Docker-compose provides functions to easily manage multiple containers.
In this article, only mysql is started with a container, but since setting up system components and controlling the order of activation can only be described in yaml file, it is highly readable and easy to manage even with VCS.

For example, suppose you have the following `Dockerfile` .

{{< highlight vim "linenos=inline" >}}
FROM mysql:latest

RUN { \
   echo '[mysqld]'; \
   echo 'character-set-server=utf8'; \
   echo 'collation-server=utf8_general_ci'; \
   echo '[client]'; \
   echo 'default-character-set=utf8'; \
} > /etc/mysql/conf.d/charset.cnf

EXPOSE 3306
CMD ["mysqld"]
{{< / highlight >}}

Create a `docker-compose.yml` that uses `Dockerfile` .

{{< highlight yaml "linenos=inline" >}}
mysql:
  build: .
  dockerfile: Dockerfile
  ports:
    - "3306:3306"
  environment:
    - MYSQL_ROOT_USER=root
    - MYSQL_ROOT_PASSWORD=root
    - MYSQL_DATABASE=soudegesu
    - MYSQL_USER=soudegesu
    - MYSQL_PASSWORD=soudegesu
  volumes:
    - ./init.d:/docker-entrypoint-initdb.d
{{< / highlight >}}

By specifying the created `Dockerfile` as the `dockerfile` property of the yaml file, you can build the image in the startup phase and launch the container with the created image.

In the case of an official container of mysql, by attaching `docker-entrypoint-initdb.d` inside the container to an arbitrary directory on the host, sql in the directory is executed when the container is started, and the database is initialized.

## launch with docker-compose

Let's start it.

{{< highlight bash "linenos=inline" >}}
docker-compose up

Starting soudegesu_mysql_1
Attaching to soudegesu_mysql_1
mysql_1  | 2017-01-31T07:09:28.026908Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
mysql_1  | 2017-01-31T07:09:28.038354Z 0 [Note] mysqld (mysqld 5.7.17) starting as process 1 ...
mysql_1  | 2017-01-31T07:09:28.053912Z 0 [Note] InnoDB: PUNCH HOLE support available
mysql_1  | 2017-01-31T07:09:28.054031Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
mysql_1  | 2017-01-31T07:09:28.054043Z 0 [Note] InnoDB: Uses event mutexes
mysql_1  | 2017-01-31T07:09:28.054055Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
...
{{< / highlight >}}

Try connecting to the database with the `mysql` command.

{{< highlight bash "linenos=inline" >}}
mysql -h 127.0.0.1 -P 3306 -u root -proot
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.17 MySQL Community Server (GPL)

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>

{{< / highlight >}}

I did it.
Also check the execution result of sql at database startup.

{{< highlight bash "linenos=inline" >}}
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| soudegesu              |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
{{< / highlight >}}


{{< highlight bash "linenos=inline" >}}
mysql> use soudegesu;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+-----------------+
| Tables_in_soudegesu |
+-----------------+
| aaaa            |
| bbbb            |
+-----------------+
2 rows in set (0.00 sec)

{{< / highlight >}}

## Additional Information

You can also run the `docker-compose up` command using the existing container image.
If necessary, modify `docler-compose.yml` as follows.

{{< highlight yaml "linenos=inline, hl_lines=2" >}}
mysql:
  image: mysql:latest
  ports:
    - "3306:3306"
  environment:
    - MYSQL_ROOT_USER=root
    - MYSQL_ROOT_PASSWORD=root
    - MYSQL_DATABASE=soudegesu
    - MYSQL_USER=soudegesu
    - MYSQL_PASSWORD=soudegesu
  volumes:
    - ./init.d:/docker-entrypoint-initdb.d
{{< / highlight >}}
