---
title: "Amazon Linux2(systemd)のプロセス数やファイルディスクリプタ数を変更する"
description: "今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、プロセス数やファイルディスクリプタ数といったリソース制限の変更に関して備忘録として残しておきます。"
date: 2018-06-10 00:00:00 +0900
categories: linux
tags: systemd
header:
  teaser: /assets/images/icon/linux_icon.png
---

今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、
プロセス数やファイルディスクリプタ数といったリソース制限の変更に関して備忘録として残しておきます。

なお、以降の手順は公式の Amazon Linux2 のAMIをそのままブートした後に試しています。

* Table Of Contents
{:toc}

## ソフトリミットとハードリミット

まず、最初によく聞くソフトリミットとハードリミットの確認しましょう。
Linuxではユーザやプロセスごとに利用できるリソースを制限することできます。

これらには **ソフトリミット** と **ハードリミット** の2種類が存在します。

ソフトリミットはユーザの現在の設定値を指し、ハードリミットはユーザ側での変更可能なソフトリミットの上限値を意味します。

## ログインユーザへの設定

### limits.confを書き換える

Linuxへのログインユーザへの設定は `/etc/security/limits.conf` ファイルにて設定がなされます。
なお、これはPAM認証が適用されたログインに限られます。

Ansibleの [pam_limits](https://docs.ansible.com/ansible/2.3/pam_limits_module.html) を使うと、このファイルに追記がされます。

```bash
cat /etc/security/limits.conf

# /etc/security/limits.conf
#
#This file sets the resource limits for the users logged in via PAM.
#It does not affect resource limits of the system services.
#
#Also note that configuration files in /etc/security/limits.d directory,
#which are read in alphabetical order, override the settings in this
#file in case the domain is the same or more specific.
#That means for example that setting a limit for wildcard domain here
#can be overriden with a wildcard setting in a config file in the
#subdirectory, but a user specific setting here can be overriden only
#with a user specific setting in the subdirectory.
#
#Each line describes a limit for a user in the form:
#
#<domain>        <type>  <item>  <value>
#
#Where:
#<domain> can be:
#        - a user name
#        - a group name, with @group syntax
#        - the wildcard *, for default entry
#        - the wildcard %, can be also used with %group syntax,
#                 for maxlogin limit
#
#<type> can have the two values:
#        - "soft" for enforcing the soft limits
#        - "hard" for enforcing hard limits
#
#<item> can be one of the following:
#        - core - limits the core file size (KB)
#        - data - max data size (KB)
#        - fsize - maximum filesize (KB)
#        - memlock - max locked-in-memory address space (KB)
#        - nofile - max number of open file descriptors
#        - rss - max resident set size (KB)
#        - stack - max stack size (KB)
#        - cpu - max CPU time (MIN)
#        - nproc - max number of processes
#        - as - address space limit (KB)
#        - maxlogins - max number of logins for this user
#        - maxsyslogins - max number of logins on the system
#        - priority - the priority to run user process with
#        - locks - max number of file locks the user can hold
#        - sigpending - max number of pending signals
#        - msgqueue - max memory used by POSIX message queues (bytes)
#        - nice - max nice priority allowed to raise to values: [-20, 19]
#        - rtprio - max realtime priority
#
#<domain>      <type>  <item>         <value>
#

#*               soft    core            0
#*               hard    rss             10000
#@student        hard    nproc           20
#@faculty        soft    nproc           20
#@faculty        hard    nproc           50
#ftp             hard    nproc           0
#@student        -       maxlogins       4

# End of file
```

### limits.confよりも優先されるファイル

`/etc/security/limits.conf` のコメント内にも記載されていますが、 `/etc/security/limits.d` ディレクトリ内のファイルを読み取り、
デフォルト値として設定することができます。

Amazon Linux2（CentOS系）の場合には `/etc/security/limits.d/20-nproc.conf` がデフォルトで配備されており、
同ファイルにプロセスのソフトリミットがデフォルトで設定されていることがわかります。

アクシデンタルなフォーク爆弾を防ぐために、とも書かれていますね。

```bash
cat /etc/security/limits.d/20-nproc.conf

> # Default limit for number of user's processes to prevent
> # accidental fork bombs.
> # See rhbz #432903 for reasoning.
>
> *          soft    nproc     4096
> root       soft    nproc     unlimited
```

### 設定値の確認方法

設定された項目は `ulimit -a` コマンドにて一覧表示して確認可能です。
`-H` オプションでハードリミット、 `-S` オプションでソフトリミットを確認できます。

注意点として、`ulimit` で表示されるのは、カレントユーザの設定値であることです。
別のユーザの設定値を確認したければ `su` を使うなどする必要があります。

```bash
ulimit -a

> core file size          (blocks, -c) 0
> data seg size           (kbytes, -d) unlimited
> scheduling priority             (-e) 0
> file size               (blocks, -f) unlimited
> pending signals                 (-i) 3828
> max locked memory       (kbytes, -l) 64
> max memory size         (kbytes, -m) unlimited
> open files                      (-n) 1024
> pipe size            (512 bytes, -p) 8
> POSIX message queues     (bytes, -q) 819200
> real-time priority              (-r) 0
> stack size              (kbytes, -s) 8192
> cpu time               (seconds, -t) unlimited
> max user processes              (-u) 3828
> virtual memory          (kbytes, -v) unlimited
> file locks                      (-x) unlimited
```

## デーモンへの設定

次にサーバ上で動作させるデーモンプロセスのリソース制限をしましょう。

[archlinuxのlimits.confのページ](https://wiki.archlinux.jp/index.php/Limits.conf) を見ると興味深いことが書いてあります。

> ノート: systemd を使っている場合 /etc/security/limits.conf の値は反映されません。/etc/systemd/system.conf, /etc/systemd/user.conf,/etc/systemd/<systemd_unit>/override.conf などを使ってリソースを制御することが可能です。詳しくは systemd-system.conf の man ページを見てください。

デーモンに対する設定においては、systemd場合、 `limits.conf` による設定はできないよ、ということです。

### 全体へのデフォルト設定をする

systemdにてコントロールされるプロセスのデフォルト値を変更するには `/etc/systemd/system.conf` ファイルを編集します。
例えば、プロセス数やファイルディスクリプタ数を変更するには以下のように記述をします。

```bash
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
```

### デーモンごとの設定をする

本来、サービスを運用するのであれば、サービスに対して適切なリソースを割り当てるのが好ましいでしょう。

その場合には `/etc/systemd/system/（サービス名）.service` ファイルを作成して、 `[Service]` ブロックに追加することができます。
なお、 `/etc/systemd/system/（サービス名）.service` が既に存在し、割当リソースだけ変更したいケースでは  `/etc/systemd/system/（サービス名）.service.d/override.conf` によって上書きするのがよいでしょう。
なお、設定値は `（サービス名）.service` の記述よりも `override.conf` が優先されます。

以下ではファイルディスクリプタの数を定義しています。

```vim
[Service]
LimitNOFILE=40000
```

その後、デーモンを再起動して

```bash
systemctl daemon-reload

systemctl stop (サービス)
systemctl start (サービス)
```

設定が反映されているか確認しましょう。

```bash
cat /proc/${プロセス番号}/limits

Limit                     Soft Limit           Hard Limit           Units
Max cpu time              unlimited            unlimited            seconds
Max file size             unlimited            unlimited            bytes
Max data size             unlimited            unlimited            bytes
Max stack size            8388608              unlimited            bytes
Max core file size        0                    unlimited            bytes
Max resident set          unlimited            unlimited            bytes
Max processes             65536                65536                processes
Max open files            40000                40000                files
Max locked memory         65536                65536                bytes
Max address space         unlimited            unlimited            bytes
Max file locks            unlimited            unlimited            locks
Max pending signals       29779                29779                signals
Max msgqueue size         819200               819200               bytes
Max nice priority         0                    0
Max realtime priority     0                    0
Max realtime timeout      unlimited            unlimited            us
```

ファルディスクリプタ（Max open files）が40000になっていますね。

## まとめ

systemdでのリソース変更を行いました。
PAM認証でのユーザログインと、systemd上のデーモンプロセスでは設定の仕方が異なるので注意が必要です。

くれぐれも `ulimit` だけを変更して、 「Too many open files」 でアプリケーションが死亡しないように注意してくださいね！

## 参考にさせていただいたサイト
* [ファイルディスクリプタについて](https://codezine.jp/article/detail/4836)
* [limits.conf](https://wiki.archlinux.jp/index.php/Limits.conf)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798044911&linkId=ecbd4a37e5ba5b5255521397a806e73c&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4797382686&linkId=72348c4f427aaabd31a6e84ed1928825&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
