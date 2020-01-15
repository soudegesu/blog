---
title: "Python string concatenation: + operator/join function/format function/f-strings"
description: "Use the + operator, join function, format function and f-strings. In addition, the use in Python3 is assumed."
date: "2019-10-28T08:41:04+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

This time, I will introduce the method of string concatenation in Python.
Here, the Python version is assumed to be `3.x`.

<!--adsense-->

## Concatenate with '+' operator

The simplest way is string concatenation using the `+` operator.
Some programming languages ​​don't support string concatenation with the `+` operator, but Python has no problem.

{{< highlight python "linenos=inline, hl_lines=4" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = a + b + c
print(txt)

> aaabbbccc
{{< / highlight >}}

<!--adsense-->

## Concatenate between string literals

Python allows strings to be concatenated between string literals without using the `+` operator.
However, since I often use strings stored in variables, I have never used this method honestly.

{{< highlight python "linenos=inline, hl_lines=1" >}}
txt = 'aaa' 'ccc'
print(txt)

> aaacccc
{{< / highlight >}}

<!--adsense-->

## Join lists with the join () function

Next, concatenate the elements of the string stored in the list.
It can be linked with a for statement as follows, but the description will be redundant.

{{< highlight python "linenos=inline, hl_lines=2-4" >}}
arr = ['aaa', 'bbb', 'ccc']
txt = ''
for t in arr:
    txt += t
print(txt)

> aaabbbccc
{{< / highlight >}}

Now, you can easily join by using the `str` type `join()` function.

{{< highlight python "linenos=inline, hl_lines=3" >}}
arr = ['aaa', 'bbb', 'ccc']
# String join with empty character
txt = ''.join(arr)
print(txt)

> aaabbbccc
{{< / highlight >}}

In the above example, strings are joined by an empty character (`''`), but any combination character can be specified.
For example, to combine as a string separated by commas, implement as follows.

{{< highlight python "linenos=inline, hl_lines=2" >}}
arr = ['aaa', 'bbb', 'ccc']
txt = ','.join(arr)
print(txt)

> aaa,bbb,ccc
{{< / highlight >}}

<!--adsense-->

## concatenate with format () function

The `format()` function is for converting the format of a string, but since the final output of this function is a string, it can also be used for concatenation. Variables given as arguments are expanded in order for the occurrence of `{}` in the template string.

{{< highlight python "linenos=inline, hl_lines=4" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = '{}{}{}'.format(a, b, c)
print(txt)

> 'aaabbbccc'
{{< / highlight >}}

By giving a numerical value like `{0}`, it's possible to expand variables in any order or to expand variables repeatedly.

{{< highlight python "linenos=inline, hl_lines=4" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = '{0}{2}{1}'.format(a, b, c)
print(txt)

> 'aaacccbbb'
{{< / highlight >}}

<!--adsense-->

## concatenate with f-strings

In Python `3.6` and above, use `f-strings(formatted string literals)` which makes the `format()` function easier to use.
This can be used by simply adding a `f` or` F` before the quotes in the string literal. 
Expand any variable in `f-strings`, and call any process in `{}`.

{{< highlight python "linenos=inline, hl_lines=4" >}}
a = 'aaa'
b = 'bbb'
c = 'ccc'
txt = f'{a}{b}{c}'
print(txt)

> 'aaabbbccc'
{{< / highlight >}}
