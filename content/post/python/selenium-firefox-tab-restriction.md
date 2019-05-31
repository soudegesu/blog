---
title: "SeleniumでFirefoxの複数タブを同時に開く時にポップアップブロックされる問題に対処する"
description: "Seleniumを使って複数のURLを一斉に開く時に、Firefoxではポップアップブロックが表示されてしまいます。"
date: "2019-05-31T18:00:00+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: "/images/icons/python_icon.png"
---

以前の記事 [Pythonで自動化しよう！ ー Selenium Webdriverをセットアップする](/post/python/setup-selenium-webdriver/) では、
PythonでSeleniumの実行環境の構築手順を紹介しました。

今回は少しニッチですが、Firefoxで動作させる時に私が実際に陥った問題とその対処法を紹介します。

<!--adsense-->

## やりたかったこと

* 複数のURL(100個くらい)を同時に開き、表示された画面を目視でチェックする
* その時、SeleniumではJavascriptの `window.open()` 関数を実行してURLを開く

## 発生したこと：Firefoxで複数タブを多く開くとポップアップブロックが表示される

Firefoxのwebdriverを使って以下のようなコードを実行してみます。

{{< highlight python "linenos=inline" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.get('https://www.google.com/')
for i in range(0, 100):
    driver.execute_script(f"window.open('https://www.google.com/', '{i}')")
{{< /highlight>}}

すると、20個ほど順調にタブが開いた後、いきなり以下のようなポップアップブロックが表示されました。

![popup_block](/images/20190601/popup_block.png)

ポップアップブロックは `window.open()` 関数を実行しているタブに対してのみ表示されるため、間違いなく見落とします。
ポップアップブロックから「許可」を手動で行えばなんとか開けますが、自動化のうまみが消えてしまうのでなんとか対処したいです。

<!--adsense-->

## 解決策：ポップアップの上限数を設定する

調査の結果、ブラウザの「設定」に該当するオプションをFirefoxのwebdriver生成時に `Options` クラスで指定できることがわかりました。
以下のサンプルコードでは2つのプロパティを使っています。

* `dom.disable_open_during_load`: ページロード中におけるポップアップブロックを行う
* `dom.popup_maximum`: ポップアップによる別タブ表示の上限数（デフォルトは **20**）

{{< highlight python "linenos=inline, hl_lines=2 4-8" >}}
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

options = Options()
options.set_preference("dom.disable_open_during_load", False)
options.set_preference('dom.popup_maximum', -1)

driver = webdriver.Firefox(firefox_options=options)
driver.get('https://www.google.com/')
for i in range(0, 100):
    driver.execute_script(f"window.open('https://www.google.com/', '{i}')")

{{< /highlight>}}

`dom.popup_maximum` を `-1` に指定するとタブの表示上限が無制限扱いとなり、ポップアップブロックされなくなりました。

## 参考にさせていただいたサイト

* [mozillaZine](http://kb.mozillazine.org/About:config_entries)
