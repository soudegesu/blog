---
title: "Spring Bootを1.5から2へ移行してみて大変だった"
description: ""
date: 2018-05-09 00:00:00 +0900
categories: java
tags: springboot
---


* Table Of Contents
{:toc}


[Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
を参考にSpring Bootの目メジャーバージョンアップを試みた。

## モチベーション
### これからのJavaに備えて
`1.5.9` を使っているのだが、今のところ [1.5系をJava9上でサポートする予定はない](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above) と公表されている。

## 事前準備

### テストを準備しておく
* 単体テスト
* Integration テスト
* 負荷テスト

## build.gradleの変更

* バージョンアップする
`1.5.9.RELEASE` -> `2.0.1.RELEASE`

[2.0.1のissue](https://github.com/spring-projects/spring-boot/milestone/98?closed=1) を見るとわかるが、165のissueがクローズされている

今のとおｒ

* enabled = trueを追加

jar {
    baseName = 'soudegesu-demo-app'
    enabled = true
}

* `bootRepackage` が廃止になったため変更

```
bootRepackage {
    mainClass = 'com.soudegesu.demo.app.Application'
    executable = true
}

springBoot {
    mainClassName = 'com.soudegesu.demo.app.Application'
}

```

## 参考にさせていただいたサイト
* [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
* [Spring Boot with Java 9 and above](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above)
