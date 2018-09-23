---
title: "Goのinterfaceを使ったmockのテストの書き方を学んだ"
description: "プログラミング言語 Go を最近少しづつ触るようになってきました。主にPythonで書いていた簡易なスクリプトを置き換える作業なのですが、開発の過程で、Goにおけるテストコードの書き方を学習したので、備忘としてまとめます。"
date: "2018-09-24T06:12:28+09:00"
thumbnail: /images/icons/gopher_icon.png
categories:
  - "go"
tags:
  - "go"
isCJKLanguage: true
twitter_card_image: /images/icons/gopher_icon.png
---

プログラミング言語 [Go](https://github.com/golang/go) を最近少しづつ触るようになってきました。
主に [Python](https://www.python.org/) で書いていた簡易なスクリプトを置き換える作業なのですが、
開発の過程で、[Go](https://github.com/golang/go) におけるテストコードの書き方を学習したので、備忘としてまとめます。

## Goではスタブがいい感じに作れない

JavaやPythonでは、ライブラリの力を借りることによって、スタブを簡単に作ることができました。
特にJavaのどうしようもないレガシーコードと対峙する際には、 [jmockit](http://jmockit.github.io/tutorial/Mocking.html) を友として、関数の振る舞いをテストコードで固めた後にリファクタリングを行う、といったファンキーな事をやっていました。

しかし、Goではそのような「リフレクションを使えば何でもあり」なことができません。（もしかしたらできるかもしれませんが、今の所見つけていません）

基本的にはDependency Injectionの発想と同様のことを行います。Interfaceに対して実装を後から定義するのです。
さっそくやってみましょう。

## プロダクションコード側
### 構造体とインタフェースの定義

まずは、構造体 `Sample` を定義します。構造体には `Client` interface をもたせます。
外部パッケージからは直接 `client` を操作できないようにする目的で、`doGet` 関数でラップします。

```go
// 構造体を定義する
type Sample struct {
  // interfaceを定義する
	client Client
}

// 振る舞いをモックしたい
type Client interface {
	Get() int
}

// interfaceのGet()をラップする
func (sample *Sample) doGet() int {
	return sample.client.Get()
}
```

### interfaceの実装

次にinterfaceの実装を行います。 [Go](https://github.com/golang/go) のinterfaceは他の言語と異なり、実装する側（ここでいう構造体）による  **「このinterfaceを実装しますよ」 という宣言が不要です** 。 レシーバを使い、interfaceに規定された関数を持った構造体を定義してあげれば良いのです。
今回は  `hogeClientImpl`  という名前で実装します。

```go
// Client interface の実装をする構造体
type hogeClientImpl struct {
}

// レシーバで実装する
func (client *hogeClientImpl) Get() int {
	return 1
}
```

これによって、プロダクションコードの実装においては、例えば以下のように、`hogeClientImpl` を外から渡すことができます。
仮に `hogeClientImpl` の実装がinterfaceの定義を満たしていなければ、コンパイルエラーになります。

```go
func hogeMain() int {
  sample := &Sample{&hogeClientImpl{}}
  // 1が返却される
	return sample.doGet()
}
```

## テストコード側
### interfaceの実装

次にテストコードを作ってみましょう。テストコードファイル側でも同様に interfaceの定義を満たす構造体を定義してあげればOKです。
ここでは `testClientImpl` とします。

```go
type testClientImpl struct {
}

func (c *testClientImpl) Get() int {
	return 2
}
```

interfaceと同じ関数を規定したので、`Client` として引数に渡すことが可能となりました。

```go
func TestMainRequest(t *testing.T) {
  // testClientImpl の実体をセットする
  sample := &Sample{&testClientImpl{}}
  // testClientImpl#Getが呼ばれ、2が返却される
	res := sample.doGet()
	if res != 2 {
		t.Error("response should be 2")
	}
}
```

## まとめ

今回はinterfaceを使って [Go](https://github.com/golang/go) のテストコードを書いてみました。

* interfaceを持った構造体を定義する(構造体A)
* interfaceを実装した構造体を定義する(構造体B)
* 構造体Aの初期化時に構造体Bを渡してあげる
* テスト時には、テスト用に作成した構造体（構造体C）を構造体Aの初期化時にわたしてあげる

といった感じです。

[interface定義からmockを自動生成してくれるライブラリ](https://github.com/golang/mock) もありましたが、当面は自前で構造体定義して頑張ろうと思っています。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798142417&linkId=2a504e0591dea2b29c897641fee103b4&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4908686033&linkId=bc543f9a203ae829ea5149b77f7f26ed&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>	
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118468&linkId=a29dc46f2c8ec02b6826b9192aabec5f&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117526&linkId=f9d2734b0ac386b7e7acb6a0331d2268&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
