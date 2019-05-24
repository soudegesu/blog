---
title: "Jenkins2をコード化しよう - その３：Jenkins Job DSLプラグインでジョブをコード化する"
description: "Jenkins2のコード化を行います。今回はJenkinsのジョブ自体の設定をJenkins Job DSLを使ってコード化します。"
date: "2019-05-24T15:35:08+09:00"
thumbnail: "/images/icons/jenkins_icon.png"
categories:
  - "jenkins"
tags:
  - "jenkins"
  - "groovy"
isCJKLanguage: true
twitter_card_image: /images/icons/jenkins_icon.png
---

前回の記事 [Jenkins2をコード化しよう - その２：Jenkinsの起動時にプログラム（Groovy Hook Script）を動かす](/post/jenkins/jenkins-as-code-with-init-groovy-d/) ではJenkins2起動時に実行するGroovy Hook Scriptの書き方を紹介しました。

今回はJenkinsのジョブ設定をコード化してみましょう。

<!--adsense-->

## JenkinsのジョブはXMLで管理されている

`${JENKINS_HOME}` 配下のディレクトリ構成は以下のようになっています。ジョブに関連する部分のみ抜粋します。

```bash
${JENKINS_HOME}
├── jobs
│   ├── ${JOB名}
│   │   ├── builds
│   │   ├── config.xml
│   │   ├── lastStable -> builds/lastStableBuild
│   │   ├── lastSuccessful -> builds/lastSuccessfulBuild
│   │   └── nextBuildNumber
│   ├── ${JOB名}
(以下略)
```

`jobs` ディレクトリ直下にジョブ名のディレクトリがあり、その配下に `config.xml` が存在します。
`config.xml` 内にJenkinsのジョブの設定全体を保存しているのですが、xmlを直接編集したり、gitで管理するのは苦行です。

<!--adsense-->

## Jenkins Job DSL プラグインを使う

xml管理を避ける方法の１つとして、[Jenkins Job DSL プラグイン](https://jenkinsci.github.io/job-dsl-plugin/) を使ってGroovy DSLでJenkinsの設定を作成できます。

[Jenkins Job DSL プラグイン](https://jenkinsci.github.io/job-dsl-plugin/)は、Jar単体で動く `job-dsl-core-${version}-standalone.jar` も提供しており、
これを使うのが個人的にはオススメです。

理由としては、Jenkinsプラグインを使うと、DSLを実行時にJenkinsの管理者のスクリプト実行許可（ScriptApproval）が必要な場合があり、自動的にJobをインポートさせたいユースケースの妨げになるからです。

スタンドアロンなjarの使い方をサンプルコードで紹介します。

以下のようなGroovy DSLファイル( `config.groovy` )を準備し、

{{< highlight groovy "linenos=inline" >}}
pipelineJob('config') {
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        url('git@github.com:xxxxxxxx/xxxxxxxx.git')
                        credentials('your-credential')
                    }
                    branch('*/master')
                }
            }
            scriptPath('path to Jenkinsfile')
        }
    }
}
{{</ highlight>}}

Groovy DSLをスタンドアロンなJarに渡します。

{{< highlight bash "linenos=inline" >}}
java -Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8 -jar job-dsl-core-1.74-standalone.jar -j config.groovy
{{</ highlight>}}

すると、カレントディレクトリに `config.xml` を生成してくれます。

{{< highlight xml "linenos=inline" >}}
<flow-definition>
    <actions></actions>
    <description></description>
    <keepDependencies>false</keepDependencies>
    <properties></properties>
    <triggers></triggers>
    <definition class='org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition'>
        <scriptPath>path to Jenkinsfile</scriptPath>
        <lightweight>false</lightweight>
        <scm class='hudson.plugins.git.GitSCM'>
            <userRemoteConfigs>
                <hudson.plugins.git.UserRemoteConfig>
                    <url>git@github.com:xxxxxxxx/xxxxxxxx.git</url>
                    <credentialsId>your-credential</credentialsId>
                </hudson.plugins.git.UserRemoteConfig>
            </userRemoteConfigs>
            <branches>
                <hudson.plugins.git.BranchSpec>
                    <name>*/master</name>
                </hudson.plugins.git.BranchSpec>
            </branches>
            <configVersion>2</configVersion>
            <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
            <gitTool>Default</gitTool>
        </scm>
    </definition>
</flow-definition>
{{</ highlight>}}

<!--adsense-->

## ユースケース：ジョブをインポートするジョブを作る

私は、この `job-dsl-core-${version}-standalone.jar` を使って、**Jenkinsが「自分のジョブを丸ごとインポートする」ジョブ** を作っています。

ジョブの処理概要は以下です。

1. Groovy DSLを含むGitリポジトリをClone
2. Jenkinsの `jobs` ディレクトリ配下の構成にならって、再帰的にすべてのJobの `config.xml` を生成する。
3. 生成された `config.xml` を含むジョブのディレクトリをまるごと `${JENKINS_HOME}/jobs` 配下にコピー
4. jenkins-cliを使って自分を再起動

## 参考にさせていだいたサイト

* [Jenkins Job DSL API](https://jenkinsci.github.io/job-dsl-plugin/)
