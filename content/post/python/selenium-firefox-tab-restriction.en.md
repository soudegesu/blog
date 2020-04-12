---
title: "Avoiding pop-up blocking when opening multiple Firefox tabs simultaneously in Selenium"
description: "Here are some tips on how to deal with pop-up blocking in Firefox when using Selenium to open multiple URLs in a separate tab at once."
date: "2019-06-01T03:00:00+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: "/images/icons/python_icon.png"
---

In previous article [Set up the Selenium Webdriver. Let's automate with Python!](/en/post/python/setup-selenium-webdriver/) ,
I introduced the procedure to build Selenium execution environment in Python.

In this article, I would like to introduce a problem I actually ran into when opening multiple URLs in different tabs at the same time in Firefox and how to deal with it.

<!--adsense-->

## What I originally wanted to do

* Open multiple URLs (about 100) at the same time and check the displayed screen visually.
* Then, in Selenium, open the URL by executing the `window.open()` function of Javascript.

## Issue: Pop-up blocks appear when opening multiple tabs in Firefox

Run the following code using Firefox WebDriver.

{{< highlight python "linenos=inline" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.get('https://www.google.com/')
for i in range(0, 100):
    driver.execute_script(f"window.open('https://www.google.com/', '{i}')")
{{< /highlight>}}

Then, after about 20 tabs were opened smoothly, the following pop-up block was suddenly displayed.

![popup_block](/images/20190601/popup_block.png)

Since popup blocks are only displayed for tabs running the `window.open()` function, you will definitely be overlooked if a lot of browsers' tabs are opened. Allowing pop-up blockers will display the page correctly, but it is not automated because of human intervention.

<!--adsense-->

## Solution: set the maximum number of pop-ups

Programmatically set the values of the browser's "configuration" options, which are used by the `Options` class when creating the Firefox WebDriver. The following sample code uses two properties.

* `dom.disable_open_during_load`: Perform a pop-up block during page loading.
* `dom.popup_maximum`: the maximum number of separate tabs to be displayed by popups (default: **20**).

{{< highlight python "linenos=inline, hl_lines=2 4-8" >}}
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

options = Options()
options.set_preference("dom.disable_open_during_load", False)
options.set_preference('dom.popup_maximum', -1)

driver = webdriver.Firefox(options=options)
driver.get('https://www.google.com/')
for i in range(0, 100):
    driver.execute_script(f"window.open('https://www.google.com/', '{i}')")

{{< /highlight>}}

When `dom.popup_maximum` is set to `-1`, the maximum display limit of tabs is unlimited and popups are not blocked.

## References

* [mozillaZine](http://kb.mozillazine.org/About:config_entries)
