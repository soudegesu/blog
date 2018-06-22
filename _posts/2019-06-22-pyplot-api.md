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

### 矢印を書き加える：arrow

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

## グラフのレイアウトを修正する


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
