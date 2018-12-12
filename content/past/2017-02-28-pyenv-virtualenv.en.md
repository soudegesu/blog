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
However, recently I use anaconda more often.
Since python and anaconda conflict when executing `activate` command, I decided to use pyenv-virtualenv.

## Goals
1. Switch python version in one machine
1. Switch the python distribution (anaconda in this case)
1. Resolve conflict between *anaconda* and *pyenv* when I execute `activate` command
    1. Activate anaconda without executing the command with full path

Both 1 and 2 above are able to solved with `pyenv` and 3 with `pyenv-virtualent`.

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

Install any available version of Python with `pyenv install` command and also change `pyenv local` command.

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
It is available to install various python distributions by using `pyenv`.

{{< highlight bash "linenos=inline" >}}
pyenv install anaconda3-4.1.0
pyenv local anaconda3-4.1.0
python -V
> Python 3.5.1 :: Anaconda 4.1.0 (x86_64)
{{< / highlight >}}

### Create virtual environment

And the existing environment can check from `conda info` command.

{{< highlight bash "linenos=inline" >}}
conda info -e
> root                  *  /Users/XXXXXXXXX/.pyenv/versions/anaconda3-4.1.0
{{< / highlight >}}

For the next, I build a anaconda virtual environment.

{{< highlight bash "linenos=inline" >}}
conda create -n fuga python=3.5 anaconda
{{< / highlight >}}

Now activate anaconda environment with `pyenv activate` command.

{{< highlight bash "linenos=inline" >}}
pyenv activate anaconda3-4.1.0/envs/fuga
{{< / highlight >}}

And use `pyenv deactivate` command to deactivate virtual environment.

{{< highlight "linenos=inline" >}}
pyenv deactivate
{{< / highlight >}}

## Conclusion

It is available to

* Switch the virtual environment of python by using `pyenv` and` pyenv-virtualenv`
* Activate multiple virtual environments, created with either vend or conda, without conflicting
