---
title: "systemdのプロセス数やファイル数を変更する"
description: ""
date: 2018-06-10 00:00:00 +0900
categories: linux
tags: systemd
---

* Table Of Contents
{:toc}

## ファイルディスクリプタ

### OS全体のファイルディスクリプタを設定する

`/etc/systemd/system.conf` ファイル

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

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798044911&linkId=ecbd4a37e5ba5b5255521397a806e73c&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4797382686&linkId=72348c4f427aaabd31a6e84ed1928825&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
