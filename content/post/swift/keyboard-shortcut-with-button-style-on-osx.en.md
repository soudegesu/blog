---
title: "Enabling keyboard shortcuts for buttons with buttonStyle applied in SwiftUI"
description: "When you try to create a cool UI with SwiftUI, you will often face a problem. In this article, I'll show you how to use keyboardShortcut to assign keyboard shortcuts to buttons that have been customized with buttonStyle."
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

When you try to create a cool UI with SwiftUI, you will often face a problem. In this article, I'll show you how to use keyboardShortcut to assign keyboard shortcuts to buttons that have been customized with buttonStyle.

## Environment

- mac OSX 11.0
- XCode 12.0

<!--adsense-->

## Goal in this article

- Using SwiftUI
- In a macOS app
- You can use the Enter key to submit a Button.
- Button design can be customized with buttonStyle modifier.

This is a useful feature that is often used in forms.

### A pattern of keyboard shortcuts being disabled

As of macOS 11.0, [KeyboardShortcut](https://developer.apple.com/documentation/swiftui/keyboardshortcut) is available.
See the code sample below. You can use the `.keyboardShortcut` modifier to set any keyboard input as a shortcut.
The `.defaultAction` specified is the default value, the Return key. This code works fine for shortcuts.

{{< highlight swift "linenos=inline,hl_lines=6" >}}
Button(action: {
  debugPrint("Sign In")
}) {
  Text("Sign In")
}
.keyboardShortcut(.defaultAction)
{{< / highlight >}}

However, the following code does not work for shortcuts. Note that `XXXXButtonStyle` specified in `.buttonStyle` is assumed to be an arbitrary ButtonStyle Struct.

{{< highlight swift "linenos=inline,hl_lines=6-7" >}}
Button(action: {
  debugPrint("Sign In")
}) {
  Text("Sign In")
}
.keyboardShortcut(.defaultAction)
.buttonStyle(XXXXButtonStyle())
{{< / highlight >}}

There was also someone on [StackOverflow](https://stackoverflow.com/questions/66356450/swiftui-keyboard-shortcut-doesnt-work-if-button-has-a-buttonstyle) asking for help.


<!--adsense-->

## Solution: Hide the keyboard shortcut button with ZStack

As a result of my workaround, it was found that **only keyboard shortcuts will not work if keyboardShortcut and buttonStyle are used together for a single Button**. Therefore, until the behavior of SwiftUI is improved, need to create your own workaround.
The easiest way I found to do this was to use ZStack to hide the button for handling keyboard shortcut behind the button it was customized with buttonStyle.

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

ZStack will display the lower defined View in the front. Use this behavior to hide the Button for handling shortcut keys behind the Button with `.buttonStyle` applied.
This way, keyboard shortcuts will be enabled.

### Point 1: Make shortcut-only buttons as small as possible and make them transparent.

The important point is to make the size as small as possible with `.frame(width: 0, height: 0)` and `.padding(0)`, and then make it fully transparent with `.opacity(0)`.
The setting `.opacity(0)` is useful to avoid the problem of the keybord shortcut button showing through when the front button is transparent.

### Point 2: Can't use hidden() modifier.

Some people may think that specifying a [`hidden()`](https://developer.apple.com/documentation/swiftui/view/hidden()) modifier will hide the back side of the button nicely.
However, if you specify `hidden()`, the keyboard shortcuts will not work.

<!--adsense-->

## Conclusion

To assign a keyboard shortcut to a custom-designed button in SwiftUI, use the

- Create two buttons, apply `.buttonStyle` to one, and `.keyboardShortcut` to the other
- Describe the same process in the action part of Button
- Use ZStack to hide one button on the back of the other.

If you need to implement more shortcuts, you may want to create a modifier yourself.

This is bad know-how, but I hope it helps someone.

## References

- [Apple Developer Documentation](https://developer.apple.com/documentation/swiftui/keyboardshortcut)
- [StackOverflow](https://stackoverflow.com/questions/66356450/swiftui-keyboard-shortcut-doesnt-work-if-button-has-a-buttonstyle)
