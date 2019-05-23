---
title: "Jenkins2をコード化しよう - その２：Jenkinsの起動時にプログラム（Groovy Hook Script）を動かす"
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

<!--adsense-->

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

<!--adsense-->

## 外部のライブラリを使いたい場合

外部のJavaライブラリを使いたいときがよくあります。
例えば、JenkinsをAWS上に構築しているのであれば、[AWS SDK for JAVA](https://aws.amazon.com/jp/sdk-for-java/) などがそれに該当します。

このようなユースケースではJenkinsのwarファイルに細工をするのではなく、`Grape.grab` を使うと良いでしょう。
以下のように書けば、Groovy Script内で使う外部モジュールを、スクリプトの実行タイミングで取得してくれます。

{{< highlight groovy "linenos=inline" >}}
// https://mvnrepository.com/artifact/com.amazonaws/aws-java-sdk
groovy.grape.Grape.grab(group:'com.amazonaws', module:'aws-java-sdk', version:'1.11.534', transitive: false)

import jenkins.model.*
import hudson.security.*
// 以下にgroovyの処理を書く（割愛）
{{</ highlight>}}

<!--adsense-->

## サンプルコード：KMSの情報を復号化してJenkinsのCredentialへ登録

試しにGroovyのサンプルコードを書いてみましょう。KMSから取得した鍵情報を復号化して、JenkinsにCredentialを登録するサンプルです。

{{< highlight groovy "linenos=inline" >}}
// https://mvnrepository.com/artifact/com.amazonaws/aws-java-sdk
groovy.grape.Grape.grab(group:'com.amazonaws', module:'aws-java-sdk', version:'1.11.534', transitive: false)

import jenkins.model.*
import hudson.security.*
import com.cloudbees.plugins.credentials.SystemCredentialsProvider;
import com.cloudbees.jenkins.plugins.sshcredentials.impl.BasicSSHUserPrivateKey;
import com.cloudbees.plugins.credentials.CredentialsScope;
import org.jenkinsci.plugins.plaincredentials.*
import org.jenkinsci.plugins.plaincredentials.impl.*
import hudson.util.Secret

import org.apache.commons.fileupload.*
import java.nio.ByteBuffer;
import java.util.Base64;
import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.AWSKMSClient;
import com.amazonaws.services.kms.AWSKMSClientBuilder;
import com.amazonaws.services.kms.model.DecryptRequest;

// Jenkinsのインスタンスを取得
def instance = Jenkins.getInstance()

println "JenkinsのCredentialを登録開始します"
def system_credentials_provider = SystemCredentialsProvider.getInstance()

// KMSのキー情報
def ssh_key_description = 'description of key'
def ssh_key_scope = CredentialsScope.GLOBAL
def ssh_key_id = 'key_id'
def ssh_key_username = 'username'
def ssh_key_passphrase = 'passphrase'
def ssh_key_private_key_source = new BasicSSHUserPrivateKey.DirectEntryPrivateKeySource(decrypt('CyperText of KMS'))

// 認証情報を追加
system_credentials_provider.addCredentials(
  com.cloudbees.plugins.credentials.domains.Domain.global(),
  new BasicSSHUserPrivateKey(
        ssh_key_scope,
        ssh_key_id,
        ssh_key_username,
        ssh_key_private_key_source,
        ssh_key_passphrase,
        ssh_key_description)
)

// KMSから復号化します
String decrypt(String src) {
  println "KMSから鍵情報を復号化します"
  byte[] cipherText = Base64.getDecoder().decode(src);
  ByteBuffer cipherBuffer = ByteBuffer.allocate(cipherText.length);
  cipherBuffer.put(cipherText);
  cipherBuffer.flip();

  AWSKMS kmsClient = AWSKMSClientBuilder.defaultClient();
  DecryptRequest req = new DecryptRequest().withCiphertextBlob(cipherBuffer);
  return getString(kmsClient.decrypt(req).getPlaintext());
}

// ByteBufferからStringへ変換します
String getString(ByteBuffer b) {
  byte[] byteArray = new byte[b.remaining()];
  b.get(byteArray);
  return new String(byteArray);
}

// Jenkinsインスタンスに保存
instance.save()
println "Jenkinsへの登録が完了しました"

{{</ highlight>}}

ポイントになるのは、 スクリプト内の処理が終了するタイミングまでに、`Jenkins.getInstance()` で取得したJenkinsのインスタンスオブジェクトを保存することです。

## 参考にさせていただいたサイト

* [Groovy Hook Script - Jenkins - Jenkins Wiki](https://wiki.jenkins.io/display/JENKINS/Groovy+Hook+Script)
