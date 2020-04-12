---
title: "Waiting for an element to be displayed using the WebDriverWait in Selenium"
description: "Fetching an element before it is displayed during Selenium execution can cause an error. In that case, you should wait until the element is displayed with the WebDriverWait. Here's how to do it."
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

In a previous article [Avoiding pop-up blocking when opening multiple Firefox tabs simultaneously in Selenium](/en/post/python/setup-selenium-webdriver/), I presented tips on running Selenium in Firefox.

In this article, I will show you some tips for writing Selenium code.

<!--adsense-->

## Selenium works faster than people.

Selenium is fast, but it's easy to overlook **waitting** when writing code that works with Selenium.

The browser communicates and draws the screen when some event is triggered, such as the click of a button. While the browser is processing, the human is waiting for the browser to complete its actions. A human confirms that the interaction on the screen is over, **"Oh, I think I'm going to touch it "**, and then does the next operation.

The same idea is needed for code using Selenium.
Selenium is faster than human operation, so you need to set the "wait" correctly.

## Waiting for an element to appear using WebDriverWait

The following is an introduction to **waiting for an arbitrary HTML element to be in a certain state** using `WebDriverWait`.

A common method used by beginners is to wait with the `sleep` function to specify the time when the element is expected to be displayed for sure.
However, using `WebDriverWait` to wait for an element is less dependent on the execution environment and reduces the execution time than using `sleep` function.

Here is the sample code.

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

Specify the WebDriver to wait as the first argument to `WebDriverWait` and the timeout value as the second argument.
Write the condition to the `until` function to keep the WebDriver waiting until it is satisfied.
In the above example, Selenium will stop working until the presence of an HTML element with the id attribute `myDynamicElement` is verified.

A `presence_of_element_located` is a function to check for the existence of an HTML element. There are also other functions that allow you to specify various conditions.

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

In the case of a web application that expresses screen transitions by using JavaScript to show or hide HTML elements without changing URL, the
The `visibility_of_element_located` is used because it is better to determine whether an element is visible or not.

In a web application that switches between showing and hiding HTML elements using JavaScript without changing the URL, it is better to set the condition based on whether the element is visible or not. Instead of `presence_of_element_located`, use `visibility_of_element_located`.

<!--adsense-->

## Set an implicit wait time

Rather than setting a timeout value to `WebDriverWait`, you can also set a common implicit wait time. You can use `implicitly_wait` for this purpose.

{{< highlight python "linenos=inline, hl_lines=4" >}}
from selenium import webdriver

driver = webdriver.Firefox()
driver.implicitly_wait(10) # seconds
{{< /highlight>}}


## References

* [5. Waits: Selenium Python Bindings 2 documentation](https://selenium-python.readthedocs.io/waits.html)