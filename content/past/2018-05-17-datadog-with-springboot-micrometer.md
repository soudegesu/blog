---
title: "micrometer-registry-datadogを使ったらDatadogのJVMのメトリックがわかりやすくなった"
description: "以前書いた「 Spring Bootを1.5から2へマイグレーションするステップとポイント」 にて、Datadogに対してメトリックを送信するの仕組みをmicrometer-registry-datadogに変更したのですが、Javaアプリケーションのメトリック取得がいい感じだったので、今回はそれを紹介します。"
date: 2018-05-17
thumbnail: /images/icons/datadog_icon.png
categories:
    - java
tags:
    - springboot
    - datadog
url: /java/datadog-with-springboot-micrometer/
twitter_card_image: /images/icons/datadog_icon.png
---

以前書いた「 [Spring Bootを1.5から2へマイグレーションするステップとポイント](/java/migrate-springboot-1-to-2/) 」 にて、
[Datadog](https://www.datadoghq.com/)に対してメトリックを送信するの仕組みを [micrometer-registry-datadog](https://mvnrepository.com/artifact/io.micrometer/micrometer-registry-datadog) に変更したのですが、
Javaアプリケーションのメトリック取得がいい感じだったので、今回はそれを紹介します。

![micrometer](/images/20180517/micrometer.png)

<!--adsense-->

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

{{< highlight groovy "linenos=inline" >}}
compile group: 'org.springframework.boot', name: 'spring-boot-starter-actuator', version: '2.0.1.RELEASE'
compile group: 'io.micrometer', name: 'micrometer-registry-datadog', version: '1.0.3'
{{< / highlight >}}

### application.yamlの修正

application.yaml に設定を追加します。
公式ドキュメントだと指定可能なプロパティが全て列挙されていないので、
`io.micrometer.datadog.DatadogConfig` クラスの中を見ることで確認できます。

{{< highlight yaml "linenos=inline" >}}
management:
  metrics:
    export:
      datadog:
        api-key: ${datadogのAPIキー}
        step: 15s # メトリックの収集間隔
{{< / highlight >}}

### メトリックに情報を付与する

こちらは必須ではありません。

Datadog上でタグを使ってメトリックを横断的にフィルタできると嬉しいケースがあるので、 `commonTags` を使って、ホスト名やモニターグループを設定すると良いと思います。

また、Spring Bootから取得しているメトリックであることを識別するために、メトリックに `spring.` のprefixを付与しています。

{{< highlight java "linenos=inline" >}}
@Bean
public MeterRegistryCustomizer<MeterRegistry> customizer() {
    return registry -> {
        try {
            registry.config()
            .meterFilter(new MeterFilter() {
                @Override
                public Meter.Id map(Meter.Id id) {
                    return id.withName("spring." + id.getName());
                }
            })
            .commonTags("env", "local")
            .commonTags("monitoring_group", "system_component_a")
            .commonTags("host", InetAddress.getLocalHost().getHostName());
        } catch (UnknownHostException e) {
            LOGGER.error("fail to resolve hostname.", e);
        }
    };
}
{{< / highlight >}}

<!--adsense-->

## Datadog上でJVMのメトリックを見てみよう

さて本題です。アプリケーションを起動し、Datadog上でメトリックを確認してみましょう。

### JVMの使用メモリ

#### 全体の使用量

JVMの使用メモリ量は `jvm.memory.used` のメトリックで確認できます。 (先程 `spring.` のprefixをつけているので、下の図では `spring.jvm.memory.used`)

![used_memory](/images/20180517/used_memory.png)

#### ヒープ領域のみ

次に `area:heap` を指定すると、ヒープ領域のみに絞りこむことができます。

![heap_only](/images/20180517/heap_only.png)

#### Survivor領域

`id:ps_survivor_space` を追加すると、 ヒープの中のさらにSurvivor領域のみにも絞り込めます。これは嬉しい。

![survivor_only](/images/20180517/survivor_only.png)

#### 領域毎にグループ化する

もちろん、 `id` をfromではなく、グルーピングで使用すると、Heap領域に対する各領域の状態が確認できます。

![heap_group_by_id](/images/20180517/heap_group_by_id.png)

### JVMメトリックの構成

`jvm.memory.used` メトリックの構造をまとめると以下。

|metric         |area   |id |
|---------------|-------|---|
|jvm.memory.used|heap   |ps_eden_space|
|               |       |ps_old_gen|
|               |       |ps_survivor_space|
|               |nonheap|metaspace|
|               |       |code_cache|
|               |       |cmpressed_class_space|

他にも、例えば、 バッファメモリもそれぞれDirect BufferとMapped Bufferでメトリックが取れたりする。

|metric                 |id     |
|-----------------------|-------|
|jvm.buffer.memory.used |direct |
|                       |mapped |

<!--adsense-->

## micrometer-registry-datadog使用時の注意点

### Datadogへのメトリック送信に失敗した場合にはWARNログが出力される

`micrometer-registry-datadog` がバックグラウンドで定期的にメトリックを打ち上げてくれますが、
通信に失敗した場合には `WARN` レベルのログが出力されます。

そのため、 **アプリケーションのログ監視をしている場合には、影響がないか確認しておきましょう** 。

参考までに、エラーは以下のような感じで出ていました。

{{< highlight java "linenos=inline" >}}
failed to send metrics
    java.net.SocketTimeoutException: connect timed out
    at java.net.PlainSocketImpl.socketConnect(Native Method)
    at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
    at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
    at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
    at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
    at java.net.Socket.connect(Socket.java:589)
    at sun.security.ssl.SSLSocketImpl.connect(SSLSocketImpl.java:673)
    at sun.net.NetworkClient.doConnect(NetworkClient.java:175)
    at sun.net.www.http.HttpClient.openServer(HttpClient.java:463)
    at sun.net.www.http.HttpClient.openServer(HttpClient.java:558)
    at sun.net.www.protocol.https.HttpsClient.<init>(HttpsClient.java:264)
    (以下略)
{{< / highlight >}}

## まとめ

`micrometer-registry-datadog` を使用すると、取得したいメトリックの情報が構造化されて、フィルタリングがしやすくなりました。
特にJVMのメモリのメトリックは以前よりも直感的になった印象があります。

今回のMicrometerに限らず、 Application Performance Monitoring 界隈のライブラリが様々出回ってきたので、この方面も学習していきたいですね。

## 参考にさせていただいたサイト
* [Micrometer Datadog](https://micrometer.io/docs/registry/datadog)
