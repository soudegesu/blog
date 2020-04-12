---
title: "Selecting a specific element in Selenium"
description: "Here are the functions to use when you want to get a unique element in Selenium: id attribute, class attribute, CSS selector, XPath, etc."
date: "2020-01-16T08:48:46+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

In previous article [Waiting for an element to be displayed using the WebDriverWait in Selenium](/en/post/python/selenium-wait-element/), 
`WebDriverWait` is used to prevent the browser from performing the following actions until the condition is satisfied.

This time, I will introduce you how to select HTML elements that can also be used in WebDriverWait.

<!--adsense-->

## Selection with id attribute

First of all, I introduce the most common way to specify the id attribute.
The id attribute is used to indicate that an element is unique in HTML.

You can check the HTML of the web page you are viewing by using the browser's View Source menu or the developer tools.
For example, an attribute starting with `id=` in an HTML tag is called an ID attribute as follows.

{{< highlight python >}}
<input id="user_name"></input>
{{< /highlight>}}

Get an element with the `find_element_by_id` function of the Selenium Driver.

{{< highlight python >}}
user_name = driver.find_element_by_id('user_name')
{{< /highlight>}}

As I discussed earlier, "unique in HTML", it is up to the editor of the web page to make it truly unique.
In other words, it is possible to have more than one id in a single HTML.

<!--adsense-->

## Selection by class attribute

Next is the selection by class attribute. Unlike the id attribute mentioned above, the class attribute assumes that there are multiple elements in the HTML.

{{< highlight python >}}
<ul>
  <li class="fruit">apple</li>
  <li class="fruit">melon</li>
  <li class="fruit">peache</li>
</ul>
{{< /highlight>}}

Note that there are two types of functions: **find_element_by_class_name**, which retrieves only the first hit element, and **find_elements_by_class_name**, which retrieves all the hit elements in a list type.

{{< highlight python >}}
# The first "apple" is returned.
fruit = driver.find_element_by_class_name('fruit')
{{< /highlight>}}

{{< highlight python >}}
# The first "apple," "melon," and "peache" are all returned on the list.
fruits = driver.find_elements_by_class_name('fruit')
{{< /highlight>}}

<!--adsense-->

## Selection by name attribute

The name attribute is often used in **input tags** on login screens and user information editing pages.

{{< highlight python >}}
<form id="loginForm">
  <input name="user_name" type="text" />
  <input name="password" type="password" />
</form>
{{< /highlight>}}

Because these also duplicate values like the class attribute, there are two kinds of functions, `find_element_by_name` and `find_elements_by_name`.

{{< highlight python >}}
username = driver.find_element_by_name('username')
password = driver.find_element_by_name('password')
{{< /highlight>}}

<!--adsense-->

## How to make a selection when narrowing down an element is complicated

The majority of cases where you write code in Selenium are cases where you get a unique element.
However, web page authors don't always make pages easy to automate with Selenium.
In some cases, unique elements can be obtained by specifying multiple class attributes.

This section shows you how to identify elements with a slightly more complex specification.

### Select an element using the parent-child relationship of a class

In order to get an "apple" in the li tag in the following HTML, you need to specify the `apple` class attribute under the class attribute `menu`. If you specify the class of `apple` only, the div tag "apple" is also retrieved.

{{< highlight python >}}
<div class="apple">apple</div>
<ul class="menu">
  <li class="apple">apple</li>
  <li class="melon">melon</li>
  <li class="peache">peache</li>
</ul>
{{< /highlight>}}

If it needs complex conditions like the above, use `find_element_by_css_selector`.
Here, we focus on the parent-child relationship of the class attribute to narrow down the elements.

{{< highlight python >}}
apple = driver.find_element_by_css_selector('.menu .apple')
{{< /highlight>}}

The CSS selector of `find_element_by_css_selector` is a method to select an element by specifying a condition in CSS.
There are many ways to use CSS selectors, such as specifying conditions by parent-child relationship, getting adjacent elements, and the first element of a list. So, if you learn how to write CSS selectors, you will be able to cover most cases.

<!--adsense-->

### Selection by XPath

If it's hard to get even with CSS selectors, you can try writing with XPath.
XPath is used to locate a node in XML or HTML.
You may feel that the specification method is less readable than the CSS selector. However, it's useful to remember because it allows for a flexible selection of elements.

{{< highlight python >}}
<body>
  <div class="apple">apple</div>
  <ul class="menu">
    <li class="apple">apple</li>
    <li class="melon">melon</li>
    <li class="peache">peache</li>
  </ul>
</body>
{{< /highlight>}}

{{< highlight python >}}
apple = driver.find_element_by_xpath("//ul[@class='menu']/li[1]")
apple = driver.find_element_by_xpath("//li[@class='apple']")
{{< /highlight>}}

