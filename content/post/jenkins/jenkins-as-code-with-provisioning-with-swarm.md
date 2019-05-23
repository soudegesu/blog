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

## 参考にさせていだいたサイト

* [Swarm Plugin](https://wiki.jenkins.io/display/JENKINS/Swarm+Plugin)
