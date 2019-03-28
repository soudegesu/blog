---
title: "「Javaは起動が遅い」の通説を覆すか？QuarkusでSpringをネイティブコンパイルしてみる"
description: "今回はRedhatが提供するQuarkusのSpringプラグインを試してみました。"
date: "2019-03-20T08:55:39+09:00"
thumbnail: /images/icons/spring_icon.png
categories:
  - "java"
tags:
  - "java"
  - "spring"
isCJKLanguage: true
twitter_card_image: /images/icons/spring_icon.png
---

今回はRedhatが提供する [Quarkus](https://quarkus.io/) のSpringプラグインを試してみました。

<!--adsense-->

## 「Javaは起動が遅い」

過去、他のプログラミング言語使用者に「Javaアプリケーションは起動が遅い。マリオカートで言うクッパみたいなもんだ」とよく言われていました。
この議論は泥仕合になる風体なのであまり好きではありませんが、確かにJITコンパラを備えた言語と違って、アプリケーションが利用可能になるまでに時間がかかることは事実です。
（以前と比べてもかなり高速になりました。それでも数秒かかりますよね？たぶん。）

たとえ数秒であっても、この起動時間を短縮することはかなり価値があります。仮にこれをほぼゼロにできるとすると、システムのスケーラビリティが格段に向上するからです。

そんなある日、[Quarkus](https://quarkus.io/) という画期的なライブラリが登場したのでした。

## Quarkusとは

![quarkus_top](/images/20190320/quarkus_top.png)

[Quarkus](https://quarkus.io/) はRedhat社が提供するJavaアプリケーションをLinux上で動作するバイナリにネイティブコンパイルするライブラリです。
[Quarkus](https://quarkus.io/) のサイト上では、Kubernatesとの親和性を謳っていますが、Webアプリケーション以外にも広く活用できる場面があるでしょう。

ネイティブコンパイルする部分は [GraalVM](https://www.graalvm.org/) を採用しています。
[GraalVM](https://www.graalvm.org/) は様々なプログラミング言語をサポートしており、Ruby界隈ではRubyを爆速にしてみた [TruffleRuby](https://github.com/oracle/truffleruby) というのが一時期話題になりましたね。

[GraalVM自体に制限はある](https://github.com/oracle/graal/blob/master/substratevm/LIMITATIONS.md) ものの、提供される高速化メリットは大きいです。

## 本日のゴール

今回のゴールは以下とします。

* Springのサンプルアプリケーションを [Quarkus](https://quarkus.io/) でネイティブコンパイルする
* 起動にかかった時間を見てみる

なお、今回実装したリポジトリは [こちら](https://github.com/soudegesu/quarkus_practice.git) になります。

<!--adsense-->

## やってみる

### 環境構築

まずは環境構築をします。
実は [Quarkus](https://quarkus.io/) はドキュメントが比較的厚めに書かれているので、公式ドキュメントを見るだけで概ねできてしまいます。

環境構築は [QUARKUS - GET STARTED](https://quarkus.io/get-started/) を使えばできてしまいます。

ざっくりな手順としては以下になります。

1. JDK 8をインストールし
2. Apache Mavenをインストールし
3. GraalVMをインストールパスを通す

なお、Gradleのプラグインも提供されていますが、Mavenのプラグインの方が動作が安定しているので、まずはMavenで試すことをオススメします。
(Gradleプラグインでトラブルシュートするのはなかなかきつかった)

### プロジェクトの雛形を作成する

以下を実行すると `quarkus-maven-plugin` がプロジェクトの雛形を作成してくれます。

```bash
mvn io.quarkus:quarkus-maven-plugin:0.12.0:create \
    -DprojectGroupId=${プロジェクトのGroupID} \
    -DprojectArtifactId=${プロジェクトのArtifactID}
```

```bash
tree
.
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
    ├── main
    │   ├── docker
    │   │   ├── Dockerfile.jvm
    │   │   └── Dockerfile.native
    │   ├── java
    │   └── resources
    │       ├── META-INF
    │       │   └── resources
    │       │       └── index.html
    │       └── application.properties
    └── test
        └── java
```

最低限のdependencyを追記した状態で `pom.xml` も生成してくれるますから、これを使うのが楽ちんです。

よく見ると、2種類のDockerfileが作成されていることがわかります。
ファイルのsuffixで想像はつくと思いますが、アプリケーションをネイティブコードを実行するためのDockerfileと、コンテナ内でJVMを使って実行するためのDockerfileです。

<!--adsense-->

### Springをネイティブコンパイルしてみる

[Quarkus](https://quarkus.io/) が提供するエクステンションを使うことで、GraalVMがよしなにネイティブコンパイルしてくれるようです。

今回は私も普段使っているSpring frameworkをネイティブコンパイルするエクステンションがあるので追加してみます。

```bash
./mvnw quarkus:add-extension -Dextensions="io.quarkus:quarkus-spring-di"
```

これによって、実際には `pom.xml` に `quarkus-spring-di` がdependencyとして追加されるくらいでした。

余談ですが、対応しているエクステンションは `list-extensions` で確認ができます。HibernateやKotlinとかもありました。

```bash
./mvnw quarkus:list-extensions
```

### ソースコードを書く

特に専用のコードを書く必要はなく、Springを使って普通にアプリケーションのコードを書きます。

コードを全て掲載すると冗長になるので、[私のリポジトリ](https://github.com/soudegesu/quarkus_practice/tree/master/src/main/java/com/soudegesu/example/quarkus/spring/di) を参照してください。

<!--adsense-->

### アプリケーションをビルド&起動する

サンプルコードの実装が終わったら、アプリケーションをビルドして実行します。
今回はネイティブコードにコンパイルしたコードをコンテナ内で起動する方法にします。

まずは、アプリケーションをネイティブコンパイルします。

```bash
./mvnw package -Pnative -Dnative-image.docker-build=true
```

次にDockerfileをビルドします。

```bash
docker build -f src/main/docker/Dockerfile.native -t ${任意のタグ名} .
```

そしてコンテナを起動します。

```bash
docker run -i --rm -p 8080:8080 ${任意のタグ名}
```

### 起動時間やいかに！？

![boot_docker](/images/20190320/boot_docker.png)

**Quarkus 0.12.0 started in 0.076s.** って早すぎでしょ。

## まとめ

今回は [Quarkus](https://quarkus.io/) を使ってSpringアプリケーションをネイティブコンパイルして、Dockerコンテナ上で起動してみました。
サンプルアプリケーションではあるものの、これだけ起動時間が短縮されると未来を感じます。

2019/03現在では、まだ [Quarkus](https://quarkus.io/) はバージョンが `0.12.0` ですが、これからの進化が楽しみですね！

## 参考にさせていただいたサイト

* [Quarkus](https://quarkus.io/)
* [
Javaフレームワーク「Quarkus」登場。Javaコードからネイティブバイナリを生成し瞬時にJavaアプリが起動、コンテナへの最適化を実現。Red Hatがリリース](https://www.publickey1.jp/blog/19/javaquarkusjavajavared_hat.html)
