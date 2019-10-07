---
title: "React+JSXでは1つの要素しか返却してはいけないのでFragmentを使う"
description: "JSXではreturnするエレメントが複数あるとエラーになります。React.Fragmrntを活用してDOMをすっきりきれいにしましょう。"
date: "2019-10-03T08:25:19+09:00"
thumbnail: "images/icons/react_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "react"
isCJKLanguage: true
twitter_card_image: "images/icons/react_icon.png"
---

今日は [React](https://ja.reactjs.org/) の小ネタです。

<!--adsense-->

## ReactのJSX

[React](https://ja.reactjs.org/) ではエレメントをコンポーネント化する仕組みとして [JSX](https://ja.reactjs.org/docs/introducing-jsx.html)を使います。

Function ComponentやReact Componentを書く場合には以下のようにreturnの中に要素を書きます。

{{< highlight typescript "linenos=inline,hl_lines=3-7" >}}
const SomeComponent: React.FC = () => {
  // ここに要素を書く
  return (
    <div>
      hogehoge
    </div>
  )
}
export default SomeComponent;
{{</ highlight>}}

## Returnするエレメントが複数ある場合にはエラーになる

ここで、以下のような要素を２つ返却するコンポーネントを書いてみます。

{{< highlight typescript "linenos=inline" >}}
const SomeComponent: React.FC = () => {
  return (
    <div>
      hogehoge
    </div>
    <div>
      fugafuga
    </div>
  )
}
export default SomeComponent;
{{</ highlight>}}

すると以下のようなエラーに出くわします。

```
Parsing error: JSX expressions must have one parent element
```

JSXではReturnする要素が複数あると（今回はdivタグ2つ）エラーとなってしまいます。

単純な解決策として、本来返却したい複数のタグを更にdivタグで囲うなどして1つにまとめる方法が思いつくでしょう。
しかしこの方法は不要なタグを書くことになるのでスマートな解決策とは言えません。

{{< highlight typescript "linenos=inline,hl_lines=3 10" >}}
const SomeComponent: React.FC = () => {
  return (
    <div>
      <div>
        hogehoge
      </div>
      <div>
        fugafuga
      </div>
    </div>
  )
}
export default SomeComponent;
{{</ highlight>}}

<!--adsense-->

## React.Fragmentでグルーピングする

これを解決するために、 [React.Fragment](https://ja.reactjs.org/docs/fragments.html) を使います。

{{< highlight typescript "linenos=inline,hl_lines=3 10" >}}
const SomeComponent: React.FC = () => {
  return (
    <React.Fragment>
      <div>
        hogehoge
      </div>
      <div>
        fugafuga
      </div>
    </React.Fragment>
  )
}
export default SomeComponent;
{{</ highlight>}}

`React.Fragment` では複数の要素をグルーピングすることができ、`React.Fragment` 自体がHTMLタグとして出力されることはありません。

なお `React.Fragment` にはシンタックスシュガーが存在します。実際には以下の方をよく利用します。

{{< highlight typescript "linenos=inline,hl_lines=3 10" >}}
const SomeComponent: React.FC = () => {
  return (
    <>
      <div>
        hogehoge
      </div>
      <div>
        fugafuga
      </div>
    </>
  )
}
export default SomeComponent;
{{</ highlight>}}

## React.Fragmentを使う上での留意点

複数の要素をまとめてコンポーネントを返却できる便利な `React.Fragment` ですが、 **UIフレームワークが提供するコンポーネントと組み合わせて動作するか** は確認が必要です。

以前、 `@material-ui/lab` の `4.0.0-alpha.28` で `SpeedDialAction` を `React.Fragment` でラップして返却した場合に動作していないことを確認しています。
まぁ、この場合はLabなライブラリなので動かなくても仕方が無いのですけど。

## 参考にさせていただいたサイト

* [JSX の導入](https://ja.reactjs.org/docs/introducing-jsx.html)
