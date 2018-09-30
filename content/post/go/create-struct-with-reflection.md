---
title: "json.Unmarshalとreflectパッケージを使って構造体を生成する"
description: "今回はreflectパッケージとjsonパッケージも使って構造体の生成をしてみます。"
date: "2018-09-26T16:17:21+09:00"
thumbnail: /images/icons/gopher_icon.png
categories:
  - "go"
tags:
  - "go"
isCJKLanguage: true
twitter_card_image: /images/icons/gopher_icon.png
---

今回は `reflect` パッケージと `json` パッケージも使って構造体の生成をしてみます。

## `json.Unmarshal` を使った構造体の生成

以下の構造体を定義します。

```go
type Msg struct {
	ID  int    `json:"id"`
	Msg string `json:"msg"`
}
```

通常、json文字列から構造体を作成するには `json.Unmarshal` 、または `json.NewDecoder` を使います。

```go
func main() {
	str := `{"id":1,"msg":"some message here"}`
	
	var msg Msg
	json.Unmarshal([]byte(str), &msg)

	# main.Msg{ID:1, Msg:"some message here"} が表示される
	log.Printf("%#v", msg)	
}
```

## `reflect` パッケージと `json.Unmarshal` を使った構造体の生成

[Goのreflectパッケージを使ってインスタンスを生成する](/post/go/create-instance-with-reflection/) の記事で学んだ
リフレクションと組み合わせて、JSON文字列から構造体のインスタンスを作成する関数 `createInstance` を作ります。

以下のようになりました。

```go

func main() {
	str := `{"id":1,"msg":"some message here"}`

	var msg Msg
	# *Msg型が格納される
	res := createInstance(str, reflect.TypeOf(msg))

	# main.Msg{ID:1, Msg:"some message here"} が表示される
	log.Printf("%#v", res)

	# 構造体の各フィールドにアクセスするには型アサーションが必要
	r := res.(*Msg)
	log.Printf("%#v", r)
	log.Print("%s", r.ID)
	log.Print("%s", r.Msg)
}

# Typeからオブジェクトを生成して、interfaceをUnmarshalに渡す
func createInstance(str string, typ reflect.Type) interface{} {

	obj := reflect.New(typ).Interface()	
	json.Unmarshal([]byte(str), &obj)
	return obj
}
```

## NGなパターン（ `Elem` を使う）

実装の過程で失敗したコード片も載せておきます。 

`reflect.New` で生成したインスタンスから `Elem()` で要素を取得した場合には
`map[string]interface{}` 型のオブジェクトが返却されてしまいました。

```go
func createInstance(str string, typ reflect.Type) interface{} {
	obj := reflect.New(typ).Elem().Interface()
	json.Unmarshal([]byte(str), &obj)
	# map[string]interface{} 型が返却される
	return obj
}
```

これは `Unmarshal` に `interface{}` 型の変数のアドレスを渡したときと同じ挙動です。

```go
var f interface{}
err := json.Unmarshal(b, &f)
```

## 参考にさせていただいたサイト

* [JSON and Go](https://blog.golang.org/json-and-go)

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798142417&linkId=2a504e0591dea2b29c897641fee103b4&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4908686033&linkId=bc543f9a203ae829ea5149b77f7f26ed&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>	
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118468&linkId=a29dc46f2c8ec02b6826b9192aabec5f&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=tf_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117526&linkId=f9d2734b0ac386b7e7acb6a0331d2268&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
