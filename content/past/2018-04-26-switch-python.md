---
title: "Pythonの2と3を切り替えて仮想環境を作る"
description: "Python 2.x と Python 3.x では文法的な互換性がないため、バージョンを正しく使い分けることは最初の第一歩です。今回はMac環境でのバージョン切り替えとLinux環境でのバージョンの共存について書きます。"
date: 2018-04-26
thumbnail: /images/icons/python_icon.png
categories:
    - python
tags:
    - python
url: /python/switch-python/
twitter_card_image: /images/icons/python_icon.png
---

Python使いであれば、Python 2.x と Python 3.x では文法的な互換性がないため、バージョンを正しく使い分けることは最初の第一歩です。
今回はMac環境でのバージョン切り替えとLinux環境でのバージョンの共存について書きます。

## モチベーション
### Python 2.x と Python 3.x を共存させたい

Python 3.x は言語のバージョンアップに伴い、2.x 系との後方互換性をサポートしていません。
`__future__` モジュールや [six](https://hhsprings.bitbucket.io/docs/translations/python/six-doc-ja/) を使えば、
Python 2で書かれたコードをPython 3のランタイムで動かすことができる場合もありますが、基本的には書き直した方が好ましいと考えています。

互換性に纏わる話は、 バージョン・アップして第2版となって帰ってきた書籍「エキスパートPython」にも触れられていますので、そちらを見た方が良いかもしれません。

<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/4048930613/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4048930613&linkCode=as2&tag=soudegesu-22&linkId=a3d62631d025b73bac36ad1a91b2fb13"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4048930613&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4048930613" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>

### プロジェクト毎にモジュールを管理したい

プロジェクト毎にpythonのライブラリを管理したい(プロジェクト毎に依存モジュールが混ざらないようにしたい)ケースが多いので、
仮想環境を簡単に管理できる仕組みも欲しいです。

## Mac OSの場合

MacOSの場合には [pyenv](https://github.com/pyenv/pyenv) を使って複数バージョンをインストールしつつ
[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv) で仮想環境を管理することをオススメします。
もちろん、`pyenv` の代わりとしてawsome的な [anyenv](https://github.com/riywo/anyenv) でも構いません。

### Homebrew のインストール

入っていなければ、 [Homebrew](https://brew.sh/index_ja) をインストールしましょう。

TOPページに「このスクリプトをターミナルで叩きなさい」とコマンドが記載されている超親切設計なツールなので、問題なくインストールできるはずです。

### pyenvのインストール

`pyenv` と `pyenv-virtualenv` をインストールします。

```bash
brew install pyenv pyenv-virtualenv
```

### .bashrc を書き換える

bashであれば `.bashrc` 、 zsh であれば `.zshrc` に以下を追記します。
ターミナルを起動する時に `rehash` してほしくなければ `--no-rehash` を入れます。

```bash
export PYENV_ROOT="${HOME}/.pyenv"
export PATH="$PATH:${PYENV_ROOT}/bin:${PYENV_ROOT}/shims"

eval "$(pyenv init --no-rehash -)"
eval "$(pyenv virtualenv-init -)"
```

### pythonをインストールして仮想環境を作る

ベースになるPythonをインストールします。

```bash
pyenv install 3.6.1
```

その後、対象のプロジェクト専用の仮想環境を準備します。
仮想環境の名前は `test_project` にしておきます。

```bash
pyenv virtualenv 3.6.1 test_project
```

次に `test_project` ディレクトリを作成して、
そのディレクトリ配下では `Python 3.6.1` のである仮想環境 `test_project` を使うように設定します。

```bash
mkdir test_project
cd test_project

pyenv local 3.6.1/envs/test_project

python -V
>> Python 3.6.1
```

試しにディレクトリから出てみましょう。

```bash
cd ../
python -V
>> Python 2.7.14
```

できました。

## サーバの場合

私の場合、大抵Linux系OSをサーバ用途で使う事が多く、開発用のローカル環境的な使い方はあまりしません。

もう少し具体的に言うと、 [Packer](https://www.packer.io/) や [Ansible](https://www.ansible.com/) でPython入りのマシンイメージを焼いて使っています。

このようなユースケースの場合には `pyenv` を使うのではなくて、 **特定のバージョンを予めインストールしておく** 方が適しています。(Jenkinsのようなビルドサーバ用途では `pyenv` の方が良いかもしれません)


今回は [Pythonの公式ドキュメント](https://docs.python.org/ja/3/using/unix.html#getting-and-installing-the-latest-version-of-python) にも記載がある方法で、Pythonをソースからビルドするやり方を個人的にはオススメします。


例えば、CentOSであれば以下のようなになります。

* Pythonのダウンロード

```bash
curl -O https://www.python.org/ftp/python/(バージョン)/Python-(バージョン).tgz
tar zxf Python-(バージョン).tgz
```

* ソースからインストール

```bash
cd Python-(バージョン)

./configure --prefix=/opt/local
make
make altinstall
```

ただし、警告のところに書かれているように **Linuxには予めPythonがインストールされているため、それを破壊しないように** `make altinstall` の方が良いです。

> 警告 make install は python3 バイナリを上書きまたはリンクを破壊してしまうかもしれません。
> そのため、make install の代わりに exec_prefix/bin/pythonversion のみインストールする make altinstall が推奨されています。

## まとめ

今回は異なるバージョンのPythonをインストールし、切り替える方法をまとめました。
* ローカル環境(Mac)は `pyenv` と `pyenv-virtualenv` で **Pythonのバージョンと仮想環境を切り替える**
* サーバは Pythonを **ソースから `altinsall`** して複数バージョンが共存できるようにしてあげる

のがいいかな、と考えています。


## 参考にさせていただいたサイト

* [Python 3.6.5 ドキュメント](https://docs.python.org/ja/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

<br><br>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/479738946X/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=479738946X&linkCode=am2&tag=soudegesu-22&linkId=4d6041eaf55821514ce2f3c16f0b9a5c"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=479738946X&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=479738946X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
