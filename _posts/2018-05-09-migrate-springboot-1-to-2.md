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

bugfixだらけ、というわけではない。

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

###

* パッケージの変更

|変更前|変更後|
|===|===|
|org.springframework.boot.autoconfigure.web.ErrorAttributes|org.springframework.boot.web.servlet.error.ErrorAttributes|
|org.springframework.web.context.request.RequestAttributes|org.springframework.web.context.request.WebRequest|
|org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter|import org.springframework.web.servlet.config.annotation.WebMvcConfigurer|

### spring-data-jpa

こんなエラーが出た。 `@GeneratedValue(strategy= GenerationType.AUTO)` でAUTO INCREMENTで入れている時に起きた
```
org.springframework.dao.InvalidDataAccessResourceUsageException: error performing isolated work; SQL [n/a]; nested exception is org.hibernate.exception.SQLGrammarException: error performing isolated work
Caused by: org.hibernate.exception.SQLGrammarException: error performing isolated work
Caused by: java.sql.SQLException: Table '(Schema名).hibernate_sequence' doesn't exist
Query is: select next_val as id_val from hibernate_sequence for update
```

spring.jpa.hibernate.use-new-id-generator-mappings: false を追加

### springboot-actuatorの変更



```yaml
 management:
+  endpoints:
+    web:
+      exposure:
+        include: info,health,metrics,httptrace,threaddump,heapdump
   security:
     enabled: false
-  port: 8081
+  server:
+    port: 8081
```

* レスポンスボディが変わった

before
```
{
    "mem": 485331,
    "mem.free": 253058,
    "processors": 4,
    "instance.uptime": 312097,
    "uptime": 338799,
    "systemload.average": 3.69384765625,
    "heap.committed": 419840,
    "heap.init": 131072,
    "heap.used": 166781,
    "heap": 1864192,
    "nonheap.committed": 66648,
    "nonheap.init": 2496,
    "nonheap.used": 65492,
    "nonheap": 0,
    "threads.peak": 177,
    "threads.daemon": 155,
    "threads.totalStarted": 243,
    "threads": 158,
    "classes": 9613,
    "classes.loaded": 9613,
    "classes.unloaded": 0,
    "gc.ps_scavenge.count": 14,
    "gc.ps_scavenge.time": 373,
    "gc.ps_marksweep.count": 2,
    "gc.ps_marksweep.time": 388,
    〜(中略)〜
    "instrumented.responseCodes.other.fiveMinuteRate": 0,
    "httpsessions.max": -1,
    "httpsessions.active": 0,
    "datasource.primary.active": 0,
    "datasource.primary.usage": 0
}
```

after


* dropwizardMetricsを削除する

* 今まで使っていたメトリック

```
mem.free
mem
heap.used
heap
nonheap.used
nonheap
```

### micrometer-registry-datadog を入れる

* micrometer-registry-datadog を `build.gradle` に追加する

```groovy
compile group: 'io.micrometer', name: 'micrometer-registry-datadog', version: '1.0.3'
```

ローカル環境の場合

```yaml
# Spring Boot Actuator Settings
management:
  metrics:
    export:
      datadog:
        enabled: false
```

それ以外の環境の場合

```yaml
management:
  metrics:
    export:
      datadog:
        api-key: ${API-KEY}
        step: 30s
```

## 参考にさせていただいたサイト
* [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
* [Spring Boot with Java 9 and above](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above)
