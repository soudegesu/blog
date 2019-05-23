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

前回の記事 [Jenkins2をコード化しよう - その１：Ansibleでマシンイメージを作成する](/post/jenkins/jenkins-as-code-with-ansible/) では Jenkins2をAnsibleでコード化するためのTipsを紹介しました。

今回は前回触れなかった `init.groovy.d` のJenkins起動スクリプトについて説明します。

## `init.groovy.d` ディレクトリとは

[Jenkinsの公式ページ](https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script) に Groovy Hook Script に関する記載があります。
Groovy Hook Scriptを使うことで、Jenkinsアプリケーションの指定のタイミングで任意のプログラムを実行するのに役立ちます。

Groovyスクリプト配置可能場所と探索の優先順位を以下に引用します。
なお、`HOOK` は 2019/05現在では `init` と `boot-failure` のタイミングがあり、それぞれ、Jenkinsが起動するタイミングと、起動に失敗したタイミングをフックできます。

> These scripts are written in Groovy, and get executed inside the same JVM as Jenkins, allowing full access to the domain model of Jenkins. For given hook HOOK, the following locations are searched:
>
> WEB-INF/HOOK.groovy in jenkins.war
>
> WEB-INF/HOOK.groovy.d/*.groovy in the lexical order in jenkins.war
>
> $JENKINS_HOME/HOOK.groovy
>
> $JENKINS_HOME/HOOK.groovy.d/*.groovy in the lexical order

jenkins.warの中に直接Groovyファイルを配置する手間と、実行ファイルが複数あっても良いことを鑑みると、`${JENKINS_HOME}/init.groovy.d/` 配下にファイルを配置するのが割と自然な選択でしょう。

## デバッグの仕方

まず覚えて置くと良いのは、作成したGroovy Scriptのデバッグの仕方です。
Groovy Scriptを使ってJenkinsの設定を変更するコードを書きたいときには、Jenkinsに関連するライブラリが必要なのですが、ローカル環境を構築するのが手間です。
そのため、Jenkinsの [Manage Jenkins] > [Script Console] からGroovy Scriptの動作確認をしながら実装することをオススメします。

![script_console](/images/20190523/script_console.png)

なお、Script Console上では `jenkins.*` `jenkins.model.*` `hudson.*` `hudson.model.*` がデフォルトでインポートされています。
実際にgroovyファイルを作成するときはこれらもgroovyファイル内でインポートする必要があります。


## 外部のライブラリを使いたい場合

## JenkinsのCredentialを登録してみる

## 参考にさせていただいたサイト

* [Groovy Hook Script - Jenkins - Jenkins Wiki](https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script)

