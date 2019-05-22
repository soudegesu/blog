---
title: "Jenkins2をコード化しよう - その２：Jenkinsの起動スクリプトを書く"
description: "Jenkins2のinit.groovy.d配下にgroovyスクリプトを配置することで、Jenkins起動時にJenkinsの設定を書き換えることができます。"
date: "2019-05-22T15:35:08+09:00"
thumbnail: "/images/icons/jenkins_icon.png"
categories:
  - "jenkins"
tags:
  - "jenkins"
  - "groovy"
isCJKLanguage: true
twitter_card_image: /images/icons/jenkins_icon.png
---

前回の記事 [Jenkins2をコード化しよう - その１：Ansibleでマシンイメージを作成する](/post/jenkins/jenkins-as-code-with-ansible/) では Jenkins2をAnsibleでコード化するためのTipを紹介しました。

今回は前回触れなかった `init.groovy.d` のJenkins起動スクリプトについて説明します。

## `init.groovy.d` ディレクトリとは

[Jenkinsの公式](https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script) にて、Groovy Hook Scriptに関する記載があります。


> These scripts are written in Groovy, and get executed inside the same JVM as Jenkins, allowing full access to the domain model of Jenkins. For given hook HOOK, the following locations are searched:
> WEB-INF/HOOK.groovy in jenkins.war
> WEB-INF/HOOK.groovy.d/*.groovy in the lexical order in jenkins.war
> $JENKINS_HOME/HOOK.groovy
> $JENKINS_HOME/HOOK.groovy.d/*.groovy in the lexical order

## デバッグの仕方

## 外部のライブラリを使いたい場合

## JenkinsのCredentialを登録してみる

## 参考にさせていただいたサイト

* [Groovy Hook Script - Jenkins - Jenkins Wiki](https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script)

