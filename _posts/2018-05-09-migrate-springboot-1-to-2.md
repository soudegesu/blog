---
title: "Spring Bootを1.5から2へマイグレーションしてみて大変だった"
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
### これからのJava時代に備えて

今私は Springbootの `1.5.9` を使っているのだが、2018/05時点において、公式からは [Springboot 1.5のJava9サポート予定はない](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above) ことが公表されている。

以前、[JavaプロジェクトをModule System(Java9のProject Jigsaw)にマイグレーションするステップ](/java/java9-modularity/) を書いた時には
Springbootの1.5がJava9のmodule pathでのクラスロードに対応しておらず(**複数ライブラリ間でのパッケージ重複問題**)、完全移行を断念した経緯があった。

その後、Springbootの2.0が2018/03にローンチされた後、Java9上で動作することを確認している。

つまり、 **Javaの進化に追従していきたいプロダクトは、Springboot2にマイグレーションする必要がある** のだ。

### 2019年1月までにSpringboot2への以降を

マイグレーションを進める上で、スケジュール感の算段を立てる必要がある。

[Oracleの公式](http://www.oracle.com/technetwork/jp/java/eol-135779-ja.html) でJavaのロードマップを確認しよう。

Javaに関して抑えておきたいのは2点
* Java11は `2018/09` から利用可能
* Java8は `2019/01` にサポートが切れる

である。

次に [Springbootのロードマップ](https://github.com/spring-projects/spring-boot/milestones) も確認しておく。

![springboot-milestone]({{site.baseurl}}/assets/images/20180509/springboot-milestones.png)

Springbootの場合には

* `2.0.2` のリリースは2018/05予定
* `2.1.0.RC1` のリリースが2018/09予定
* `2.1.0.RC2` 以降は未定

がポイントだ。

結論として、
* **2018/09までに `sprignboot 2.0.x` にマイグレーションする**
* **2019/01までに `Java 11` にマイグレーションする**

という段取りで進めていくとスムーズだと考えている。

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

* CrudRepositoryからfindOneが消えた
ので `findByXX` にて自前実装


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


```
{
    "names": [
        "http.server.requests",
        "jvm.buffer.memory.used",
        "jvm.memory.used",
        "jvm.gc.memory.allocated",
        "jvm.memory.committed",
        "jdbc.connections.min",
        "tomcat.sessions.created",
        "tomcat.sessions.expired",
        "hikaricp.connections.usage",
        "tomcat.global.request.max",
        "tomcat.global.error",
        "jvm.gc.max.data.size",
        "logback.events",
        "system.cpu.count",
        "jvm.memory.max",
        "jdbc.connections.active",
        "jvm.buffer.total.capacity",
        "jvm.buffer.count",
        "process.files.max",
        "jvm.threads.daemon",
        "hikaricp.connections",
        "process.start.time",
        "hikaricp.connections.active",
        "tomcat.global.sent",
        "hikaricp.connections.creation.percentile",
        "tomcat.sessions.active.max",
        "tomcat.threads.config.max",
        "jvm.gc.live.data.size",
        "process.files.open",
        "process.cpu.usage",
        "hikaricp.connections.acquire",
        "hikaricp.connections.timeout",
        "tomcat.servlet.request",
        "jvm.gc.pause",
        "hikaricp.connections.idle",
        "process.uptime",
        "tomcat.global.received",
        "system.load.average.1m",
        "tomcat.cache.hit",
        "hikaricp.connections.pending",
        "hikaricp.connections.acquire.percentile",
        "tomcat.servlet.error",
        "tomcat.servlet.request.max",
        "hikaricp.connections.usage.percentile",
        "jdbc.connections.max",
        "tomcat.cache.access",
        "tomcat.threads.busy",
        "tomcat.sessions.active.current",
        "system.cpu.usage",
        "jvm.threads.live",
        "jvm.classes.loaded",
        "jvm.classes.unloaded",
        "jvm.threads.peak",
        "tomcat.threads.current",
        "tomcat.global.request",
        "hikaricp.connections.creation",
        "jvm.gc.memory.promoted",
        "tomcat.sessions.rejected",
        "tomcat.sessions.alive.max"
    ]
}
```

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
