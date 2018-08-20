---
title: "EthereumでDApps開発のための開発環境を構築する(Ethereumで別アカウントに送金まで)"
description: "DAppsを開発したくてEthereumの環境構築を行いました。今回はテストネット上で複数アカウントを作成し、Ethのやりとりをするところまでを纏めました"
date: 2018-03-05
categories:
  - ethereum
tags:
  - ethereum
  - dapps
  - truffle
  - ganache
url: /ethereum/ethereum-development-environment/
---

以前、`IPFS` を調査したことがあり、そこから `Ethereum` の存在を知りました。
昨年頃から本格的に日本でも名前が売れてきて、日本語のソースも増えてきたこともあるので、これを機にサンプルでも作成しようかと思いました。
今回はDApps開発のための下準備までを纏めます。

## 環境情報
今回、私は以下の環境にて構築を行いました

* Mac Book Pro
  * OS: High Seria 10.13.2
* Homebrew
  * 1.5.6

## Etehreumのセットアップ
今回は [Ethereum](https://www.ethereum.org/) を使用します。理由としては、DApps開発のためのOSSとして開発が積極的に行われており、
様々なDAppsにて使用されている(らしい)からです。

### Ethereumのインストール
Homebrewがあれば簡単にインストールができます。

* リポジトリを追加

```bash
brew tap ethereum/ethereum
```

* Ethereum をインストール

```bash
brew install ethereum
```

* バージョンを確認

```bash
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

```bash
pwd
> /Users/xxxxxx/workspace/eth_private_net
```


### 設定ファイルの作成

`Ethereum` の 1.6から `puppeth` コマンドが追加されました。
これを使って初期化を行います。

```bash
puppeth
```

すると以下のようなメッセージが出てくるので、とりあえずネットワーク名を任意の名前にします。
今回は `soudegesu` にしました。

```bash
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

以降も対話形式で入力していきます。まず、 `2. Configure new genesis` を選択します。

```bash
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

```bash
Which consensus engine to use? (default = clique)
 1. Ethash - proof-of-work
 2. Clique - proof-of-authority
> 1
```

次はとりあえずデフォルトにしておきます。

```bash
Which accounts are allowed to seal? (mandatory at least one)
> 0x
```

次に使用するネットワークIDを指定します。
適当に `4224` にします。

```bash
Specify your chain/network ID if you want an explicit one (default = random)
> 4224
```

なお、代表的なnetwork idは以下のようになっています。
今回はローカル環境で動かすだけですが、重複しないようにしておきましょう。

* `1`: Mainnet
* `2`: Morden test net(obsolete)
* `3`: Ropsten test net
* `4`: Rinkeby test net
* `42`: Kovan test net

次にgenesisの設定管理を選択します。

```bash
What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components
> 2
```

genesisの設定をエクスポートします。

```bash
 1. Modify existing fork rules
 2. Export genesis configuration
 3. Remove genesis configuration
> 2
```

次はデフォルトでOK

```bash
Which file to save the genesis into? (default = soudegesu.json)
>
```

ココまで来ると `Exported existing genesis block` と表示され、コンソール上の表示が最初に戻ります。
`Ctrl + C` にてexitしましょう。

`soudegesu.json` が作成されていることが確認できます。

```javascript
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

```bash
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

ether(wei) をやりとりするためのアカウントを作成します。

```bash
geth --datadir . account new
```

適当にパスワードを設定すると `Address` のところにアカウントのアドレスが表示されます。

```bash
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase:
Address: {アカウントA}
```

作成が完了すると `keystore` ディレクトリ下にユーザ情報が記載されたjsonファイルが出力されます。

```bash
ls keystore

UTC--2018-03-05T06-00-32.829542689Z--アカウントA
```

作成されたアカウントを確認します。

```bash
geth --datadir . account list
Account #0: {アカウントA} keystore:///Users/xxxxx/workspace/eth_private_net/keystore/UTC--2018-03-05T06-00-32.829542689Z--アカウントA
```

後の行程で、複数ユーザ間でデータをやりとりする仕組みを試してみるため、
 `geth --datadir . account new` コマンドを複数実行し、アカウントを複数作っておきましょう。(とりあえず3つくらい)

### マイニングの動作確認をする
次にマイニングの動作確認をします。

先程作成した `keystore` の情報を移動します。

```bash
cp ~/workspace/eth_private_net/keystore/* ~/workspace/eth_private_net/private/keystore/.
```

作成したユーザのパスワードファイルを作成します。
```bash
echo (account new する時に指定したパスワード) > private/password.sec
```

実行してみましょう。

```bash
geth --networkid 4224 --mine --minerthreads 1 --datadir "~/workspace/eth_private_net/private" --nodiscover --rpc --rpcport "8545" --port "30303" --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net --unlock 0 --password ~/workspace/eth_private_net/private/password.sec --ipcpath "~/Library/Ethereum/geth.ipc"
```

その際に、標準出力に表示される `ChainID` が指定されたIDになっているかを確認しましょう。
今回であれば **4224** が出ていればOKです。

処理がもりもり走っていきます。ハンマーアイコンが出てくればマイニングできています。
(もちろんテスト用なので、何の価値もないですが)

![mining](/images/20180305/chained.png)

### 別アカウントにEthを送ってみる
先程複数アカウントを作成したので、実際にetherを送ってみましょう。
ターミナル上のマイニングの画面はそのままにして、ターミナルの別ウィンドウを立ち上げましょう。

その後、以下を実行し、Javascriptコンソールを起動します。
コンソールは対話形式で入力していくことが可能です。

```javascript
geth attach

instance: Geth/v1.8.1-stable/darwin-amd64/go1.10
coinbase: xxxxxxxxxxxxxxxxxxxxxxxxxx
at block: 23 (Mon, 05 Mar 2018 15:39:56 JST)
 datadir: /Users/xxxxxx/workspace/eth_private_net/private
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0
```

まず存在するアカウントを確認しておきます。

```javascript
> eth.accounts
["アカウントA", "アカウントB", "アカウントC"]
```

マイニング時のメインアカウントを確認します。

```javascript
> eth.coinbase
アカウントA
```

現時点での保有量を確認します。

```javascript
> eth.getBalance(eth.accounts[0])
285000000000000000000
```

単位が `wei` でわかりにくいので `ether` にしましょう。

```javascript
> web3.fromWei(eth.getBalance(eth.coinbase), "ether")
288
```

アカウントAから他のアカウントBとアカウントCにそれぞれ送りつけてみましょう。

```javascript
# アカウントA -> アカウントB へ10 ether送る
eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[1], value:web3.toWei(10, "ether")})
> ハッシュ値
# アカウントA -> アカウントC へ6 ether送る
eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[2], value:web3.toWei(6, "ether")})
> ハッシュ値
```

以下で確認することができました。

```javascript
> web3.fromWei(eth.getBalance(eth.accounts[1]), "ether")
10
> web3.fromWei(eth.getBalance(eth.accounts[2]), "ether")
6
```

## まとめ
駆け足でしたが、今回はざっくり以下まで実施できました。

* `Ethereum` のインストール
* 開発用のConfigファイルの作成
* アカウントの作成
* マイニング
* 複数アカウント間の送金

この後、`Ganache` や `truffle` 、 `Metamask` のセットアップ、 `web3` での開発作業があるのですが、
長くなりそうなので、今回はここで一旦切ろうと思います。

ローカルとはいえ、マイニングされていく様を見ると少しそわそわしますね。

genesisファイルやコマンドの細かい部分は完全にすっ飛ばしており、私もまだまだ理解が浅いので、
様々なソースを見ながら引き続き学習したいと思います。

(いやぁ、しかし、早く [Mastering Ethereum](https://github.com/ethereumbook/ethereumbook) 発売されないかな)

## 参考にさせていただいたサイト
* [Ethereum blog](https://blog.ethereum.org/2017/04/14/geth-1-6-puppeth-master/)
