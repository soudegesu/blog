---
title: "RustupでRustの環境構築をする"
description: ""
date: "2018-10-28T07:09:38+09:00"
thumbnail: /images/icons/rust_icon.png
categories:
  - "rust"
tags:
  - "rust"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/rust_icon.png
---

```bash
brew install rustup
```

```bash
rustup-init
```

```
vi ~/.zshrc

export CARGO_HOME="$HOME/.cargo"
export PATH="$CARGO_HOME/bin:$PATH"
```


```bash
cargo -V
> cargo 1.30.0 (36d96825d 2018-10-24)
```

```bash
rustup -V
> rustup 1.14.0 ( )
```

```bash
rustdoc -V
> rustdoc 1.30.0 (da5f414c2 2018-10-24)
```


```bash
rustup show
> Default host: x86_64-apple-darwin
>
> stable-x86_64-apple-darwin (default)
> rustc 1.30.0 (da5f414c2 2018-10-24)
```

CargoはRustのパッケージマネージャー

既に存在するプロジェクトファイルを Cargoに対応させる場合

```bash
cargo init --vcs git --bin 
```