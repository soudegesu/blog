---
title: "WebAuthn（Web Authentication）を体験してみる"
description: ""
date: "2018-10-24T08:07:24+09:00"
thumbnail: ""
categories:
  - ""
tags:
  - ""
draft: true
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

[技術評論社](https://gihyo.jp/book) の刊行物である [WEB+DB PRESS Vol.107](https://gihyo.jp/magazine/wdpress) に Web Authentication の特集が組まれていました。タイミングを合わせたのか、publickeyでも 「[Yahoo! JAPANが指紋認証などによるログイン実現。ID/パスワードを不要にするFIDO2対応が国内でついにスタート](https://www.publickey1.jp/blog/18/yahoo_japanidfido2.html)」という記事が紹介され、日本ではYahoo!さんがプロダクション導入一番手になりそうですね。

現職に転職してからはクライアントサイドの開発に従事する機会が激減し、`FIDO`　の動向をキャッチアップしていなかったのですが、
先程のニュースを見て、「おっ」と思い、久しぶりに手を動かしてみました。

## Web AuthenticationとFIDO

刊行物をパクらない程度に触りだけ説明します。

[Web Authentication](https://www.w3.org/TR/webauthn/) はW3Cにて策定されたWebにおける認証の仕様です。
主にブラウザに組み込まれることを想定した仕様となっていて、Javascriptを介して、従来のID/Passwordによる認証ではなく、
携帯電話のPINコードやSMSを使った認証、指紋や顔を使った生体認証の機能にアクセスすることができるようになります。

そもそも、[Web Authentication](https://www.w3.org/TR/webauthn/) の仕様は [FIDO Alliance](https://fidoalliance.org/) の提案が基になっています。
現在では、 [数多くの名だたる企業が加盟している](https://fidoalliance.org/participate/members-bringing-together-ecosystem/) ことから、業界の注目度が高いことが伺えます。

個人的に `FIDO` と言われると、所持認証や生体認証を用いてクライアント側で認証処理自体を行う技術、みたいな印象です。

## Web Authenticationの対応状況

策定された [Web Authentication](https://www.w3.org/TR/webauthn/) の仕様は、各ブラウザベンダーが実装を進めています。

2018/10現在では、モバイル端末向けのChromeでは近々利用可能という話がある一方、 [Webkit（Safari）](https://webkit.org/status/) の開発が **In Development** のステータスです。Safariの対応が完了することで、Webの世界におけるモバイル端末の認証のユーザビリティ向上が本格化しそうですね。

一方、PCブラウザでは、一部のブラウザ（FirefoxやChrome）で既に利用することができます。
その場合には、 [Yubico セキュリティキー](https://amzn.to/2CP2RXK) などのUSBデバイスが必要になります。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B07BYSB7FK&linkId=5b318a344f16e200346b36c76ea5e527"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B018Y1Q71M&linkId=02d0f0a9c5607f1b8713ef635b64d056"></iframe>

## 設定する





## 参考

* [WEB+DB PRESS Vol.107](https://gihyo.jp/magazine/wdpress)
* [apowers313/fido2-server-demo](https://github.com/apowers313/fido2-server-demo)
