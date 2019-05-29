---
title: "HTTP requests in Python3 with Requests library"
description: "Requests is a multifunctional library for HTTP request."
date: "2019-05-27T09:12:22+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

In past article "[HTTP requests in Python3 with urllib.request module](/en/post/python/http-request-with-urllib/)", I wrote simple code samples for HTTP requests with [urllib.request](https://docs.python.org/ja/3/library/urllib.request.html) module which is a package in Python.

In this article, I introduce [Requests](https://github.com/kennethreitz/requests).

<!--adsense-->

## What is Requests

[Requests](https://github.com/kennethreitz/requests) is a package for HTTP request.

[Requests](https://github.com/kennethreitz/requests) is a human readable package for HTTP request with wrapping `urllib`.
It has a simple interface and supports lots of feature as follows.

> * International Domains and URLs
> * Keep-Alive & Connection Pooling
> * Sessions with Cookie Persistence
> * Browser-style SSL Verification
> * Basic/Digest Authentication
> * Elegant Key/Value Cookies
> * Automatic Decompression
> * Automatic Content Decoding
> * Unicode Response Bodies
> * Multipart File Uploads
> * HTTP(S) Proxy Support
> * Connection Timeouts
> * Streaming Downloads
> * .netrc Support
> * Chunked Requests

## Setup

Install [Requests](https://github.com/kennethreitz/requests) with `pip`.

{{< highlight bash "linenos=inline" >}}
pip install requests
{{</ highlight>}}

<!--adsense-->

## HTTP request with Requests package

First, try to request with HTTP GET.

{{< highlight python "linenos=inline" >}}
import requests
r = requests.get('https://github.com/timeline.json')
{{</ highlight>}}

That's is very simple code. Awsome.
You can do request other HTTP method (`POST` and `PUT` etc..) as well.
If request body needed, give `data` option.

{{< highlight python "linenos=inline" >}}
import requests
import json
r = requests.post('xxxxxxxx', data=json.dumps({'hoge':'huga'}))
r = requests.put('xxxxxxx', data=json.dumps({'hoge':'huga'}))
{{</ highlight>}}

## Response handling

If the response data is json format, convert data to json with `json()` function.

{{< highlight python "linenos=inline" >}}
import requests
r = requests.get('https://github.com/timeline.json')
r.json()
{{</ highlight>}}

However, `json()` function returns `None` when it failed to decode.
So I recommend to give `text` property in response object to `json.loads` function as follows if you'd like to handle as error in this case.

{{< highlight python "linenos=inline" >}}
import json
import requests

try:
    r = requests.get('https://github.com/timeline.json')
    res = json.loads(r.text)
except json.JSONDecodeError as e:
    print(e)
{{</ highlight>}}

<!--adsense-->

## Get the response status code in HTTP redirect

Response object has a `status_code` property. However, this status code means **"a status code for the last request"**.
In other words, we can't get status code `3xx` in this way.

We can access to redirected response data with `history` property in response object when HTTP redirect occured.
These data are sorted in order from the old and stored.

{{< highlight python "linenos=inline" >}}
r = requests.get('http://github.com')
his = r.history
print(his[0].status_code) # 301
{{</ highlight>}}

## Conclusion

It is available to

* Request with [Requests](https://github.com/kennethreitz/requests)
* Get HTTP status code when HTTP redirect occured

## Referencies

* [Requests](https://github.com/kennethreitz/requests)
