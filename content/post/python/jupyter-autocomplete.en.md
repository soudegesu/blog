---
title: "Autocomplete your code in Jupyter Notebook"
description: "By default, code completion is not available in Jupyter Notebook. A separate configuration is required to complement the library's code."
date: "2019-08-21T07:51:20+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

[Jupyter Notebook](https://jupyter.org/) is often used as a Python development environment, but code completion is not enabled by default. That's why it's a bit of a problem when importing packages. This time, I introduce some tips for code completion in Jupyter Notebook.

<!--adsense-->

## Autocomplete the code

Code completion in the IDE is an important feature for smooth implementation of the program.
Some people call it **autocomplete** , and others call it **intelli sense**, but the functions are the same.

I investigated how to enable autocompletion when coding in [Jupyter Notebook](https://jupyter.org/), so I'll leave it as a reminder.

## Method 1: Use `IPCompleter.greedy`

Here's the easiest way to do it first.
Just open any Notebook file and run the following magic command.

{{< highlight python "linenos=inline" >}}
%config IPCompleter.greedy=True
{{< / highlight >}}

Press the `Tab` key to display the input completion.

However, there is a one-tempo delay until the candidate is displayed after the typing key. In my environment, I had to wait about 1-2 seconds.

<!--adsense-->

## Method 2: Use autocompletion of `Nbextensions`

Next, I'll show you how to use the library to introduce [Jupyter Notebook](https://jupyter.org/)'s extensions at once.

The following command assumes that Jupyter Notebook is already installed.

{{< highlight bash "linenos=inline" >}}
# Install the library
pip install jupyter-contrib-nbextensions
pip install jupyter-nbextensions-configurator

# Enabling Extensions
jupyter contrib nbextension install
jupyter nbextensions_configurator enable
{{< / highlight >}}

After that, restart Jupyter Notebook and you will see that a new tab labeled "Nbextentions" has been added.

![nbextentions.png](/images/20190821/nbextentions.png)

Activate [Hinterland](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions/hinterland) for code completion .

You can also press the `Tab` key to display the input suggestions.
I recommend [Hinterland](https://github.com/ipython-contrib/jupyter_contrib_nbextensions/tree/master/src/jupyter_contrib_nbextensions/nbextensions/hinterland) because the time to display candidates is faster than `IPCompleter.greedy`.

![completion.png](/images/20190821/completion.png)

<!--adsense-->

## Conclusion

I showed you how to use code completion on Jupyter Notebook. I recommend you to use the autocompletion of `Nbextensions` in **Method 2.** It's quick to complete, and it's very helpful because it will show you candidates even when you're typing.

## References

* [Introduction to IPython configuration](https://ipython.org/ipython-doc/3/config/intro.html)
* [Migrating from IPython Notebook](https://jupyter.readthedocs.io/en/latest/migrating.html#since-jupyter-does-not-have-profiles-how-do-i-customize-it)
