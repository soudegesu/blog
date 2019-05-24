---
title: "Jenkins2をコード化しよう - その４：Swarm PluginでJenkins Slaveを登録する"
description: "Jenkins2のコード化を行います。今回はJenkins Slaveの登録をSwarm Pluginを使って行います。"
date: "2019-05-25T15:35:08+09:00"
thumbnail: "/images/icons/jenkins_icon.png"
categories:
  - "jenkins"
tags:
  - "jenkins"
  - "groovy"
isCJKLanguage: true
twitter_card_image: /images/icons/jenkins_icon.png
---

前回の記事 [Jenkins2をコード化しよう - その３：Jenkins Job DSLプラグインでジョブをコード化する](/post/jenkins/jenkins-as-code-with-generate-job-dsl-plugin/) ではJenkinsのジョブをGroovy DSLで記述する方法と、利用例を紹介しました。

今回はJenkins Slave登録の方法を少し工夫してみましょう。

## Swarm PluginでJenkins SlaveからJenkins Masterへ登録する

JenkinsをMaster-Slaveの冗長構成で組む場合に、従来であればMaster側の管理画面にある `[ノードの管理]` からビルドSlaveにあたる別のJenkinsを登録します。

しかし、稀にネットワーク的な理由でMasterからSlaveに接続できない場合もあります。
例えば、Jenkins Masterはクラウド上にあるのに、SlaveはiOSアプリをビルドするためにオンプレのMacで構築する必要がある場合などがそれに当たります。

そこで今回紹介する [Swarm Plugin](https://wiki.jenkins.io/display/JENKINS/Swarm+Plugin) を使うことで、 **ビルドSlave側からJenkins Masterに対してノード登録ができる** のです。とても便利です。

イメージは以下の通りです。Jenkins Masterには [Swarm Plugin](https://wiki.jenkins.io/display/JENKINS/Swarm+Plugin) をインストールし、
Jenkins SlaveのマシンにはMasterにインストールされた [Swarm Plugin](https://wiki.jenkins.io/display/JENKINS/Swarm+Plugin) と同じバージョンの [Swarm Plugin Client](https://repo.jenkins-ci.org/releases/org/jenkins-ci/plugins/swarm-client/) をダウンロードしておきます。
このクライアントは `jar` ファイルで、かつスタンドアロンで動きます。

![jenkins-swarm](/images/20190525/jenkins-swarm.png)

## Swarm Plugin の使い方

## 参考にさせていだいたサイト

* [Swarm Plugin](https://wiki.jenkins.io/display/JENKINS/Swarm+Plugin)
