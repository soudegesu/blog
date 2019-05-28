---
title: "HTTP requests in Python3 with urllib.request module"
description: "Use urllib.request module for HTTP request"
date: "2019-04-02T08:11:12+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

In this article, I introduced how to use [urllib.request](https://docs.python.org/ja/3/library/urllib.request.html) module to request with HTTP in Python.

## Environment

Runtime environment is as follows.

* python 3.7

<!--adsense-->

## Ordinal HTTP request

### HTTP GET request with an `Request` object

Use `Request` object included in `urllib.request` module.

Create `Request` object instance as follows.

{{< highlight python "linenos=inline" >}}
from urllib.request import *

req = Request(url='https://docs.python.org/ja/', headers={}, method='GET')
{{< / highlight >}}

Access to `Request` object property.
You can see the host information and path etc..

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

Then, open the request using `urlopen` function.

{{< highlight python "linenos=inline" >}}
with urlopen(req) as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

### HTTP POST request with an `Request` object

Next, request with HTTP `POST`.

You can give request body with `data` option when creating `Request` object instance.

{{< highlight python "linenos=inline" >}}
from urllib.request import *
import json

req = Request(url='https://docs.python.org/ja/', data=json.dumps({'param': 'piyo'}).encode(), headers={}, method='POST')

with urlopen(req) as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

If `data` object is not encoded, the error message `TypeError: can't concat str to bytes` occued.
In above case, convert dictionary type to json with `json.dumps({'param': 'piyo'}).encode()`.

<!--adsense-->

## HTTP request wit only `urlopen` function

Instead of `Request` object, you can request with only `urlopen` function in simple request case.
The sample code is as follows.

{{< highlight python "linenos=inline" >}}
from urllib.request import *

with urlopen('https://docs.python.org/ja/') as res:
    body = res.read().decode()
    print(body)
{{< / highlight >}}

## References

* [Python doc](https://docs.python.org/3/library/urllib.request.html#module-urllib.request)
