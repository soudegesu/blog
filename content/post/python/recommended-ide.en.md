---
title: "Recommended IDEs or code editors for Python beginner"
description: "I introduce my recommended IDEs or code editors for Python beginner. Let's increase your development productivity using those IDEs."
date: "2018-11-27T09:49:50+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Motivation

My colleages who are Python beginners often asks me my recommended Python IDE.
After hearing what they'd like to do with Python from them at first, I suggest one of several IDEs or code editors.

In this article, I will introduce Python IDEs and code editors use cases.

## What is an IDE ?

An IDE is an abbreviation for **Integrated Development Environment**.
We have several steps for developing source code. These are writing codes, compililing, running codes and debugging.
An IDE is a software suite for that.

## What is a code editor?

A code editor is a tool specialized in the writing of programs and texts in general.
You can only edit after installation because it specializes in writing,
However, code editor has the same function as an IDE by installing the plug-in.

<!--adsense-->

## PyCharm

At first, [PyCharm](https://www.jetbrains.com/pycharm/) that is a Python IDE provided by Jetbrains.

![pycharm](/images/20181127/pycharm.png)

Compared with other IDEs, [PyCharm](https://www.jetbrains.com/pycharm/) is a multifunctional IDE. Especially, code completion and debugger are superior. So, [PyCharm](https://www.jetbrains.com/pycharm/) is suited for development of medium or large-scale system with Python.
(For example, developing web apps using [django](https://www.djangoproject.com/), python libraly code reading etc..)

Jetbrains provides two types of [PyCharm](https://www.jetbrains.com/pycharm/) editions, one is a professional edition(subscription model), another is a community edition(free of charge model). PyCharm editions comparison is [here](https://www.jetbrains.com/pycharm/features/editions_comparison_matrix.html). Community edition is ehough for development in most cases.

The only thing is, [PyCharm](https://www.jetbrains.com/pycharm/) startup is slowly.

<!--adsense-->

## Visual Studio Code

Secondly, [Visual Studio Code](https://code.visualstudio.com/) that is a code editor provided by Microsoft.
[Visual Studio Code](https://code.visualstudio.com/) is easy to use because it is optimized for building and debugging code.

![vscode](/images/20181127/vscode.png)

Developers can develop on various programming environment with [Visual Studio Code](https://code.visualstudio.com/) installed some plugins.
Microsft provides Python plugin for [Visual Studio Code](https://code.visualstudio.com/).

![vscode_python_extention.png](/images/20181127/vscode_python_extention.png)

[Visual Studio Code](https://code.visualstudio.com/) is suited for development of small or middle-scale system
(For example, developing web scaraper, AWS Lambda function etc..), because it is light in behavior or action.

<!--adsense-->

## Jupyter Notebook

Next is [Jupyter Notebook](http://jupyter.org/) that is an browser IDE. That was named **IPython Notebook** in past.

[Jupyter Notebook](http://jupyter.org/) can be installed with `pip` command as follows.

{{< highlight bash "linenos=inline" >}}
pip install -U pip  #update pip versiion
pip install jupyter #install jupyter
{{< / highlight >}}

and then, boot [Jupyter Notebook](http://jupyter.org/).

{{< highlight bash "linenos=inline" >}}
jupyter notebook
{{< / highlight >}}

After above command execution, browser boots automatically and open `http://localhost:8888`.

![jupyter_home](/images/20181127/jupyter_home.png)

[Jupyter Notebook](http://jupyter.org/) is suited for data visualization or machine learning because it is excellent in code execution in cell units and drawing graphs and tables.

![jupyter_iris](/images/20181127/jupyter_iris.png)

The file extension is `.ipynb` specialised in [Jupyter Notebook](http://jupyter.org/).
We can convert `.ipynb` file to `.py` file, however converted code is not executable.
And code completion in [Jupyter Notebook](http://jupyter.org/) is inferior as compared with others.

<!--adsense-->

## Google Colaboratory

At last, [Colaboratory](https://colab.research.google.com/) that is hosted by Google.
That is customised [Jupyter Notebook](http://jupyter.org/) for machine learning. We can run codes on special processor GPU and TPU.

## Conclusion

In this article, I introduced my reccomend python IDEs.

If you..

* develop production level application, use [PyCharm](https://www.jetbrains.com/pycharm/).
  * community edition is enough in most cases.
* develop light codes, use [Visual Studio Code](https://code.visualstudio.com/).
* process data like machine learning, use [Jupyter Notebook](http://jupyter.org/)
  * running codes on GPU or TPU, choice [Colaboratory](https://colab.research.google.com/)
