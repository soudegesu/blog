---
title: "Pythonの2と3を切り替えて、仮想環境を作る"
description: ""
date: 2018-04-26 00:00:00 +0900
categories: python
tags: python
---

Python使いであれば、Python 2.x と Python 3.x では文法的な互換性がないため、バージョンを正しく使い分けることは最初の第一歩です。
今回はMac環境でのバージョン切り替えとLinux環境でのバージョンの共存について書きます。

* Table Of Contents
{:toc}


## モチベーション
### Python 2.x と Python 3.x を共存させたい

Python 3.x は言語のバージョンアップに伴い、2.x 系との後方互換性をサポートしていません。
`__future__` モジュールや [six](https://hhsprings.bitbucket.io/docs/translations/python/six-doc-ja/) を使えば、
Python 2で書かれたコードをPython 3のランタイムで動かすことができる場合もありますが、基本的には書き直した方が好ましいと考えています。

互換性に纏わる話は、 書籍「エキスパートPython」がバージョン・アップして第2版となって帰ってきたので、そちらを見た方が良いかもしれません。

<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/4048930613/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4048930613&linkCode=as2&tag=soudegesu-22&linkId=a3d62631d025b73bac36ad1a91b2fb13"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4048930613&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4048930613" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>

### プロジェクト毎にモジュールを管理したい

プロジェクト毎にpythonのライブラリを管理したい(プロジェクト毎に依存モジュールが混ざらないよう)ケースが多いので、
仮想環境を簡単に管理できる仕組みも欲しいです。

## Mac OSの場合

MacOSの場合には [pyenv](https://github.com/pyenv/pyenv) を使って複数バージョンをインストールしつつ
[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) で仮想環境を管理することをオススメします。
もちろん、awsome的な [anyenv](https://github.com/riywo/anyenv) でも構いません。

### Homebrew のインストール

入っていなければ、 [Homebrew](https://brew.sh/index_ja) をインストールしましょう。

TOPページに「このスクリプトをターミナルで叩きなさい」とコマンドが記載されている超親切設計ツールなので、問題なくインストールできるはずです。

### pyenvのインストール

`pyenv` と `pyenv-virtualenv` をインストールします。

```
brew install pyenv pyenv-virtualenv
```

### .bashrc を書き換える

bashであれば `.bashrc` 、 zsh であれば `.zshrc` に以下を追記します。
ターミナルを起動する時に `rehase` してほしくなければ `--no-rehash` を入れます。

```
export PYENV_ROOT="${HOME}/.pyenv"
export PATH="$PATH:${PYENV_ROOT}/bin:${PYENV_ROOT}/shims"

eval "$(pyenv init --no-rehash -)"
eval "$(pyenv virtualenv-init -)"
```

### pythonをインストールして仮想環境を作る

ベースになるPythonをインストールします。

```
pyenv install 3.6.1
```

その後、対象のプロジェクト専用の仮想環境を準備します。
仮想環境の名前は `test_project` にしておきます。

```
pyenv virtualenv 3.6.1 test_project
```

次に `test_project` ディレクトリを作成して、
そのディレクトリ配下では `Python 3.6.1` のである仮想環境 `test_project` を使うように設定します。

```
mkdir test_project
cd test_project

pyenv local 3.6.1/envs/test_project
python -V
>> Python 3.6.1
```

試しにディレクトリから出てみましょう。

```
cd ../
python -V
>> Python 2.7.14
```

## Linuxサーバの場合



<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/479738946X/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=479738946X&linkCode=am2&tag=soudegesu-22&linkId=4d6041eaf55821514ce2f3c16f0b9a5c"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=479738946X&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=479738946X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>