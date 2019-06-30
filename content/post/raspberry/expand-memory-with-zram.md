---
title: "Raspberry Piでメモリを拡張したい時にZramを使う"
description: "Raspberry Piを使っているところメモリが簡単にあふれてしまったのでZramを使ってメモリ領域をうまく活用したいと思います"
date: "2019-07-01T07:53:02+09:00"
thumbnail: "/images/icons/rpi_icon.png"
categories:
  - "raspberry-pi"
tags:
  - "raspberry-pi"
isCJKLanguage: true
twitter_card_image: "/images/icons/rpi_icon.png"
---

[Raspberry Pi](https://amzn.to/2FEzesF) で電子工作をしている時にメモリ不足に陥りました。
これに対処すべく調査していった結果、[Zram](https://en.wikipedia.org/wiki/Zram) という機構が使えそうだったので試してみました。

<!--adsense-->

## Zramとは

[Zram](https://en.wikipedia.org/wiki/Zram) はRAM上に圧縮されたブロックデバイスを構築できます。
作成されたブロックデバイスはスワップとして使われたり、一般のRAMのように使われます。

手持ちの [Raspberry Pi](https://amzn.to/2FEzesF) はメモリが1Gしかないので、メモリを消費するプログラムを動かすとすぐに溢れてしまいます。
[Zram](https://en.wikipedia.org/wiki/Zram) を作成して、メモリにもう少し持ちこたえてもらいましょう。

## Zramのセットアップ

ここから [Zram](https://en.wikipedia.org/wiki/Zram) のセットアップを始めましょう。

### Zramが利用可能かを確認する

まずは動作しているLinuxカーネルが [Zram](https://en.wikipedia.org/wiki/Zram) に対応しているか調べる必要があります。
`zram.ko` ファイルが存在すれば [Zram](https://en.wikipedia.org/wiki/Zram) を使うことができます。

{{< highlight bash "linenos=inline" >}}
ls /lib/modules/4.19.42-v7+（カーネルのバージョン）/kernel/drivers/block/zram/zram.ko
{{</ highlight >}}

### Zramをデーモン登録する

Zram領域を確保するためのデーモンスクリプトを取得します。
幸いなことに公開してくださっている方がいるので、こちらを参考にします。

{{< highlight bash "linenos=inline" >}}
curl -O http://sstea.blog.jp/raspi/script/zram.sh
{{</ highlight >}}

中身はシンプルですが、ポイントは `/sys/block/zram0/comp_algorithm` に指定する圧縮アルゴリズムと、
`/sys/block/zram0/disksize` に指定する確保する領域です。

ここは必要に応じて書き換えてください。

{{< highlight vim "linenos=inline" >}}
#!/bin/sh
### BEGIN INIT INFO
# Provides:       zram
# Required-Start:
# Required-Stop:
# Default-Start:  2 3 4 5
# Default-Stop:   0 1 6
### END INIT INFO

case "$1" in
	start)
		modprobe zram

		echo lz4 > /sys/block/zram0/comp_algorithm
		echo 2048M > /sys/block/zram0/disksize

		mkswap /dev/zram0
		swapon -p 5 /dev/zram0
		;;
	stop)
		swapoff /dev/zram0
		sleep 1
		modprobe -r zram
		;;
	*)
		echo "Usage $0 start | stop "
		;;
esac
{{</ highlight >}}

編集が終了した後 `zram.sh` をデーモン登録します。

{{< highlight bash "linenos=inline" >}}
sudo mv zram.sh /etc/init.d/
{{</ highlight >}}

最後に [Raspberry Pi](https://amzn.to/2FEzesF) を再起動すれば使えるようになります。

<!--adsense-->

## zramctlコマンドでzramを確認する

`zramctl` コマンドでzramの状態を確認できます。DISKSIZEが `2G` 取られていることが確認できます。

{{< highlight bash "linenos=inline" >}}
zramctl

> NAME       ALGORITHM DISKSIZE DATA COMPR TOTAL STREAMS MOUNTPOINT
> /dev/zram0 lz4             2G   4K   64B    4K       4 [SWAP]
{{</ highlight >}}

`--help` オプションでカラム名を引っ張ってきただけですが、各カラムは以下のようです。

|カラム名|意味|
|---|---|
|        NAME |zram device name|
|    DISKSIZE |limit on the uncompressed amount of data|
|        DATA |uncompressed size of stored data|
|       COMPR |compressed size of stored data|
|   ALGORITHM |the selected compression algorithm|
|     STREAMS |number of concurrent compress operations|
|  ZERO-PAGES |empty pages with no allocated memory|
|       TOTAL |all memory including allocator fragmentation and metadata overhead|
|   MEM-LIMIT |memory limit used to store compressed data|
|    MEM-USED |memory zram have been consumed to store compressed data|
|    MIGRATED |number of objects migrated by compaction|
|  MOUNTPOINT |where the device is mounted|

## 参考にさせていただいたサイト

* [Zswap - Wikipedia](https://ja.wikipedia.org/wiki/Zswap)
* [Zram - Wikipedia](https://en.wikipedia.org/wiki/Zram)
