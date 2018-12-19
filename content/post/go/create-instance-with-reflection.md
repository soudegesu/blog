---
title: "Goのreflectパッケージを使ってインスタンスを生成する"
description: "プログラミング言語 Goでインスタンスを生成する関数を作るにはどうすれば良いかを調査しました。"
date: "2018-09-26T06:00:59+09:00"
thumbnail: /images/icons/gopher_icon.png
categories:
  - "go"
tags:
  - "go"
isCJKLanguage: true
twitter_card_image: /images/icons/gopher_icon.png
---

プログラミング言語 [Go](https://github.com/golang/go) で
インスタンスを生成する関数を作るにはどうすれば良いかを調査しました。

<!--adsense-->

## 抽象化されたプログラムを書くには？

抽象化されたコードを書く場面にしばしば出くわすことがあります。
分かりやすい例として、 **型そのものの情報を使ってインスタンスを生成する**、というのもその一つです。
Javaで言えば以下のようなコードです。

{{< highlight java "linenos=inline" >}}
private <T> T createInstance (Class<T> clazz) {
    T obj = null;
    try {
        // クラス情報を基にインスタンスを生成
        obj = (T)(Class.forName(clazz.getName()));
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    return obj;
}
{{< / highlight >}}

<!--adsense-->

## Goではreflectパッケージを使う

先程のようなコードを [Go](https://github.com/golang/go) で書くには、 [reflect](https://golang.org/pkg/reflect/) パッケージを使って、リフレクションをすることになります。

今回は型情報を基にインスタンスを生成する `createInstance` 関数を作成してみましょう。

### 関数本体の処理

まずはインスタンス生成処理の本体となる `createInstance` 関数を作成します。
コードは以下のようになります。

{{< highlight go "linenos=inline" >}}
// インスタンスを作るだけの関数
func createInstance(typ reflect.Type) interface{} {
	val := reflect.New(typ).Elem()
	return val.Interface()
}
{{< / highlight >}}

ここでポイントをいくつか紹介します。

#### 引数は `reflect.Type` 型

関数への引数は　`reflect.Type` 型にしています。 
`interface{}` 型でも良いのですが、`interface{}` 型だと引数に何でも入れれてしまうので、 `reflect.Type` によって型を縛ります。

#### `reflect.New()` でインスタンスを生成

`reflect.New()` 関数では、 `reflect.Type` 型の引数に与えられたインスタンスを生成します。
次に `reflect.Elem()` でポインタの指す実体にアクセスできるようにします。

#### `reflect.Interface()` で interface{} を返却

最後に `Interface()` 関数を呼んで、 `interface{}` 型で返せるようにします。
`createInstance()` 関数内でキャストできると嬉しいかもしれませんが、
ジェネリクス的なものはGoにはありませんし、動的な型アサーションも難しそうなので、
基本的には、`createInstance()` 関数の呼び出し元で型アサーションをすることになります。

### 呼び出し元の処理

作成した `createInstance()` 関数の呼び出し元の処理は以下のようになります。

{{< highlight go "linenos=inline" >}}
var u User
obj := createInstance(reflect.TypeOf(u))
r := obj.(User)
{{< / highlight >}}

#### `reflect.TypeOf()` で型情報を取得する

宣言した変数を `reflect.TypeOf()` の引数に与えることで、 `reflect.Type` 型のオブジェクトが取得できます。
これを `createInstance()` 関数に渡して上げます。

#### 戻り値を型アサーション

戻り値を型アサーションすることで `obj` 変数が `User` 型としての定義を持っているかを確認してくれます。
これで、呼び出し元でも `User` 型として処理を書けるわけです。

### 所感

[Go](https://github.com/golang/go) でインスタンス生成を行う、抽象度の少し高いコードを書くことができました。
ただ、逆に手間がかかってしまう感も否めず、変に共通化を狙わずに、シンプルに処理を書いた方が吉かもしれないなー、と思いました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798142417&linkId=2a504e0591dea2b29c897641fee103b4&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4908686033&linkId=bc543f9a203ae829ea5149b77f7f26ed&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>	
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118468&linkId=a29dc46f2c8ec02b6826b9192aabec5f&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117526&linkId=f9d2734b0ac386b7e7acb6a0331d2268&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
