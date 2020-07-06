---
title: "Jetson AGX Xavier Developer KitをVirtualbox + NVIDIA SDK Managerでセットアップする"
description: "Virtualboxをホストマシンとして見立てて、NVIDIA SDK ManagerでJetson AGX Xavierの初期化を試みたいと思います。"
date: "2020-07-06T13:06:35+09:00"
thumbnail: ""
categories:
  - "jetson"
tags:
  - "jetson"
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

縁あって [Jetson AGX Xavier Developer Kit(以後AGX)](https://amzn.to/2VORfNb) を触る機会に恵まれたのですが、初期設定に色々ハマってしまったので備忘録として書き残しておきます。

<!--adsense-->

### AGXの初期化にはNVIDIA SDK Managerが必要

NVIDIAが提供するJetsonシリーズでは、製品によってNVIDIAが提供するSDKのインストールやOSの初期化方法が異なります。
[AGX](https://amzn.to/2VORfNb) では専用のアプリケーション([NVIDIA SDK Manager](https://docs.nvidia.com/jetson/jetpack/install-jetpack/index.html#sdk-manager))を使用し、
**ホストマシン経由で** JetPackの書き込みやSDKの追加インストールを行う必要があります。ホストマシンはx64のUbuntu `18.04` または `16.04` が必須とされています。

Ubuntuに載せ換えても良いマシンが手元になかったため、Virtualboxをホストマシンと見立てたセットアップにチャレンジしてみました。

### 環境情報
- ホストマシン
  - Macbook Pro Catalina `10.15.2`
  - Virtualbox `6.1`
  - NVIDIA SDK Manager `1.1.0`
- 本体
  - Jetson AGX Xavier Developer Kit
- セットアップに使う周辺機器
  - LANケーブル
  - Macbook ProとLANケーブルを接続するためのアダプタ
  - USBキーボード
  - USBマウス
  - HDMI接続可能なモニタ

<!--adsense-->

### Virtualbox設定手順

まずは、ホストマシンのMacbook ProにVirtualboxを設定していきます。

#### Virtualboxのインストール

VirtualboxとExtension Packをインストールします。

{{< highlight bash "linenos=inline" >}}
brew cask install virtualbox
brew cask install virtualbox-extension-pack
{{< / highlight >}}

`virtualbox-extension-pack` は Virtualbox に USB 3.0を認識させるために後で使用します。

#### Ubuntu 18.04 LTSのイメージをダウンロード

[Ubuntu Desktop 日本語 Remix](https://www.ubuntulinux.jp/download/ja-remix) のダウンロードページから **Ubuntu desktop 18.04** のISOファイルをダウンロードします。

#### Virtualboxの設定

1. 先ほどインストールしたVirtualboxを起動します。
2. [仮想マシン] > [新規] で新規作成ウィザードを開きます。
3. 任意の仮想マシン名を入力し、[タイプ] を Linux、[バージョン] をUbuntu(64bit)とします。

![new-vm](/images/20200706/new-vm.png)

4. メモリは8GB程度与えておきます。

![new-vm-memory](/images/20200706/new-vm-memory.png)

5. ハードディスクは [仮想ハードディスクを作成する] を選択します。
6. ハードディスクのファイルタイプは [VDI(Virtualbox Disk Image)] を選択します。
7. 物理ハードディスクにあるストレージでは [可変サイズ] を選択します。
8. ディスクの容量は 120GB 以上を確保してください。これは [ホストマシンからAGXをフラッシュする際、最大120GBを必要とする](https://docs.nvidia.com/sdk-manager/system-requirements/index.html)とされているからです。

![new-vm-storage](/images/20200706/new-vm-storage.png)

ここまで終えると、新規作成が完了し、VMの一覧に作成された仮想マシンが表示されます。

9. 一覧から先ほど作成した仮想マシンを選択し、 [設定] を選択します。
10. [ストレージ] メニューから空のIDEコントローラーを選択した状態で、光学ドライブメニュー右側のディスクアイコンをクリックし、表示されたメニューから [仮想光学ディスクの選択/作成] を選びます。

![add-settings](/images/20200706/add-settings.png)

11. [追加] から先ほどダウンロードした **ubuntu desktop 18.04** のISOファイル を選択し、追加されたisoを選択します。

![add-settings-disk](/images/20200706/add-settings-disk.png)

12. 同様に、[システム] メニューから [プロセッサー] タブを選択し、プロセッサー数を `4` 程与えます。必須ではありませんが、多めに割り当てた方が動作もスムーズなのでオススメします。

![add-settings-processor](/images/20200706/add-settings-processor.png)

<!--adsense-->

#### Ubuntuの設定

1. 作成したUbuntu 18.04の仮想マシンを起動します。
2. 初回インストールの画面が表示されるので、言語は [日本語] を選択した状態で [Ubuntuをインストール] を選択します。
3. キーボードレイアウトは使用しているものに合わせて設定します。
4. アプリケーションは [最小インストール] で十分です。

![setup_ubuntu_minimum](/images/20200706/setup-ubuntu-minimum.png)

5. [ディスクを削除してUbuntuをインストール] を選択し、クリーンインストールします。
6. その後、住んでいる国やコンピュータのログインアカウントの作成といった基本の設定を行い、設定完了後OSの再起動を行います。
7. デフォルトでは画面が小さいため、画面サイズを変更します。右上の [アクティビティ] から [設定] を開きます。

![mod_os_settings](/images/20200706/mod-os-settings.png)

8. [デバイス] > [ディスプレイ] を選択し、[解像度] で 1440 * 900 (16:10) より大きな解像度を指定します。

これは、 以後の手順で使うNvidia SDK Managerが最小解像度を1440 * 900と定めているためです

9. 同様に [設定] > [電源管理] > [省電力] から [ブランクスクリーン] を [しない] に変更、[自動サスペンド]　を [オフ] にします。

これは、 SDK Manager実行中にUbuntuがスリープして書き込みが失敗するのを防ぐためです

![mod-os-settings-buttery](/images/20200706/mod-os-settings-buttery.png)

<!--adsense-->

#### AGXとVirtualboxのUSB接続設定

VirtualboxからAGXに書き込みを行うために、VirtualboxにUSBを認識させる必要があります。

1. Macbook ProとAGXをUSB Type-Cで接続します。その際、USBはAGXの電源ライトに近い端子に差し込んでください 。別の端子では正しく認識されません。

![agx_power](/images/20200706/agx_power.png)

2. AGXをリカバリモードで起動します。リカバリモードで起動するには、

- 3つ並んでいるボタンの真ん中を長押しする
- 真ん中のボタンを押したまま左のボタンを押す
- 両方のボタンを離す

![agx_button](/images/20200706/agx_button.png)

3. AGXをHDMIでモニタに接続します。電源ライトは光っているが、モニタに何も表示されなければリカバリモードで起動できています。
4. Virtualboxの仮想マシン一覧から実行中の仮想マシンの設定を開きます。
5. [ポート] > [USB] からプラスアイコンを押して、[Nvidia Corp.*] を追加します。USBコントローラーはUSB 3.0を選択します。

![usb](/images/20200706/usb.png)

6. Ubuntuを再起動し、 [端末] にて lsusb コマンドを実行する。出力されるUSBに `Nvidia Corp.` が表示されていればOK。

長くなりましたが、ここまででVirtualboxの初期設定が完了しました。

<!--adsense-->

### NVIDIA SDK ManagerでJetpack 4.4DPをインストールする

ここではホストマシンがAGXにプロビジョニングを行うNvidia SDK Managerの設定を説明します。

#### AGXをインターネットに接続する

AGXをインターネットに接続できるようにします。後の工程でホストマシンからAGXにSSHできる必要があるため、同じネットワーク内であれば良いです。
私はMacbook Proの [共有] からインターネットを共有してAGXをインターネットに接続可能にしました。

#### NVIDIA SDK Managerをダウンロード

VirtualboxのUbuntuで以下の手順を実施します。

1. Webブラウザで [NVIDIA SDK Managerのページ](https://developer.nvidia.com/nvidia-sdk-manager) へアクセスし、NVIDIA SDK Managerをダウンロードします。ダウンロードするためにはNvidia Developerのアカウントが必要です。手持ちのメールアドレスでアカウントを新規作成してください。
2. [アクティビティ] から [端末(ターミナルのこと)] を開き、ダウンロードした sdkmanager_x.x.x_amd64.deb ファイルを使って以下のコマンドを実行し、SDK Managerをインストールします。

{{< highlight bash "linenos=inline" >}}
sudo apt install ./sdkmanager_x.x.x_amd64.deb
{{< / highlight >}}

3. SDK Managerの実行スクリプトはpythonを必要とします。 [端末] から `which python` コマンドを実行してpythonが解決できなければ、以下コマンドにてpython 2.7 をインストールします。

{{< highlight bash "linenos=inline" >}}
sudo apt install python
{{< / highlight >}}

#### Nvidia SDK ManagerでのSDKをインストール

1. AGXとホストマシンをUSB接続し、AGXはリカバリモードで起動しておく
2. Ubuntuの [端末] から sdkmanager コマンドを実行し、Nvidia SDK Managerを起動する。
3. Nvidia developerアカウントでログインします。

![sdk-manager-top](/images/20200706/sdk-manager-top.png)

4. 以下の設定を選択します

- Product Category: Jetson
- Hardware Configuration: Host Machine
- Target Hardware: Jetson AGX Xavier
- Target Operating System: Jetpack 4.4 DP
- Additional SDK： なし

![sdk-manager-step1](/images/20200706/sdk-manager-step1.png)

5. ライセンスアグリーメントを許可し、Continueを選択

![sdk-manager-step2](/images/20200706/sdk-manager-step2.png)

6. リソースのダウンロードとイメージのフラッシュを行うので、のんびり待ちます。
7. 途中、デバイスのフラッシュ前にアカウント情報を聞かれるダイアログが表示されたら以下の対応を行います。

- [Automatic Setup] から [Manual Setup]に変更
- AGXのログインユーザとログインパスワード(デフォルトではnvidia/nvidia)を入力
- Flashを実行

**Manual Setupのオプションが存在しないダイアログ表示された場合** には、ホストマシンからアクセス可能なAGXのIPアドレスを入力します。

8. 書き込み完了。AGXを通常モードで起動します。

<!--adsense-->

### 参考にさせていただいたサイト

- [Install Jetson Software with SDK Manager](https://docs.nvidia.com/sdk-manager/install-with-sdkm-jetson/index.html)
- [MacBookProでJetson AGX Xaivarをセットアップ Jetpack 4.3](https://qiita.com/notitle420/items/786e1293e6a776338c55)
- [NVIDIA AGX Xavierのセットアップ](http://www1.meijo-u.ac.jp/~kohara/cms/technicalreport/nvidia-agx-xavier-setup)
