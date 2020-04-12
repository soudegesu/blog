---
title: "Set up the Selenium Webdriver. Let's automate with Python!"
description: "Automate with Selenium in Python. In this article, we will set up WebDriver, which is the initial setup for running Selenium."
date: "2019-05-31T08:09:27+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

These days, even non-programmers are increasingly doing programming. That's a good thing. Particularly popular with them is the automation of their work using the programming language Python. This means that we can use programs to simplify routine tasks that were previously done by hand.

I've been getting a lot of needs (or rather questions) about running Selenium in Python, so I've decided to document them.

## Goals

* Set up the Selenium Webdriver
* Launch a web browser using Selenium WebDriver

<!--adsense-->

## What is Selenium?

Selenium was originally created as a test tool for verifying the behavior of web applications (applications running on a browser).
The word "test tool" may sound a little difficult, but in a simple explanation, it should be understood as software that executes a program to check the correct behavior of the system, such as "clicking the A button transitions to the B screen".

Selenium has the feature of executing the instruction of the written test program by manipulating the actual web browser.
In addition, due to the fact that Selenium supports a number of programming languages that can run Selenium, as well as the number of different browsers that can be operated by Selenium, it is now used not only as a testing tool, but also as a program execution environment to streamline operations on the browser.

## Execution environment

Here are the setup steps to follow. The operating environment is as follows.

* Python `3.7.2`
* selenium `3.141.0`

##  Installing Selenium

First, install [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html).

{{< highlight bash "linenos=inline" >}}
pip install selenium
{{</ highlight>}}

<!--adsense-->

## Download WebDriver

Next, set up the drivers needed to start the browser.

The official documentation of Selenium provides [download links for each browser's driver](https://www.seleniumhq.org/download/), so you can download the appropriate driver for your application.

### Running in Mozilla Firefox

[Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) needs [geckodriver](https://github.com/mozilla/geckodriver/releases) to work with Firefox.

[Gecko](https://ja.wikipedia.org/wiki/Gecko) refers to Firefox's built-in rendering engine, which has the ability to draw HTML and other content.

Download the appropriate driver for your machine from the [geckodriver](https://github.com/mozilla/geckodriver/releases) page.

Select `geckodriver-vx.xx.x-macos.tar.gz` if your environment is Mac, or `geckodriver-vx.xx.x-win64.zip` if you're on 64bit Windows.
After downloading, you can put the contents of the unzipped zip file through the PATH environment variable.
I won't explain how to use PATH here, so please search with "Windows PATH" or "Mac PATH".

### Running in Google Chrome

In the case of Chrome, you will need [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) as well as Firefox.
From the [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) page, select a version of the driver that is equal to the version of Google Chrome that is installed on your PC.

Again, you can pass the contents of the unzipped zip file to the PATH environment variable.
I won't explain how to use PATH here, so please search with "Windows PATH" or "Mac PATH".

### Running in Safari

Safari is a bit special and does not require the installation of a driver.

From the Safari settings screen, select [Details] > [Show "Development" on the menu bar] to display the "Development" menu in your browser.

![safari_preference](/images/20190531/safari_preference.png)

Then, from the Development menu, select **Allow remote automation**.

<!--adsense-->

## Launching a browser using Selenium

Once you have installed the driver, you can start the browser with [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html), and here is a sample code for Python.

* Launching Firefox

{{< highlight python "linenos=inline" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.get('https://www.google.com/')
{{</ highlight>}}

* Launching Chrome

{{< highlight python "linenos=inline" >}}
from selenium import webdriver

driver = webdriver.Chrome()
driver.get('https://www.google.com/')
{{</ highlight>}}

* Launching Safari

{{< highlight python "linenos=inline" >}}
from selenium import webdriver

driver = webdriver.Safari()
driver.get('https://www.google.com/')
{{</ highlight>}}

Just by switching webdriver, you can change the browser that stands up.

## References

* [Selenium - Downloads](https://www.seleniumhq.org/download/)
