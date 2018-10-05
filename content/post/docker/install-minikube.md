---
title: "MinikubeでKubernatesのローカル環境を構築する"
description: ""
date: "2018-10-03T08:39:26+09:00"
thumbnail: /images/icons/k8s_icon.png
categories:
  - "docker"
tags:
  - "docker"
  - "kubernates"
isCJKLanguage: true
twitter_card_image: /images/icons/k8s_icon.png
---

今回はローカル環境で [Kubernates](https://kubernetes.io/) を動かすために、
[Minikube](https://github.com/kubernetes/minikube) をインストールします。


## 事前準備

以降は以下の環境にて実行することを前提としています。

* MacOS X
* [Homebrew](https://brew.sh/index_ja)

### VirtualBoxのインストール

今回インストールする [Minikube](https://github.com/kubernetes/minikube) では以下のVMをサポートしています。

* virtualbox
* vmwarefusion
* KVM2
* KVM (deprecated in favor of KVM2)
* hyperkit
* xhyve
* hyperv

なんでも良いのですが、今回は過去に使ったことのある [VirtualBox](https://www.virtualbox.org/) のインストーラをダウンロードし、インストールしました。

### Minikube をインストールする

次に、ローカル環境で [Kubernates](https://kubernetes.io/) を動かすために、
[Minikube](https://github.com/kubernetes/minikube) をインストールします。

```bash
brew cask install minikube
```

インストールされたかを確認します。

```bash
minikube version

> minikube version: v0.29.0
```

これで `minikube` コマンドが使えるようになりました。


## Usageを確認する

`minikube help` コマンドで、サブコマンドを確認してみます。

```bash
Minikube is a CLI tool that provisions and manages single-node Kubernetes clusters optimized for development workflows.

Usage:
  minikube [command]

Available Commands:
  addons         Modify minikube's kubernetes addons
  cache          Add or delete an image from the local cache.
  completion     Outputs minikube shell completion for the given shell (bash or zsh)
  config         Modify minikube config
  dashboard      Opens/displays the kubernetes dashboard URL for your local cluster
  delete         Deletes a local kubernetes cluster
  docker-env     Sets up docker env variables; similar to '$(docker-machine env)'
  help           Help about any command
  ip             Retrieves the IP address of the running cluster
  logs           Gets the logs of the running instance, used for debugging minikube, not user code
  mount          Mounts the specified directory into minikube
  profile        Profile sets the current minikube profile
  service        Gets the kubernetes URL(s) for the specified service in your local cluster
  ssh            Log into or run a command on a machine with SSH; similar to 'docker-machine ssh'
  ssh-key        Retrieve the ssh identity key path of the specified cluster
  start          Starts a local kubernetes cluster
  status         Gets the status of a local kubernetes cluster
  stop           Stops a running local kubernetes cluster
  update-check   Print current and latest version number
  update-context Verify the IP address of the running cluster in kubeconfig.
  version        Print the version of minikube

Flags:
      --alsologtostderr                  log to standard error as well as files
  -b, --bootstrapper string              The name of the cluster bootstrapper that will set up the kubernetes cluster. (default "kubeadm")
  -h, --help                             help for minikube
      --log_backtrace_at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log_dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
  -p, --profile string                   The name of the minikube VM being used.
                                         	This can be modified to allow for multiple minikube instances to be run independently (default "minikube")
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```

## Minikubeの起動/停止

`minikube start` コマンドで [Kubernates](https://kubernetes.io/) クラスタを起動します。


初回実行時、`kubelet` や `kubeadm` もダウンロードされていることがわかります。

```bash
minikube start

> Starting local Kubernetes v1.10.0 cluster...
> Starting VM...
> Downloading Minikube ISO
>  166.67 MB / 171.87 MB [== (中略)
```

余談ですが、 `kubeadm` のダウンロードが終了する前に `minikube logs -f` コマンドを実行してしまうと、以下のエラーメッセージが表示されます。

```bash
F1005 08:25:45.623595    4174 logs.go:50] Error getting cluster bootstrapper: getting kubeadm bootstrapper: getting ssh client: Error dialing tcp via ssh client: dial tcp 127.0.0.1:22: connect: connection refused
```

起動確認をしてみます。

```bash
minikube status

> minikube: Running
> cluster: Running
> kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

停止するときは以下です。

```bash
minikube stop
```

## Minikubeの設定ファイルを確認する

`minikube start` にて無事 [Minikube](https://github.com/kubernetes/minikube) の起動が完了すると、`~/.minikube/` 配下にファイルが生成されます。


```bash
/Users/xxxxxxxxxx/.minikube/
├── addons
├── apiserver.crt
├── apiserver.key
├── ca.crt
├── ca.key
├── ca.pem
├── cache
│   ├── iso
│   │   └── minikube-v0.29.0.iso
│   └── v1.10.0
│       ├── kubeadm
│       └── kubelet
├── cert.pem
├── certs
│   ├── ca-key.pem
│   ├── ca.pem
│   ├── cert.pem
│   └── key.pem
├── client.crt
├── client.key
├── config
├── files
├── key.pem
├── logs
├── machines
│   ├── minikube
│   │   ├── boot2docker.iso
│   │   ├── config.json
│   │   ├── disk.vmdk
│   │   ├── id_rsa
│   │   ├── id_rsa.pub
│   │   └── minikube
│   │       ├── Logs
│   │       │   ├── VBox.log
│   │       │   └── VBox.log.1
│   │       ├── minikube.vbox
│   │       └── minikube.vbox-prev
│   ├── server-key.pem
│   └── server.pem
├── profiles
│   └── minikube
│       └── config.json
├── proxy-client-ca.crt
├── proxy-client-ca.key
├── proxy-client.crt
└── proxy-client.key
```

`profiles/minikube/config.json` には以下のようにVMの設定と、[Kubernates](https://kubernetes.io/) の設定が記載されていました。
これらは `minikube start` コマンドのオプションとして渡せる値たちですね。

```json
{
    "MachineConfig": {
        "MinikubeISO": "https://storage.googleapis.com/minikube/iso/minikube-v0.29.0.iso",
        "Memory": 2048,
        "CPUs": 2,
        "DiskSize": 20000,
        "VMDriver": "virtualbox",
        "HyperkitVpnKitSock": "",
        "HyperkitVSockPorts": [],
        "XhyveDiskDriver": "ahci-hd",
        "DockerEnv": null,
        "InsecureRegistry": null,
        "RegistryMirror": null,
        "HostOnlyCIDR": "192.168.99.1/24",
        "HypervVirtualSwitch": "",
        "KvmNetwork": "default",
        "DockerOpt": null,
        "DisableDriverMounts": false,
        "NFSShare": [],
        "NFSSharesRoot": "/nfsshares",
        "UUID": "",
        "GPU": false
    },
    "KubernetesConfig": {
        "KubernetesVersion": "v1.10.0",
        "NodeIP": "192.168.99.100",
        "NodeName": "minikube",
        "APIServerName": "minikubeCA",
        "APIServerNames": null,
        "APIServerIPs": null,
        "DNSDomain": "cluster.local",
        "ContainerRuntime": "",
        "NetworkPlugin": "",
        "FeatureGates": "",
        "ServiceCIDR": "10.96.0.0/12",
        "ExtraOptions": null,
        "ShouldLoadCachedImages": false
    }
}
```

## クラスタの削除

`minikube delete` コマンドは **ローカルのクラスタや関連ファイルを削除する** ことができます。
実際に試してみたところ、 `machines/minikube` ディレクトリと `profiles/minikube/config.json` ファイルが削除されていることを確認できました。

## プロファイルによるインスタンスの切り替え

設定ファイルを削除して気づいたのですが、 [Minikube](https://github.com/kubernetes/minikube) には `profile` の概念があり、
複数の [Minikube](https://github.com/kubernetes/minikube) インスタンスを扱うことができるようです。

デフォルトでは `minikube` というプロファイル名ですが、 `minikube profile ${プロファイル名` で現在の [Minikube](https://github.com/kubernetes/minikube) インスタンスを別プロファイルとして扱えます。

例えば、以下のようにしてプロファイル `hoge` を作成した後、起動すると、

```bash
minikube profile hoge

> minikube profile was successfully set to hoge

minikube start
```

先程の設定ファイルのディレクトリ内にもプロファイル用の設定が新規で追加されています。なるほどですね。

```bash
├── machines
│   ├── hoge
│   │   ├── boot2docker.iso
│   │   ├── config.json
│   │   ├── disk.vmdk
│   │   ├── hoge
│   │   │   ├── Logs
│   │   │   │   └── VBox.log
│   │   │   ├── hoge.vbox
│   │   │   └── hoge.vbox-prev
│   │   ├── id_rsa
│   │   └── id_rsa.pub
│   ├── minikube
│   │   ├── boot2docker.iso
│   │   ├── config.json
│   │   ├── disk.vmdk
│   │   ├── id_rsa
│   │   ├── id_rsa.pub
│   │   └── minikube
│   │       ├── Logs
│   │       │   └── VBox.log
│   │       ├── minikube.vbox
│   │       └── minikube.vbox-prev
│   ├── server-key.pem
│   └── server.pem
├── profiles
│   ├── hoge
│   │   └── config.json
│   └── minikube
│       └── config.json
```

## ダッシュボードを確認する

最後に、ローカル環境で起動した [Kubernates](https://kubernetes.io/) クラスタをダッシュボードで確認しましょう。

```bash
minikube dashboard
```

{{< figure src="/images/20181003/minikube_dashboard.png" class="center" width="100%" >}}

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4295004804&linkId=8e13fb4b1e8ffb04d23631ff17587599"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873118409&linkId=b2dae0c89a5c2f690d8e24943d6e6c9c"></iframe>
