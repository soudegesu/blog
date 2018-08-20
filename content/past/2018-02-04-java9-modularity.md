---
title: "JavaプロジェクトをModule System(Java9のProject Jigsaw)にマイグレーションするステップ"
description: "JavaアプリケーションをJava9で導入されたProject Jigsaw(JPMS/Modular System)にマイグレーションするための5ステップを紹介。またこれからのJavaでエンジニアが抑えておきたいポイント(ロードマップ)も少し触れます"
date: 2018-02-04
categories:
    - java
tags:
    - java
    - gradle
    - springboot
    - JPMS
url: /java/java9-modularity/
---

## はじめに
今回はJava 9で追加されたModule System移行に関して説明します。
自身で手を動かすことで、JavaのプロダクションコードをJPMSに適用するための作業手順の一定の目処がたったのでまとめておきます。

実は [社内向けにも同様の発表](https://speakerdeck.com/takaakisuzuki/korekarafalsejavafalsehua-wosiyou) はしています。
少しネガティブなニュアンスで資料を書いていますが、社内の(いろんな意味で)危機意識を煽るため、という背景もあったので、その点ご了承ください。

* [これからのJavaの話をしよう](https://speakerdeck.com/takaakisuzuki/korekarafalsejavafalsehua-wosiyou)

## 注意点
2018/1時点での情報を基に記載をしていますので、今後変更になる可能性があります。
最新の情報と照らし合わせながら適宜情報の補填を行っていただければと思います。

## どうなる？これからのJava
ここではまず最初に、足元のJPMSの話ではなく、Javaエンジニアが把握しておくべき今後の全体的な流れについて触れておきます。

### 半年に1度訪れるJava SEのリリース
昨年のJava Oneにて Java9 以降のJavaのリリースロードマップが発表されました。
要点だけまとめると以下になります。

* リリース頻度は半年に1度(次は2018/3、その次は2018/9)
* バージョニングは `9`, `10`, `11`
    * Oracle社のページでは `yy.MM` 形式で記載されているで注意
* 時間軸でリリースがされていくため、期限までに実装終了したフィーチャーがリリース対象の機能として取り込まれる
    * early access buildはリリース3ヶ月前から提供される

### ウォッチすべき話題はJavaのサポート期限
Javaのリリースロードマップの中で注目すべきは **サポート期限** です。
リリースラインが1本化されたことで、**複数のJavaのバージョンが並行サポートされることがなくなり** ます。
つまり、Javaの進化に合わせて、自分のプロダクトも追随していく必要がある、というわけです。
例えば、Java 10が出たら、Java 9はその時点でサポート終了ということです。

ルールとして一見わかりやすくはあるものの、以下のようなプロジェクトの場合はJavaのリリースサイクルに追従していくのは容易なことではありません。

* リリースサイクルが長い
* リリースタイミングが柔軟にコントロールできない
* テストコード(非機能含む)が整備されていない

そのようなプロジェクトの場合には、Oracle社からの長期サポートを受けるなどして適宜自分たちのペースでマイグレーション計画をしていくことになるでしょう。

### Java8はいつまでサポートされるか
実は **2018/01/31現在でOracle社がJava 8のサポートを2018/09→2019/01へ延長した** こともあり、実際どうなるかはまだわかりません。 **いつJava8から移行するか**を決断するための材料としても、「Javaのサポート期限」の話題は今後も慎重にウォッチした方が良いでしょう。

### 他にも気をつけておいた方が良いこと

Javaが先程のリリースサイクルになった場合に他に留意すべき点も補足しておきます。
以下のようなポイントを中心に情報収集やearly access buildでの動作確認を早めにしておくと良いと感じました。

* 周辺のエコシステムが追従できているか
    * アプリケーションを構成する依存ライブラリ
    * 実行環境として使用するパブリッククラウド
* 重要な仕様変更が入っているか
    * JPMSのような大きな仕様変更
    * パッケージの移動や非推奨になったAPI

## Module Systemへのマイグレーションに挑戦
Java9で導入された `Java Platform Module System(JPMS)` の仕様により、
JDKを差し替えただけでは既存のJavaアプリケーションが動かない可能性が高いです。
そのため、Module Systemに対応するためにはいくつか段階を経る必要があります。

### Step 1. Module Systemの基礎を勉強する
まず、Module Systemに関する知識がなければModule Systemの勉強をしましょう。
私の場合、ヌーラボさんが「[ヌーラボのアカウント基盤を Java 9 にマイグレーションして起きた問題と解決法](https://nulab-inc.com/ja/blog/nulab/java9-migration/)」 にて紹介されている内容を参考に学習しました。

* [Virtual Java User GroupのJava9マイグレーション動画](https://www.youtube.com/watch?v=NKY2FYTCo7I&t=1905s) を見る
    * Githubにリポジトリも公開されているので、一緒に手を動かすのがオススメ
* 書籍 **Java9 Modularity** を読む
    * マイグレーションよりも、modulepathの動きとクラス解決の話を中心に読んだほうが良い
    * 英語弱者もKindleがあれば大丈夫

<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/product/B075FZK9DC/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B075FZK9DC&linkCode=as2&tag=soudegesu0a-22&linkId=57a893d3bc1e7e5418a0aff02cb01707"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B075FZK9DC&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu0a-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu0a-22&l=am2&o=9&a=B075FZK9DC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>

このステップでは

* Moduleの種類(Unnamed/Automatic/Named)と違いを理解する
* classpathとmodulepathでのクラスロードの違いを理解する

が身につけばOKだと感じました。

余裕があれば、Module SystemのBootstrapのコードを読んでおくと更に理解が捗ると思います。
(System#initPhase2の処理あたりからブレークポイント貼って読むといいです)

### Step 2. 依存ライブラリのバージョンアップを行う
Step 1で基本が理解できたら、**Java8のうちに依存ライブラリのバージョンアップをやりましょう** 。
リリースノートでJava9対応を謳っているライブラリはJava8でも動作可能なものが大半なので、今の内にJava9(Module System)対応版のバージョンまで依存ライブラリのバージョンを更新するのが良いです。
理由は単純で、 **Module Systemに対応させるのも多少時間がかかるのに、ライブラリ自体のマイナーアップグレードの対応も同時に行うのは苦行** だからです。変更箇所が多いと、細かな変更を見落としがちになり、デグレードを引き起こす原因になります。また、ライブラリの更新と合わせて、細かく商用環境にデプロイすることで、リスクを減らしながらマイグレーションすることができます。

なお、参考までに私のプロジェクトでは主にライブラリを使用していて(モジュールの正式名称での記載は省略)、これらを最新の安定版まで全てアップグレードしました。

|ライブラリ                |Java9対応状況|
|------------------------|------------|
|springboot(embed tomcat)| 2.x 〜(2018/2リリース予定)
|dropwizard-metric       |不明|
|lombok                  |済|
|mariadb-java-client     |済|
|jmockit                 |済|
|gradle                  |未|

加えて、リポジトリがマルチモジュール構成になっているという点が特徴です。

#### ライブラリのリリースノートを読んで「大丈夫だな」と早合点するのは危険

このステップのポイントとして、リリースノートの情報だけで自プロダクトがModule Systemに移行可能だと思い込んで作業を終了してしまうのは危険、ということです。 **自分のプロジェクトがNamed Moduleとしてマイグレーション可能か(ここで言うStep 4)** まで手を動かして確認した方が良いでしょう。

実際問題、Named Moduleにマイグレーションする場合には、 **modulepath上で同じjavaのパッケージを持った複数のライブラリが存在しない状態** にする必要があり、依存ライブラリが古かったり多かったりするとパッケージの重複エラーが発生します。下のイメージの場合ではmodulepathでのクラスロードはできないので、ライブラリ側に対応をお願いするか、classpathからロードする必要があります。

(例: `tomcat-embed-core` と `tomcat-juli` で パッケージ重複が起きていてNG)
![conflict_packages](/images/20180204/conflict_packages.png)

### Step 3. Unnamed Moduleにマイグレーションする

Unnamed Moduleはclasspathを用いてクラスをロードする方式であるため、そこまで大きな改修は不要です。Javaのバージョンが上がったことによってパッケージから分離されたクラスを利用可能にするためにコンパイル引数を追加する作業が主なタスクになります。

`Gradle` であれば、例えば以下のようにコンパイル引数を追加しました。

```groovy
compileJava.options.compilerArgs += [
    "--add-modules", "java.xml.ws.annotation",
    "--add-modules", "java.xml.bind",
]
```

### Step 4. Named Moduelにマイグレーションする

Named Moduleはメインモジュールの `module-info.java` に定義されている情報を基にmodulepath上に配備されているモジュールをロードしていきます。

Unnamed Moduleの時とは異なり、ビルドスクリプト(私の場合は `build.gradle` ) をそこそこ書き換える必要があるので、覚悟して臨みましょう。

`Gradle` は `Maven` と違い、java9のサポートを謳ってはいません。しかし、 [Building Java 9 Modules](https://guides.gradle.org/building-java-9-modules/) にjava9に対応するためのヒントとサンプルリポジトリへのリンクがあるので、これを参考にすると良いです。

私も紹介されている通りに `java-library` プラグインに差し替えてビルドするように修正しました。
なお、 `experimental-jigsaw` プラグインは使わずともいけました。

[Building Java 9 Modules](https://guides.gradle.org/building-java-9-modules/) を参考にしつつと言ったのですが、こちらも注意点があります。ページでは以下のようサンプルコードが書かれているのですが、試しにやってみたところ、一発でコンパイルは通りませんでした。

```groovy
doFirst {
    options.compilerArgs = [
        '--module-path', classpath.asPath,
    ]
    classpath = files()
}
```

このコードサンプルではGradleがリポジトリから取得したclasspath上のライブラリを全てmodulepathで読み込むように修正しています。
そのため、Step 2でも少し触れましたが **modulepath上で同じjavaのパッケージを持った複数のモジュールが存在する場合** は以下のようなエラーが出力されてしまいます。(例としてspringboot1.5.9が依存している `embed tomcate`のライブラリでパッケージが競合している場合)

```bash
エラー: モジュールhttpclientはtomcat.embed.coreとtomcat.juliの両方からパッケージorg.apache.juliを読み取ります
エラー: モジュールhttpclientはtomcat.embed.coreとtomcat.juliの両方からパッケージorg.apache.juli.loggingを読み取ります
エラー: モジュールhttpclientはjava.persistenceとhibernate.jpaの両方からパッケージjavax.persistence.spiを読み取ります
エラー: モジュールhttpclientはjava.persistenceとhibernate.jpaの両方からパッケージjavax.persistence.criteriaを読み取ります
エラー: モジュールhttpclientはjava.persistenceとhibernate.jpaの両方からパッケージjavax.persistence.metamodelを読み取ります
エラー: モジュールhttpclientはjava.persistenceとhibernate.jpaの両方からパッケージjavax.persistenceを読み取ります
エラー: モジュールhttpclientはjava.persistenceとtomcat.annotations.apiの両方からパッケージjavax.persistenceを読み取ります
エラー: モジュールhttpclientはjavax.transaction.apiとjava.sqlの両方からパッケージjavax.transaction.xaを読み取ります
```

これを解決するためのワークアラウンドがそこそこ大変なのですが

* モジュールのバージョンを合わせる(場合によっては片方のdependencyからexcludeする)
* 代替可能な別クラスや別モジュールにコードを置き換えて、依存モジュールを減らす
* 特定のモジュールのみclasspathから読み込むように `build.gradle` を修正する

という風に逐一スタックトレースとにらめっこをしていました。

### Step 5. 負荷試験とリソースモニタリングをする
最後にアプリケーションが今まで通りの振る舞いをするかどうかを外部から確認します。
自動化された単体テストや結合テストはもちろんですが、今までと同等のリクエスト負荷に耐えられるか、システムの健康状態を測定するメトリックが今まで通り取れているかを確認します。

## まとめ
今回はプロダクションコードのリポジトリでModule Systemに移行するための手順を確認できました。
従来の `classpath` のクラスロードから `modulepath` へのクラスロードに機構が変わったことに加え、ビルドツールが現段階ではよしなにやってくれないため、モジュール同士の依存関係やモジュール自体の設計を強く意識する必要が出てきました。ここは今後の課題かもしれません。

個人的には商用環境までデプロイできればかっこよかったのですが、

* springboot 2.xの安定版がまだないこと
* Java 9/10にはサポートがつかないこと
* `build.gradle` の可読性とメンテナンス性が落ちた

ことを理由に商用デプロイは見送っています。
Java 8もまだしばらくサポートされるようですし、今回の学習によってマイグレーションのアキレス腱がどこにありそうなのか理解できたことは収穫でした。
皆さんも是非、自プロダクトで練習してみてはいかがでしょうか。

最後にポイントだけもう一度まとめておきます

* マイグレ前にやること
    * 依存ライブラリのサポート状況を確認しておく
    * 依存ライブラリのバージョンを上げておく
    * 依存ライブラリを減らしておく(可能なら)
    * テストコードを準備しておく
* マイグレ中
    * まずはUnnamed Moduleにマイグレする
    * パッケージ重複が発生していないか注意する
* マイグレ後
    * 負荷試験とかしっかり

## 参考にさせていただいたページ

* [ヌーラボのアカウント基盤を Java 9 にマイグレーションして起きた問題と解決法](https://nulab-inc.com/ja/blog/nulab/java9-migration/)
* [Building Java 9 Modules](https://guides.gradle.org/building-java-9-modules/)
