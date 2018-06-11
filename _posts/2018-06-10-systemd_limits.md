---
title: "Amazon Linux2(systemd)のプロセス数やファイルディスクリプタ数を変更する"
description: "今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、プロセス数やファイルディスクリプタ数といったリソース制限の変更に関して備忘録として残しておきます。"
date: 2018-06-10 00:00:00 +0900
categories: linux
tags: systemd
---

今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、
プロセス数やファイルディスクリプタ数といったリソース制限の変更に関して備忘録として残しておきます。

なお、以降の手順は公式の Amazon Linux2 のAMIをそのままブートした後に試しています。

* Table Of Contents
{:toc}

## limits.confを見てみる

Linuxではユーザごとに利用できるリソースを制限することできます。

`/etc/security/limits.conf` ファイルを見てみると、以下のように多くの設定項目が記載されています。

```bash
cat /etc/security/limits.conf

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
```

systemdの場合には `/etc/security/limits.d/20-nproc.conf` ファイルでプロセスのソフトリミットが設定されています。

```bash
cat /etc/security/limits.d/20-nproc.conf

> # Default limit for number of user's processes to prevent
> # accidental fork bombs.
> # See rhbz #432903 for reasoning.
> 
> *          soft    nproc     4096
> root       soft    nproc     unlimited

```

```
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

```
sudo su - -c "ulimit -a"

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

## ファイルディスクリプタ

### デフォルトのファイルディスクリプタを設定する

デフォルト値を変更するには `/etc/systemd/system.conf` ファイルを編集します。

```
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
```

### デーモンごとのフィルディスクリプタを設定する

`system.conf` による設定は デーモンのリスタートをするとデフォルト値に戻ってしまうので、
デーモンごとに設定をしてあげるのが好ましい。

`/etc/systemd/system/（サービス名）.service` ファイルを作成して

```
[Unit]
Description=clarisse-auth
After=syslog.target network-online.target codedeploy-agent.service
Requires=codedeploy-agent.service

[Service]
User=clarisse
ExecStart=/kddi/clarisse/clarisse-auth/clarisse-auth.jar
SuccessExitStatus=143
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```


```bash
ls -l /proc/1/fd

> lrwx------ 1 root root 64  6月 10 07:32 0 -> /dev/null
> lrwx------ 1 root root 64  6月 10 07:32 1 -> /dev/null
> lr-x------ 1 root root 64  6月 10 07:32 10 -> anon_inode:inotify
> lr-x------ 1 root root 64  6月 10 07:32 11 -> /proc/swaps
> lrwx------ 1 root root 64  6月 10 07:32 12 -> socket:[14117]
> lr-x------ 1 root root 64  6月 10 07:32 14 -> anon_inode:inotify
> lrwx------ 1 root root 64  6月 10 07:32 19 -> socket:[14122]
(以下略)
```

## プロセス数スレッド数


## 参考にさせていただいたサイト
* [ファイルディスクリプタについて](https://codezine.jp/article/detail/4836)
* [limits.conf](https://wiki.archlinux.jp/index.php/Limits.conf)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798044911&linkId=ecbd4a37e5ba5b5255521397a806e73c&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4797382686&linkId=72348c4f427aaabd31a6e84ed1928825&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
