---
title: "RecoilでReactの子孫要素がatomの値が取得できない時の対処法"
description: "Reactの状態管理ライブラリであるRecoilのTipsを紹介します。Recoilで子コンポーネントからatomの値が取得できない場合、子コンポーネントのどこかでcontext stateが渡されていないのでブリッジしましょう"
date: "2021-01-15T13:43:32+09:00"
thumbnail: "images/icons/react_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "react"
  - "recoil"
isCJKLanguage: true
twitter_card_image: /images/icons/react_icon.png
---

React の 状態管理ライブラリの [Recoil](https://recoiljs.org/) を使ってしばらくしたのでTipsを書いておきます。
使いこなせているかと言われると自信はありませんが備忘録として。

<!--adsense-->

### 環境情報

- react `16.14.x`
- recoil `0.1.2`

### Recoilで子孫要素からatomの値が取得できない

Recoil を使って中規模程度のアプリケーションを実装していたところ、特定の子孫要素からatomの値が取得できない、という事象に遭遇しました。
もちろん `App.tsx` のようなアプリケーションの最上位のコンポーネントに近い箇所で `<RecoilRoot>` を呼び出しています。

### React Contextをぶった切ってしまう実装にはRecoilBridgeを使う

実は、Render Treeの中にcontext stateを正しく渡さないコンポーネントが存在する場合、該当するコンポーネントの前後でcontext stateをブリッジをする必要があります。
例えば、[react-three-fiber](https://github.com/pmndrs/react-three-fiber) の `<Canvas>` タグの子要素ではcontextをブリッジする必要があります。

ブリッジする方法として、Recoilでは [useRecoilBridgeAcrossReactRoots_UNSTABLE](https://recoiljs.org/docs/api-reference/core/useRecoilBridgeAcrossReactRoots/) が提供されています。ただし、`UNSTABLE` と名前に付与されている通りなので、使用する場面はご自身で判断してください。

以下のサンプルコードでは `<SomeChildComponent>` 以降のコンポーネントでRecoilのatomの値を参照させることができます。

{{< highlight typescript "linenos=inline,hl_lines=9 11" >}}
const SomeComponent: React.FC = () => {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  return (
    <Canvas
      camera={{ fov: 50, aspect: 4.0 / 3.0, near: 0.4, far: 1.0 }}
    >
      <RecoilBridge>
        <SomeChildComponent />
      </RecoilBridge>
    </Canvas>
  )
}
{{</ highlight>}}

状態管理のアプローチ自体が異なりますが、 `React.createContext` で自前で定義したReact Contextを使った場合では通常以下のようにブリッジする必要があるので、
`RecoilBridge` の方が見た目的にもすっきりすることがわかります。

{{< highlight typescript "linenos=inline,hl_lines=4-14" >}}
const SomeComponent: React.FC = () => {

  return (
    <SomeContext.Consumer>
      {(value) => (
        <Canvas
          camera={{ fov: 50, aspect: 4.0 / 3.0, near: 0.4, far: 1.0 }}
        >
          <SomeContext.Provider value={value}>
            <SomeChildComponent />
          </SomeContext.Provider>
        </Canvas>
      )}
    </SomeContext.Consumer>
  )
}
{{</ highlight>}}

<!--adsense-->

### まとめ

- Recoilを使ったアプリケーションで子コンポーネントがatomを参照できない場合には、context stateを渡していないコンポーネントが存在する可能性がある
- context stateを渡していないコンポーネントの中で [useRecoilBridgeAcrossReactRoots_UNSTABLE](https://recoiljs.org/docs/api-reference/core/useRecoilBridgeAcrossReactRoots/) を使うことで参照可能になる
- ただし APIが `UNSTABLE` なので注意しましょう
