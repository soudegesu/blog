---
title: "Use PyPDF2 - which PyPDF 2 or PyPDF 3 should be used?"
description: "Which should I use PyPDF2 or PyPDF3? I looked for resources about PyPDF2 and PyPDF3."
date: "2018-12-03T10:19:07+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pdf"
  - "pypdf2"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Introduction

In previous article, we can extract text on a PDF file using [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).

* [Use PyPDF2 - open PDF file or encrypted PDF file](/en/post/python/open-pdf-with-pypdf2/)
* [Use PyPDF2 - extract text data from PDF file](/en/post/python/extract-text-from-pdf-with-pypdf2/)

I will introduce [PyPDF3](https://github.com/mstamy2/PyPDF3) in this article.

<!--adsense-->

## PyPDF2 and PyPDF3 exist

When I looked for various usage of [PyPDF2](https://pythonhosted.org/PyPDF2/index.html), I found the follwing [commnet in StackOverflow](https://stackoverflow.com/questions/50751267/only-algorithm-code-1-and-2-are-supported).

![stack_overflow](/images/20181203/stack_overflow.png)

The [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) has been stopped since 3 years ago?! And, new version [PyPDF3](https://github.com/mstamy2/PyPDF3) exists?! Really?

**Which should I use PyPDF2 or PyPDF3 ??**

### Check the PyPI

Does [PyPDF3](https://github.com/mstamy2/PyPDF3) exist on PyPI? Check with `pip` command.

This is [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).

{{< highlight bash "linenos=inline" >}}
pip search PyPDF2
> PyPDF2 (1.26.0)   - PDF toolkit
{{< / highlight >}}

This is [PyPDF3](https://github.com/mstamy2/PyPDF3).

{{< highlight bash "linenos=inline" >}}
pip search PyPDF3
> PyPDF3 (1.0.1)  - Pure Python PDF toolkit
{{< / highlight >}}

Both are really present!!

<!--adsense-->

## What is PyPDF3 ?

In this section, I show my understanding about [PyPDF3](https://github.com/mstamy2/PyPDF3) by reading [roadmap](https://github.com/mstamy2/PyPDF3/wiki/Roadmap) on Github and another resources.

* Volunteers have started [PyPDF3](https://github.com/mstamy2/PyPDF3) project that is based on [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) because [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) has not been updated since 3 years ago.

* Initial goals are to fully implement existing features and fix some of the most critical bugs/performance issues from [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) before moving on to new functionality.

* However, development is not active as far as seeing the commit log.

<!--adsense-->

## All of the story is discussed in a certain github issue

As a further investigation, I got to one github issue.

* [Rebooting PyPDF2 Maintenance #385](https://github.com/mstamy2/PyPDF2/issues/385)

![reboot_pypdf2](/images/20181203/reboot_pypdf2.png)

In summarize..

* [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) core maintainer had not updated it because of busy
* However he has decided to restart to update PyPDF2
* Developers also discuss [PyPDF3](https://github.com/mstamy2/PyPDF3) in that issues

## Conclusion

**We can use [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) without problems.**

I checked issues and pull requests in [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) repository and I understand that [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) is still alive.
