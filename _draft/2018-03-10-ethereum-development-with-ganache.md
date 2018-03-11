---
title: "EthereumでDApps開発のための開発環境を構築する(Truffle&Ganache接続まで)"
description: "Ganacheを用いたローカル環境の構築を行います"
date: 2018-03-10 00:00:00 +0900
categories: ethereum
tags: ethereum truffle ganache dapps 
---

[前回の記事](/ethereum/ethereum-development-environment/) で `Ethereum` の開発環境の構築を行いました。
今回はさらに `Ethereum` 用のフレームワークである `Truffle` と `Ganache` を使ってローカルでの開発環境を整えようと思います。

* Table Of Contents
{:toc}

## Truffleとは
[Truffle](http://truffleframework.com/) は

## Ganacheとは

[Ganache](http://truffleframework.com/ganache/) はDAppsを開発時のテストをする際に便利なローカル用のプライベートネットワークを構築してくれます。

![Ganache top]({{site.baseurl}}/assets/images/20180310/ganache.png)

## セットアップ
以前同様の記事を書きましたが、簡単におさらいします。

* Etehreum のインストール

```
brew tap ethereum/ethereum
brew install ethereum
```

* nodenvのインストール
私の場合、ローカル環境のグローバルなnodeのバージョンを変更したくないので、 `nodenv` を使って切り替えています。

```
brew install nodenv
```

* nodenv起動のために、 `~/.zshrc` に以下を追記

```
export PATH="$PATH:$HOME/.nodenv/bin:"
eval "$(nodenv init --no-rehash -)"
```

* node(9.6.1)のインストールと設定

```
nodenv install 9.6.1
nodenv local 9.6.1
node -v
```

* npmの初期化

```
npm init
(面倒なので、以降はEnter)
```

* `truffle` のインストール

```
npm install truffle@4.0.4
```

* solidityのコンパイラ `solc` のインストール

```
npm install solc@0.4.18
```

* `Ganache` のインストール
[Ganache](http://truffleframework.com/ganache/) のページからインストーラを取得し実行する。


## 設定
### package.json の修正
`truffle` をグローバルインストールしていないので、`npm run` でキックできるように `package.json` を修正します。
`package.json` の `scripts` ブロックを修正します。

```
  "scripts": {
    "truffle": "truffle",
    "develop": "truffle develop",
    "truffle-ganache": "truffle migrate --compile-all --reset --network ganache",
    "truffle-console": "truffle console --network ganache"
  },
```

### truffleを初期化する

```
npm run truffle init 
```

実行が完了すると、プロジェクトディレクトリにフォルダやファイルがジェネレートされます。

```
tree -L 1

.
├── contracts
├── migrations
├── node_modules
├── package-lock.json
├── package.json
├── test
├── truffle-config.js
└── truffle.js
```

* `contracts` ディレクトリ
    * コントラクトプログラムを配置する場所。`truffle init` 時に `Migrations.sol` が生成される
* `migrations` ディレクトリ
    * マイグレーションスクリプトを配置する場所。 `truffle init` 時に `1_initial_migrations.js` が生成される。
* `test` ディレクトリ
    * 作成したコントラクトプログラムのテストスクリプトを配置する場所。デフォルトで `mocha` が使える。
* `truffle.js`
    * truffleの設定ファイル
* `truffle-config.js`
    * truffle.jsと同じ。`PowerShell` や `Git-bash` 利用時にはこちらを編集する。


私はMacユーザなので、`truffle-config.js` は消してしまいます。

```
rm truffle-config.js
```

### Ganacheと接続する

次にインストール済みの `Ganache` を起動します。

![Boot Ganache]({{site.baseurl}}/assets/images/20180310/boot_ganache.png)

Ganacheが表示しているネットワークの情報を基に、`truffle.js` を以下のように編集します。

```
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    }
  }
};
```

`package.json` に記載した npm scriptsのコマンドから `truffle-ganache` を起動し、
Ganacheのマイグレーションを行います。

```
npm run truffle-ganache
```

Ganacheの画面を見てみると1番上のアドレスの `balance` (所有しているether) が `100` → `99.97` に減っています。

![migration Ganache]({{site.baseurl}}/assets/images/20180310/migration_ganache.png)

実はこれ、`npm run truffle-ganache` 実行により、`migrations/1_initial_migrations.js` が実行され、
そこから `contracts/Migrations.sol` がデプロイされています。
そのマイグレーションの処理自体もトランザクションが行われており、ganacheに `gas` をお支払いしたため少しだけ減っています。

`TRANSACTIONS` タブを押すと、トランザクションハッシュが生成されていることを確認できます。

![transaction Ganache]({{site.baseurl}}/assets/images/20180310/transaction_ganache.png)

##

## まとめ
