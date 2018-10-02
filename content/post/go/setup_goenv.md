---
title: "goenvでGoをセットアップする"
description: "今の所、プログラミング言語 Goは `1.x` 系のバージョンが最新なわけですが、非公式ながらGo2の話も盛り上がっているので、そろそろ真面目にバージョン管理するか、と、 goenvに手を出しました。"
date: "2018-10-02T08:46:15+09:00"
thumbnail: /images/icons/gopher_icon.png
categories:
  - go
tags:
  - go
isCJKLanguage: true
twitter_card_image: /images/icons/gopher_icon.png
---

今の所、プログラミング言語 [Go](https://github.com/golang/go) は `1.x` 系のバージョンが最新なわけですが、
非公式ながら [Go2](https://github.com/golang/go/wiki/Go2) の話も盛り上がっているので、
そろそろ真面目にバージョン管理するか、と、 [goenv](https://github.com/syndbg/goenv) に手を出しました。


## goenvとは

1つのマシン上で [Go](https://github.com/golang/go) を複数バージョン管理するのに役立つツールです。

Pythonであれば [pyenv](https://github.com/pyenv/pyenv)、 Rubyであれば [rbenv](https://github.com/rbenv/rbenv) など、
大抵の言語に同様のツールがあります。

あげく、全部の言語入りの [anyenv](https://github.com/riywo/anyenv) なんてものも存在します。

今回は [Go](https://github.com/golang/go) を管理できれば良いので、 [goenv](https://github.com/syndbg/goenv) を使います。

## 環境情報

今回は以下の環境でのセットアップを想定して書いています。

* MacOS X
* [Homebrew](https://brew.sh/index_ja) インストール済み

## 設定手順

### goenvのインストール

[goenv](https://github.com/syndbg/goenv) をインストールします。 [Homebrew](https://brew.sh/index_ja) を使えばすぐできます。

```bash
brew install goenv
```

### 設定ファイルの編集

Bash使いであれば、 `~/.bash_profile` 、 Zsh使いであれば `$ZDOTDIR/.zprofile` に以下を記載します。

```bash
export GOENV_ROOT="$HOME/.goenv"
export PATH="$GOENV_ROOT/bin:$PATH"

eval "$(goenv init --no-rehash -)"
```

ファイルを保存後、 `source` コマンドで設定ファイルを再読込するか、新規のターミナルを立ち上げ直せば、 環境変数を `export` できます。

### Goのインストール

次に [Go](https://github.com/golang/go) をインストールします。今回は `1.10.1` をインストールします。
これによって、 使用可能なバージョンに `1.10.1` を追加できます。

```bash
goenv install 1.10.1
```

任意のディレクトリ配下の [Go](https://github.com/golang/go) のバージョンを先程インストールした `1.10.1` に変更します。

```bash
cd hoge
go local 1.10.1
```

変更されているかを `go version` コマンドで確認します。

```bash
go version

> go version go1.10.1 darwin/amd64
```

`1.10.1` になっていますね。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798142417&linkId=2a504e0591dea2b29c897641fee103b4&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4908686033&linkId=bc543f9a203ae829ea5149b77f7f26ed&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118468&linkId=a29dc46f2c8ec02b6826b9192aabec5f&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117526&linkId=f9d2734b0ac386b7e7acb6a0331d2268&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
