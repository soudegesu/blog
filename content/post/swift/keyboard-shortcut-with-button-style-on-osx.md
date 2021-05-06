---
title: "SwiftUIでbuttonStyleを適用したButtonに対してキーボードショートカットを有効にする"
description: "SwiftUIで凝ったUIを作ろうとすると節々詰まることがあります。今回はデザインをbuttonStyleでカスタマイズしたButtonに対してkeyboardShortcutでキーボードショートカットを割り当てる方法を紹介します。"
date: "2021-05-06T09:41:23+09:00"
thumbnail: /images/icons/swift_icon.svg
categories:
  - "swift"
tags:
  - "swift"
  - "swiftUI"
  - "osx"
isCJKLanguage: true
twitter_card_image: /images/icons/swift_icon.svg
---

SwiftUIで凝ったUIを作ろうとすると節々詰まることがあります。今回はデザインをカスタマイズしたButtonに対してキーボードショートカットを割り当てる方法を紹介します。

## 環境情報

今回コードを書いた環境はこちらです。

- mac OSX 11.0
- XCode 12.0

<!--adsense-->

## やりたいこと

やりたいことを箇条書きにすると以下です。

- SwiftUIを使った
- macOSアプリで
- EnterキーでButtonをSubmitできるようにし
- Buttonは buttonStyle modifierでデザインをカスタマイズする

入力フォームでよく使われる便利系の機能ですね。

### Enter キーでSubmitができないパターン

実は macOS 11.0から [KeyboardShortcut](https://developer.apple.com/documentation/swiftui/keyboardshortcut) が提供されています。
以下のコードサンプルをご覧ください。 `.keyboardShortcut` modifier を使用し、任意のキーボード入力をショートカットとして設定できます。
指定されている `.defaultAction` はデフォルト値で、Returnキーです。このコードはショートカットが問題なく動作します。

{{< highlight swift "linenos=inline,hl_lines=6" >}}
Button(action: {
  debugPrint("Sign In")
}) {
  Text("Sign In")
}
.keyboardShortcut(.defaultAction)
{{< / highlight >}}

しかし、以下のコードはショートカットが機能しません。なお、 `buttonStyle` に指定されている `XXXXButtonStyle` は任意のButtonStyle Structとします。

{{< highlight swift "linenos=inline,hl_lines=6-7" >}}
Button(action: {
  debugPrint("Sign In")
}) {
  Text("Sign In")
}
.keyboardShortcut(.defaultAction)
.buttonStyle(XXXXButtonStyle())
{{< / highlight >}}

[StackOverflow](https://stackoverflow.com/questions/66356450/swiftui-keyboard-shortcut-doesnt-work-if-button-has-a-buttonstyle) 上にも似た症状で困っている方がいるのを発見しました。

<!--adsense-->

## 解決策：ZStackでキーボードショートカット専用ボタンを隠す

ワークアラウンドの結果、**1つのButtonに対してkeyboardShortcutとbuttonStyleの併用すると、キーボードショートカットのみ効かなくなる** ということが判明しました。
そのため、SwiftUIの挙動が改善されるまでは回避策を自作する必要があります。
一番手軽だった方法を紹介すると「キーボードショートカット専用のボタンを作成し、ZStackで隠す」です。

{{< highlight swift "linenos=inline,hl_lines=2-16" >}}
ZStack {
  // Button for handling keyboard shortcut
  Button(action: {
    debugPrint("Sign In")
  }) {}
    .padding(0)
    .opacity(0)
    .frame(width: 0, height: 0)
    .keyboardShortcut(.defaultAction)
  // Button for handling mouse event
  Button(action: {
    debugPrint("Sign In")
  }) {
    Text("Sign In")
  }
  .buttonStyle(XXXXButtonStyle())
}
{{< / highlight >}}

ZStackは後に定義したViewが前面に表示されるため、`.buttonStyle` を適用したButtonの裏側にショートカットキーをハンドリングする用のButtonを隠してしまいます。
これでショートカットが効きます。


### ポイント1： ショートカット専用ボタンは限りなく小さく、かつ透過に

重要なポイントとしては、 `.frame(width: 0, height: 0)` や `.padding(0)` で可能な限りサイズを小さくした後、 `.opacity(0)` で完全透過にすることです。
`.opacity(0)` は前面のButtonに透過を付与した時に裏側のボタンが透けて見えてしまう問題を回避するのに役立ちます。

### ポイント2： hidden() modifier は使えない

一見 [`hidden()`](https://developer.apple.com/documentation/swiftui/view/hidden()) modifier を指定すれば裏側のボタンを綺麗に隠せると考える人もいるかもしれません。
しかし、 `hidden()` を指定するとキーボードショートカットが機能しなくなってしまいます。

<!--adsense-->

## まとめ

SwiftUI で デザインをカスタムしたボタンに対してキーボードショートカットを割り当てる場合には

- ZStack で Button を2つ作成する
- 片方には `.buttonStyle` を適用し、もう一方には `.keyboardShortcut` を指定する
- Buttonのaction部には同じ処理を記述する

で実装できます。

ショートカットの箇所が増えるようならmodifierを自作するのもありです。

バッドノウハウ感全開ですが誰かのお役に立てば。

## 参考にさせていただいたサイト

- [Apple Developer Documentation](https://developer.apple.com/documentation/swiftui/keyboardshortcut)
- [StackOverflow](https://stackoverflow.com/questions/66356450/swiftui-keyboard-shortcut-doesnt-work-if-button-has-a-buttonstyle)
