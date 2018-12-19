---
title: "springboot-webfluxのバックプレッシャーを体験してたらいい感じだった"
description: "springboot2から利用可能になったwebfluxを調べました。従来のspringboot-mvcと振る舞い上の違いであるバックプレシャーを実際に試してみました。"
date: 2018-03-16
thumbnail: /images/icons/spring_icon.png
categories:
    - java
tags:
    - java
    - spring
    - webflux
    - reactor
url: /java/non-blocking-webflux/
twitter_card_image: /images/icons/spring_icon.png
---

2018/3にリリースされた `springboot2` から `spring5` がバンドルされるようになりました。
リリースの中でも注目機能と言われている `webflux` 、とりわけ `webflux` が内包しているリアクティブプログラミングライブラリである `Reactor` はspringユーザであれば気になるはずです。今回はバックプレッシャーがいい感じだったので、それをまとめてみました。

<!--adsense-->

## 今回作成したリポジトリ
今回作成したリポジトリは [こちら](https://github.com/soudegesu/springboot-webflux-test) です。
全てローカル環境で動かせるように `docker-compose` でコンポーネント化してあるものの、 ローカルマシンのリソースを食い合うため、負荷試験をするときはLinuxサーバ上に展開することをオススメします。

## RouterFunctionを登録する
以下のような `RouterFunction` を作成し、 `@Bean` で登録しておきます。
RouterFunctionのレスポンスを返す部分はもう少しいい実装がありそうですが、一旦こうしました。

* `RouterFunction`

{{< highlight java "linenos=inline" >}}
@Component
public class HelloWebClientHandler {

    @Value("${app.backend.uri}")
    private String baseUri;

    private static final String PATH = "/test";

    public RouterFunction<ServerResponse> routes() {
        return RouterFunctions.route(
                RequestPredicates.GET("/hello")
                        .and(RequestPredicates.accept(MediaType.APPLICATION_JSON))
                , this::webclient);
    }

    private Mono<ServerResponse> webclient(ServerRequest req) {
        return WebClient.builder()
                .baseUrl(baseUri)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON.toString())
                .build()
                .get()
                .uri(uriBuilder -> {
                    uriBuilder.path(PATH);
                    if (req.queryParam("time").isPresent()) {
                        uriBuilder.queryParam("time", req.queryParam("time").get());
                    }
                    return uriBuilder.build();
                })
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .flatMap(response ->
                    ServerResponse.ok()
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(response.bodyToMono(User.class), User.class)
                            .switchIfEmpty(ServerResponse.notFound().build())
                );
    }
}
{{< / highlight >}}

* RouterFunctionを登録する側

作成した `HelloWebClientHandler` を登録します。

{{< highlight java "linenos=inline" >}}
@Configuration
@EnableWebFlux
public class WebConfig extends DelegatingWebFluxConfiguration {
    // ~中略~

    @Bean
    RouterFunction<ServerResponse> route7(HelloWebClientHandler webClientHandler) {
        return webClientHandler.routes();
    }
}
{{< / highlight >}}

あとは `main` メソッドを持ったクラスを作ってあげればspringbootアプリケーションは作成完了です。

<!--adsense-->

## パフォーマンスを測定してみた
springbootのjarファイルをEC2上に置いて実際にバックプレッシャーの効果を見てみましょう。

### 環境情報
私のローカルマシン上からgatlingを実行し、EC2上のspringbootアプリケーションに負荷がけをします。
springbootアプリケーションは、バックエンドのmockサーバ(OpenRestyを使用)に対して `WebClient` を使ってAsyncなHTTP通信を行います。

![architechture](/images/20180316/architecture.png)

なお、EC2インスタンスは `t2.small` を使用し、JVMへの割当メモリは `最大256M` に設定しています。
また、バックプレッシャーを観測したいので、mockサーバではsleep処理を入れています。

### バックプレッシャーを体験する
#### springboot-webfluxは普通に生きている
バックプレッシャーの効果を見てみましょう。
gatlingのリクエスト量と、mockサーバ側のsleep時間は以下です。

|gatlingのリクエスト|mockのsleep時間|
|---------|----------|
|150req/s|1s         |

![webflux-sleep-150](/images/20180316/webflux-sleep-150.png)

普通に全て200レスポンスが返却されていますね。すごい。

次にsleep時間を `5s` にして見てみます。
対照実験的な意味で `150req/s` がよかったのですが、今回は私のマシンのパワー不足により `130` までしか出ませんでした。

|gatlingのリクエスト|mockのsleep時間|
|---------|----------|
|130req/s|5s         |

![webflux-sleep-130-5s](/images/20180316/webflux-sleep-130-5s.png)

バックエンドサーバが5秒も応答待ちでも普通に200応答できていますね。

#### springboot-webmvcはやっぱり死んだ
比較として、従来の `springboot-webmvc` ではどうでしょう。
サーブレットコンテナはデフォルトの `embed-tomcat` として、`application.yaml` の設定もデフォルトとします。
また、mockへの通信を行う `HttpClient` はConnectionPoolingから取得するように実装した上で以下の条件でリクエストを流してみました。

|gatlingのリクエスト|mockのsleep時間|
|---------|----------|
|100req/s|1s         |

![mvc-sleep-100](/images/20180316/mvc-sleep-100.png)

うむ。やはりだめでしたか。

一応、同条件にて、HttpClientのPool数も増やしたりして調整しましたが、エラーレスポンス件数が0にはなりませんでした。

![mvc-sleep-100-tuned](/images/20180316/mvc-sleep-100-tuned.png)

### スレッド増加の傾向を見てみる
負荷試験中のスレッドの増加傾向も見てみましょう。この観点は単純に `netty4` vs `tomcat` に依存する部分が大きいのですが、見てみましょう。

webflux(Netty4)の場合は起動時からスレッド数が一定ですね。

![webflux-thread](/images/20180316/webflux-thread.png)

tomcatはやはりリクエストをさばくためにスレッドが必要になってしまうため、増加傾向にあります。

![tomcat-thread](/images/20180316/tomcat-thread.png)

<!--adsense-->

## まとめ

今回は `springboot-webflux` と `springboo-webmvc` を比較して、バックプレッシャーがどんな感じかを確認しました。
梱包されている `netty4` が持つnon-blockingな仕組みのおかげで、バックエンドサーバの遅延に引きずられることなくレスポンスを返却できていることがわかります。

しかしながら、もちろん銀の弾丸ではなくて、実装する上でのデメリットや考慮ポイントが他のサイトを見ると情報が色々出てきます。
例えば、自身が書こうとしている処理がblockingな処理なのか、non-blockingな処理なのかを実装する側が気をつけないといけない、という点があります。
そのためには、ライブラリがどのように動いているかをきちんと把握しないといけないでしょう。
加えて、スレッドを共有する形でアプリケーションが動作するので、 `ThreadLocal` をむやみに使わない方が良い気もしています。

ただ、 tomcatでサポートしているServlet 3.1の非同期IOよりは良さそうなので、用法を見定めた上で使っていきたいですね。

## 参考にさせていただいたサイト

* [How to Migrate Netty 3 to 4 (Netty 番外編)](http://acro-engineer.hatenablog.com/entry/2013/10/17/113216)
