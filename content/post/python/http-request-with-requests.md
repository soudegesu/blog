---
title: "Python3でHTTP通信をする（Requestsを使う）"
description: "PythonのHTTP通信をするためのライブラリであるReqestsを使ってみます。"
date: "2019-05-27T09:12:22+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

以前の記事 「[Python3でHTTP通信をする（urllib.requestモジュールを使う）](/post/python/http-request-with-urllib/)」 では、Pythonの標準モジュールである [urllib.request](https://docs.python.org/ja/3/library/urllib.request.html) を使って、簡単なHTTPリクエスト処理を書きました。

今回は外部ライブラリである [Requests](https://requests-docs-ja.readthedocs.io/en/latest/) を使ってみようと思います。

## Requests とは

[Requests](https://requests-docs-ja.readthedocs.io/en/latest/) はPythonを使った外部通信するためのライブラリです。
Python標準の `urllib` モジュールよりも高機能であり、コード量も減り、APIも可読性が良いため、外部通信を伴うアプリケーションでは一般に広く使われています。
公式サイトでは以下がサポートする機能として紹介されているので引用します。

> * ドメインとURLの国際化
> * Keep-Aliveとコネクションプーリング
> * Cookieによるセッションの永続化
> * ブラウザのようなSSLによる接続
> * ベーシック/ダイジェスト認証
> * エレガントなキー/バリューによるCookie
> * 圧縮の自動的な展開
> * レスポンスの本文のユニコード化
> * マルチパートファイルのアップロード
> * コネクションのタイムアウト
> * .netrc のサポート
> * Python 2.6-3.3に対応
> * スレッドセーフ


## 参考にさせていただいたサイト

* [Requests](https://requests-docs-ja.readthedocs.io/en/latest/)
