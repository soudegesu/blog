---
title: "EthereumでDApps開発のための開発環境を構築する(Truffle&Ganache接続まで)"
description: "Ganacheを用いたローカル環境の構築を行います"
date: 2018-03-10
thumbnail: /images/icons/ethereum_icon.png
categories:
  - ethereum
tags:
  - ethereum
  - truffle
  - ganache
  - dapps
url: /ethereum/ethereum-development-with-ganache/
twitter_card_image: /images/icons/ethereum_icon.png
---

[前回の記事](/ethereum/ethereum-development-environment/) で `Ethereum` の開発環境の構築を行いました。
今回はさらに `Ethereum` 用のフレームワークである `Truffle` と `Ganache` を使ってローカルでの開発環境を整えようと思います。

## Truffleとは
[Truffle](http://truffleframework.com/) は `Ethereum` アプリケーションの開発効率を上げるためのフレームワークです。
ボイラープレート的な仕事をしてくれるところから始まり、 ネットワーク接続の設定管理や、ネットワークのマイグレーション実行や初期化、テストフレームワークをバンドルしていたりなど、一通り開発できるように準備を整えてくれます。

![Truffle top](/images/20180310/truffle.png)

## Ganacheとは

[Ganache](http://truffleframework.com/ganache/) はDAppsを開発時のテストをする際に使用するローカル用のプライベートネットワークを構築してくれます。自動マイニングしてくれるので、別でターミナルを立ち上げて、マイニング用のコマンドを実行する必要もありません。発生したトランザクションは順番にソートされて表示もされるので、動作確認も比較的容易にできると思います。

![Ganache top](/images/20180310/ganache.png)

## セットアップ
以前同様の記事を書きましたが、簡単におさらいします。

* Etehreum のインストール

```bash
brew tap ethereum/ethereum
brew install ethereum
```

* nodenvのインストール

私の場合、ローカル環境のグローバルなnodeのバージョンを変更したくないので、 `nodenv` を使って切り替えています。

```bash
brew install nodenv
```

nodenv起動のために、 `~/.zshrc` に以下を追記します。

```bash
export PATH="$PATH:$HOME/.nodenv/bin:"
eval "$(nodenv init --no-rehash -)"
```

* node(9.6.1)のインストールと設定

```bash
nodenv install 9.6.1
nodenv local 9.6.1
node -v
```

* `package.json` の作成

```bash
npm init
(面倒なので、以降はEnter)
```

* `truffle` のインストール

```bash
npm install truffle@4.0.4
```

* solidityのコンパイラ `solc` のインストール

```bash
npm install solc@0.4.18
```

* `Ganache` のインストール

[Ganache](http://truffleframework.com/ganache/) のページからインストーラを取得し実行する。


## 設定
### package.json の修正
`truffle` をグローバルインストールしていないので、`npm run` でキックできるように `package.json` を修正します。
`package.json` の `scripts` ブロックを修正します。

```json
  "scripts": {
    "truffle": "truffle",
    "develop": "truffle develop",
    "truffle-ganache": "truffle migrate --compile-all --reset --network ganache",
    "truffle-console": "truffle console --network ganache"
  },
```

### truffleを初期化する

```bash
npm run truffle init
```

実行が完了すると、プロジェクトディレクトリにフォルダやファイルがジェネレートされます。

```bash
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

```bash
rm truffle-config.js
```

### Ganacheと接続する

次にインストール済みの `Ganache` を起動します。
`Ganache` はデフォルトで10個のアカウントを作成してくれます。指定がなければ1番上に表示されているアカウントが `coinbase` になります。

![Boot Ganache](/images/20180310/boot_ganache.png)

Ganacheが表示しているネットワークの情報を基に、`truffle.js` を以下のように編集します。

```javascript
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

```bash
npm run truffle-ganache
```

Ganacheの画面を見てみると1番上のアドレスの `balance` (所有しているether) が `100` → `99.97` に減っています。

![migration Ganache](/images/20180310/migration_ganache.png)

実はこれ、`npm run truffle-ganache` 実行により、`migrations/1_initial_migrations.js` が実行され、
そこから `contracts/Migrations.sol` がデプロイされています。
そのマイグレーションの処理自体もトランザクションが行われており、ganacheに `gas` をお支払いしたため少しだけ減っています。

`TRANSACTIONS` タブを押すと、トランザクションハッシュが生成されていることを確認できます。

![transaction Ganache](/images/20180310/transaction_ganache.png)

また、対話形式でプログラムを書きたい場合には以下のようにコンソールを立ち上げて、

```bash
npm run truffle-console
```

試しに以下のようなコードを実行すると

```javascript
web3.eth.sendTransaction({from: web3.eth.accounts[0], to: web3.eth.accounts[1], value:web3.toWei(5, "ether")})
```

トランザクションのアドレスが帰ってきます。

```bash
>  '0x046714fb412724c656250e5856bbb83469e2811b5d710bfa3c515606f5ff938a'
```

`Ganache` の方を確認すると、ちゃんとトランザクションが反映されていることがわかりますね。

![transaction sample](/images/20180310/transaction_sample.png)

## まとめ

今回は `Truffle` でローカル環境構築をした後、 `Ganache` のネットワークに接続設定をして、マイグレーションまでを行いました。
`Truffle` と `Ganache` を使うことで、素の `Ethereum` 単体で開発するよりも、開発環境周辺の手間が軽減されるので、これから積極的に使っていきたいと思います。
ここまでできれば、次は `Solidity` によるコントラクトの開発と、テストコードによる動作確認です。

