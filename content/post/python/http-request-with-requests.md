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

## Requestsのインストール

まずは [Requests](https://requests-docs-ja.readthedocs.io/en/latest/) をインストールしましょう。
外部ライブラリなので `pip` でインストールします。

{{< highlight bash "linenos=inline" >}}
pip install requests
{{</ highlight>}}

## Requestsを使ったHTTP通信

まずは基本のHTTP GETをしてみましょう。

{{< highlight python "linenos=inline" >}}
import requests
r = requests.get('https://github.com/timeline.json')
{{</ highlight>}}

とてもシンプルです。最高ですね。
実は同様にして `POST` や `PUT` など他のHTTP Methodも処理できます。

{{< highlight python "linenos=inline" >}}
import requests
r = requests.post('xxxxxxxx')
r = requests.put('xxxxxxx')
{{</ highlight>}}

## レスポンスのハンドリング

レスポンスが `JSON` 形式であれば、`json()` 関数を使うとJSONとしてデータを取得できます。

{{< highlight python "linenos=inline" >}}
import requests
r = requests.get('https://github.com/timeline.json')
r.json()
{{</ highlight>}}

ただし、JSONのデコードに失敗すると `None` が返却される仕様なので、後段で　`None` の判定処理は入れた方が良いです。

きちんと例外処理をしたい場合には、単にレスポンスをテキストとして扱うために `text` プロパティにアクセスし、`json.loads` 関数で処理することをオススメします。
以下のようなイメージになります。

{{< highlight python "linenos=inline" >}}
import json
import requests

try:
    r = requests.get('https://github.com/timeline.json')
    res = json.loads(r.text)
except json.JSONDecodeError as e:
    print(e)
{{</ highlight>}}

## リダイレクトされたかを確認する

レスポンスオブジェクトの `status_code` プロパティにアクセスすると


## 参考にさせていただいたサイト

* [Requests](https://requests-docs-ja.readthedocs.io/en/latest/)
