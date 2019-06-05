---
title: "Selenium実行中に稀にエラーになる時はWaitが正しく使えているか見てみよう"
description: "Selenium実行中に稀にエラーになる時はWaitで要素の表示がされるまで待ちましょう、という話をします。"
date: "2019-06-04T11:05:57+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
draft: true
isCJKLanguage: true
twitter_card_image: "/images/icons/python_icon.png"
---

以前の記事 [SeleniumでFirefoxの複数タブを同時に開く時にポップアップブロックされる問題に対処する](/post/python/setup-selenium-webdriver/) では、

## Seleniumの自動操作がたまにエラーになる

## Seleniumは動作が早すぎる

## Waitを使って表示を待つ

{{< highlight python "linenos=inline" >}}

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()
driver.get("http://somedomain/url_that_delays_loading")
try:
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "myDynamicElement"))
    )
finally:
    driver.quit()
{{< /highlight>}}

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

## 暗黙的な待ち時間を設定する

{{< highlight python "linenos=inline, hl_lines=4" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.implicitly_wait(10) # seconds
{{< /highlight>}}


## 参考にさせていただいたサイト

* [5. Waits: Selenium Python Bindings 2 documentation](https://selenium-python.readthedocs.io/waits.html)