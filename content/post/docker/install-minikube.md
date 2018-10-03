---
title: "Install-Minikube"
description: ""
date: "2018-10-03T08:39:26+09:00"
thumbnail: ""
categories:
  - "docker"
tags:
  - "docker"
  - "kubernates"
draft: true
isCJKLanguage: true
twitter_card_image: /images/soudegesu.jpg
---

## 事前準備

以降は以下の環境にて実行することを前提としています。

* MacOS X
* [Homebrew](https://brew.sh/index_ja)

### VirtualBoxのインストール

次の工程でインストールする [Minikube](https://github.com/kubernetes/minikube) では以下のVMをサポートしています。

* virtualbox
* vmwarefusion
* KVM2
* KVM (deprecated in favor of KVM2)
* hyperkit
* xhyve
* hyperv

なんでも良いのですが、今回は過去に使ったことのある [VirtualBox](https://www.virtualbox.org/) のインストーラをダウンロードし、インストールしました。

### minikube をインストールする

次に、ローカル環境で [Kubernates](https://kubernetes.io/) を動かすために、
[Minikube](https://github.com/kubernetes/minikube) をインストールします。

```bash
brew cask install minikube
```

これで `minikube` コマンドが使えるようになりました。

## Usageを確認する

`minikube` コマンドに準備されているサブコマンドを確認してみます。
めちゃ出ました。

```bash
minikube

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

```bash
minikube completion
```


## Minikubeを起動する

```bash
minikube start
```

```bash
kubectl config current-context

> minikube
```
