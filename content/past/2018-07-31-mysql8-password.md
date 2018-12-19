---
title: "MySQL 8のAnsibleハマりポイント（rootのパスワード変更とか）"
description: "MySQLのメジャーバージョン8が2018/4 にリリースされました。今回はPacker+Ansibleで MySQL8のAMIを作成しようとして苦労したところをまとめます。"
date: 2018-07-31
thumbnail: /images/icons/mysql_icon.png
categories:
  - mysql
tags:
  - mysql
  - ansible
  - packer
url: /mysql/mysql8-password/
twitter_card_image: /images/icons/mysql_icon.png
---

[MySQL](https://www.mysql.com/jp/) のメジャーバージョン `8` が 2018/4 にリリースされました。
今回はPacker+Ansibleで MySQL8のAMIを作成しようとして苦労したところをまとめます。

<!--adsense-->

## MySQL8のAMIを作りたい

普段、AWSを利用する上ではRDSを使うことが多いので、MySQL5.x系を選択することになります。
今回はMySQL8を使った研修を社内で実施するため、MySQL8のAMIを作る必要がありました。

## 環境情報

今回は以下のような環境で実施しています。

* CentOS 7
* Ansible 2.6.1
* Packer 1.1.3

<!--adsense-->

## playbookのサンプル

先に結論を書きます。
ansible playbookのサンプルは以下のようになりました。

なお、今回はメインのタスク定義の部分だけとし、その他の部分やPackerは冗長になるので割愛しています。

{{< highlight yaml "linenos=inline" >}}
---
- name: download epel-release
  yum:
    name: https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
    state: present
- name: delete mariadb
  yum:
    name: mariadb-libs
    state: removed
- name: install mysql
  yum:
    name: "{{ item }}"
    state: present
  with_items:
    - mysql-community-devel*
    - mysql-community-server*
    - MySQL-python
- name: copy my.cnf
  copy:
    src: ../files/etc/my.cnf
    dest: /etc/my.cnf
    mode: 0644
- name: enable mysql
  systemd:
    name: mysqld
    state: restarted
    enabled: yes
- name: get root password
  shell: "grep 'A temporary password is generated for root@localhost' /var/log/mysqld.log | awk -F ' ' '{print $(NF)}'"
  register: root_password
- name: update expired root user password
  command: mysql --user root --password={{ root_password.stdout }} --connect-expired-password --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY '{{ mysql.root.password }}';"
- name: create mysql client user
  mysql_user:
    login_user: root
    login_password: "{{ mysql.root.password }}"
    name: "{{ item.name }}"
    password: "{{ item.password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%'
  with_items:
    - "{{ mysql.users }}"
{{< / highlight >}}

<!--adsense-->

## ポイント解説

上から順番にポイントを解説していきます。

### mariadb-libsを削除する

CentOS 7にデフォルトでインストールされている mariadbのモジュールは削除しましょう。
MySQLインストール時にモジュールの競合を起こしてうまくいきません。

{{< highlight yaml "linenos=inline" >}}
- name: delete mariadb
  yum:
    name: mariadb-libs
    state: removed
{{< / highlight >}}

### MySQL-pythonをインストールする

ansibleで `mysql_user` モジュールを使いたい場合には **MySQL-python をプロビジョニング対象のサーバにインストールする** 必要があります。

なお、 `MySQL-python` はPython2上でしか動作しない点も注意してください。

{{< highlight yaml "linenos=inline" >}}
- name: install mysql
  yum:
    name: "{{ item }}"
    state: present
  with_items:
    - mysql-community-devel*
    - mysql-community-server*
    - MySQL-python # これ
{{< / highlight >}}

### MySQLのデフォルト認証プラグインの変更

MySQL8からセキュリティ強化の目的で、デフォルトの認証プラグインが変更されています。
詳しくは [ここ](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password) を読んでください。

そのため、以前の認証プラグインに変更するために `my.cnf` を修正する必要があります。

以下のように **default-authentication-plugin=mysql_native_password** を追記した `my.cnf` を準備し、

{{< highlight vim "linenos=inline" >}}
[mysqld]
default-authentication-plugin=mysql_native_password
{{< / highlight >}}

`/etc/my.cnf` にコピーしてあげます。

{{< highlight yaml "linenos=inline" >}}
- name: copy my.cnf
  copy:
    src: ../files/etc/my.cnf
    dest: /etc/my.cnf
    mode: 0644
{{< / highlight >}}

変更を反映するために、`mysqld` を再起動してあげます。

{{< highlight yaml "linenos=inline" >}}
- name: enable mysql
  systemd:
    name: mysqld
    state: restarted
    enabled: yes
{{< / highlight >}}

### ログファイルからrootのパスワードを取得して初期化する

これがめんどくさいところでした。

MySQL8はrootの初期パスワードを `/var/log/mysqld.log` にこっそり出力します。

初期パスワードをログファイルから抽出して変数に登録した後( `register` )、 mysql コマンドを直で発行して root ユーザのデフォルトパスワードを変更します。

{{< highlight yaml "linenos=inline" >}}
- name: get root password
  shell: "grep 'A temporary password is generated for root@localhost' /var/log/mysqld.log | awk -F ' ' '{print $(NF)}'"
  register: root_password # これで一回変数登録
- name: update expired root user password
  command: mysql --user root --password={{ root_password.stdout }} --connect-expired-password --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY '{{ mysql.root.password }}';"
{{< / highlight >}}

**なぜ `mysql_user` ではなく `command` モジュールを使うの？** と思うことでしょう。

例えば、以下のように、rootでloginし、root自身を操作するような書き方を想定するかもしれません。

{{< highlight yaml "linenos=inline" >}}
-  mysql_user:
    login_user: root
    login_password: "{{ root_password }}"
    name: root
    password: "{{ sometinng new password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%'
{{< / highlight >}}

実はこれだと、以下のようなエラーが発生します。

{{< highlight bash "linenos=inline" >}}
unable to connect to database, check login_user and login_password are correct or /root/.my.cnf has the credentials
{{< / highlight >}}

こちらは [Ansible の isuue](https://github.com/ansible/ansible/issues/41116) にも報告がされていました。

そのため、少し邪道感はありますが、issueがfixするまでは、mysqlコマンドを直接発行して変更をする、という手段をとります。

### データベース接続するユーザを作成する

アプリケーションから接続する時に使うmysqlのユーザを作成します。
操作するユーザ(`login_user`) を `root` とし、更新済みのパスワードで接続( `login_password` )します。

これはMySQL自体の話ですが、 `host` は接続元のホストを適切に設定してください。今回は研修用途のどうでもいいサーバなので `%` としています。
逆に `host` が未設定だと、localhostからの接続しか許可されません。

{{< highlight yaml "linenos=inline" >}}
- name: create mysql client user
  mysql_user:
    login_user: root
    login_password: "{{ mysql.root.password }}"
    name: "{{ item.name }}"
    password: "{{ item.password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%' # hostを設定しないと、localhostからの接続しか受け付けない
  with_items:
    - "{{ mysql.users }}"
{{< / highlight >}}

## まとめ

今回は MySQL8初期化のplaybookのはまりポイントを紹介しました。
文書化すると案外簡素になりましたが、MySQL8による変更点と、Ansibleそのものの振る舞いとを切り分けをしたこともあり、実作業はなかなか時間がかかっています。
Packer+Ansibleのデバッグ効率を上げるために、ローカルのVagrantに対して実施していましたがもっと作業スピードを上げたいところです。

## 参考にさせていただいたサイト

* [Github](https://github.com/ansible/ansible)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4844333933&linkId=3e53647e05f4ccbeb0c6cf501ef74f65&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>
</div>
