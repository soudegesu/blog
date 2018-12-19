---
title: "Flutterでモバイルアプリケーション（Android/iOS）の開発環境を構築する"
description: "gizmodoの記事で、の話が触れられていました。今回は Fuchsia 上で動作するようになるかもしれない Flutter の環境構築をしてみます。"
date: 2018-07-25
thumbnail: /images/icons/flutter_icon.png
categories:
  - dart
tags:
  - flutter
  - android
  - ios
  - dart
url: /dart/android-with-flutter/
twitter_card_image: /images/icons/flutter_icon.png
---

[gizmodoの記事](https://www.gizmodo.jp/2018/07/fuchsia-5years.html) で、[Google Fuchsia](https://ja.wikipedia.org/wiki/Google_Fuchsia) の話が触れられていました。今回は Fuchsia 上で動作するようになるかもしれない [Flutter](https://flutter.io/) の環境構築をしてみます。

![flutter](/images/20180725/flutter.png)

<!--adsense-->

## モチベーション

### Web系エンジニアがモバイルをアプリを作ることになった

**「君はコード書けるから、アプリのプロトタイプを作ってもらおうかな」** というオーダーを頂戴しました。
そもそも私はWeb系のエンジニアで、近年はサーバサイドを中心に仕事をしていたので、Javascriptは2013年頃からあまり積極的に書いていませんでした。
（スポットで簡易な管理コンソールにようなものは実装していましたが。。）

この「あなたSEなんだから、Fax直せるでしょ？」の某Web広告を彷彿とさせる依頼が契機となり、アプリ開発の門を叩くことになったのです。

### React-NativeかFlutterか

先も書いた通り、私は過去Javascriptでの開発経験があるので、React-Nativeを使う選択肢もあります。

一方で、つい最近、[gizmodoの記事](https://www.gizmodo.jp/2018/07/fuchsia-5years.html) で Google の新OSである Fuchsia の話と、
それと付随して [Flutter](https://flutter.io/) が紹介されていました。

今回実装するのもアプリのプロトタイプのようですし、せっかくだから実験台になってもらおう、となったわけです。

<!--adsense-->

## 環境構築
### Flutterのインストール

* SDKのダウンロード

私のマシンはMac OSXなので [Flutter公式のMacOSのセットアップ](https://flutter.io/setup-macos/) ページを参考にセットアップを進めます。
セットアップページに行くと、Flutter SDKのarchiveが手に入るので、それをダウンロードします。2018/07での最新バージョンは `v0.5.1-beta` でした。

ちなみに、HomebrewのFlutterを探すと、 古いバージョン（ `v0.3.1` ）がヒットするので Homebrew 経由でのインストールはオススメしません。

* zipの解凍

ダウンロード終了後に任意のフォルダで解凍します。

{{< highlight bash "linenos=inline" >}}
cd ~/
unzip ~/Downloads/flutter_macos_v0.5.1-beta.zip
{{< / highlight >}}

unzipされていく過程を眺めていると、 `creating: flutter/packages/fuchsia_remote_debug_protocol/` といった `Fuchsia` との関連を匂わせるソースも入っていますね。少しだけテンションが上がりました。

* パスを通す

毎度 exportコマンドを実行するのも面倒なので、 `~/.zshrc` ファイルに記載をして、`source` コマンドで再読込させます。

{{< highlight vim "linenos=inline" >}}
export FLUTTER="${HOME}/flutter/bin"
export PATH="${FLUTTER}:$PATH"
{{< / highlight >}}

* 動作確認

`flutter` コマンドの確認をします。

{{< highlight bash "linenos=inline" >}}
flutter --version

> Flutter 0.5.1 • channel beta • https://github.com/flutter/flutter.git
> Framework • revision c7ea3ca377 (8 weeks ago) • 2018-05-29 21:07:33 +0200
> Engine • revision 1ed25ca7b7
> Tools • Dart 2.0.0-dev.58.0.flutter-f981f09760
{{< / highlight >}}

低いバージョンのflutterを使っていると、このタイミングでバージョンアップが促されます。親切設計です。

{{< highlight bash >}}
  ╔════════════════════════════════════════════════════════════════════════════╗
  ║ WARNING: your installation of Flutter is 61 days old.                      ║
  ║                                                                            ║
  ║ To update to the latest version, run "flutter upgrade".                    ║
  ╚════════════════════════════════════════════════════════════════════════════╝
{{< / highlight >}}

### Flutterの依存ツールをチェックする

Flutterが依存するツールの状況を確認しましょう。 `flutter doctor` の実行結果を確認しながら不足しているツールをインストールしていきます。

コマンドサンプルも付随しているので、インストールに手間取ることはありませんでした。
インストールするモジュールの容量が大きくて時間がかかります。

{{< highlight bash >}}
flutter doctor

> Doctor summary (to see all details, run flutter doctor -v):
> [✓] Flutter (Channel beta, v0.5.1, on Mac OS X 10.13.2 17C88, locale ja-JP)
> [!] Android toolchain - develop for Android devices (Android SDK 26.0.2)
>     ! Some Android licenses not accepted.  To resolve this, run: flutter doctor --android-licenses
> [!] iOS toolchain - develop for iOS devices (Xcode 9.2)
>     ✗ Missing Xcode dependency: Python module "six".
>       Install via 'pip install six' or 'sudo easy_install six'.
>     ✗ libimobiledevice and ideviceinstaller are not installed. To install, run:
>         brew install --HEAD libimobiledevice
>         brew install ideviceinstaller
>     ✗ ios-deploy not installed. To install:
>         brew install ios-deploy
>     ✗ CocoaPods not installed.
>         CocoaPods is used to retrieve the iOS platform side's plugin code that responds to your plugin usage on the Dart side.
>         Without resolving iOS dependencies with CocoaPods, plugins will not work on iOS.
>         For more info, see https://flutter.io/platform-plugins
>       To install:
>         brew install cocoapods
>         pod setup
> [✓] Android Studio (version 3.0)
>     ✗ Flutter plugin not installed; this adds Flutter specific functionality.
>     ✗ Dart plugin not installed; this adds Dart specific functionality.
> [!] IntelliJ IDEA Ultimate Edition (version 2017.3)
>     ✗ Flutter plugin not installed; this adds Flutter specific functionality.
>     ✗ Dart plugin not installed; this adds Dart specific functionality.
> [!] VS Code (version 1.25.0)
> [!] Connected devices
>     ! No devices available
{{< / highlight >}}

### プロジェクトの初期化

`flutter` のプロジェクトの初期化を行います。今回は `sample` という名前のプロジェクトにします。

{{< highlight bash "linenos=inline" >}}
flutter create sample
{{< / highlight >}}

こんな感じでプロジェクトツリーが生成されました。 `lib/main.dart` がメインとなるdartのコードっぽいですね。

`android` や `ios` のディレクトリ配下は、各プラットフォームのアプリのディレクトリ構造になっていました。

ネイティブコードでも拡張できるんでしょね、おそらく。

{{< highlight bash >}}
.
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── local.properties
│   └── settings.gradle
├── build
│   ├── android-profile
│   ├── app
│   ├── app.dill
│   └── frontend_server.d
├── ios
│   ├── Flutter
│   ├── Runner
│   ├── Runner.xcodeproj
│   └── Runner.xcworkspace
├── lib
│   └── main.dart
├── pubspec.lock
├── pubspec.yaml
├── sample.iml
├── sample_android.iml
└── test
    └── widget_test.dart
{{< / highlight >}}

### サンプルアプリケーションの起動

作成したプロジェクトをVisual Studio Codeで開きます。

`lib/main.dart` ファイルを開いて、 デバッグを選択（`F5` キー）を押すと、エミュレータを選択できます。
とりあえず、iOS Simulator にします。

![flutter](/images/20180725/launch_app.png)

暫く待つと（数分待ちました。。）エミュレータが起動し、アプリが立ち上がります。

![demo](/images/20180725/demo.png)

これで開発環境は構築できました！

## まとめ

今回はFlutterの環境構築までを行いました。
最初はコマンドラインでやっていたのですが、IDEにプラグインをインストールした方が開発が捗るのでオススメします。
Dartのコードはまだ書けていませんが、Javascriptでオブジェクト指向プログラミングをやったことがあれば、ついていけそうな気はします。
次は [Write Your First Flutter App](https://flutter.io/get-started/codelab/) で簡単なデモアプリを作ってみようと思います！

## 参考にさせていただいたサイト
* [Flutter](https://flutter.io)
* [Google Fuchsia](https://ja.wikipedia.org/wiki/Google_Fuchsia)
* [【追記あり】Googleの新OS｢Fuchsia｣がAndroidを5年後に置き換えるかも](https://www.gizmodo.jp/2018/07/fuchsia-5years.html)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4048915118&linkId=bbd8ab09e1853c0025cee79f27f3adff&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774198552&linkId=c9a21af23359162955dce78777edebe9&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4774188174&linkId=ef4bacdf0606f740e9024096feae3373"></iframe>
</div>
