---
title: "Setting to avoid python and anaconda conflict using pyenv and pyenv-virtualenv"
date: 2017-02-28
thumbnail: /images/icons/python_icon.png
categories:
    - pyenv
    - anaconda
tags:
    - python
    - pyenv
    - pyenv-virtualenv
    - anaconda
url: /en/python/pyenv/anaconda
twitter_card_image: /images/icons/python_icon.png
---
## Introduction

I have been using pyenv only to switch versions of python in local environments.
However, recently I have used anaconda more often.
Since ptyhon and anaconda conflict when executing `activate` command, I decided to use pyenv-virtualenv.

## Goals
1. I want to switch python version in one machine
1. I also want to switch the python distribution (anaconda in this case)
1. I want to resolve conflict between *anaconda* and *pyenv* when I execute `activate` command
    1. When I activate anaconda, I do not execute the command with full path

1 and 2 are `pyenv`, and 3 can be solved with `pyenv-virtualenv`.

## Environment
* MacOSX Yosemite
* homebrew
* zsh

## Setup
### Install modules for switching python virtual environments

{{< highlight bash "linenos=inline" >}}
# install pyenv
brew install pyenv
# install pyenv-virtualenv
brew install pyenv-virtualenv
{{< / highlight >}}

### Edit configuration file at terminal startup

* Add the following settings to `.zshrc`

{{< highlight bash "linenos=inline" >}}
# setting for pyenv
export PYENV_ROOT="${HOME}/.pyenv"
if [ -d "${PYENV_ROOT}" ]; then
    export PATH=${PYENV_ROOT}/bin:${PYENV_ROOT}/shims:${PATH}
    eval "$(pyenv init -)"
fi
# setting for pyenv-virtualenv
if which pyenv-virtualenv-init > /dev/null; then eval "$(pyenv virtualenv-init -)"; fi
{{< / highlight >}}

* Reboot terminal(you can also use `source` command)

## Create a Python virtual environment(for Python)
### Create directory

In this time, I switch to the arbitrary python version under *hoge* directory.

Print default python version.

{{< highlight bash "linenos=inline" >}}
cd ~
mkdir hoge
cd hoge
python -V
> Python 2.7.6
{{< / highlight >}}

### Specify python version

Install available python with `pyenv install` command.
After that, Python version will be changed with `pyenv local` command.

{{< highlight bash "linenos=inline" >}}
pyenv install 3.6.0
pyenv local 3.6.0
python -V
> Python 3.6.0
{{< / highlight >}}

### Create virtual environment

Create python virtual environment in current directory with `venv` module.
Activate the virtual environment by loading `activate` shell.

{{< highlight bash "linenos=inline" >}}
python3 -m venv .
source bin/activate
{{< / highlight >}}

And use `deactivate` command to deactivate virtual environment.

{{< highlight "linenos=inline" >}}
deactivate
{{< / highlight >}}

## Create a Python virtual environment(for anaconda)
### Create directory

Create a *fuga* directory for anaconda environment.
Also make sure the python version is the default.

{{< highlight bash "linenos=inline" >}}
cd ~
mkdir fuga
cd fuga
python -V
Python 2.7.6
{{< / highlight >}}

### Specify anaconda version

Install anaconda with `pyenv install` command.
By using pyenv, you can install various Python distributions.

{{< highlight bash "linenos=inline" >}}
pyenv install anaconda3-4.1.0
pyenv local anaconda3-4.1.0
python -V
> Python 3.5.1 :: Anaconda 4.1.0 (x86_64)
{{< / highlight >}}

### Create virtual environment
With `conda info` command, you can check the existing environment information.

{{< highlight bash "linenos=inline" >}}
conda info -e
> root                  *  /Users/XXXXXXXXX/.pyenv/versions/anaconda3-4.1.0
{{< / highlight >}}

Next, we build a anaconda virtual environment.

{{< highlight bash "linenos=inline" >}}
conda create -n fuga python=3.5 anaconda
{{< / highlight >}}

With `pyenv activate` command, you can activate anaconda environment.

{{< highlight bash "linenos=inline" >}}
pyenv activate anaconda3-4.1.0/envs/fuga
{{< / highlight >}}

`deactivate` is also the same as before.

{{< highlight "linenos=inline" >}}
pyenv deactivate
{{< / highlight >}}

## Conclusions

* By using `pyenv` and` pyenv-virtualenv`, you can switch the virtual environment of python
* The virtual environment created with `venv` and the virtual environment created with` conda` can be `activate` without conflict using` pyenv`
