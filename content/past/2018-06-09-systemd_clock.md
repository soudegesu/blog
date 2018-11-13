---
title: "Amazon Linux2(systemd)のシステム時刻を変更する"
description: "今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、システム時刻の変更に関して備忘録として残しておきます。"
date: 2018-06-09
categories:
    - linux
tags:
    - systemd
url: /linux/systemd_clock/
---

今回はAmazon Linux から Amazon Linux2 への移行をする機会があったので、
システム時刻の変更に関して備忘録として残しておきます。

なお、以降の手順は公式の Amazon Linux2 のAMIをそのままブートした後に試しています。

## システムクロックを変更する

システムクロックは `/etc/adjtime` を使ってハードウェアクロックから算出されます。
`systemd` の場合、 `/etc/adjtime` が存在しないとデフォルトでUTCを使うそうですが、今回は存在していました。

{{< highlight "linenos=inline" >}}
cat /etc/adjtime

> 0.0 0 0.0
> 0
> UTC
{{< / highlight >}}

システムクロックを確認しましょう。 `timedatectl` コマンドを実行してみます。

{{< highlight "linenos=inline" >}}
timedatectl

>       Local time: Sat 2018-06-09 05:16:29 UTC
>   Universal time: Sat 2018-06-09 05:16:29 UTC
>         RTC time: Sat 2018-06-09 05:16:28
>        Time zone: n/a (UTC, +0000)
>      NTP enabled: yes
> NTP synchronized: no
>  RTC in local TZ: no
>      DST active: n/a
{{< / highlight >}}

何もしていないので、UTCのままですね。

次にtimezoneを `Asia/Tokyo` にしてみましょう。こちらも `timedatectl` コマンドで設定可能です。

{{< highlight "linenos=inline" >}}
timedatectl set-timezone Asia/Tokyo
{{< / highlight >}}

設定がされたか確認してみましょう。 `timedatectl` コマンドを実行したら、 Time zoneがJSTになっていることが確認できます。

{{< highlight "linenos=inline" >}}
timedatectl

>       Local time: Sat 2018-06-09 14:57:45 JST
>   Universal time: Sat 2018-06-09 05:57:45 UTC
>         RTC time: Sat 2018-06-09 05:57:45
>        Time zone: Asia/Tokyo (JST, +0900)
>      NTP enabled: yes
> NTP synchronized: no
>  RTC in local TZ: no
>       DST active: n/a
{{< / highlight >}}

タイムゾーンを変更すると、 `/etc/localtime` にその設定が反映されます。
ファイルを見てみましょう。 `cat` してみましょう。

{{< highlight "linenos=inline" >}}
cat /etc/localtime

> TZif2
>         ��>p��K����p��-���ۭ�����݌�����~~LMTJDTJSTTZif2
>
> �����e¤p�����>p������K��������p������-�����������ۭ�������������݌�����~~LMTJDTJST
{{< / highlight >}}

文字化けしてしまいましたね。代わりに、 `zdump` コマンドを使うことで `/etc/localtime` が指すタイムゾーンの情報を確認してみましょう。
これで JST になっていることを確認できました。

{{< highlight "linenos=inline" >}}
zdump /etc/localtime

> /etc/localtime  Sat Jun  9 14:57:54 2018 JST
{{< / highlight >}}

ちなみに `timedatectl set-time　"2018-06-09 12:00:00"` のように、
直接引数に与えられた時刻に設定することができますが、個人的に使った経験はありません。

## ハードウェアクロックを確認する

Linuxが起動するときにシステムクロックを設定するため、ハードウェアクロックの情報が参照されます。

ハードウェアクロックの情報は `hwclock` コマンドで確認できます。

{{< highlight "linenos=inline" >}}
hwclock --debug

> hwclock from util-linux 2.30.2
> Trying to open: /dev/rtc0
> Using the rtc interface to the clock.
> Last drift adjustment done at 0 seconds after 1969
> Last calibration done at 0 seconds after 1969
> Hardware clock is on UTC time
> Assuming hardware clock is kept in UTC time.
> Waiting for clock tick...
> ...got clock tick
> Time read from Hardware Clock: 2018/06/09 06:09:22
> Hw clock time : 2018/06/09 06:09:22 = 1528524562 seconds since 1969
> Time since last adjustment is 1528524562 seconds
> Calculated Hardware Clock drift is 0.000000 seconds
> 2018-06-09 15:09:21.645250+0900
{{< / highlight >}}

デバッグオプションなしで、 `hwclock` だけ実行すると、ハードウェアに記録されている時刻が表示されます。

{{< highlight "linenos=inline" >}}
hwclock

> 2018-06-09 15:09:21.645250+0900
{{< / highlight >}}

## 参考にさせていただいたサイト

* [時刻 archlinux](https://wiki.archlinux.jp/index.php/%E6%99%82%E5%88%BB)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798044911&linkId=ecbd4a37e5ba5b5255521397a806e73c&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4797382686&linkId=72348c4f427aaabd31a6e84ed1928825&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
