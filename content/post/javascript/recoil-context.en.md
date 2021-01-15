---
title: "React child component can't get the atom value in Recoil"
description: "Here are some tips for React's state management library, Recoil: If you can't get the atom value from a child component in Recoil, the context state is not being passed somewhere in the child component."
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

I've been using [Recoil](https://recoiljs.org/), a state management library for React, for a while now, so I'll write some tips.

<!--adsense-->

### Environment

- react `16.14.x`
- recoil `0.1.2`

### Cannot get atom value from child component in Recoil

While implementing a medium-sized application using Recoil, I encountered an issue where I could not get the value of atom from certain child component.
Of course, I called `<RecoilRoot>` close to the top level components of the application such as `App.tsx`.

### Use RecoilBridge for implementations that break the React Context

If there is a component in the Render Tree that does not pass the context state, it is necessary to bridge the context state before and after the corresponding component.
For example, in the API of the `<Canvas>` tag in [react-three-fiber](https://github.com/pmndrs/react-three-fiber), you need to bridge the context.

As a way to bridge, Recoil provides [useRecoilBridgeAcrossReactRoots_UNSTABLE](https://recoiljs.org/docs/api-reference/core/useRecoilBridgeAcrossReactRoots/) API. However, since the name is given as `UNSTABLE`, you should judge by yourself when to use it.

In the following sample code, the value of atom of Recoil can be used in components after `<SomeChildComponent>`.

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

The approach to state management itself is different, but if you use a React Context that you defined yourself with `React.createContext`, you usually need to bridge it as follows.
You can see that `RecoilBridge` is simple to look at as well.

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

### Conclusion

- If a child component cannot refer to an atom in an application using Recoil, there may be a component that has not passed the context state.
- Can be referenced by using [useRecoilBridgeAcrossReactRoots_UNSTABLE](https://recoiljs.org/docs/api-reference/core/useRecoilBridgeAcrossReactRoots/).
- Note that the API is `UNSTABLE`.
