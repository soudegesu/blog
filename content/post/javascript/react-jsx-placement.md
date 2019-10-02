---
title: "JSXでは1つの要素しか返却してはいけない"
description: ""
date: "2019-10-03T08:25:19+09:00"
thumbnail: "images/icons/react_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "react"
draft: true
isCJKLanguage: true
twitter_card_image: "images/icons/react_icon.png"
---

今日は [React](https://ja.reactjs.org/) の小ネタです。

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


```
Parsing error: JSX expressions must have one parent element
```

## 参考にさせていただいたサイト

* [JSX の導入](https://ja.reactjs.org/docs/introducing-jsx.html)
