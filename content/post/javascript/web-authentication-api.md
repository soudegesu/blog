---
title: "FIDO2ということで、WebAuthn（Web Authentication）を試してみる"
description: "WebAuthnをサーバ上に展開して、WebAuthnを体験してみました。コードは主に各社のリファレンス実装をベースに不足分を追加して動作可能にしています。特にハマりポイントはなく、簡単に誰でもWebAuthnを体験できるでしょう。"
date: "2018-10-24T08:07:24+09:00"
thumbnail: ""
categories:
  - "javascript"
tags:
  - "javascript"
  - "webauthn"
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

[技術評論社](https://gihyo.jp/book) の刊行物である [WEB+DB PRESS Vol.107](https://gihyo.jp/magazine/wdpress) に Web Authentication の特集が組まれていました。タイミングを合わせたのか、publickeyでも 「[Yahoo! JAPANが指紋認証などによるログイン実現。ID/パスワードを不要にするFIDO2対応が国内でついにスタート](https://www.publickey1.jp/blog/18/yahoo_japanidfido2.html)」という記事が紹介され、日本ではYahoo!さんがプロダクション導入一番手になりそうですね。

現職に転職してからはクライアントサイドの開発に従事する機会が激減し、`FIDO`　の動向をキャッチアップしていなかったのですが、
先程のニュースを見て、「おっ」と思い、久しぶりに手を動かしてみました。

<!--adsense-->

## Web AuthenticationとFIDO

簡単に触りだけ説明します。

[Web Authentication](https://www.w3.org/TR/webauthn/) はW3Cにて策定されたWebにおける認証の仕様です。
主にブラウザに組み込まれることを想定した仕様となっていて、JavascriptのAPIを介して、クライアント側で認証を行います。
従来のID/Passwordによる認証ではなく、携帯電話のPINコードやSMSを使った認証、指紋や顔を使った生体認証の機能が実現できるようになります。

そもそも、[Web Authentication](https://www.w3.org/TR/webauthn/) の仕様は [FIDO Alliance](https://fidoalliance.org/) の提案が基になっています。
現在では、 [数多くの名だたる企業が加盟している](https://fidoalliance.org/participate/members-bringing-together-ecosystem/) ことから、業界の注目度が高いことが伺えます。

個人的には `FIDO` という単語を、 **所持認証や生体認証を用いてクライアント側で認証処理自体を行う技術**、という意味合いで使っています。

<!--adsense-->

## Web Authenticationの対応状況

策定された [Web Authentication](https://www.w3.org/TR/webauthn/) の仕様は、各ブラウザベンダーが実装を進めています。

2018/10現在では、モバイル端末向けのChromeでは近々利用可能という話がある一方、 [Webkit（Safari）](https://webkit.org/status/) では **In Development（開発中）** のステータスです。Safariの対応が完了することで、Webの世界におけるモバイル端末の認証のユーザビリティ向上が本格化しそうですね。

PCブラウザでは、一部のブラウザ（FirefoxやChrome）で既に利用することができます。
その場合には、 [Yubico セキュリティキー](https://amzn.to/2CP2RXK) などのUSBデバイスが必要になります。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07BYSB7FK&linkId=5b318a344f16e200346b36c76ea5e527"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B018Y1Q71M&linkId=02d0f0a9c5607f1b8713ef635b64d056"></iframe>

<!--adsense-->

## 指紋認証を試してみる

手持ちのモバイル端末を使って指紋認証を体験してみます。
今回、Android（OS ver7以上）に [Chrome Canary](https://www.google.com/chrome/canary/) をインストールして使うことを前提とします。

### 実装してみる

[WEB+DB PRESS Vol.107](https://gihyo.jp/magazine/wdpress) のFIDOの記事で紹介されている [サンプルコード](https://gihyo.jp/magazine/wdpress/archive/2018/vol107/support) は、サーバ通信が発生しないライトな実装だったので、
最初は [Web Authentication APIの仕様](https://www.w3.org/TR/webauthn/#web-authentication-api) を読みながら自前でしこしこ作ろうかと考えていましたが、
既に先人がリファレンス実装をしてくれていました。

* [apowers313/fido2-server-demo](https://github.com/apowers313/fido2-server-demo)

上記のリンクから、更に各会社のリファレンス実装のリンクをたどることができます。
今回は、FIDO Allianceが実装している [webauthn-demo](https://github.com/fido-alliance/webauthn-demo) をベースにしました。

しかし、 **[webauthn-demo](https://github.com/fido-alliance/webauthn-demo)** には、
AndroidのChromeで指紋認証を使った場合のアテステーションのハンドリング（ `fmt` が `android-safetynet` の場合の実装）がありませんでした。
不足箇所の実装は [google/webauthndemo](https://github.com/google/webauthndemo/blob/6853d5fd5bc4916fea86640459717bab37229bb3/src/main/java/com/google/webauthn/gaedemo/objects/AttestationStatement.java) を参考に実装しました。

これをAWSのEC2上に展開し、SSL証明書（ACM）を当てたロードバランサー配下に配置して上げればOKです。

### アクセスしてみる

さっそくアクセスしてみましょう。`name` と `username` を入力して `Register` を押します。

{{< figure src="/images/20181024/register.png" class="center" width="50%" >}}

すると、`WebAuthn` でセキュリティキーの使用を確認する画面が出てくるので `開始` を押します。

{{< figure src="/images/20181024/use_security.png" class="center" width="50%" >}}

どの認証方式を利用するか聞かれるので、指紋認証を選択します。（ここで初めてNFCが使えることを知りました）

{{< figure src="/images/20181024/select_key.png" class="center" width="50%" >}}

端末についている指紋認証センサーに指をあてます。（余談： `画面ロックを使用` ボタンでは、PINコードの入力による認証ができました）

{{< figure src="/images/20181024/login_with_bio.png" class="center" width="50%" >}}

指紋が読み取られ、認証OKになります。

{{< figure src="/images/20181024/passed_bio.png" class="center" width="50%" >}}

最後にサーバ側で署名を検証すればOKです。
ログインできました。

{{< figure src="/images/20181024/login_with_webauth.png" class="center" width="50%" >}}

## まとめ

今回はサンプルコードを基に、[Web Authentication](https://www.w3.org/TR/webauthn/) を試してみました。
既に多くの方がリファレンス実装をしているので、それを参考にすると、かなり工数も削減できそうです。

認証方式の選択時に `USB` や `指紋認証` 以外にも、
`Bluetooth` や `NFC` も選択可能なことは興味深く、次はこちらも挑戦してみたいです。

従来の認証方式と異なる点として、鍵の所有者が逆転することになりますから、
既にローンチしているサービスにおいては、既存のIDとの共存を設計するところが勘所な気もしますね。

## 参考

* [WEB+DB PRESS Vol.107](https://gihyo.jp/magazine/wdpress)
* [apowers313/fido2-server-demo](https://github.com/apowers313/fido2-server-demo)
