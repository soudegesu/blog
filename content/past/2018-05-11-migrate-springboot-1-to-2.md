---
title: "Spring Bootを1.5から2へマイグレーションするステップとポイント"
description: "Spring Bootの2がリリースされたので、Spring Boot 2.0 Migration Guideを参考に既存の1.5のプロジェクトをマイグレーションしました。行なったときの段取りとポイントを簡単にまとめています。spring-boot-starter-web、spring-boot-starter-data-jpa、spring-boot-starter-actuator、spring-boot-starter-thymeleafを主に使っています。結論だけ先に言うと、spring-boot-starter-actuatorのマイグレーションがめんどくさかったです。"
date: 2018-05-11
categories:
  - java
tags:
  - springboot
  - datadog
---

Spring Bootの2がリリースされたので、[Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
を参考に既存のSpring Boot 1.5のプロジェクトをマイグレーションしてみた。行なったときの段取りとポイントを簡単にまとめました。

spring-boot-starter-web、spring-boot-starter-data-jpa、spring-boot-starter-actuator、spring-boot-starter-thymeleafを主に使っている。結論だけ先に言うと、spring-boot-starter-actuatorのマイグレーションがめんどくさかったです。

![springboot]({{site.baseurl}}/assets/images/20180511/springboot.png)

* Table Of Contents
{:toc}

## モチベーション
### これからのJava時代に備えて

Spring Bootの `1.5.9` を使っていたのだけど、2018/05時点において、公式からは [Spring Boot 1.5のJava9サポート予定はない](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above) ことが公表されている。

以前、[JavaプロジェクトをModule System(Java9のProject Jigsaw)にマイグレーションするステップ](/java/java9-modularity/) を書いた時には
Spring Bootの1.5がJava9のmodule pathでのクラスロードに対応しておらず(**複数ライブラリ間でのパッケージ重複問題**)、完全移行を断念した経緯があった。

その後、Spring Bootの2.0が2018/03にローンチされた後、Java9上で動作することを一応確認しておいたので、
 **Javaの進化に追従していきたいプロダクトは、Spring Boot2にマイグレーションする必要がある** し、 Spring Boot使いは **既にJavaのマイグレーション準備期間に突入した** のだ。

### 2019年1月までにSpring Boot2への以降を

「いつまでに何をしないといけないか？」、つまり、スケジュール感の算段を立てる必要がありそうだ。

まずは、 [Oracleの公式](http://www.oracle.com/technetwork/jp/java/eol-135779-ja.html) でJavaのロードマップを確認しよう。

Javaに関して抑えておきたいのは2点
* Java11は `2018/09` から利用可能
* Java8は `2019/01` にサポートが切れる

<br>

次に [Spring Bootのロードマップ](https://github.com/spring-projects/spring-boot/milestones) も確認しておく。

![springboot-milestone]({{site.baseurl}}/assets/images/20180511/springboot-milestones.png)

Spring Bootの場合には

* `2.0.2` のリリースは2018/05予定
* `2.1.0.RC1` のリリースが2018/09予定
* `2.1.0.RC2` 以降は未定

がポイントだ。

結論として、
* **2018/09までに `sprignboot 2.0.x` にマイグレーションする**
* **2019/01までに `Java 11` にマイグレーションする**

という段取りで進めていくとスムーズだと考えている。

## マイグレーションに必要な事前準備

いきなりマイグレーション作業をすると破綻するので、事前準備が必要だ。

具体的に言うと **テストコード** と **メトリック取得の仕組み** の2つが必要になる。

テストコードは最低でも以下の3種類を準備する。CI基盤と組み合わせるなどして簡単に実行できる工夫をしておくのが好ましい。
* 単体テスト
* 結合テスト
* 負荷テスト

メトリック取得の仕組みはなんでも良いが、私は [Datadog](https://www.datadoghq.com/) を使っている。

プロジェクトによっては、結合テストと負荷テストまで手が届いていないかもしれないが、今回のようなマイグレーションには欠かせないので作っておこう。

外側から見たシステムの振る舞いやパフォーマンスに影響がないかを確認する必要があるからだ。

なお、負荷テストではbefore/afterの比較ができないと意味がないので、既存のシステムでさばけるパフォーマンスは一度計測しておく。

とりあえず私の場合は既にメンテンナスされている資産があるので、それを使うことにする。

## いざマイグレーション!!

### 環境情報

* Java
  * 1.8.0_152
* Gradle
  * 4.4
* マイグレーション対象のSpring Bootモジュール
  * spring-boot-starter-web
  * spring-boot-starter-data-jpa
  * spring-boot-starter-actuator
  * spring-boot-configuration-processor
  * spring-boot-starter-thymeleaf
  * spring-boot-gradle-plugin(ビルド用)

### build.gradleの変更

* Spring Bootをバージョンアップ

記事を書いている時点での最新 `2.0.1.RELEASE` に変更する。

* `bootRepackage` タスクを削除

[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/docs/2.0.1.RELEASE/gradle-plugin/reference/html/) の `bootRepackage` タスクが廃止になったため削除した。 `public static void main(String[] args)` を探してよしなにやってくれるようなので、シンプルな構成のアプリケーションであれば、そもそも `mainClassName` の記述は必須ではない。

```groovy
// 削除
//bootRepackage {
//    mainClass = 'com.soudegesu.demo.app.Application'
//    executable = true
//}
```

### application.yaml の修正

`application.yaml` を修正する。設定項目は使っているモジュールに依存するので、詳細は触れないが、
私の場合には主に `springboot-actuator` の設定変更が発生した。
**yaml構造の変更** と **actuator endpointの公開設定** と **メトリック取得方法指定** といったところ。

```yaml
management:
  endpoints:
    web:
      exposure:
        include: info,health,metrics,httptrace,threaddump,heapdump
  metrics:
    export:
      datadog:
        api-key: (APIのキー)
        step: 30s
  security:
    enabled: false
  server:
    port: ポート番号
```

### コンパイルエラーやwarningを解決していく

`build.gradle` を編集して依存関係を更新すると、コンパイルエラーやwarningが出てくるので、それを適宜直していく。

パッケージやクラスに変更があり、それに合わせてIFも修正する必要があった。
ざっくり以下に置き換えている。

|変更前      |変更後    |
|===========|=========|
|org.springframework.boot.autoconfigure.web.ErrorAttributes|org.springframework.boot.web.servlet.error.ErrorAttributes|
|org.springframework.web.context.request.RequestAttributes|org.springframework.web.context.request.WebRequest|
|org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter|org.springframework.web.servlet.config.annotation.WebMvcConfigurer|

少し面倒だったのは [spring-data-jpa](https://projects.spring.io/spring-data-jpa/) の
`CrudRepository` から `findOne` が削除されたため、 implementしているクラス側で `findByXX` を自前定義してあげた。

コンパイルエラーが治ったら、単体テストを実行し、クラスレベルのデグレードが起きないことを確認した。

## 実行時エラーを解決する

次に、マイグレーション済みのSpring Bootアプリケーションを起動できるようになったら、ローカルで結合テストを流して、振る舞いに変化がないかをチェックする。

エラーがやはり出た。

DBへのINSERTが伴うリクエストの処理にて、 [spring-data-jpa](https://projects.spring.io/spring-data-jpa/) がエラーを吐き出している。

```
org.springframework.dao.InvalidDataAccessResourceUsageException: error performing isolated work; SQL [n/a]; nested exception is org.hibernate.exception.SQLGrammarException: error performing isolated work
(中略)
Caused by: java.sql.SQLException: Table '(Schema名).hibernate_sequence' doesn't exist

  Query is: select next_val as id_val from hibernate_sequence for update

```

DB（MySQL）へのINSERTで1箇所、AUTO INCREMENTしているところがあって、 Entityでフィールドに `@GeneratedValue(strategy= GenerationType.AUTO)` アノテーションを付与しているのだが、 `hibernate_sequence` を使ったID生成を試みてしまっているようだ。

確認してみたところ、デフォルトの挙動が変わっているようだ。

> Id generator
>
> The spring.jpa.hibernate.use-new-id-generator-mappings property is now true by default to align with the default behaviour of Hibernate. If you need to temporarily restore this now deprecated behaviour, set the property to false.

そのため、 `spring.jpa.hibernate.use-new-id-generator-mappings: false` を `application.yaml` に追加してあげる。

### メトリックの取得設定を変える（springboot-actuator）

正直これが一番めんどくさかった。

[springboot-actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready.html) を使用しているのだが、
バージョンアップに伴い大きく以下の変更が入っている。

* **メトリック毎にエンドポイントが分割された**
  * 一発で取得できなくなった
* **取得できるメトリック名に後方互換がなくなった**
  * 諸事情で後方互換性を持たせたい時には自前実装が必要
* **メトリック拡張のロジックに修正が必要になった**
  * [dropwizard metrics](http://metrics.dropwizard.io/4.0.0/) でメトリック拡張してた場合も改修必要

springboot-actuator のメトリックをシステム監視に利用しているプロダクトは辛い。

<br>

もう少し具体的に説明しておく。

#### 以前は一発で取れた

以前はactuator endpointに対してリクエストすると、以下のようにメトリックが一発で取れた。
拡張メトリックもレスポンスのjsonにプロパティが追加される形で拡張がなされていた。

```json
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
    "httpsessions.max": -1,
    "httpsessions.active": 0,
    "datasource.primary.active": 0,
    "datasource.primary.usage": 0
}
```

#### これからはメトリック毎に取得する

`/actuator/metrics` を参考に取得可能なメトリックを確認して
(この時点でメトリック名に互換性がないことがわかる)

```json
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
        (中略)
        "tomcat.threads.busy",
        "tomcat.global.request",
        "hikaricp.connections.creation",
        "jvm.gc.memory.promoted",
        "tomcat.sessions.rejected",
        "tomcat.sessions.alive.max"
    ]
}
```

`/actuator/metrics/(メトリック名)` でリクエストをしてあげなければならない。

例えば以下のようになる。

パス: `/actuator/metrics/tomcat.sessions.created`

```json
{
    "name": "tomcat.sessions.created",
    "measurements": [
        {
            "statistic": "COUNT",
            "value": 0
        }
    ],
    "availableTags": []
}
```

結構変わってしまったではないか。。

#### micrometer-registry-datadog を入れる

たまたま [Datadog](https://www.datadoghq.com/) を導入していたため、
簡易な解決策として、micrometer-registry-datadog にメトリックを打ち上げてもらうことにした。

* `build.gradle` に依存モジュールを追加

```groovy
compile group: 'io.micrometer', name: 'micrometer-registry-datadog', version: '1.0.3'
```

### まさかにEC2（AmazonLinux）デプロイで落とし穴

ローカルマシン（Mac）で起動できたため、大方いけると考えていたが、EC2に `jar` をデプロイする時に落とし穴に遭遇した。

`service` コマンド起動時に

```bash
invalid file (bad magic number): Exec format error
```

のようなエラーメッセージが出て起動できなくなってしまったのだ。

しかし、 `java -jar` コマンドでは起動できる。

これには `bootJar` タスク実行時に起動スクリプトを含めることで対応した。

```groovy
bootJar {
    launchScript()
}
```

## とどめの負荷テスト

最後に環境にデプロイして、負荷試験を行う。
プロダクトによって指標は異なると思うので、私は以下の2種類だけ実施した。（人によって言い方が変わるので注意）

* ストレステスト
  * サービス需要予測とそれ以上の瞬間最大風速を計測
  * できれば3点計測する
* ロングランテスト
  * 長期間実施してサーバリソースが枯渇しないか、周辺のコンポーネントに迷惑かけないか計測

これらをdatadog上で大きな変化がないことを確認して、終了。

## まとめ

今回はSpring Boot 1.5のプロジェクトを 2.0にマイグレーションしてみました。

大きな流れをまとめると

* テストコード準備する
* マイグレ前のアプリケーションのパフォーマンスを計測しておく
* ライブラリを差し替える
* 単体テストを動かしながら、コンパイルエラーを取り除く
* 結合テストを動かしながら、実行時エラーを取り除く
* サーバにデプロイする
* 負荷テストして、パフォーマンスが大きく変わっていないことを確認

負荷テスト含めて実施したため、全体としての所要時間はかかりました（1人でやって1.5weekくらい）が、コードのマイグレーション作業自体はそこまで時間がかかりませんでした。これは [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide) の内容が以前よりも充実したことが寄与していると思う。

強いて言うと、 `springboot-actuator` のメトリック変更がコード以外の部分に波及したのは厄介でした。

2.x自体もリリースされて日が浅いので、事故っても損害が少ないプロダクトから適用していきたいですね。

そして、来るべきJava 11に早めに備えておきたい！

## 参考にさせていただいたサイト
* [Spring Boot 2.0 Migration Guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)
* [Spring Boot with Java 9 and above](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-with-Java-9-and-above)
