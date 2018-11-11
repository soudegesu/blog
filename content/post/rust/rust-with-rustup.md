---
title: "RustupでRustの環境構築をする　- インストールからツールチェインの固定まで"
description: "プログラミング言語 Rust の環境構築をRustupで行います。Rustupを使うことで複数バージョンのRustを同一マシン上に共存させることができ、開発環境をクリーンに保つことができます。"
date: "2018-10-28T07:09:38+09:00"
thumbnail: /images/icons/rust_icon.png
categories:
  - "rust"
tags:
  - "rust"
isCJKLanguage: true
twitter_card_image: /images/icons/rust_icon.png
---

プログラミング言語 [Rust](https://www.rust-lang.org/ja-JP/) を学習する必要がでてきたので、
環境構築手順をまとめたいと思います。

今回はMacOS X上で [Homebrew](https://brew.sh/index_ja) を使ってインストールする手順になります。

## Rustupをインストールする

まずは、 `rustup` をインストールします。

{{< highlight bash "linenos=inline" >}}
brew install rustup
{{< / highlight >}}

`rustup` をインストールしただけだと使えないので、以下のコマンドで初期化を行います。

{{< highlight bash "linenos=inline" >}}
rustup-init
{{< / highlight >}}

`${HOME}/.zshrc` や `${HOME}/.bashrc` などにパスを通して `export` します。

{{< highlight vim "linenos=inline" >}}
export CARGO_HOME="$HOME/.cargo"
export PATH="$CARGO_HOME/bin:$PATH"
{{< / highlight >}}

コマンドが利用可能かを確認します。

まずはコンパイルに使う `rustc` コマンド。

{{< highlight bash "linenos=inline" >}}
rustc -V
> rustc 1.30.0 (da5f414c2 2018-10-24)
{{< / highlight >}}

次にビルド兼パッケージマネージャの `cargo` コマンド。

{{< highlight bash "linenos=inline" >}}
cargo -V
> cargo 1.30.0 (36d96825d 2018-10-24)
{{< / highlight >}}

なお、 `show` のサブコマンドで、現在有効なツールチェーンを確認できます。

{{< highlight bash "linenos=inline" >}}
rustup show
> Default host: x86_64-apple-darwin
>
> stable-x86_64-apple-darwin (default)
> rustc 1.30.0 (da5f414c2 2018-10-24)
{{< / highlight >}}

## 不足しているコンポーネントをインストールする

[Homebrew](https://brew.sh/index_ja) 経由でのインストールと、
公式ページで紹介されているコマンド `curl https://sh.rustup.rs -sSf | sh` では
インストールされるツールチェーンに若干の差分があります。

例えば、 `rustfmt` コマンドが [Homebrew](https://brew.sh/index_ja) 経由の場合はデフォルトでインストールされません。

そのため、 `component` サブコマンドで別途インストールしてあげる必要がありそうです。

{{< highlight bash "linenos=inline" >}}
rustup component add rustfmt-preview --toolchain stable-x86_64-apple-darwin
{{< / highlight >}}

必要なものを適宜追加するスタイルになるので、そもそも差分を考慮するのが面倒であれば、
`rustup` を `curl https://sh.rustup.rs -sSf | sh`  でインストールした方が良いかもしれません。

## プロジェクトを初期化する

任意のディレクトリ配下をCargoプロジェクトとしたいときには、 `cargo init` コマンドを使います。

{{< highlight bash "linenos=inline" >}}
cargo init --vcs git --bin 
{{< / highlight >}}

`--bin` は、`init` 時にアプリケーション実装のためのテンプレートを出力するオプションです。
現在の `Cargo` バージョン `1.30.0` ではデフォルトで有効になっているオプションなので、省略することもできます。

また、 `--vcs` オプションは、利用するVCSの設定ファイルも出力してくれるので便利です。
例えば、 `--vcs git` とすると、 `.git` や `.gitignore` を吐き出してくれます。

先程のディレクトリ内に出力された結果を見てみましょう。

{{< highlight bash "linenos=inline" >}}
#tree -a 
.
├── .git
│   ├── HEAD
│  (中略)
│   └── refs
│       ├── heads
│       └── tags
├── .gitignore
├── Cargo.toml
└── src
    └── main.rs
{{< / highlight >}}

`src` 配下にコードのエントリポイントとなる `main.rs` が、
プロジェクトルートに `Cargo.toml` が出力されていることがわかります。

`Cargo.toml` は `Cargo` の依存パッケージの定義やソースコードのエントリポイントの指定などを行うための設定ファイルです。

補足として、ディレクトリ自体も含めたまっさらな状態から `Cargo` プロジェクトを新規作成するには、 
`cargo new` コマンドを使うと良いです。

## ツールチェインを固定する

環境差分を減らす仕組みは、チーム開発する上での重要な下準備となります。

[Rust](https://www.rust-lang.org/ja-JP/) においても同様で、ここではツールチェインのバージョンを固定します。

[Rustupの公式](https://github.com/rust-lang-nursery/rustup.rs/blob/060192bd8089b4866f1571d85e85ca0264323233/README.md#the-toolchain-file) に記載があったので引用すると、`Rustup`によって、プロジェクト毎に使うツールチェインを指定することができ、その設定の優先順位は以下のようになります。

> * An explicit toolchain, e.g. cargo +beta,
> * The RUSTUP_TOOLCHAIN environment variable,
> * A directory override, ala rustup override set beta,
> * The rust-toolchain file,
> * The default toolchain,

チームで環境を統一するのであれば、`rust-toolchain` ファイルを使う方法が一番適していそうです。

早速試してみます。プロジェクトルート直下に `rust-toolchain` ファイルを作成し、以下のフォーマットの文字列を書き込むことでツールチェインを固定できます。

{{< highlight bash "linenos=inline" >}}
<channel>[-<date>][-<host>]

<channel>       = stable|beta|nightly|<version>
<date>          = YYYY-MM-DD
<host>          = <target-triple>
{{< / highlight >}}

例えば

{{< highlight bash "linenos=inline" >}}
1.20.0
{{< / highlight >}}            

と書けば `stable` チャンネル（デフォルト）の `1.20.0` を指定することになります。

{{< highlight vim "linenos=inline" >}}
nightly-2018-10-01
{{< / highlight >}}

と書けば `nightly` の `2018-10-01` を指定することになります。

その後、 `cargo check` でも `cargo build` でも良いのですが、コマンドを実行すると、
ツールチェインがインストールされます。

### 余談：日付指定時に取得できるツールチェインはどれか

ツールチェインの日付文字列による指定の場面で、「どの日時を記述してもツールチェインがインストールできるのか？」と疑問を持ったので調査してみます。

異なる日付を指定して `cargo check` コマンドの標準出力を確認します。以下は一部を抜粋したものです。同じ `1.31.0-nightly` にも関わらず、コミットハッシュが異なることが確認できます。 **指定日付時点での最新のコミット** が採用されている印象を受けます。

{{< highlight bash "linenos=inline" >}}
# rust-toolchainに nightly-2018-10-10 を書いた場合
info: latest update on 2018-10-10, rust version 1.31.0-nightly (96cafc53c 2018-10-09)

# rust-toolchainに nightly-2018-10-09 を書いた場合
info: latest update on 2018-10-09, rust version 1.31.0-nightly (423d81098 2018-10-08)
{{< / highlight >}}

チャンネルが `nightly` の場合においては、概ねどの日付を指定してもインストールできました。

逆にリリース頻度の低い `stable` チャンネルでは、日付を指定しても取得できない場合がありました。

{{< highlight bash "linenos=inline" >}}
error: no release found for 'stable-2018-10-10'
{{< / highlight >}}

そのため、日付指定は `nightly` 向けの機能と考えた方が良いでしょう。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118557&linkId=35c7fff2b5b5cac3555644c01e066fb1&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>

## 参考にさせていただいたサイト
* [プログラミング言語 Rust](https://www.rust-lang.org/ja-JP/)
* [rust-lang-nursery/rustup.rs](https://github.com/rust-lang-nursery/rustup.rs/blob/060192bd8089b4866f1571d85e85ca0264323233/README.md#the-toolchain-file)