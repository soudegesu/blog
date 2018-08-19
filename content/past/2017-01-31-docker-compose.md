---
title: "docker-composeを使ってmysql dockerコンテナを起動する"
description: "docker-composeコマンドを使用して、mysqlのdockerコンテナ起動をやってみます。"
date: 2017-01-31
categories: 
  - docker
  - docker-compose
# permalinks: /docker/docker-compose/mysql
---

前回の記事で `docker build` からの `docker run` コマンドを使用することでmysqlのdockerコンテナの起動ができました。

個人的にはcliのオプション指定が長くなっていくのがあまり好きではないので、今回はdocker-composeを使用して、もう少しお手軽に起動にこぎつけたいと思います。

## docker-compose をインストールする
以下のサイトからdocker-toolboxをインストールしましょう。
その中にdocker-composeも含まれています。

[https://www.docker.com/products/docker-toolbox:embed:cite]

そもそもdocker-composeは複数のコンテナ管理を容易に行う機能を提供してくれるものです。今回はmysqlコンテナでしか利用しませんが、システムコンポーネントの設定や起動順序の制御をyamlファイルに記載するだけで良いので、可読性が高く、VCSでも管理がしやすいです。

例えば、以下のようなDockerfileがあったとします。

```
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
```

それを呼び出すdocker-compose.ymlを作成します。

```
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
```

dockerfileの箇所に作成したDockerfileを指定しておくことで、起動時にimageをビルドし、そのイメージを使ってコンテナを起動します。

なお、mysqlの公式のコンテナの場合、コンテナ内のdocker-entrypoint-initdb.dをホスト上の任意のディレクトリを対象としてアタッチすることで、起動時にディレクトリ配下のsqlを流し込んで初期化してくれます。

## docker-compose で起動する
それでは起動してみましょう。

```
#docker-compose up                                                                                                                                                
Starting soudegesu_mysql_1
Attaching to soudegesu_mysql_1
mysql_1  | 2017-01-31T07:09:28.026908Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
mysql_1  | 2017-01-31T07:09:28.038354Z 0 [Note] mysqld (mysqld 5.7.17) starting as process 1 ...
mysql_1  | 2017-01-31T07:09:28.053912Z 0 [Note] InnoDB: PUNCH HOLE support available
mysql_1  | 2017-01-31T07:09:28.054031Z 0 [Note] InnoDB: Mutexes and rw_locks use GCC atomic builtins
mysql_1  | 2017-01-31T07:09:28.054043Z 0 [Note] InnoDB: Uses event mutexes
mysql_1  | 2017-01-31T07:09:28.054055Z 0 [Note] InnoDB: GCC builtin __atomic_thread_fence() is used for memory barrier
〜以下略〜
```

mysqlコマンドで接続してみます。

```
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

```

できました。
起動時のsqlファイルの実行結果も確認しましょう。

```
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
```


```
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

```

## ちなみに
既存のimageを使用して `docker-compose up` を実行することも可能です。場合に応じて設定を変更してください。

```
mysql:
  image: mysql:latest ←これ
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
```
