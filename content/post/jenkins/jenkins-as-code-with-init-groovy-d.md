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


