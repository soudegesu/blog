---
title: "Python3でHTTP通信をする（urllib.requestモジュールを使う）"
description: "PythonでHTTP通信するためにurllib.requestモジュールを使ってみました。"
date: "2019-04-02T08:11:12+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

今回はPythonでHTTP通信を行うためのモジュールである [urllib.request](https://docs.python.org/ja/3/library/urllib.request.html) モジュールを紹介します。

## 環境情報

今回は以下の環境にて動作確認をしています。

* python 3.7

<!--adsense-->

## 基本的な通信

### Request オブジェクトを使ったGET

`urllib.request` モジュール内に含まれる `Request` オブジェクトを使います。

以下のようにインスタンスを作成します。

{{< highlight python "linenos=inline" >}}
from urllib.request import *

req = Request(url='https://docs.python.org/ja/', headers={}, method='GET')
{{< / highlight >}}

`Request` オブジェクトのインスタンスのプロパティにアクセスしてみましょう。
オリジンの情報やパスなどの情報が取得できることがわかります。

{{< highlight python "linenos=inline" >}}
print(req.full_url)
> https://docs.python.org/ja/

print(req.type)
> https

print(req.host)
> docs.python.org

print(req.origin_req_host)
> docs.python.org

print(req.selector)
> /ja/

print(req.data)
> None

print(req.unverifiable)
> False

print(req.method)
> GET
{{< / highlight >}}

あとはこれを `urlopen` 関数で処理してあげるだけです。

{{< highlight python "linenos=inline" >}}
with urlopen(req) as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

### Request オブジェクトを使ったPOST

今度は `POST` で送信します。

リクエストボディを指定するには `Request` オブジェクトのインスタンス生成時に `data` オプションを指定してします。

{{< highlight python "linenos=inline" >}}
from urllib.request import *
import json

req = Request(url='https://docs.python.org/ja/', data=json.dumps({'param': 'piyo'}).encode(), headers={}, method='POST')

with urlopen(req) as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

`TypeError: can't concat str to bytes` が表示されるときは `data` に渡すオブジェクトがエンコードされていないことが原因です。
上の例では `json.dumps({'param': 'piyo'}).encode()` で辞書型をjsonにエンコードしています。

<!--adsense-->

## `urlopen` だけで通信する

先程のような簡単な通信であれば `Request` オブジェクトを使わなくても `urlopen` 関数単体で実現できます。

{{< highlight python "linenos=inline" >}}
from urllib.request import *

with urlopen('https://docs.python.org/ja/') as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

## 参考にさせていただいたサイト

* [Python doc](https://docs.python.org/ja/3/library/urllib.request.html#module-urllib.request)
