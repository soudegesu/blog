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

### 棒グラフ（積み上げ棒グラフ）：bar/barh

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

y軸からの棒グラフを作りたい場合には `barh` 関数を使えばOKです。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3
xerr = (.1, .08, .1, .0, .5)

plt.barh(x, y, width, align='center', xerr=xerr, ecolor='r')
```

![barh]({{site.baseurl}}/assets/images/20180622/barh.png)

`broken_barh` 関数を使うと、軸に足をつけない棒グラフを描画することができる。
実際には指定された領域を矩形で描画することになる。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  [(1.5, 0.5)]
y = (.5, 2.0)

plt.broken_barh(x, y)
plt.xlim(0)
plt.ylim(0)
```

![broken_barh]({{site.baseurl}}/assets/images/20180622/broken_barh.png)

### 箱ひげ図：boxplot

与えられたデータ配列の箱ひげ図を描画します。（最小値、第1四分位点、中央値、第3四分位点、最大値）

```python
import numpy as np
from matplotlib import pyplot as plt
import random

a = np.array([1, 3, 0.25, 0.44, 5.88])
plt.boxplot(a)
```

![boxplot]({{site.baseurl}}/assets/images/20180622/boxplot.png)

### コヒーレンス：cohere

波の可干渉性（コヒーレンス）を描画することができます。

```python
import numpy as np
import matplotlib.pyplot as plt

n = 1024
x = np.random.randn(n)
y = np.random.randn(n)

plt.cohere(x, y, NFFT=128)
plt.figure()
```

![cohere]({{site.baseurl}}/assets/images/20180622/cohere.png)

### 等高線・水平曲線：contour/contourf/tricontour/tricontourf

等高線（同じ高さの値の集まり）を描画します。
`contour` 単体だと値がわかりにくいので、 `clabel` や `colorbar` などで情報を付与すると良いです。

```python
import numpy as np
import matplotlib.pyplot as plt

delta = 0.025
x = np.arange(-4.0, 3.0, delta)
y = np.arange(-2.0, 2.0, delta)
X, Y = np.meshgrid(x, y)
Z1 = np.exp(-X**2 - Y**2)
Z2 = np.exp(-(X - 1)**2 - (Y - 1)**2)
Z = (Z1 - Z2) * 2

plt.figure()
plt.contour(X, Y, Z)
```

![contour]({{site.baseurl}}/assets/images/20180622/contour.png)

塗りつぶしをしたい場合には `contourf` を使います。

```python
import numpy as np
import matplotlib.pyplot as plt

delta = 0.025
x = np.arange(-4.0, 3.0, delta)
y = np.arange(-2.0, 2.0, delta)
X, Y = np.meshgrid(x, y)
Z1 = np.exp(-X**2 - Y**2)
Z2 = np.exp(-(X - 1)**2 - (Y - 1)**2)
Z = (Z1 - Z2) * 2

plt.figure()
plt.contourf(X, Y, Z)
```

![contourf]({{site.baseurl}}/assets/images/20180622/contourf.png)


非構造な三次元データを扱う場合には `tricontour` 、 `tricontourf` を使います。

```python
import matplotlib.pyplot as plt
import matplotlib.tri as tri
import numpy as np

n_angles = 48
n_radii = 8
min_radius = 0.25
radii = np.linspace(min_radius, 0.95, n_radii)

angles = np.linspace(0, 2 * np.pi, n_angles, endpoint=False)
angles = np.repeat(angles[..., np.newaxis], n_radii, axis=1)
angles[:, 1::2] += np.pi / n_angles

x = (radii * np.cos(angles)).flatten()
y = (radii * np.sin(angles)).flatten()
z = (np.cos(radii) * np.cos(3 * angles)).flatten()

triang = tri.Triangulation(x, y)

plt.gca().set_aspect('equal')
plt.tricontourf(triang, z)
plt.colorbar()
plt.tricontour(triang, z, colors='k')
```

![tricontour]({{site.baseurl}}/assets/images/20180622/tricontour.png)


### クロススペクトル密度：csd

クロススペクトル密度を描画します。

```python
from scipy import signal
from matplotlib import pyplot as plt

fs = 10e3
N = 1e5
amp = 20
freq = 1234.0
noise_power = 0.001 * fs / 2
time = np.arange(N) / fs
b, a = signal.butter(2, 0.25, 'low')
x = np.random.normal(scale=np.sqrt(noise_power), size=time.shape)
y = signal.lfilter(b, a, x)
x += amp*np.sin(2*np.pi*freq*time)
y += np.random.normal(scale=0.1*np.sqrt(noise_power), size=time.shape)

plt.figure()
plt.csd(x, y)
```

![csd]({{site.baseurl}}/assets/images/20180622/csd.png)

### 複数データの並行描画:eventplot

複数のイベントデータを並行して描画する。公式から引用すると、以下のようなユースケースがあるらしい。

> This type of plot is commonly used in neuroscience for representing neural events, where it is usually called a spike raster, dot raster, or raster plot.

```
import numpy as np
from matplotlib import pyplot as plt

np.random.seed(1)

data = np.random.random([6, 50])
lineoffsets = np.array([-15, -3, 1, 1.5, 6, 10])
linelengths = [10, 2, 1, 1, 3, 1.5]

plt.figure()
plt.eventplot(data, lineoffsets=lineoffsets,
              linelengths=linelengths)
```

![eventplot]({{site.baseurl}}/assets/images/20180622/eventplot.png)

### 六角形で描画：hexbin

hexでデータを描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(1, 10, 1)
y = np.arange(1, 10, 1)

plt.hexbin(x, y, gridsize=10)
```

![hexbin]({{site.baseurl}}/assets/images/20180622/eventplot.png)

### ヒストグラム：hist/hist2d

ヒストグラムを表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

mu, sigma = 100, 15
x = mu + sigma * np.random.randn(100)

plt.hist(x, 50, density=True, alpha=0.75)
```

![hist]({{site.baseurl}}/assets/images/20180622/hist.png)

2次元のヒストグラムを描画するには、 `hist2d` 関数を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

x = np.random.randn(100000)
y = np.random.randn(100000) + 5

plt.hist2d(x, y, bins=40)
```

![hist2d]({{site.baseurl}}/assets/images/20180622/hist2d.png)

### 対数を描画：loglog/semilogx/semilogy

対数を描画します。両対数の場合には `loglog` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

t = np.arange(0.01, 20.0, 0.01)
plt.loglog(t, 20 * np.exp( -t / 10.0), basex=2)
plt.grid(True)
plt.title('loglog base 2 on x')
plt.show()
```

![loglog]({{site.baseurl}}/assets/images/20180622/loglog.png)

x軸を10を底とする対数スケールで片対数を描画する場合には `semilogx` を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0.01, 20.0, 0.01)

plt.semilogx(t, np.sin(2*np.pi*t))
plt.grid(True)
```

![semilogx]({{site.baseurl}}/assets/images/20180622/semilogx.png)

y軸を10を底とする対数スケールで片対数を描画する場合には `semilogy` を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0.01, 20.0, 0.01)

plt.semilogy(t, np.exp(-t/5.0))
plt.grid(True)
```

![semilogy]({{site.baseurl}}/assets/images/20180622/semilogy.png)

### 振幅スペクトラム：magnitude_spectrum

信号の強さを表す振幅スペクトラムを描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

dt = 0.01
Fs = 1/dt
t = np.arange(0, 10, dt)
nse = np.random.randn(len(t))
r = np.exp(-t/0.05)
cnse = np.convolve(nse, r)*dt
cnse = cnse[:len(t)]

s = 0.1*np.sin(2*np.pi*t) + cnse

plt.magnitude_spectrum(s, Fs=Fs)
plt.show()
```

![magnitude_spectrum]({{site.baseurl}}/assets/images/20180622/magnitude_spectrum.png)

### 行列の描画：matshow

行列のデータを描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

mat = np.random.rand(10,10)
plt.matshow(mat)

plt.show()
```

![matshow]({{site.baseurl}}/assets/images/20180622/matshow.png)

### 2次元配列の疑似カラー描画：pcolor/pcolormesh/tripcolor

2次元配列のデータを擬似カラーで描画します。

```python
import matplotlib.pyplot as plt
import numpy as np

dx, dy = 0.15, 0.05

y, x = np.mgrid[slice(-3, 3 + dy, dy),
                slice(-3, 3 + dx, dx)]
z = (1 - x / 2. + x ** 5 + y ** 3) * np.exp(-x ** 2 - y ** 2)
z = z[:-1, :-1]
z_min, z_max = -np.abs(z).max(), np.abs(z).max()

plt.pcolor(x, y, z, cmap='RdBu', vmin=z_min, vmax=z_max)
```

![pcolor]({{site.baseurl}}/assets/images/20180622/pcolor.png)

メッシュデータにして、高速に描画したい場合には `pcolormesh` 関数を使うと良いそうです。

```python
import matplotlib.pyplot as plt
import numpy as np

dx, dy = 0.15, 0.05

y, x = np.mgrid[slice(-3, 3 + dy, dy),
                slice(-3, 3 + dx, dx)]
z = (1 - x / 2. + x ** 5 + y ** 3) * np.exp(-x ** 2 - y ** 2)
z = z[:-1, :-1]
z_min, z_max = -np.abs(z).max(), np.abs(z).max()

plt.pcolormesh(x, y, z, cmap='RdBu', vmin=z_min, vmax=z_max)
```

![pcolormesh]({{site.baseurl}}/assets/images/20180622/pcolormesh.png)

`tricontour` に対する疑似カラー描画には `tripcolor` 関数を使います。

```python
import matplotlib.pyplot as plt
import matplotlib.tri as tri
import numpy as np

n_angles = 48
n_radii = 8
min_radius = 0.25
radii = np.linspace(min_radius, 0.95, n_radii)

angles = np.linspace(0, 2 * np.pi, n_angles, endpoint=False)
angles = np.repeat(angles[..., np.newaxis], n_radii, axis=1)
angles[:, 1::2] += np.pi / n_angles

x = (radii * np.cos(angles)).flatten()
y = (radii * np.sin(angles)).flatten()
z = (np.cos(radii) * np.cos(3 * angles)).flatten()

triang = tri.Triangulation(x, y)

plt.gca().set_aspect('equal')
plt.tricontourf(triang, z)
plt.colorbar()
plt.tripcolor(triang, z, shading='flat')
```

![tripcolor]({{site.baseurl}}/assets/images/20180622/tripcolor.png)

### 位相スペクトラム：phase_spectrum

位相スペクトラムを描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

dt = 0.01
Fs = 1/dt
t = np.arange(0, 10, dt)
nse = np.random.randn(len(t))
r = np.exp(-t/0.05)

cnse = np.convolve(nse, r)*dt
cnse = cnse[:len(t)]
s = 0.1*np.sin(2*np.pi*t) + cnse

plt.phase_spectrum(s, Fs=Fs)
plt.show()
```

![phase_spectrum]({{site.baseurl}}/assets/images/20180622/pcolormesh.png)

### 円グラフ：pie

円グラフを描画します。 `autopct` （円グラフ上に値を表示する）オプションのように、`pie` 関数にはグラフを修飾する多くのオプションがあります。

```python
from matplotlib import pyplot as plt
from matplotlib.gridspec import GridSpec

labels = 'A', 'B', 'C', 'D'
fracs = [15, 30, 45, 10]

plt.pie(fracs, labels=labels, autopct='%1.1f%%')
plt.show()
```

![pie]({{site.baseurl}}/assets/images/20180622/pie.png)

### 日付で描画する：plot_date

x軸が日付データの場合には `plot_date` 関数で描画することができます。

```python
import matplotlib.pyplot as plt
from matplotlib.dates import (DateFormatter, drange)
import numpy as np
import datetime

np.random.seed(0)

formatter = DateFormatter('%Y/%m/%d/')
date1 = datetime.date(1970, 1, 1)
date2 = datetime.date(2018, 4, 12)
delta = datetime.timedelta(days=100)

dates = drange(date1, date2, delta)
s = np.random.rand(len(dates))

plt.plot_date(dates, s)
plt.show()
```

![plot_date]({{site.baseurl}}/assets/images/20180622/plot_date.png)

### 極座標グラフ：polar

極座標系の円グラフを描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

r = np.arange(0, 2, 0.01)
theta = 2 * np.pi * r

plt.polar(theta, r)
plt.show()
```

![polar]({{site.baseurl}}/assets/images/20180622/polar.png)

### パワースペクトル密度：psd

パワースペクトル密度を描画します。

```python
from matplotlib import pyplot as plt
import numpy as np
from matplotlib import mlab as mlab

np.random.seed(0)

dt = 0.01
t = np.arange(0, 10, dt)
nse = np.random.randn(len(t))
r = np.exp(-t / 0.05)

cnse = np.convolve(nse, r) * dt
cnse = cnse[:len(t)]
s = 0.1 * np.sin(2 * np.pi * t) + cnse

plt.psd(s, 512, 1 / dt)
plt.show()
```

![psd]({{site.baseurl}}/assets/images/20180622/psd.png)

### ベクトルの描画：quiver/quiverkey

ベクトルを描画します。また、 `quiverkey` 関数を使うことで、ベクトルのキーも描画することができます。

```python
from matplotlib import pyplot as plt
import numpy as np

X, Y = np.meshgrid(np.arange(0, 2 * np.pi, .2), np.arange(0, 2 * np.pi, .2))
U = np.cos(X)
V = np.sin(Y)

Q = plt.quiver(X, Y, U, V, units='width')
plt.quiverkey(Q, 0.5, 0.9, 2, r'$2 \frac{m}{s}$', labelpos='E', coordinates='figure')
plt.show()
```

![quiver]({{site.baseurl}}/assets/images/20180622/quiver.png)

### 散布図：scatter

散布図を描画します。 オプションでマーカーの大きさを変更できたりします。

```python
from matplotlib import pyplot as plt
import numpy as np

N = 50
x = np.random.rand(N)
y = np.random.rand(N)

colors = np.random.rand(N)
area = np.pi * (15 * np.random.rand(N))**2

plt.scatter(x, y, s=area, c=colors, alpha=0.5)
plt.show()
```

![scatter]({{site.baseurl}}/assets/images/20180622/scatter.png)

### スペクトログラム：specgram

スペクトログラムを描画します。

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(0)

dt = 0.0005
t = np.arange(0.0, 20.0, dt)
s1 = np.sin(2 * np.pi * 100 * t)
s2 = 2 * np.sin(2 * np.pi * 400 * t)

mask = np.where(np.logical_and(t > 10, t < 12), 1.0, 0.0)
s2 = s2 * mask

nse = 0.01 * np.random.random(size=len(t))

x = s1 + s2 + nse
NFFT = 1024
Fs = int(1.0 / dt)

plt.specgram(x, NFFT=NFFT, Fs=Fs, noverlap=900)
plt.show()
```

![specgram]({{site.baseurl}}/assets/images/20180622/specgram.png)

### スパース行列：spy

スパース行列（疎行列）を描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.random.randn(20, 20)
x[5] = 0.
x[:, 12] = 0.

plt.spy(x, markersize=3)
```

![spy]({{site.baseurl}}/assets/images/20180622/spy.png)

### 積み上げ折れ線グラフ：stackplot

積み上げの折れ線グラフを描画します。

```python
import numpy as np
from matplotlib import pyplot as plt

x = [1, 2, 3, 4, 5]
y1 = [1, 1, 2, 3, 5]
y2 = [0, 4, 2, 6, 8]
y3 = [1, 3, 5, 7, 9]

plt.stackplot(x, y1, y2, y3, labels=labels)
plt.show()
```

![stackplot]({{site.baseurl}}/assets/images/20180622/stackplot.png)

### 離散データの描画：stem

x軸から伸びるシーケンスとしてyの値を描画したい場合に使います。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.linspace(0.1, 2 * np.pi, 10)
plt.stem(x, np.cos(x), '-.')

plt.show()
```

![stem]({{site.baseurl}}/assets/images/20180622/stem.png)

### ステップ応答の描画:step

ステップ応答を描画します。コンピュータ信号のような離散値とかを扱うときに使います。

```python
import numpy as np
from numpy import ma
import matplotlib.pyplot as plt

x = np.arange(1, 7, 0.4)
y = np.sin(x).copy() + 2.5

plt.step(x, y)
plt.scatter(x, y) #データを表す座標が見やすいようにしています
plt.show()
```

![step]({{site.baseurl}}/assets/images/20180622/step.png)

### 流線グラフ：streamplot

流線を描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

Y, X = np.mgrid[-3:3:100j, -3:3:100j]
U = -1 - X**2 + Y
V = 1 + X - Y**2
speed = np.sqrt(U*U + V*V)

plt.streamplot(X, Y, U, V, color=U, linewidth=2, cmap=plt.cm.autumn)
```

![streamplot]({{site.baseurl}}/assets/images/20180622/streamplot.png)


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

### 風向きを表す：barbs

天気図で使う風向きとその強さを表す記号を描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

x =  (1, 2, 3, 4, 5)
y = (1, 2, 3, 4, 5)
u = (10,20,-30,40,-50)
v = (10,20,30,40,50)

plt.barbs(x, y, u, v)
```

![barbs]({{site.baseurl}}/assets/images/20180622/barbs.png)

### 色の値の判例を表示する：colorbar

色が表す値の判例を表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

delta = 0.025
x = np.arange(-4.0, 3.0, delta)
y = np.arange(-2.0, 2.0, delta)
X, Y = np.meshgrid(x, y)
Z1 = np.exp(-X**2 - Y**2)
Z2 = np.exp(-(X - 1)**2 - (Y - 1)**2)
Z = (Z1 - Z2) * 2

plt.figure()
plt.contourf(X, Y, Z)
plt.colorbar()
```

![colorbar]({{site.baseurl}}/assets/images/20180622/colorbar.png)

### 色のラベルを表示する：clabel

色が表す値のラベルをグラフ上に表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

delta = 0.025
x = np.arange(-4.0, 3.0, delta)
y = np.arange(-2.0, 2.0, delta)
X, Y = np.meshgrid(x, y)
Z1 = np.exp(-X**2 - Y**2)
Z2 = np.exp(-(X - 1)**2 - (Y - 1)**2)
Z = (Z1 - Z2) * 2

plt.figure()
CS = plt.contour(X, Y, Z)
plt.clabel(CS, inline=1, fontsize=10)
```

![clabel]({{site.baseurl}}/assets/images/20180622/clabel.png)

### 誤差を棒で表す：errorbar

データの誤差を棒で表します。
`uplims` `lolims` オプションで、上下のどちらの誤差か指定することもできます。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure(0)
x = np.arange(10.0)
y = np.sin(np.arange(10.0) / 20.0)

plt.errorbar(x, y, yerr=0.1)

y = np.sin(np.arange(10.0) / 20.0) + 1
plt.errorbar(x, y, yerr=0.1, uplims=True)

y = np.sin(np.arange(10.0) / 20.0) + 2
plt.errorbar(x, y, yerr=0.1, lolims=True)
```

![errorbar]({{site.baseurl}}/assets/images/20180622/errorbar.png)

### 図中にテキストを埋め込む：figtext

図中にテキストを埋め込みます。
指定のx, yは図中の相対位置であることに注意が必要です。（座標ではありません）

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure(0)
x = np.arange(10.0)
y = np.sin(np.arange(10.0) / 20.0)

plt.errorbar(x, y)
# x軸方向の中央(0.5)
# y軸方向の1/4(0.25)の場所に
# 文字「x」を埋め込む
plt.figtext(0.5, 0.25, '$x$')
```

![figtext]({{site.baseurl}}/assets/images/20180622/figtext.png)

### 色を塗りつぶす:fill/fill_between/fill_betweenx

グラフ上の範囲を塗りつぶして描画します。
`fill` ではy=0との間の色が塗りつぶされます。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(0.0, 2, 0.01)
y = np.sin(2*np.pi*x)

plt.fill(x, y)
```

![fill]({{site.baseurl}}/assets/images/20180622/fill.png)

塗りつぶし範囲のyを指定するには `fill_between` 関数を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(0.0, 2, 0.01)
y1 = np.sin(2*np.pi*x)
y2 = 0.5

plt.fill_between(x, y1, y2)
```

![fill_between]({{site.baseurl}}/assets/images/20180622/fill_between.png)

x軸に対して行う場合には `fill_betweenx` 関数を使います。

```python
import numpy as np
import matplotlib.pyplot as plt

y = np.arange(0.0, 2, 0.01)
x1 = np.sin(2*np.pi*x)
x2 = 0.5

plt.fill_betweenx(y, x1, x2)
```

![fill_betweenx]({{site.baseurl}}/assets/images/20180622/fill_betweenx.png)

### 水平に線を引く：hlines

図中に水平線を引きます。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

xmin = 1
xmax =  10

plt.hlines([-1, 1], xmin, xmax)
```

### 凡例を追加する：legend

グラフデータの凡例を追加します。

```python
from matplotlib import pyplot as plt
import numpy as np

x_data = (1, 2, 3)
y_data = (.5, 1.5 , .8)

plt.bar(x_data, y_data)
plt.legend(['dataA'])
```

![legend]({{site.baseurl}}/assets/images/20180622/legend.png)

### グラフにタイトルをつける：title/suptitle

グラフにタイトルをつける場合には `title` 関数を使います。
複数グラフに対するタイトルをつけたい場合には `suptitle` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

def f(t):
    return np.cos(2*np.pi*t)

t1 = np.arange(0.0, 5.0, 0.1)
t2 = np.arange(0.0, 2.0, 0.01)

plt.subplot(121)
plt.plot(t1, f(t1), '-')
plt.title('subplot 1')
plt.suptitle('Suptitle', fontsize=16)


plt.subplot(122)
plt.plot(t2, np.cos(2*np.pi*t2), '--')
plt.title('subplot 2')

plt.show()
```

![title]({{site.baseurl}}/assets/images/20180622/title.png)

### データテーブルを表示：table

グラフで描画するデータにデータテーブルを追加します。
パッと見た感じ、テーブルを単体で描画するのはできなそうでした。

```python
import numpy as np
from matplotlib import pyplot as plt

data = [[ 66386, 174296,  75131, 577908,  32015],
        [ 58230, 381139,  78045,  99308, 160454],
        [ 89135,  80552, 152558, 497981, 603535],
        [ 78415,  81858, 150656, 193263,  69638],
        [139361, 331509, 343164, 781380,  52269]]
columns = ('Freeze', 'Wind', 'Flood', 'Quake', 'Hail')
rows = ['%d year' % x for x in (100, 50, 20, 10, 5)]

plt.table(cellText=data,
                      rowLabels=rows,
                      rowColours=colors,
                      colLabels=columns,
                      loc='bottom')

plt.show()
```

![table]({{site.baseurl}}/assets/images/20180622/table.png)

### テキストを表示する：text

グラフ上にテキストを描画します。 オプションを指定して、テキストを修飾することもできます。

```python
from matplotlib import pyplot as plt

plt.text(0.6, 0.5, "hogehoge", size=20, rotation=20.,
         ha="center", va="center",
         bbox=dict(boxstyle="square",
                   ec=(1., 0.5, 0.5),
                   fc=(1., 0.8, 0.8),
                   )
         )

plt.text(0.2, 0.5, "fugafuga", size=20, rotation=20.,
         ha="center", va="center"
         )

plt.show()
```

![text]({{site.baseurl}}/assets/images/20180622/text.png)


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

### 外枠の表示/非表示：box

グラフの枠の表示/非表示を設定します。デフォルトはTrueです。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3

plt.barh(x, y, width, align='center')
plt.box(False)
```

![box]({{site.baseurl}}/assets/images/20180622/box.png)

### 枠線を表示する：grid/rgrids/thetagrids

グラフ内の枠線を表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

mu, sigma = 100, 15
x = mu + sigma * np.random.randn(100)

plt.hist(x, 50, density=True, alpha=0.75)
plt.grid(linestyle='-', linewidth=1)
```

![grid]({{site.baseurl}}/assets/images/20180622/grid.png)

極座標グラフ（polar）に枠線を描画するには `rgrids` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

plt.polar()
plt.rgrids((0.25, 0.5, 1.0))
plt.show()
```

![rgrids]({{site.baseurl}}/assets/images/20180622/rgrids.png)

`rgrids` の代わりに `thetagrids` 関数で、枠線とラベルを一緒に設定することも可能です。

```python
from matplotlib import pyplot as plt
import numpy as np

plt.polar()
plt.thetagrids(range(45,360,90), ('NE', 'NW', 'SW','SE'))
plt.show()
```

![thetagrids]({{site.baseurl}}/assets/images/20180622/thetagrids.png)

### メモリの分割数を変更する：locator_params

指定軸のメモリの分割数を指定できます。
`nbins` オプションで指定時された数字通りに分割してくれるときとそうでないときがあり、
2の乗数で指定するといい感じにスケールしてくれました。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

mu, sigma = 100, 15
x = mu + sigma * np.random.randn(100)

plt.hist(x, 50, density=True, alpha=0.75)
# x軸を8分割
plt.locator_params(axis='x', nbins=8)
plt.show()
```

![locator_params]({{site.baseurl}}/assets/images/20180622/locator_params.png)

### マージンをとる：margins/subplots_adjust

図内の点に対してマージンをとって、データを見やすい位置に調整します。

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [1, 4, 9, 6]

plt.plot(x, y, 'o')
plt.margins(0.3)
plt.show()
```

![margins]({{site.baseurl}}/assets/images/20180622/margins.png)

`subplots` を使った複数のグラフ描画の場合には `subplots_adjust` が使えます。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

plt.subplot(211)
plt.imshow(np.random.random((100, 100)), cmap=plt.cm.BuPu_r)
plt.subplot(212)
plt.imshow(np.random.random((100, 100)), cmap=plt.cm.BuPu_r)

plt.subplots_adjust(bottom=0.3, right=0.8, top=0.9)
plt.show()
```

![subplots_adjust]({{site.baseurl}}/assets/images/20180622/subplots_adjust.png)

### レイアウトを自動調整する：tight_layout

複数グラフ間のレイアウト設定から、自動で調節してくれます。

```python
from matplotlib import pyplot as plt
import itertools

fontsizes = itertools.cycle([8, 16, 24, 32])

def example_plot(ax):
    ax.plot([1, 2])
    ax.set_xlabel('x-label', fontsize=next(fontsizes))
    ax.set_ylabel('y-label', fontsize=next(fontsizes))
    ax.set_title('Title', fontsize=next(fontsizes))

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(nrows=2, ncols=2)
example_plot(ax1)
example_plot(ax2)
example_plot(ax3)
example_plot(ax4)
plt.tight_layout()
```

![tight_layout]({{site.baseurl}}/assets/images/20180622/tight_layout.png)

### 複数のグラフを描画する:subplots

複数のグラフを描画する場合には、 `subplots` を使います。
返却された `axes` 配列の要素にアクセスして、データをプロットする関数を実行することで描画が可能です。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.linspace(0, 2*np.pi, 400)
y = np.sin(x**2)

fig, axes = plt.subplots(2, 1)
axes[0].plot(x, y)
axes[1].scatter(x, y)
plt.show()
```

![subplots]({{site.baseurl}}/assets/images/20180622/subplots.png)


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
