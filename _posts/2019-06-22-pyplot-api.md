---
title: "matplotlibのpyplotを理解する"
description: ""
date: 2018-06-22 00:00:00 +0900
categories: python
tags: matplotlib
---

`matplotlib` はpythonでデータの可視化をするときに重宝されるのですが、なかなか概念的にも難しく、初見ユーザにはなかなかつらいライブラリです。
最近データ可視化の機会が増えたので、 `matplotlib` のドキュメントを読みつつ学んだことをまとめたいと思います。

* Table Of Contents
{:toc}

## 実行環境

実行環境は以下になります。

* mac OS (High Sierra 10.13)
* Python 3.6.1
* matplotlib 2.2.2
* jupyter 1.0.0
* numpy 1.14.5
* pandas 0.23.1

また、今回作成したグラフは [こちら](https://github.com/soudegesu/pyplot-test) にpushしてあります。

## 描画できるグラフの種類

`matplotlib.pyplot` モジュールがデータのプロット（描画）を司るモジュールになります。

まずは、描画可能なグラフの種類を確認してみましょう。

[matplotlibのpyplotのページ](https://matplotlib.org/api/pyplot_summary.html) にAPIに関する記載があるのでそれを参考にします。

### acorr

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.random.normal(0, 10, 50)
plt.acorr(x)
```

![acorr]({{site.baseurl}}/assets/images/20180622/acorr.png)

### angle_spectrum

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.random.normal(0, 10, 50)
plt.angle_spectrum(x)
```

![angle_spectrum]({{site.baseurl}}/assets/images/20180622/angle_spectrum.png)

### 棒グラフ（積み上げ棒グラフ）：bar

棒グラフを描画します。 `xerr` `yerr` オプションを指定すると誤差の指定ができます。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3
yerr = (.1, .08, .1, .0, .5)

plt.bar(x, y, width, align='center', yerr=yerr, ecolor='r')
```

![bar]({{site.baseurl}}/assets/images/20180622/bar.png)

積み上げ棒グラフを作りたい場合には、`bottom` オプションで積み上げておきたい値を加算する必要があります。

`bottom` 指定がないと、棒グラフを重ねて描画してしまうので注意が必要なのと、
重ねるグラフ同士の配列の要素数は同じである必要があります。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
y2 = (2, 1, 3, 2, 1)
width = 0.3
yerr = (.1, .08, .1, .0, .5)

p1 = plt.bar(x, y, width, align='center', yerr=yerr, ecolor='r')
p2 = plt.bar(x, y2, width, align='center', bottom=y, yerr=yerr, ecolor='r')

plt.show()
```

![bar2]({{site.baseurl}}/assets/images/20180622/bar2.png)

## グラフに付加情報を加える

### 特定のデータに注釈を入れる：annotate

グラフ上にテキストの付加情報を追加します。「ここだよ！ここ！」と特定のデータポイントを指し示したいときに使います。

気をつけるのは、 `xycoords` オプションによって、`xy` や `xytext` の振る舞いが変わること。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

t = np.arange(0.0, 5.0, 0.01)
s = np.cos(2*np.pi*t)
line, = ax.plot(t, s, lw=2)

# xycoordsがデフォルトの'data'なので、
# 座標(4, 1)のデータに対して座標(3, 1.5)にテキストを表示して
# 矢印で線を引っ張る
ax.annotate('max', xy=(4, 1), xytext=(3, 1.5),
            arrowprops=dict(facecolor='black', shrink=0.05),
            )

ax.set_ylim(-2,2)
plt.show()
```

![annotate]({{site.baseurl}}/assets/images/20180622/annotate.png)

### 矢印（直線）を書き加える：arrow

図中に任意の矢印を描画したいときに使います。 `head_width` `head_length` オプションを記入しないとただの直線として描画されます。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

#head_widthとhead_lengthを入れないと矢印にならない
ax.arrow(x=0.5, y=0.5, dx=1.0, dy=1.0, ls='--', head_width=0.1, head_length=0.1)

ax.set_xlim(0.25, 1.75)
ax.set_ylim(0.25, 1.75)
plt.show()
```

![arrow]({{site.baseurl}}/assets/images/20180622/arrow.png)

### x軸と平行の線を引く：axhline

x軸に対して平行線を引きます。しきい値を直線で表すことができます。
また、 `xmin` `xmax` オプションで、直線を引く区間を指定できるのが便利です。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

plt.axhline(y=.5, xmin=0.25, xmax=0.75)
plt.show()
```

![axhline]({{site.baseurl}}/assets/images/20180622/axhline.png)

### x軸と垂直（y軸と平行）の線を引く：

x軸に対して垂直の線を引くことが出来ます。オプションの概念は `axhline` と同様です。

```python
# axvline sample
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

plt.axvline(x=.5, ymin=0.25, ymax=0.75, color='r', linewidth=4)
plt.show()
```

![axvline]({{site.baseurl}}/assets/images/20180622/axvline.png)

### x軸と平行の矩形を描画する：axhspan

x軸と平行の矩形（四角形）を描画することができます。
y軸の範囲を表現したいときに使います。
`xmin` `xmax` `ymin` `ymax` オプションを指定した場合は矩形を描画するという意味では `axvspan` と変わりません。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

# yが1.25〜1.55までを一律で塗りつぶし
plt.axhspan(1.25, 1.55, facecolor='g', alpha=0.5)
plt.show()
```

![axhspan]({{site.baseurl}}/assets/images/20180622/axhspan.png)

### 矩形を描画する：axvspan

y軸と平行の矩形（四角形）を描画することができます。
x軸の範囲を表現したいときに使います。
`xmin` `xmax` `ymin` `ymax` オプションを指定した場合は矩形を描画するという意味では `axhspan` と変わりません。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

plt.axvspan(1.25, 1.55, facecolor='g', alpha=0.5)
plt.show()
```

![axvspan]({{site.baseurl}}/assets/images/20180622/axvspan.png)

## グラフのレイアウトを修正する

### グラフの位置を変更する：axes

グラフの位置を修正し、複数のグラフを重ね合わせるときなどに使用します。

```python
# sample axes
import matplotlib.pyplot as plt
import numpy as np

x = np.random.normal(0, 10, 50)
plt.acorr(x)

# 引数は図を描画する位置の [left, bottom, width, height]を表す
plt.axes([.65, .6, .2, .2], facecolor='k')
plt.angle_spectrum(x)
```

![axes]({{site.baseurl}}/assets/images/20180622/axes.png)

## pyplotの概念


## まとめ


## 参考にさせていただいたサイト
* [The Pyplot API ; Matplotlib 2.2.2 documentation](https://matplotlib.org/api/pyplot_summary.html)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=178862517X&linkId=3dec88b3972c7ff66f6e2f7f8f72c8c0&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117488&linkId=f93decd08ed89a95a63410d08e00c827&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873118417&linkId=8442e209dbcce8dfd90c9f2c8ea1c75a&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
