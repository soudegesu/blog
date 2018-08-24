---
title: "matplotlibのpyplot APIをいろいろ試す"
description: "matplotlibはpythonでデータの可視化をするときに重宝しますが、ドキュメントがパッと見わかりにくいので、取っ掛かりが難しいです。たまにデータの可視化をするのですが、 matplotlibの調べ物に時間がかかるときがあり「なんか時間がもったいないな」と感じていました。今回はmatplotlibのドキュメントを読みつつ、matplotlibのpyplot APIをいろいろ試し、自分向けにまとめました。"
date: 2018-06-22
thumbnail: /images/icons/python_icon.png
categories:
    - python
tags:
    - matplotlib
url: /python/pyplot-api/
twitter_card_image: /images/icons/python_icon.png
---

matplotlibはpythonでデータの可視化をするときに重宝しますが、ドキュメントがパッと見わかりにくいので、取っ掛かりが難しいです。

たまにデータの可視化をするのですが、 matplotlibの調べ物に時間がかかるときがあり「なんか時間がもったいないな」と感じていました。

今回はmatplotlibのドキュメントを読みつつ、matplotlibのpyplot APIをいろいろ試し、自分向けにまとめました。

## 実行環境

実行環境は以下になります。

* mac OS (High Sierra 10.13)
* Python 3.6.1
* matplotlib 2.2.2
* jupyter 1.0.0
* numpy 1.14.5
* pandas 0.23.1

また、今回作成したグラフは [こちら](https://github.com/soudegesu/pyplot-test) にpushしてあります。

## pyplotの思想を理解する

グラフ描画を始める前にpyplotの思想を理解しました。

いきなりSample Garallyから行くと凝ったグラフが出てきて理解が追いつかなくなるので注意が必要です。

探しにくいですが、公式の [Usage GuideのGeneral Conceptsの項](https://matplotlib.org/tutorials/introductory/usage.html) にpyplotの概念の説明があるので一読しました。

## プロットできるデータの種類

`matplotlib.pyplot` モジュールがデータのプロット（描画）を司るモジュールになります。

[matplotlibのpyplotのページ](https://matplotlib.org/api/pyplot_summary.html) に提供しているAPIの一覧記載があるのでそれを参考に試していきます。

ここでは、大きくわけて以下2種類を取り扱います。

* グラフの種類を指定する関数（棒グラフや円グラフなど）
* 渡されたデータに対して、特定の演算結果を描画する関数（スペクトル計算など）

### 棒グラフ（積み上げ棒グラフ）：bar/barh/broken_barh

**棒グラフ** を描画します。 `xerr` `yerr` オプションを指定すると誤差の指定ができます。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3
yerr = (.1, .08, .1, .0, .5)

plt.bar(x, y, width, align='center', yerr=yerr, ecolor='r')
```

![bar](/images/20180622/bar.png)

`bottom` オプションで積み上げておきたい初期値を設定することで、 **積み上げ棒グラフ** を描画することもできます。

積み上げるグラフの複数の配列の要素数は同一である必要があり、`bottom` 指定を忘れると、2種類の棒グラフを重ねて描画してしまうので注意が必要です。

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

![bar2](/images/20180622/bar2.png)

**y軸から横に伸びる棒グラフ** は `barh` 関数を使います。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3
xerr = (.1, .08, .1, .0, .5)

plt.barh(x, y, width, align='center', xerr=xerr, ecolor='r')
```

![barh](/images/20180622/barh.png)

`broken_barh` 関数では、 **軸に足をつけない棒グラフ** を描画することができます。
実際には指定領域を矩形描画することになります。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  [(1.5, 0.5)]
y = (.5, 2.0)

plt.broken_barh(x, y)
plt.xlim(0)
plt.ylim(0)
```

![broken_barh](/images/20180622/broken_barh.png)

### ヒストグラム：hist/hist2d

**ヒストグラム** を表示します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

mu, sigma = 100, 15
x = mu + sigma * np.random.randn(100)

plt.hist(x, 50, density=True, alpha=0.75)
```

![hist](/images/20180622/hist.png)

**2次元のヒストグラム** を描画するには、 `hist2d` 関数を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

x = np.random.randn(100000)
y = np.random.randn(100000) + 5

plt.hist2d(x, y, bins=40)
```

![hist2d](/images/20180622/hist2d.png)

### 円グラフ：pie

**円グラフ** を描画します。 `autopct` （円グラフ上に値を表示する）オプションのように、グラフを修飾する多くのオプションが備わっています。

```python
from matplotlib import pyplot as plt
from matplotlib.gridspec import GridSpec

labels = 'A', 'B', 'C', 'D'
fracs = [15, 30, 45, 10]

plt.pie(fracs, labels=labels, autopct='%1.1f%%')
plt.show()
```

![pie](/images/20180622/pie.png)

### 散布図：scatter

**散布図** を描画します。 マーカーの大きさはオプション指定で変更しています。

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

![scatter](/images/20180622/scatter.png)

### 折れ線グラフ（積み上げ折れ線グラフ）：plot/stackplot/plot_date

**折り線グラフ** は `plot` で描画できます。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

x = np.random.rand(100)

plt.plot(x)
plt.show()
```

![plot](/images/20180622/plot.png)

**積み上げの折れ線グラフ** を描画するには `stackplot` 関数を使います。

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

![stackplot](/images/20180622/stackplot.png)

また、 **x軸が日付データの場合の折れ線グラフ** には `plot_date` 関数を用いることが可能です。

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

![plot_date](/images/20180622/plot_date.png)


### 箱ひげ図：boxplot

**箱ひげ図** （最小値、第1四分位点、中央値、第3四分位点、最大値）を描画します。

```python
import numpy as np
from matplotlib import pyplot as plt
import random

a = np.array([1, 3, 0.25, 0.44, 5.88])
plt.boxplot(a)
```

![boxplot](/images/20180622/boxplot.png)

### バイオリン図：violinplot

**バイオリン図** （箱ひげ図に確率密度表示を加えたもの）を描画します。

```python
import pandas as pd
import numpy as  np
from matplotlib import pyplot as plt

fs = 10
pos = [1, 2, 4, 5, 7, 8]
data = [np.random.normal(0, std, size=100) for std in pos]

plt.violinplot(data, pos, points=20, widths=0.3, showmeans=True, showextrema=True, showmedians=True)
plt.show()
```

![violinplot](/images/20180622/violinplot.png)

### 等高線・水平曲線：contour/contourf

**等高線** （同じ高さの値の集まり）を描画します。
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

![contour](/images/20180622/contour.png)

**等高線の塗りつぶし** には `contourf` を使います。

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

![contourf](/images/20180622/contourf.png)

### 非構造三次元データ：tricontour/tricontourf

**非構造三次元データ** を扱う場合には `tricontour` 、 `tricontourf` を使います。

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

![tricontour](/images/20180622/tricontour.png)

### 極座標：polar

**極座標** の円状グラフを描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

r = np.arange(0, 2, 0.01)
theta = 2 * np.pi * r

plt.polar(theta, r)
plt.show()
```

![polar](/images/20180622/polar.png)

### 対数：loglog/semilogx/semilogy

対数を描画します。 **両対数** の場合には `loglog` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

t = np.arange(0.01, 20.0, 0.01)
plt.loglog(t, 20 * np.exp( -t / 10.0), basex=2)
plt.grid(True)
plt.title('loglog base 2 on x')
plt.show()
```

![loglog](/images/20180622/loglog.png)

**x軸を10を底とする対数スケールでの片対数** を描画する場合には `semilogx` を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0.01, 20.0, 0.01)

plt.semilogx(t, np.sin(2*np.pi*t))
plt.grid(True)
```

![semilogx](/images/20180622/semilogx.png)

**y軸を10を底とする対数スケールでの片対数** を描画する場合には `semilogy` を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

t = np.arange(0.01, 20.0, 0.01)

plt.semilogy(t, np.exp(-t/5.0))
plt.grid(True)
```

![semilogy](/images/20180622/semilogy.png)

### 行列：matshow

**行列データ** を描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

np.random.seed(0)

mat = np.random.rand(10,10)
plt.matshow(mat)

plt.show()
```

![matshow](/images/20180622/matshow.png)

### スパース行列：spy

**スパース行列（疎行列）** を描画します。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.random.randn(20, 20)
x[5] = 0.
x[:, 12] = 0.

plt.spy(x, markersize=3)
```

![spy](/images/20180622/spy.png)

### コヒーレンス：cohere

**コヒーレンス（波の可干渉性）** を描画することができます。

```python
import numpy as np
import matplotlib.pyplot as plt

n = 1024
x = np.random.randn(n)
y = np.random.randn(n)

plt.cohere(x, y, NFFT=128)
plt.figure()
```

![cohere](/images/20180622/cohere.png)

### 離散データ：stem

**x軸から伸びるシーケンスとしてyの値** を描画したい場合に使います。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.linspace(0.1, 2 * np.pi, 10)
plt.stem(x, np.cos(x), '-.')

plt.show()
```

![stem](/images/20180622/stem.png)

### ステップ応答：step

**ステップ応答** を描画します。コンピュータ信号のような離散値とかを扱うときに使います。

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

![step](/images/20180622/step.png)

### 自己相関・相互相関：acorr/xcorr

`acorr` 関数で **自己相関** を描画することができます。

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.random.normal(0, 10, 50)
plt.acorr(x)
```

![acorr](/images/20180622/acorr.png)

また、**相互相関** を描画は `xcorr` になります。

```python
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(0)

x, y = np.random.randn(2, 100)
plt.xcorr(x, y, usevlines=True, maxlags=50, normed=True, lw=2)

plt.show()
```

![xcorr](/images/20180622/xcorr.png)

### 複数イベントデータ：eventplot

**複数のイベントデータ** を並行して描画する。公式から引用すると、以下のようなユースケースがあるらしいです。

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

![eventplot](/images/20180622/eventplot.png)

### 六角形で描画：hexbin

**hex** でデータを描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(1, 10, 1)
y = np.arange(1, 10, 1)

plt.hexbin(x, y, gridsize=10)
```

![hexbin](/images/20180622/hexbin.png)


### 疑似カラー描画：pcolor/pcolormesh/tripcolor

2次元配列のデータを **擬似カラー** で描画します。

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

![pcolor](/images/20180622/pcolor.png)

**メッシュデータを高速に描画したい** 場合には `pcolormesh` 関数を使うと良いそうです。

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

![pcolormesh](/images/20180622/pcolormesh.png)

**`tricontour` に対する疑似カラー描画** には `tripcolor` 関数を使います。

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

![tripcolor](/images/20180622/tripcolor.png)

### スペクトラム：magnitude_spectrum/phase_spectrum/angle_spectrum/specgram

信号の強さを表す **振幅スペクトラム** は `magnitude_spectrum` で描画します。

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

![magnitude_spectrum](/images/20180622/magnitude_spectrum.png)

**位相スペクトラム** は `phase_spectrum` で描画します。

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

![phase_spectrum](/images/20180622/pcolormesh.png)

**角度スペクトラム** は `angle_spectrum` で描画します。

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.random.normal(0, 10, 50)
plt.angle_spectrum(x)
```

![angle_spectrum](/images/20180622/angle_spectrum.png)

**スペクトログラム** は `specgram` になります。

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

![specgram](/images/20180622/specgram.png)

### スペクトル密度：psd/csd

**パワースペクトル密度** は `psd` で描画します。

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

![psd](/images/20180622/psd.png)

**クロススペクトル密度** は `csd` で描画します。

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

![csd](/images/20180622/csd.png)

### ベクトル：quiver/quiverkey

**ベクトル** を描画します。また、 `quiverkey` 関数を使うことで、**ベクトルのキー** も描画することができます。

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

![quiver](/images/20180622/quiver.png)

### 流線グラフ：streamplot

**流線** を描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

Y, X = np.mgrid[-3:3:100j, -3:3:100j]
U = -1 - X**2 + Y
V = 1 + X - Y**2
speed = np.sqrt(U*U + V*V)

plt.streamplot(X, Y, U, V, color=U, linewidth=2, cmap=plt.cm.autumn)
```

![streamplot](/images/20180622/streamplot.png)

## グラフに付加情報を加える

グラフに付加情報を加えることで、プロットされたデータの理解を補助することができます。
以下ではグラフに付加情報を加える関数を調べてみました。

### グラフのタイトル：title/suptitle

グラフに **タイトルをつける** には `title` 関数を使います。
**複数グラフにタイトルをつける** には `suptitle` 関数を使います。

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

![title](/images/20180622/title.png)

### 凡例の追加：legend/colorbar

**グラフデータの凡例** を追加します。

```python
from matplotlib import pyplot as plt
import numpy as np

x_data = (1, 2, 3)
y_data = (.5, 1.5 , .8)

plt.bar(x_data, y_data)
plt.legend(['dataA'])
```

![legend](/images/20180622/legend.png)

等高線（`contour`）に対する、 **色が表す値の凡例** は `colorbar` 関数で表示します。

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

![colorbar](/images/20180622/colorbar.png)

### ラベルの表示：xlabel/ylabel/clabel

グラフの軸に **ラベル** を表示します。

```python
from matplotlib import pyplot as plt
import numpy as np
import matplotlib

np.random.seed(0)

x = np.arange(0.0, 50.0, 2.0)
y = x ** 1.3 + np.random.rand(*x.shape) * 30.0
s = np.random.rand(*x.shape) * 800 + 500

plt.scatter(x, y, s, c="g", alpha=0.5, label="Luck")
plt.xlabel("Label X")
plt.ylabel("Label Y")
plt.show()
```

![xlabel](/images/20180622/xlabel.png)

等高線（`contour`）に対しては `clabel` 関数で **色が表す値のラベル** を表示します。

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

![clabel](/images/20180622/clabel.png)

### 軸の描画範囲を制限：xlim/ylim

デフォルトだとデータの範囲に合わせてx軸/y軸の範囲が決まりますが、 **軸の値の範囲** を変更できます。

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.linspace(-np.pi, np.pi, 100)

plt.xlim(-2, 2)
plt.ylim(-0.75, 0.75)

plt.plot(x, np.sin(x),label="y = sinx")
plt.show()
```

![xlim](/images/20180622/xlim.png)

### 軸のスケールの変更：xscale/yscale

**軸のスケール** を変更します。`linear` `log` `logit` `symlog` を指定でき、対数をとった描画等ができます。

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.linspace(-np.pi, np.pi, 100)

plt.xscale('symlog')

plt.plot(x, np.sin(x))
plt.show()
```

![xscale](/images/20180622/xscale.png)

```python
import numpy as np
from matplotlib import pyplot as plt

x = np.linspace(-np.pi, np.pi, 100)

plt.yscale('log')

plt.plot(x, np.sin(x))
plt.show()
```

![yscale](/images/20180622/yscale.png)


### 目盛りの変更：xticks/yticks

**目盛り** をカスタマイズするには `xticks` `yticks` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.arange(4)
y = [10, 20, 30, 40]

plt.bar(x, y)
plt.xticks(x, ('A', 'B', 'C', 'D'))
plt.show()
```

![xticks](/images/20180622/xticks.png)

```python
from matplotlib import pyplot as plt
import numpy as np

x = np.arange(4)
y = [10, 20, 30, 40]

plt.bar(x, y)
plt.yticks(y, ('10', '20', '30', '40'))
plt.show()
```

![yticks](/images/20180622/yticks.png)

### 表（テーブル）の表示：table

描画データの **表（テーブル）** を表示します。
パッと見た感じ、表単体で描画するのはできなそうでした。

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

![table](/images/20180622/table.png)

### 軸に対する描画データの追加：twinx/twiny

同一の軸に対して別のデータを描画します。
**x軸はそのままに、別のyの値を描画する** には `twinx` 関数を使います。

```python
import numpy as np
from matplotlib import pyplot as plt

fig, ax1 = plt.subplots()
t = np.arange(0.01, 10.0, 0.01)
s1 = np.exp(t)
ax1.plot(t, s1, 'b-')
ax1.set_xlabel('time (s)')
ax1.set_ylabel('exp', color='b')
ax1.tick_params('y', colors='b')

ax2 = ax1.twinx()
s2 = np.sin(2 * np.pi * t)
ax2.plot(t, s2, 'r.')
ax2.set_ylabel('sin', color='r')
ax2.tick_params('y', colors='r')

plt.show()
```

![twinx](/images/20180622/twinx.png)


**y軸はそのままに、別のxの値を描画する** には `twiny` 関数を使います。

```python
import numpy as np
from matplotlib import pyplot as plt

fig, ax1 = plt.subplots()
t = np.arange(0.01, 10.0, 0.01)
s1 = np.exp(t)
ax1.plot(t, s1, 'b-')
ax1.set_xlabel('time (s)')
ax1.set_ylabel('exp', color='b')
ax1.tick_params('y', colors='b')

ax2 = ax1.twiny()
t2 = np.arange(10.01, 20.0, 0.01)
s2 = np.exp(t2)
ax2.plot(t2, s2, 'r.')
ax2.set_xlabel('sin', color='r')
ax2.tick_params('y', colors='r')

plt.show()
```

![twiny](/images/20180622/twiny.png)

### 注釈の追加：annotate

**注釈を追加** します。特定のデータポイントを指し示すときに使います。

`xycoords` オプションによって、`xy` や `xytext` の振る舞いが変わる点に注意が必要です。

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

![annotate](/images/20180622/annotate.png)

### 矢印（直線）の追加：arrow

**矢印を描画** します。 `head_width` `head_length` オプションを記入しないとただの直線として描画されます。

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

![arrow](/images/20180622/arrow.png)

### 平行・垂直の線を引く：axhline/axvline/hlines/vlines

`axhline` 関数は **x軸に対する平行線** を引きます。
また、 `xmin` `xmax` オプションで、直線を引く区間を指定できるのが便利です。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

plt.axhline(y=.5, xmin=0.25, xmax=0.75)
plt.show()
```

![axhline](/images/20180622/axhline.png)

同様に **x軸に対する平行線を複数引く** には `hlines` 関数が便利です。
指定された `xmin` や `xmax` は複数の線全てに適用されます。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

xmin = 1
xmax =  10

plt.hlines([-1, 1], xmin, xmax)
plt.show()
```

![hlines](/images/20180622/hlines.png)

`axvline`関数は **x軸に対する垂直の線** を引くことが出来ます。オプションの概念は `axhline` と同様です。

```python
import numpy as np
import matplotlib.pyplot as plt

fig = plt.figure()
ax = fig.add_subplot(111)

plt.axvline(x=.5, ymin=0.25, ymax=0.75, color='r', linewidth=4)
plt.show()
```

![axvline](/images/20180622/axvline.png)

同様に **x軸に対する垂直の線を複数引く** には `vlines` 関数が便利です。
指定された `ymin` や `xmax` は複数の線全てに適用されます。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

ymin = 1
ymax =  10

plt.vlines([-1, 1], ymin, ymax)
plt.show()
```

![vlines](/images/20180622/vlines.png)

### 矩形の描画：axhspan/axvspan

`axhspan` 関数では **x軸と平行の矩形（四角形）** を描画することができます。
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

![axhspan](/images/20180622/axhspan.png)

`axvspan` 関数では **y軸と平行の矩形（四角形）** を描画することができます。
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

![axvspan](/images/20180622/axvspan.png)

### 誤差の表示：errorbar

**データの誤差** を棒で表します。
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

![errorbar](/images/20180622/errorbar.png)

### テキストの追加：text/figtext

`text` 関数はグラフ上に **テキストを追加** します。 オプション指定で修飾することもできます。

描画位置の指定は座標系に対して行います。

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

![text](/images/20180622/text.png)

同様に **テキストを追加する** 関数で `figtext` が存在します。

描画位置の指定は図に対する相対位置であることに注意が必要です。（座標に依存しません）

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

![figtext](/images/20180622/figtext.png)

### 範囲の塗りつぶし：fill/fill_between/fill_betweenx

グラフ上の **範囲を色で塗りつぶして** 描画します。
`fill` ではy=0との間の色が塗りつぶされます。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(0.0, 2, 0.01)
y = np.sin(2*np.pi*x)

#0〜y or y〜0の間を塗りつぶす
plt.fill(x, y)
```

![fill](/images/20180622/fill.png)

**塗りつぶし範囲のyを指定する** には `fill_between` 関数を使用します。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(0.0, 2, 0.01)
y1 = np.sin(2*np.pi*x)
y2 = 0.5

#y1〜y2の間を塗りつぶす
plt.fill_between(x, y1, y2)
```

![fill_between](/images/20180622/fill_between.png)

**x軸に対して塗りつぶし範囲を指定する** には `fill_betweenx` 関数を使います。

```python
import numpy as np
import matplotlib.pyplot as plt

y = np.arange(0.0, 2, 0.01)
x1 = np.sin(2*np.pi*x)
x2 = 0.5

#x1〜x2の範囲を塗りつぶす
plt.fill_betweenx(y, x1, x2)
```

![fill_betweenx](/images/20180622/fill_betweenx.png)

### 風向きの追加：barbs

**天気図で使う風向きとその強さ** を表す記号を描画します。

```python
import numpy as np
import matplotlib.pyplot as plt

x =  (1, 2, 3, 4, 5)
y = (1, 2, 3, 4, 5)
u = (10,20,-30,40,-50)
v = (10,20,30,40,50)

plt.barbs(x, y, u, v)
```

![barbs](/images/20180622/barbs.png)

## グラフのレイアウトを修正する

図を見やすくするために、グラフのレイアウトを微調整します。

### グラフの位置変更：axes

**グラフの位置を変更** します。 **複数のグラフを重ね合わせる** ときなどに使用します。

```python
import matplotlib.pyplot as plt
import numpy as np

x = np.random.normal(0, 10, 50)
plt.acorr(x)

# 引数は図を描画する位置の [left, bottom, width, height]を表す
plt.axes([.65, .6, .2, .2], facecolor='k')
plt.angle_spectrum(x)
```

![axes](/images/20180622/axes.png)

### 外枠の表示/非表示：box

グラフの **枠の表示/非表示** を設定します。デフォルトではTrue（表示する）です。

```python
import numpy as np
from matplotlib import pyplot as plt

x =  np.arange(5)
y = (1, 2, 3, 4, 5)
width = 0.3

plt.barh(x, y, width, align='center')
plt.box(False)
```

![box](/images/20180622/box.png)

### グリッド（格子）の表示：grid/rgrids/thetagrids/triplot

グラフ内に **グリッドを表示** します。

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0)

mu, sigma = 100, 15
x = mu + sigma * np.random.randn(100)

plt.hist(x, 50, density=True, alpha=0.75)
plt.grid(linestyle='-', linewidth=1)
```

![grid](/images/20180622/grid.png)

**極座標グラフ（polar）にグリッドを表示** するには `rgrids` 関数を使います。

```python
from matplotlib import pyplot as plt
import numpy as np

plt.polar()
plt.rgrids((0.25, 0.5, 1.0))
plt.show()
```

![rgrids](/images/20180622/rgrids.png)

`rgrids` の代わりに `thetagrids` 関数で、**グリッドとラベルを一緒に設定** することも可能です。

```python
from matplotlib import pyplot as plt
import numpy as np

plt.polar()
plt.thetagrids(range(45,360,90), ('NE', 'NW', 'SW','SE'))
plt.show()
```

![thetagrids](/images/20180622/thetagrids.png)

**非構造三次元データ （tricontour） にグリッドを表示** するには `triplot` 関数を使います。

```python
import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import numpy as np

x = np.asarray([0, 1, 2, 3, 0.5, 1.5, 2.5, 1, 2, 1.5])
y = np.asarray([0, 0, 0, 0, 1.0, 1.0, 1.0, 2, 2, 3.0])
triangles = [[0, 1, 4], [1, 2, 5], [2, 3, 6], [1, 5, 4], [2, 6, 5], [4, 5, 7],
             [5, 6, 8], [5, 8, 7], [7, 8, 9]]
triang = mtri.Triangulation(x, y, triangles)
z = np.cos(1.5 * x) * np.cos(1.5 * y)

plt.tricontourf(triang, z)
plt.triplot(triang, 'ko-')
plt.show()
```

![triplot](/images/20180622/triplot.png)

### 目盛りの分割数を変更：locator_params

指定軸の **目盛りの分割数** を指定できます。
`nbins` オプションは2の乗数で指定するといい感じにスケールしてくれます。
指定された数字通りに分割してくれるときとそうでないときがあり。

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

![locator_params](/images/20180622/locator_params.png)

### マージンの追加：margins/subplots_adjust

図内の点に対してマージンをとって、データを見やすい位置に調整します。

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [1, 4, 9, 6]

plt.plot(x, y, 'o')
plt.margins(0.3)
plt.show()
```

![margins](/images/20180622/margins.png)

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

![subplots_adjust](/images/20180622/subplots_adjust.png)

### レイアウトの自動調整：tight_layout

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

![tight_layout](/images/20180622/tight_layout.png)

### 複数グラフの描画:subplots

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

![subplots](/images/20180622/subplots.png)

### テイストを手書き風に変更：xkcd

グラフを手書き風にできます。

```python
import numpy as np
from matplotlib import pyplot as plt

plt.xkcd()

x = np.linspace(-np.pi, np.pi, 100)
plt.plot(x, np.sin(x),label="y = sinx")
plt.show()
```

![xkcd](/images/20180622/xkcd.png)

## まとめ

matplotlibのAPI一覧からいろいろ試してみました。

API名からは用途のイメージがわかないものもあり、試してみて「へぇ、こんなのあるんだ」というのも多かったです。
また、指定オプションも多く組み込まれているので、一つのAPIでもデータの表現方法に幅が出ます。

通常利用する分には概ねの十分な範囲をカバーできていると考えています。

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
