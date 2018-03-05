---
title: "Dapps開発のためにEthereumの開発環境を構築する"
description: "DAppsを開発したくてEthereumの環境構築を行いました。今回はテストネット上で複数アカウントを作成し、Ethのやりとりをするところまでを纏めました"
date: 2018-03-05 00:00:00 +0900
categories: ethereum
tags: ethereum dapps truffle ganache metamask
---

以前、`IPFS` を調査したことがあり、そこから `Ethereum` の存在を知りました。
昨年頃から本格的に日本でも名前が売れてきて、日本語のソースも増えてきたこともあるので、これを機にサンプルでも作成しようかと思いました。
今回はDapps開発のための下準備までを纏めます。

* Table Of Contents
{:toc}

## 環境情報
今回、私は以下の環境にて構築を行いました
* Mac
    * High Seria 10.13.2
* Homebrew
    * 1.5.6

## Etehreumのセットアップ
今回は [Ethereum](https://www.ethereum.org/) を使用します。理由としては、Dapps開発のためのOSSとして開発が積極的に行われており、
様々なDappsにて使用されている(らしい)からです。

### Ethereumのインストール
Homebrewがあれば簡単にインストールができます。

* リポジトリを追加

```
brew tap ethereum/ethereum
```

* Ethereum をインストール

```
brew install ethereum
```

* バージョンを確認

```
geth -h

> NAME:
>    geth - the go-ethereum command line interface
>
>    Copyright 2013-2017 The go-ethereum Authors
>
> USAGE:
>    geth [options] command [command options] [arguments...]
>
> VERSION:
>    1.8.1-stable
(以下略)
```

`1.8.1` がインストールされているようですね。

以降の作業は以下のディレクトリにて実施します。(誤解を招かないように念のため)

```
pwd
> /Users/xxxxxx/workspace/eth_private_net
```


### 設定ファイルの作成

`Ethereum` の 1.6から `puppeth` コマンドが追加されました。
これを使って初期化を行います。

```
puppeth
```

すると以下のようなメッセージが出てくるので、とりあえずネットワーク名を `soudegesu` にします。

```
+-----------------------------------------------------------+
| Welcome to puppeth, your Ethereum private network manager |
|                                                           |
| This tool lets you create a new Ethereum network down to  |
| the genesis block, bootnodes, miners and ethstats servers |
| without the hassle that it would normally entail.         |
|                                                           |
| Puppeth uses SSH to dial in to remote servers, and builds |
| its network components out of Docker containers using the |
| docker-compose toolset.                                   |
+-----------------------------------------------------------+

Please specify a network name to administer (no spaces, please)
> soudegesu
```

ここから対話形式で入力していきます。まず、 `2. Configure new genesis` を選択します。

```
Sweet, you can set this via --network=soudegesu next time!

INFO [03-05|14:24:17] Administering Ethereum network           name=soudegesu
WARN [03-05|14:24:17] No previous configurations found         path=/Users/xxxxxxxxx/.puppeth/soudegesu

What would you like to do? (default = stats)
 1. Show network stats
 2. Configure new genesis
 3. Track new remote server
 4. Deploy network components
> 2
```

次にコンセンサスルールを決めます。今回は `Ethash` にしましょう。

```
Which consensus engine to use? (default = clique)
 1. Ethash - proof-of-work
 2. Clique - proof-of-authority
> 1
```

次はとりあえずデフォルトにしておきます。

```
Which accounts are allowed to seal? (mandatory at least one)
> 0x
```

次に使用するネットワークIDを指定します。
適当に `4224` にします。

```
Specify your chain/network ID if you want an explicit one (default = random)
> 4224
```

なお、代表的なnetwork idは以下のようになっています。

1: Mainnet
2: Morden test net(obsolete)
3: Ropsten test net
4: Rinkeby test net
42: Kovan test net

次にgenesisの設定管理を選択します。

```
What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> 2
```

genesisの設定をエクスポートします。

```
 1. Modify existing fork rules
 2. Export genesis configuration
 3. Remove genesis configuration
> 2
```

次はデフォルトでOK

```
Which file to save the genesis into? (default = soudegesu.json)
>
```

ココまで来ると `Exported existing genesis block` と表示され、コンソール上の表示が最初に戻ります。
`Ctrl + C` にてexitしましょう。

`soudegesu.json` が作成されていることが確認できます。

```
cat soudegesu.json

{
  "config": {
    "chainId": 4224,
    "homesteadBlock": 1,
    "eip150Block": 2,
    "eip150Hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "eip155Block": 3,
    "eip158Block": 3,
    "byzantiumBlock": 4,
    "ethash": {}
  },
  "nonce": "0x0",
  "timestamp": "0x5a9cd72a",
  "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x47b760",
  "difficulty": "0x80000",
  "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
  "coinbase": "0x0000000000000000000000000000000000000000",
  "alloc": {
    "0000000000000000000000000000000000000000": {
      "balance": "0x1"
    },
    (以下略)
```


### プライベートネットワークの初期化

次にネットワークの初期化を行います。

```
geth --datadir ./private init ./soudegesu.json

INFO [03-05|14:54:31] Maximum peer count                       ETH=25 LES=0 total=25
INFO [03-05|14:54:31] Allocated cache and file handles         database=/Users/xxxxxx/workspace/eth_private_net/private/geth/chaindata cache=16 handles=16
INFO [03-05|14:54:31] Writing custom genesis block
INFO [03-05|14:54:31] Persisted trie from memory database      nodes=354 size=65.02kB time=1.10945ms gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [03-05|14:54:31] Successfully wrote genesis state         database=chaindata                                                              hash=25e489…52b7d1
INFO [03-05|14:54:31] Allocated cache and file handles         database=/Users/xxxxxx/workspace/eth_private_net/private/geth/lightchaindata cache=16 handles=16
INFO [03-05|14:54:31] Writing custom genesis block
INFO [03-05|14:54:31] Persisted trie from memory database      nodes=354 size=65.02kB time=1.327455ms gcnodes=0 gcsize=0.00B gctime=0s livenodes=1 livesize=0.00B
INFO [03-05|14:54:31] Successfully wrote genesis state         database=lightchaindata                                                              hash=25e489…52b7d1
```

### アカウントの作成

Ethreum(wei) をやりとりするためのアカウントを作成します。

```
geth --datadir . account new
```

適当にパスワードを設定すると `Address` のところにアカウントのアドレスが表示されます。

```
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase:
Address: {アカウントA}
```

作成が完了すると `keystore` ディレクトリ下にユーザ情報が記載されたjsonファイルが出力されます。

```
ls keystore

UTC--2018-03-05T06-00-32.829542689Z--アカウントA
```

作成されたアカウントを確認します。

```
geth --datadir . account list
Account #0: {アカウントA} keystore:///Users/xxxxx/workspace/eth_private_net/keystore/UTC--2018-03-05T06-00-32.829542689Z--アカウントA
```

実際には複数ユーザ間でデータをやりとりする仕組みを構築すると思いますので、
 `geth --datadir . account new` コマンドを複数実行し、アカウントを複数作っておきましょう。(とりあえず3つくらい)

### マイニングの動作確認をする
次にマイニングの動作確認をします。

先程作成した `keystore` の情報を移動します。

```
cp ~/workspace/eth_private_net/keystore/* ~/workspace/eth_private_net/private/keystore/.
```

作成したユーザのパスワードファイルを作成します。
```
echo (account new したときのパスワード) > private/password.sec
```

実行してみましょう。

```
geth --networkid 4224 --mine --minerthreads 1 --datadir "~/workspace/eth_private_net/private" --nodiscover --rpc --rpcport "8545" --port "30303" --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net --unlock 0 --password ~/workspace/eth_private_net/private/password.sec --ipcpath "~/Library/Ethereum/geth.ipc"
```

その際に、標準出力に表示される `ChainID` が指定されたIDになっているかを確認しましょう。
今回であれば **4224** が出ていればOKです。

処理がもりもり走っていきます。ハンマーアイコンが出てくればマイニングできています。
(もちろんテスト用なので、何の価値もないですが)

![mining]({{site.baseurl}}/assets/images/20180305/chained.png)

### Ethを送ってみる
先程複数アカウントを作成したので、実際にEthを送ってみましょう。
マイニングの画面はそのままにして、ターミナルで別ウィンドウを立ち上げましょう。

その後、以下を実行し、Javascriptコンソールを起動します。
コンソールは対話形式で入力していくことが可能です。

```
geth attach

instance: Geth/v1.8.1-stable/darwin-amd64/go1.10
coinbase: xxxxxxxxxxxxxxxxxxxxxxxxxx
at block: 23 (Mon, 05 Mar 2018 15:39:56 JST)
 datadir: /Users/xxxxxx/workspace/eth_private_net/private
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
```

まず存在するアカウントを確認しておきます。

```
> eth.accounts
["アカウントA", "アカウントB", "アカウントC"]
```

マイニング時のメインアカウントを確認します。

```
> eth.coinbase
アカウントA
```

現時点での保有量を確認します。

```
> eth.getBalance(eth.accounts[0])
285000000000000000000
```

単位が `wei` でわかりにくいので `ETH` にしましょう。

```
> web3.fromWei(eth.getBalance(eth.coinbase), "ether")
288
```

アカウントAから他のアカウントBとアカウントCにそれぞれ送りつけてみましょう。

```
eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[1], value:web3.toWei(10, "ether")})
> ハッシュ値
eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[2], value:web3.toWei(6, "ether")})
> ハッシュ値
```

以下で確認することができました。

```
> web3.fromWei(eth.getBalance(eth.accounts[1]), "ether")
10
> web3.fromWei(eth.getBalance(eth.accounts[2]), "ether")
6
```

## まとめ


## 参考にさせていただいたサイト
* [Ethereum blog]([)https://blog.ethereum.org/2017/04/14/geth-1-6-puppeth-master/)
