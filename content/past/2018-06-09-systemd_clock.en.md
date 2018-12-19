---
title: "Change system clock on Amazon Linux2(systemd)"
description: "When I migrate Amazon Linux to Amazon Linux2, I investigate how to change system clock on Linux server working with systemd.This post is technical memo for myself."
date: 2018-06-09
categories:
    - linux
tags:
    - systemd
url: /en/linux/systemd_clock/
---

## Motivation

When I migrate `Amazon Linux` to `Amazon Linux2`, I investigate how to change system clock on Linux server working with `systemd`.
This post is technical memo for myself.

<!--adsense-->

## Change system clock

System clock is calculated by `/etc/adjtime` that uses hardware clock.
If OS working with `systemd` dosen't have `/etc/adjtime`, `UTC` is default.

{{< highlight "linenos=inline" >}}
cat /etc/adjtime

> 0.0 0 0.0
> 0
> UTC
{{< / highlight >}}

Now check the system clock with `timedatectl` command.

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

`UTC` is default setting.

And change time zone to `Asia/Tokyo` with using `timedatectl` command.

{{< highlight "linenos=inline" >}}
timedatectl set-timezone Asia/Tokyo
{{< / highlight >}}

Execute `timedatectl` command again, check timezone is `JST`.

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

Timezone settings is configured at `/etc/localtime`.
Check `/etc/localtime` with `cat` command.

{{< highlight "linenos=inline" >}}
cat /etc/localtime

> TZif2
>         ��>p��K����p��-���ۭ�����݌�����~~LMTJDTJSTTZif2
>
> �����e¤p�����>p������K��������p������-�����������ۭ�������������݌�����~~LMTJDTJST
{{< / highlight >}}

`zdump` command can print time zone info in `/etc/localtime` **without character corruption** .
The time zone is JST.

{{< highlight "linenos=inline" >}}
zdump /etc/localtime

> /etc/localtime  Sat Jun  9 14:57:54 2018 JST
{{< / highlight >}}

Using `set-time` sub command can set datetime directly as follows, however I have never used.

`timedatectl set-time　"2018-06-09 12:00:00"`

<!--adsense-->

## Check hardware clock

Linux refers hardware clock to set system clock when bootstrap.
Now check hardware information with `hwclock --debug` command.

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

Without `--debug` option, print only dates time information recorded in hardware.

{{< highlight "linenos=inline" >}}
hwclock

> 2018-06-09 15:09:21.645250+0900
{{< / highlight >}}

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1118999878&asins=1118999878&linkId=505e8916ad9a88f434015c7752bcab37&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275676&asins=1593275676&linkId=41961435281092180b58ba1fc3f86d46&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
