---
title: "Jetson Nanoで外部接続したUSBマイクが音を拾ってくれない時の対処法"
description: "Jetson Nanoを使って音声データを収集するときにUSBマイクから音を収集してくれない問題への原因と対処法を紹介します。"
date: "2019-12-31T23:33:33+09:00"
thumbnail: ""
categories:
  - "jetson"
tags:
  - "jetson"
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

[Jetson Nano](https://amzn.to/36f2dhQ) を使って音声データを収集する際に接続された外部USBマイクで音が拾えなかったため、原因とその対処法を紹介します。

<!--adsense-->

## 実行環境

今回の動作確認環境は以下です。

* [Jetson Nano](https://amzn.to/36f2dhQ)
  * Card Image: [jetson-nano-sd-card-image-r3231](https://developer.nvidia.com/jetson-nano-sd-card-image-r3231)

## USBマイクの音が拾えてない..??

今回やりたかったことは [Jetson Nano](https://amzn.to/36f2dhQ) にマイク付きWebカメラをUSB接続し、取得した動画像と音声をサーバへ送信するプログラムの実装です。しかし、カメラの動画像は送信できているものの、マイク音声は録音できていないという事象に遭遇しました。

<!--adsense-->

## マイクデバイスを確認する

[Jetson Nano](https://amzn.to/36f2dhQ) のマイクデバイスはデフォルトで `tegrasndt210` が設定されていたため、マイクデバイスに変更する必要があります。
そのため、まず最初に接続済みのマイクデバイスの確認をします。 `arecord -L` コマンドで確認できます。

{{< highlight "linenos=inline" >}}
arecord -L

plughw:CARD=Pro,DEV=0
  HD Webcam eMeet C980 Pro, USB Audio
  Hardware device with all software conversions
{{< / highlight >}}

## `/etc/asound.conf` を編集する

確認できたCARD情報で `/etc/asound.conf` を書き換えます。

{{< highlight "linenos=inline" >}}
pcm.!default {
	type plug
	slave {
		pcm "hw:Pro,DEV=0"
	}
}

ctl.!default {
	type hw
	card Pro
}
{{< / highlight >}}

編集後、再起動を行い設定を読み込ませます。

{{< highlight "linenos=inline" >}}
alsactl stop
alsactl start
{{< / highlight >}}


<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07T6LYQZ6&linkId=7ed180cd03c44a1f511439d04b3f94d4"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4800712513&linkId=3a03ff896d417aa83c547f5b4812cf01"></iframe>
