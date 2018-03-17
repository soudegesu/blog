---
title: "springboot-webfluxのバックプレッシャーを体験してたらいい感じだった"
description: "springboot2から利用可能になったwebfluxを調べました。従来のspringboot-mvcと振る舞い上の違いであるバックプレシャーを実際に試してみました。"
date: 2018-03-16 00:00:00 +0900
categories: java
tags: java spring webflux reactor
---

2018/3にリリースされた `springboot2` から `spring5` がバンドルされるようになりました。
リリースの中でも注目機能と言われている `webflux` 、とりわけ `webflux` が内包しているリアクティブプログラミングライブラリである `Reactor` はspringユーザであれば気になるはずです。今回はバックプレッシャーがいい感じだったので、それをまとめてみました。


* Table Of Contents
{:toc}

## 今回作成したリポジトリ
今回作成したリポジトリは [こちら](https://github.com/soudegesu/springboot-webflux-test) です。
全てローカル環境で動かせるように `docker-compose` でコンポーネント化してあるものの、 ローカルマシンのリソースを食い合うため、負荷試験をするときはLinuxサーバ上に展開することをオススメします。

## 

## RouterFunctionを登録する
以下のような `RouterFunction` を作成し

```
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
```

## Webflux??

## パフォーマンスを策定してみた
### 試してみた環境


### バックプレッシャー
![webflux-thread]({{site.baseurl}}/assets/images/20180305/chained.png)


### スレッド増加の傾向を見てみる
![tomcat-thread]({{site.baseurl}}/assets/images/20180316/tomcat-thread.png)

![webflux-thread]({{site.baseurl}}/assets/images/20180316/webflux-thread.png)

## まとめ


## 参考にさせていただいたサイト
* [How to Migrate Netty 3 to 4 (Netty 番外編)](http://acro-engineer.hatenablog.com/entry/2013/10/17/113216)
