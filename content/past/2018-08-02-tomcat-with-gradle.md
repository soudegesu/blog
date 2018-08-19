---
title: "Gradleとgradle-tomcat-pluginを使ってローカルでTomcatを起動する"
description: "最近自前でwarファイルをJavaコンテナにデプロイする機会が減って、実行可能なfat-jarをsystemdに管理してもらうことが増えました。ただ、今回は敢えてローカル環境でGradleを使ってTomcatアプリケーションを動作させる方法を調査しました。"
date: 2018-08-02
categories:
    - java
tags:
    - tomcat
    - gradle
# header:
#   teaser: /assets/images/icon/gradle_icon.png
---

最近自前でwarファイルをJavaコンテナにデプロイする機会が減って、実行可能なfat-jarをsystemdに管理してもらうことが増えました。
ただ、今回は敢えてローカル環境でGradleを使ってTomcatアプリケーションを動作させる方法を調査しました。

* Table Of Contents
{:toc}

## ローカル環境でTomcatを動かそう

最近はもっぱらSpring Bootを使うのですが、とある事情により、素のTomcat上でwarアプリケーションを動作させる必要が出てきました。

ローカル環境で開発を行う上では、IDEもIntelliJを使うようになり、IntelliJにはTomcat pluginも最初からバンドルされていません。

昔使っていたEclipseやSpring Tool Suite にはTomcatのアイコンがあって、それをポチってアプリケーションを起動させていました。懐かしい。

IntelliJにプラグインをインストールするのも方法論としてはアリですが、今回のユースケースのためだけにIDEを拡張するのも嫌なので、別の方法を模索したかったのです。

## 環境情報

以下の環境にて方法を模索してみます。

* Gradle 4.8
* Tomcat 9

## gradle-tomcat-plugin を使う

割とすぐに答えが見つかりました。

ビルドツールにGradleを使っている場合には、[gradle-tomcat-plugin](https://github.com/bmuschko/gradle-tomcat-plugin) を使うことで、Gradle経由でTomcatの起動ができそうです。

今回試したサンプルコードは [こちら](https://github.com/soudegesu/tomcat-gradle-plugin-test) において置くとして、肝心の `build.gradle` だけ貼り付けておきます。

```groovy
buildscript {
    repositories {
        mavenCentral()
        jcenter()
    }
    dependencies {
        classpath group: 'com.bmuschko', name:'gradle-tomcat-plugin', version:'2.5'
    }
}

ext {
    tomcatVersion = '9.0.10'
}

apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'java'
apply plugin: 'com.bmuschko.tomcat'

sourceSets {
    sourceCompatibility = 1.8
    targetCompatibility = 1.8

    [compileJava, compileTestJava]*.options*.encoding = 'UTF-8'
}

repositories {
    mavenCentral()
}

dependencies {
    providedCompile group: 'javax.servlet', name: 'javax.servlet-api', version: '4.0.1'
    providedCompile group: 'javax.servlet.jsp', name: 'javax.servlet.jsp-api', version: '2.3.1'
    compile group: 'org.apache.taglibs', name: 'taglibs-standard-impl', version: '1.2.5'

    tomcat "org.apache.tomcat.embed:tomcat-embed-core:${tomcatVersion}"
    tomcat "org.apache.tomcat.embed:tomcat-embed-logging-juli:9.0.0.M6"
    tomcat("org.apache.tomcat.embed:tomcat-embed-jasper:${tomcatVersion}") {
        exclude group: "org.eclipse.jdt.core.compiler", module: "ecj"
    }
}

tomcat {
    httpProtocol = 'org.apache.coyote.http11.Http11Nio2Protocol'
    ajpProtocol  = 'org.apache.coyote.ajp.AjpNio2Protocol'
    contextPath = 'soudegesu'
}

```

tomcat 9を使うときのみ `tomcat-embed-logging-juli` のバージョンが `tomcat-embed-core` と同じにできない所が留意点でしょうか。
まだ、artifactがpublishされていないようですね。

`tomcat` のブロックにはコンテキストパスをはじめ、様々なTomcatのオプションを指定できます。
ローカルで開発する分には

アプリケーションは `./gradlew` で起動できます。

```bash
./gradlew tomcatRun
```

サンプルアプリケーションが動いているか確認しましょう。問題なさそうですね。

```bash
curl http://localhost:8080/soudegesu/sample

<!DOCTYPE html>
<html>
<head>
<title>Sample</title>
</head>
<body>
Sample !!!
</body>
</html>
```

Tomcatを停止するときは以下でした。

```bash
./gradlew tomcatStop
```

## まとめ

GradleでTomcatを使った開発したいときには `gradle-tomcat-plugin` を使うと簡単に導入できることがわかりました。
IDEにプラグインを入れると他のJavaプロジェクトを実装する際にも影響が出てしまいますが、 Graldeプラグインとして利用することで影響範囲がプロジェクト内に留められるので魅力的です。

## 参考にさせていただいたサイト

* [gradle-tomcat-plugin](https://github.com/bmuschko/gradle-tomcat-plugin)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=477418909X&linkId=2e0f8e2eea11a37ff8b7c8371fa3b4ae"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798136433&linkId=e75591d1acf6e9adf2f590ee3d445997&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B079Z1PG6C&linkId=21883e76b1b88cdf1ed54d705db98713&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
