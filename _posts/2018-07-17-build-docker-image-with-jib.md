---
title: "jibを使ってJavaアプリケーションのDockerイメージをビルドする"
description: ""
date: 2018-07-17 00:00:00 +0900
categories: java
tags: docker gradle
---

実案件でもJavaアプリケーションをDockerコンテナ上で稼働させる事例もかなり増えていますね。
今回は [Jib](https://github.com/GoogleContainerTools/jib/tree/master/jib-gradle-plugin) を使ったDockerfileイメージのビルドを紹介します。

![jib]({{site.baseurl}}/assets/images/20180717/jib.png)

* Table Of Contents
{:toc}


## モチベーション

### アプリケーションのビルドとDockerイメージのビルドをいい感じに統合したい

**最終的な実行可能なDockerイメージを作成するために、定義ファイルを複数管理する** というのはまどろっこしいです。
可能であれば1つにしたいです。その場の解として2つになってしまうことはありますけど。

ビルド定義が複数あるということは、複数のビルドコマンドを実行する必要があり、つまり、ビルドの順序を意識する必要があるということです。

Javaアプリケーションの場合、RubyやPythonなどのスクリプト言語と異なり、アプリケーションのビルドという前工程があり、
その後、Dockerfile内の `COPY` コマンドにて、ビルド成果物をコンテナ内にコピーすることで、ようやくDockerイメージを作成できるわけです。

ビルドにおける一連の流れを、列挙すると以下のようになります。

1. 依存モジュールの解決とインストール
2. アプリケーションのビルド
3. Dockerイメージのビルド

`3` の部分をGradleやMavenの定義ファイルに移動できれば、管理対象ファイルを減らすことができるので画期的ですよね。

### jibとは

[jib](https://github.com/GoogleContainerTools/jib/tree/master/jib-gradle-plugin) は Google のエンジニアが実装した JavaアプリケーションのためのOCI(Docker)イメージビルドツールです。

MavenやGradleのプラグインが提供されていて、従来のJavaアプリケーションのビルド定義ファイル（ `pom.xml` や `build.gradle` ）中にOCIイメージのビルド定義、リポジトリへのpush処理を集約できます。

jibではプロダクトの目的として以下の3つを謳っているのですが、dockerデーモンを起動しなくてもイメージが焼けるのは個人的には嬉しいです。

> ・Fast - Deploy your changes fast. Jib separates your application into multiple layers, splitting dependencies from classes. Now you don’t have to wait for Docker to rebuild your entire Java application - just deploy the layers that changed.
>
> ・Reproducible - Rebuilding your container image with the same contents always generates the same image. Never trigger an unnecessary update again.
>
> ・Daemonless - Reduce your CLI dependencies. Build your Docker image from within Maven or Gradle and push to any registry of your choice. No more writing Dockerfiles and calling docker build/push.

## やってみる

### ゴール設定

今回は以下の2つをゴールにします。

1. jibでSpringbootのアプリケーションのDockerイメージを作成する
2. 作成したDockerイメージをAWS ECRにpushする

### 環境の準備

以下のような環境で試しています。

* MacOSX
* Java SE: `1.8.0_152`
* Gradle: `4.8.1`
    * jib-gradle-plugin: `0.9.6`


### build.gradleの編集

まずは、 `build.gradle` を編集しましょう。以下のような感じで `build.gradle` を編集します。

```gradle
buildscript {
    repositories {
        maven {
            url 'http://repo.spring.io/plugins-release'
        }
        maven {
            url "https://plugins.gradle.org/m2/"
        }
    }
    dependencies {
        classpath "gradle.plugin.com.google.cloud.tools:jib-gradle-plugin:0.9.6"
        classpath group: 'org.springframework.boot', name: 'spring-boot-gradle-plugin', version: "2.0.3.RELEASE"
    }
}

apply plugin: 'java'
apply plugin: 'idea'
apply plugin: 'eclipse'
apply plugin: 'org.springframework.boot'
apply plugin: 'com.google.cloud.tools.jib'

sourceCompatibility = 1.8
targetCompatibility = 1.8
[ compileJava, compileTestJava ]*.options*.encoding = 'UTF-8'

repositories {
    mavenCentral()
}

jib {
    from {
        image = 'openjdk:alpine'
    }
    to {
        image = getProperty('aws.accountid') + ".dkr.ecr." + getProperty('aws.region') + ".amazonaws.com/jib-test"
        credHelper = 'ecr-login'
    }
    container {
        jvmFlags = ['-Xms512m', '-Xms1g', '-Xmx1g', '-Xss10m', '-XX:MaxMetaspaceSize=1g']
        mainClass = 'com.soudegesu.example.MainApplication'
        args = []
        ports = ['8080']
        format = 'OCI'
    }
}

ext {
    verSpringboot = '2.0.3.RELEASE'
}

dependencies {
    compile group: 'org.springframework.boot', name: 'spring-boot-starter-web', version: verSpringboot
}
```

### Dockerイメージのビルド

まずは、Dockerイメージのビルドをしてみましょう。
イメージのビルドには不要ですが、ビルドが失敗するので実行引数にプロファイルを指定します。

```bash
./gradlew jibDockerBuild -Paws.accountid=${awsアカウントID} -Paws.region=${awsのリージョン}
```

完成したイメージを確認します。

```bash
docker images

> REPOSITORY                  TAG                 IMAGE ID            CREATED             SIZE
> jib-test                    unspecified         155f1b17a8bc        48 years ago        119MB

```

「CREATED」が **48 years ago** なのが少し気になりますが、そのうち改善されるでしょう。（きっと）

作成したイメージからコンテナをローカルで起動してみます。

```bash
docker run -p 8080:8080 -it 155f1b17a8bc

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v2.0.3.RELEASE)

2018-07-18 00:34:52.773  INFO 1 --- [           main] com.soudegesu.example.MainApplication    : Starting MainApplication on 1b3277472466 with PID 1 (/app/classes started by root in /)
2018-07-18 00:34:52.780  INFO 1 --- [           main] com.soudegesu.example.MainApplication    : No active profile set, falling back to default profiles: default
(以下略)
```

### プロセスを見てみる

springbootで実装したアプリケーションをイメージに入れたわけですが、特に executable-jar を作るタスクを実行したわけではありません。
dockerコンテナの中に入って、プロセスを確認してみましょう。

```bash
ps ax | grep java

> java -Xms512m -Xms1g -Xmx1g -Xss10m -XX:MaxMetaspaceSize=1g -cp /app/libs/*:/app/resources/:/app/classes/ com.soudegesu.example.MainApplication
```

なるほど。 `/app` の各ディレクトリ配下にクラスパスを通して、指定されたMainクラスを実行しているのですね。

言われてみれば、別にfat-jarは必須じゃないので、これでも良い気がします。

### DockerイメージのAWS ECRへのpush

次にAWS ECRにビルドしたイメージをpushしてみましょう。

事前に [amazon-ecr-credential-helper](https://github.com/awslabs/amazon-ecr-credential-helper) をインストールする必要があります。

以下コマンドを実行してみます。

```bash
./gradlew jib -Paws.accountid=${awsアカウントID} -Paws.region=${awsのリージョン} --stacktrace

> Containerizing application to ${awsアカウントID}.dkr.ecr.${awsのリージョン}.amazonaws.com/jib-test...
>
> Retrieving registry credentials for ${awsアカウントID}.dkr.${awsのリージョン}.amazonaws.com...
> Getting base image openjdk:alpine...
> Building dependencies layer...
> Building resources layer...
> Building classes layer...
> Retrieving registry credentials for registry.hub.docker.com...
> Finalizing...
>
> Container entrypoint set to [java, -Xms512m, -Xms1g, -Xmx1g, -Xss10m, -XX:MaxMetaspaceSize=1g, -cp, /app/libs/*:/app/resources/:/app/classes/, > com.soudegesu.example.MainApplication]
>
> Built and pushed image as ${awsアカウントID}.dkr.${awsのリージョン}.amazonaws.com/jib-test
>
> Deprecated Gradle features were used in this build, making it incompatible with Gradle 5.0.
> See https://docs.gradle.org/4.8/userguide/command_line_interface.html#sec:command_line_warnings
>
> BUILD SUCCESSFUL in 22s
> 2 actionable tasks: 1 executed, 1 up-to-date
```

イメージをAWSコンソール上から確認してみましょう。

![ecr_repo]({{site.baseurl}}/assets/images/20180717/ecr_repo.png)

すばらしい！

## まとめ

今回はjibを触ってみました。まだメジャーバージョン1には到達していないので、機能的に不足しているところもあるかもしれませんが、Dockerイメージのビルドとpushが簡単にできるので、今後の動向には注目したいところです。

Javaのプロセスを確認したところ、クラスパスを通したアプリケーション起動をしていました。Java 9以降で導入されているModule Pathを使った場合のアプリケーション起動なども実装されていくと、更に実用性が上がるかもしれませんね。


<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117763&linkId=79c46472dbb03ff135ffc54e14dbc065&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B0191B5FE4&linkId=f8b67e42a31b772b2c59912c2eb6d869&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155373&linkId=769a9339f83ab25e7baa1540833975b8&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798136433&linkId=17aac70d0b700057a0ce1b0c64de44f7&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
