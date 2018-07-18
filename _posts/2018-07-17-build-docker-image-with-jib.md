---
title: "jibを使ってJavaアプリケーションのDockerイメージをビルドする"
description: ""
date: 2018-07-17 00:00:00 +0900
categories: java
tags: docker gradle
---

実案件でもJavaアプリケーションをDockerコンテナ上で稼働させる事例もかなり増えていますね。
今回は `Jib` を使ったDockerfileイメージのビルドを紹介します。

![jib]({{site.baseurl}}/assets/images/20180717/jib.png)

* Table Of Contents
{:toc}


## モチベーション

### アプリケーションのビルドとDockerイメージのビルドをいい感じに統合したい

おそらく、これに尽きると思います。

**最終的な実行可能なDockerイメージを作成するために、ビルド定義を複数管理する** というのはまどろっこしいです。

Javaアプリケーションの場合、RubyやPythonなどのスクリプト言語と異なり、アプリケーションのビルドという工程が発生します。

加えて、Dockerfile内で `COPY` コマンドを定義し、ビルド成果物をコンテナ内にコピーすることで、ようやくDockerイメージを作成できるわけです。

ビルドにおける一連の流れを、列挙すると以下のようになります。

1. 依存モジュールの解決とインストール
2. アプリケーションのビルド
3. Dockerイメージのビルド

`3` がDockerfile内に処理が定義されるので、この部分をGradleやMavenの定義ファイルに移動できれば、管理対象ファイルを減らすことができます。

## やってみる

### ゴール設定

今回は以下の2つをゴールにします。

1. jibでSpringbootのアプリケーションのDockerイメージを作成する
2. 作成したDockerイメージをAWS ECRにPushする

### 環境の準備

以下のような環境で試しています。

* MacOSX
* Java SE: `1.8.0_152`
* Gradle: `4.8.1`
    * jib-gradle-plugin: `0.9.6`


### build.gradleの編集

まずは、 `build.gradle` を編集しましょう。

### Dockerイメージのビルド
まずは、Docker imageのビルドをしましょう。

```bash
./gradlew jibDockerBuild
```


```bash
docker images

> jib-test                    unspecified         155f1b17a8bc        48 years ago        119MB

```

```bash
docker run -p 8080:8080 -it 155f1b17a8bc /bin/bash

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
