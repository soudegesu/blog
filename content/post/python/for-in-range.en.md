---
title: "Use Range function in Python"
description: "Python has more utility function implementations than other programming languages. This time, I will introduce the for statement processing using the Python range() function."
date: "2019-10-25T08:41:41+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

Python has more utility function implementations than other programming languages.
This time, I will introduce the for statement processing using the Python `range()` function.

<!--adsense-->

## Environment

I have confirmed the operation in the following environment.

* Python 3.8

## range() function is

A `range ()` is a Python built-in function used to create a sequence of numbers and mainly used in combination with the for statement. Takes several arguments to control the rules for generating sequence.

## Use range() function

### Generate a sequence starting from 0

This is the most basic usage. Give an integer argument to the `range ()` function.

In following example, generate a sequence of numbers starting from `0` up to `number - 1` given an integer argument to range () function.

{{< highlight python "linenos=inline" >}}
for i in range(5):
    print(i)

> 0
> 1
> 2
> 3
> 4
{{< / highlight >}}

<!--adsense-->

### Generate a sequence starting with an arbitrary number

By giving two integer arguments to the `range ()` function, it will generate a sequence of numbers starting from `number of first argument` up to `number of second argument-1`.

{{< highlight python "linenos=inline" >}}
for i in range(2, 5):
    print(i)

> 2
> 3
> 4
{{< / highlight >}}

`range (0, N)` is equivalent to `range (N)` (`N` is any integer value).

{{< highlight python "linenos=inline" >}}
for i in range(0, 5):
    print(i)

> 0
> 1
> 2
> 3
> 4
{{< / highlight >}}

The value of the first argument must be smaller than the value of the second argument.
This is because it adds one by one implicitly internally. An example of no sequence generated is as follows.

{{< highlight python "linenos=inline" >}}
for i in range(10, 0):
    print(i)

>
{{< / highlight >}}

<!--adsense-->

### Generate a sequence of numbers starting with any number and with any addition step

If you give three integer arguments to the `range ()` function, generate the number of sequence starting with the `number of the first argument` and ending with the `number of the second argument -1` in `number increments of the third argument`.

In the following, a number sequence is made by adding 2 between integer values ​​from 2 to 8.

{{< highlight python "linenos=inline" >}}
for i in range(2, 8, 2):
    print(i)

> 2
> 4
> 6
{{< / highlight >}}

Generate a sequence of decreasing numbers by giving a negative integer to the third argument.

{{< highlight python "linenos=inline" >}}
for i in range(5, 0, -1):
    print(i)

> 5
> 4
> 3
> 2
> 1
{{< / highlight >}}

Unfortunately, it is not possible to generate a sequence that handles a decimal fraction.

{{< highlight python "linenos=inline" >}}
for i in range(1, 5, 0.2):
    print(i)

> TypeError: 'float' object cannot be interpreted as an integer
{{< / highlight >}}


### Use it with list comprehensions

Initialize a numeric array by combining the `range ()` function with a list comprehension.

{{< highlight python "linenos=inline" >}}
arr = [i for i in range(1, 10, 3)]
print(arr)

> [1, 4, 7]
{{< / highlight >}}

<!--adsense-->

## Advantages of using the range () function

The object created by the `range ()` function is **not an array type** , but a **`range` class type** . Print the object type.

{{< highlight python "linenos=inline" >}}
hoge = range(1, 10)
print(hoge)

> range(1, 10)

print(type(hoge))

> <class 'range'>

{{< / highlight >}}

That is stated in the [Official Python documents](https://docs.python.org/ja/3/tutorial/controlflow.html#the-range-function). The following is a quote.

> In many ways the object returned by range() behaves as if it is a list, but in fact it isn’t. It is an object which returns the successive items of the desired sequence when you iterate over it, but it doesn’t really make the list, thus saving space.

## References

* [4. More Control Flow Tools](https://docs.python.org/3/tutorial/controlflow.html#the-range-function)
