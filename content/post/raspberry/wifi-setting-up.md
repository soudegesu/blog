---
title: "Raspberry PiでWifiを設定する方法"
description: "Raspberry PiでWifiを設定する方法を紹介します。GUIから設定する方法と/etc/wpa_supplicant/wpa_supplicant.confに記載しておく方法の2種類が存在します"
date: "2019-06-28T08:14:11+09:00"
thumbnail: "/images/icons/rpi_icon.png"
categories:
  - "raspberry-pi"
tags:
  - "raspberry-pi"
isCJKLanguage: true
twitter_card_image: /images/icons/rpi_icon.png
---

[Raspberry Pi](https://amzn.to/2FEzesF) のWifi設定について備忘録を書きます。
なお、今回私が使っているのは [Raspberry Pi 3B+](https://amzn.to/2FEzesF) になります。

<!--adsense-->

## Raspberry Pi のGUIから設定する方法

[Raspberry Pi](https://amzn.to/2FEzesF) にディスプレイを接続して使う場合、画面右上のネットワークアイコンをクリックすると接続するSSIDを選択できます。

![rpi_wifi_settings](/images/20190628/rpi_wifi_setting.png)

これはPCを普段使いしている人であればそんなり見つけられる方法です。

<!--adsense-->

## ファイルに設定を書く方法

GUIから設定する方法の場合、[Raspberry Pi](https://amzn.to/2FEzesF) の起動時には自動で接続できないケースがあります。
ここでは予めファイルに設定を記載しておくことで自動接続させる方法を紹介します。

[Raspberry Pi](https://amzn.to/2FEzesF) 内の `/etc/wpa_supplicant/wpa_supplicant.conf` にWifiの設定を書き込むことができます。

{{< highlight bash "linenos=inline" >}}
sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
{{</ highlight >}}

以下のように `network=` で設定を追加できます。

{{< highlight vi "linenos=inline,hl_lines=5-10 12-17 19-24" >}}
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP

network={
        ssid="1つ目のSSID"
        scan_ssid=1
        psk="1つ目のSSIDのパスワード"
        key_mgmt=WPA-PSK
}

network={
        ssid="2つ目のSSID"
        psk="2つ目のSSIDのパスワード"
        key_mgmt=WPA-PSK
        disabled=1
}

network={
        ssid="3つ目のSSID"
        key_mgmt=NONE
        wep_key0="3つ目のSSIDのパスワード"
        disabled=1
}

{{</ highlight >}}

`scan_ssid=1` を指定するとステルスモードのSSIDと接続することができます。また、優先的に接続しないSSIDは `disabled=1` で無効にしておくこともできます。
`psk` にはSSIDのパスワードを平文で指定することができますが、好ましい状態ではないため暗号化した文字列を使うようにしましょう。

`wpa_passphrase` コマンドを使います。

{{< highlight bash "linenos=inline" >}}
wpa_passphrase ${SSID}
{{</ highlight >}}

この後、SSIDのパスワードを入力すると暗号化文字列を生成できますので、それを `psk` の所に記載すればOKです。

<div text-align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B01CSFZ4JG&linkId=4e274a78c3c0527161dc5e00a279f961"></iframe>
</div>
