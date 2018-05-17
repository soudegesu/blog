---
title: "micrometer-registry-datadogを使ったらDatadogのJVMのメトリックがわかりやすくなった"
description: ""
date: 2018-05-17 00:00:00 +0900
categories: java
tags: springboot datadog
header:
  teaser: /assets/images/20180517/datadog_icon.png
---

以前書いた「 [Spring Bootを1.5から2へマイグレーションするステップとポイント](/java/migrate-springboot-1-to-2/) 」 にて、
[Datadog](https://www.datadoghq.com/)に対してメトリックを送信するの仕組みを [micrometer-registry-datadog](https://mvnrepository.com/artifact/io.micrometer/micrometer-registry-datadog) に変更したのですが、
Javaアプリケーションのメトリック取得がいい感じだったので、今回はそれを紹介します。

![micrometer]({{site.baseurl}}/assets/images/20180517/micrometer.png)

* Table Of Contents
{:toc}

## Micrometerって何

[Micrometer](https://micrometer.io/) はJVM上で動くアプリケーションのメトリックを取得するためのライブラリです。

各種モニタリングツールとの連携が可能で、2018/05時点では以下のモニタリングツールに対応しています。

* [Atlas](https://github.com/Netflix/atlas/wiki)
* [Datadog](https://www.datadoghq.com/)
* [Ganglia](http://ganglia.sourceforge.net/)
* [Graphite](https://graphiteapp.org/)
* [Influx](https://www.influxdata.com/)
* [JMX](http://www.oracle.com/technetwork/java/javase/tech/javamanagement-140525.html)
* [New Relic](https://newrelic.com/)
* [Prometheus](https://prometheus.io/)
* [SignalFx](https://signalfx.com/)
* [StatsD](https://github.com/etsy/statsd)
* [Wavefront](https://www.wavefront.com/)

これらのモニタリングツールと対になるライブラリを使用することで、取得したメトリックを容易に送ることができるのです。

## Spring Boot アプリケーションに micrometer-registry-datadog を設定する

Spring Bootに [micrometer-registry-datadog](https://mvnrepository.com/artifact/io.micrometer/micrometer-registry-datadog) を入れて、 Datadogにメトリックを溜め込んでみましょう。

### build.gradleの修正

`build.gradle` の依存関係に micrometer-registry-datadog を追加します。
なお、Micrometer自体は `spring-boot-starter-actuator` に含まれています。

```groovy
  compile group: 'org.springframework.boot', name: 'spring-boot-starter-actuator', version: '2.0.1.RELEASE'
  compile group: 'io.micrometer', name: 'micrometer-registry-datadog', version: '1.0.3'
```

### application.yamlの修正

application.yaml に設定を追加します。
`io.micrometer.datadog.DatadogConfig` クラスの中を見ると指定可能なプロパティを確認できます。

```yaml
management:
  metrics:
    export:
      datadog:
        api-key: ${datadogのAPIキー}
        step: 15s # メトリックの収集間隔
```

## Datadog上ではどう見えるか

## 参考にさせていただいたサイト
* [Micrometer Datadog](https://micrometer.io/docs/registry/datadog)
