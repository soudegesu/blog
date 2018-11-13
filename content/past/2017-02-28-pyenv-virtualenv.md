---
title: "pyenvとpyenv-virtualenvでanacondaと共存する"
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
url: /python/pyenv/anaconda
twitter_card_image: /images/icons/python_icon.png
---
## はじめに
今までローカル環境のpythonを切り替えるためにpyenvのみを利用してきました。
anacondaを使用する機会も増えてきたので、`pyenv install`からの`pyenv local`コマンドでanaconda環境が構築するのですが、
`activate`の部分をもう少しスマートに行いたいため、 *pyenv-virtualenv* も用いる方法に変更します。

## 今回やりたいこと
1. 1台のマシンの中で使用するpythonのバージョンを切り替えたい
1. さらに言えば、ディストリビューションも切り替えたい(anaconda)
1. *anaconda* と *pyenv* の `activate` の競合を解決したい
    1. *anaconda* を`activate`する際にフルパスで指定するのを避けたい

1と2は *pyenv* で、3は *pyenv-virtualenv* で解決できることになります。

## 環境
* MacOSX Yosemite
* homebrew
* zsh

## セットアップ手順
### 仮想環境切り替え用のモジュールをインストール

{{< highlight "linenos=inline" >}}
# pyenvをインストールする
brew install pyenv
#pyenv-virtualenvをインストールする
brew install pyenv-virtualenv
{{< / highlight >}}

### シェル起動時の設定ファイルを修正

* .zshrcに以下を追記する

{{< highlight "linenos=inline" >}}
# pyenvの設定
export PYENV_ROOT="${HOME}/.pyenv"
if [ -d "${PYENV_ROOT}" ]; then
    export PATH=${PYENV_ROOT}/bin:${PYENV_ROOT}/shims:${PATH}
    eval "$(pyenv init -)"
fi
# pyenv-virtualenvの設定
if which pyenv-virtualenv-init > /dev/null; then eval "$(pyenv virtualenv-init -)"; fi
{{< / highlight >}}

* ターミナルを再起動する(sourceコマンドでの再読込でも可)

## Pythonの仮想環境を作成する
### テスト用のディレクトリを作成
*hoge* ディレクトリ配下を任意のpythonバージョンで動作するようにしましょう。
pythonのバージョンを確認しておきます。

{{< highlight "linenos=inline" >}}
mkdir hoge
cd hoge
python -V
> Python 2.7.6
{{< / highlight >}}

### pythonのバージョンを設定
pyenvで使用可能なpythonを指定します。
今回は3.6.0をインストールした後、*hoge* ディレクトリ配下を3.6.0にします。

{{< highlight "linenos=inline" >}}
pyenv install 3.6.0
pyenv local 3.6.0
python -V
> Python 3.6.0
{{< / highlight >}}

### 仮想環境の構築
pythonのvenvモジュールを呼び出し、仮想環境を構築します。
今回は便宜的にカレントディレクトリに仮想環境を展開します。
`activate`を読み込むことで、仮想環境に切り替わります。

{{< highlight "linenos=inline" >}}
python3 -m venv .
source bin/activate
{{< / highlight >}}

`deactivate`する場合には`deactivate`コマンドを入力するだけです。

{{< highlight "linenos=inline" >}}
deactivate
{{< / highlight >}}

## Pythonの仮想環境を作成する(anacondaの場合)
### テスト用のディレクトリを作成
同様にして、anaconda環境を構築するために、*fuga*ディレクトリを作成します。
pythonのバージョンがデフォルトであることも確認しておきましょう。

{{< highlight "linenos=inline" >}}
mkdir fuga
cd fuga
python -V
Python 2.7.6
{{< / highlight >}}

### anacondaのバージョンを設定
こちらも手順としては同様です。
pyenvではインストールするpythonのディストリビューションが選択できます。
`anaconda`以外にも`miniconda`や`pypy`、`jython`等でも構築が可能です。

{{< highlight "linenos=inline" >}}
pyenv install anaconda3-4.1.0
pyenv local anaconda3-4.1.0
python -V
> Python 3.5.1 :: Anaconda 4.1.0 (x86_64)
{{< / highlight >}}

### 仮想環境の構築
`conda`コマンドを使用して、存在している環境情報を確認することができます。

{{< highlight "linenos=inline" >}}
conda info -e
> root                  *  /Users/XXXXXXXXX/.pyenv/versions/anaconda3-4.1.0
{{< / highlight >}}

次に、anacondaの仮想環境を構築します。

{{< highlight "linenos=inline" >}}
conda create -n fuga python=3.5 anaconda
{{< / highlight >}}

`-n` オプションは構築する仮想環境の名前、`python=3.5`は使用するpythonのバージョン、`anaconda`は仮想環境上で使用するモジュールになります。

`pyenv activate`コマンドを使用することで、anacondaの環境をactivateできます。

{{< highlight "linenos=inline" >}}
pyenv activate anaconda3-4.1.0/envs/fuga
{{< / highlight >}}

deactivateも同様ですね。

{{< highlight "linenos=inline" >}}
pyenv deactivate
{{< / highlight >}}

## まとめ
* `pyenv`と`pyenv-virtualenv`を使用することで、pythonの仮想環境の切り替えができるようになりました。
* `venv`で作成した環境と`conda`で作成した仮想環境も`pyenv`を使用すれば競合することなく`activate`することができます。
