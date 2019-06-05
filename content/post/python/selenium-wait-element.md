---
title: "Seleniumのコードを安定して動かすためにWaitを使って要素を待つ"
description: "Selenium実行中に稀にエラーになる時はWaitで要素の表示がされるまで待ちましょう、という話をします。"
date: "2019-06-04T11:05:57+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: "/images/icons/python_icon.png"
---

以前の記事 [SeleniumでFirefoxの複数タブを同時に開く時にポップアップブロックされる問題に対処する](/post/python/setup-selenium-webdriver/) では、ちょっとニッチなFirefoxでSeleniumを動かす時のTipsを紹介しました。

今回はSeleniumのコードを書く時のTipsを紹介します。

<!--adsense-->

## Seleniumは動作が早すぎる

本来人間が行う操作をSeleniumが肩代わりをしてコードを実行することで高速に操作するわけですが、そこでうっかり見落としがちなのは **「待ち」** です。

例えば、ボタンをクリックなどの何らかのイベントをトリガーとして、ブラウザは通信や画面の描画をします。
ブラウザが処理している間、人間はブラウザ動作の完了を待っています。一通り画面がさわれそうになったら **「あ、触れそうかな」** と判断して、次の動作をします。
これと同じことをSeleniumでも実現する必要があるのです。

Seleniumは人間の操作と比べて動作が高速であるため、正しく「待ち」を設定しましょう。

## WebDriverWait を使って表示を待つ

`WebDriverWait` を使って、 **任意のHTMLの要素が特定の状態になるまで待つ** 方法を紹介します。
`sleep` 関数で指定秒数を待つ方法よりも、実行環境への依存が減らせますし、実行時間の削減にも繋がります。

サンプルコードは以下のようになります。

{{< highlight python "linenos=inline" >}}

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
driver.get("http://somedomain/url_that_delays_loading")

element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "myDynamicElement"))
)

{{< /highlight>}}

`WebDriverWait` への第一引数はWaitさせたいWebDriver、第二引数はタイムアウト値を指定します。
`until` の中では 「充足されるまでWebDriverをWaitさせ続ける条件」 を記載します。
上記の例では、`myDynamicElement` というid属性を持ったHTMLの要素が存在するまで待っています。

`presence_of_element_located` がHTML要素の存在をチェックするための関数ですが、
他にも様々な条件が用意されています。

* title_is
* title_contains
* presence_of_element_located
* visibility_of_element_located
* visibility_of
* presence_of_all_elements_located
* text_to_be_present_in_element
* text_to_be_present_in_element_value
* frame_to_be_available_and_switch_to_it
* invisibility_of_element_located
* element_to_be_clickable
* staleness_of
* element_to_be_selected
* element_located_to_be_selected
* element_selection_state_to_be
* element_located_selection_state_to_be
* alert_is_present

URLは変えずにJavaScriptによってHTML要素の表示/非表示を切り替えて画面遷移を表現するWebアプリケーションの場合には、
要素が見えているかで判断したほうが良いため、 `visibility_of_element_located` を使います。

<!--adsense-->

## 暗黙的な待ち時間を設定する

先程は `WebDriverWait` にタイムアウト値を設定しましたが、
共通的に暗黙的な待ち時間を設定することもできます。それが `implicitly_wait` を使う方法です。

{{< highlight python "linenos=inline, hl_lines=4" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.implicitly_wait(10) # seconds
{{< /highlight>}}


## 参考にさせていただいたサイト

* [5. Waits: Selenium Python Bindings 2 documentation](https://selenium-python.readthedocs.io/waits.html)