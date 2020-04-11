---
title: "PythonのSeleniumで特定の要素を指定して取得する"
description: "Seleniumで要素をユニークに取得したい時に使う関数を紹介します。id属性による指定、class属性による指定、CSSセレクタを使った指定、XPathを使った指定などです。"
date: "2020-01-16T08:48:46+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "selenium"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

以前の記事 [Seleniumのコードを安定して動かすためにWaitを使って要素を待つ](/post/python/selenium-wait-element/) では、
`WebDriverWait` を使って特定の条件が満たされるまで次の動作を行わない処理を書きました。

今回は様々な任意のHTML要素の指定の仕方を紹介します。

<!--adsense-->

## id属性による指定

まず最も簡単で目にする方法としてID属性による指定を紹介します。
id属性とは、HTML内でユニークな要素であることを表すときに用いられます。

ブラウザの「ソースを表示」メニューや、開発者ツールを使うことで自分の閲覧していWebページのHTMLを確認できるわけですが、
例えば以下のように、HTMLタグの中に `id=` から始まる属性のことをID属性といいます。

{{< highlight python >}}
<input id="user_name"></input>
{{< /highlight>}}

これは、Selenium Driverの `find_element_by_id` 関数を呼び出すことで要素を取得できます。

{{< highlight python >}}
user_name = driver.find_element_by_id('user_name')
{{< /highlight>}}

「HTML内でユニーク」と先ほど説明しましたが、本当にユニークな要素になるかどうかはWebページの作り手に依存します。
つまり、1つのHTML内に同一のidが複数存在させることもできてしまう、ということは頭の片隅に置いておくと良いでしょう。

<!--adsense-->

## class属性による指定

次にclass属性による指定です。先ほどのID属性とは異なり、class属性はHTML内に要素が複数存在することが前提となります。

{{< highlight python >}}
<ul>
  <li class="fruit">りんご</li>
  <li class="fruit">メロン</li>
  <li class="fruit">桃</li>
</ul>
{{< /highlight>}}

class属性を使って要素を取得したい時には、最初にヒットした要素のみを取得する **find_element_by_class_name** 関数と、
ヒットした要素全てをリストで取得できる**find_elements_by_class_name** 関数の2種類があるため注意が必要です。

{{< highlight python >}}
# 一番最初の「りんご」が返却される
fruit = driver.find_element_by_class_name('fruit')
{{< /highlight>}}

{{< highlight python >}}
# 一番最初の「りんご」「メロン」「桃」の全てがリストで返却される
fruits = driver.find_elements_by_class_name('fruit')
{{< /highlight>}}

<!--adsense-->

## name属性による指定

次にname属性による指定方法です。name属性はログイン画面やユーザ情報の編集ページ等の **ユーザ入力が発生するページ** で度々使われます。


{{< highlight python >}}
<form id="loginForm">
  <input name="user_name" type="text" />
  <input name="password" type="password" />
</form>
{{< /highlight>}}

これらもclass属性と同様、値の重複が発生する可能性があるので、 `find_element_by_name` 関数と `find_elements_by_name` 関数の2種類が存在します。

{{< highlight python >}}
username = driver.find_element_by_name('username')
password = driver.find_element_by_name('password')
{{< /highlight>}}

<!--adsense-->

## 要素の絞り込みが複雑な場合の指定方法

Seleniumで任意の要素を取得したい場合、たいていのケースでは一意な要素を取得したいケースが大半だと思います。
しかし、Webページの作成者は必ずしもSeleniumで自動化しやすいページを作ってくれているわけではありません。
複数のclass属性を指定することで初めて要素がユニークになるケースもあります。

ここでは少し複雑な指定で要素を特定する方法を紹介します。

### classの親子関係を利用して要素を取得する方法

以下で「りんご」を取得するためには、 `menu` というclass属性を持った親要素配下の `apple` class属性を指定する必要があります。
`apple` のclass指定だけでは「アップル」も取得されてしまうからです。

{{< highlight python >}}
<div class="apple">アップル</div>
<ul class="menu">
  <li class="apple">りんご</li>
  <li class="melon">メロン</li>
  <li class="peach">桃</li>
</ul>
{{< /highlight>}}

このような条件が複雑な指定方法では `find_element_by_css_selector` を使うと良いでしょう。
ここではclass属性の親子関係関係に着目して要素を絞り込みます。

{{< highlight python >}}
apple = driver.find_element_by_css_selector('.menu .apple')
{{< /highlight>}}

この `find_element_by_css_selector` のCSSセレクタとは、CSSにおいて要素を絞り込み、選択するために用いられる書き方になります。
CSSセレクタを使った書き方では、先ほどの親子関係による絞り込みや、隣接した要素の取得、リストの最初の要素など多くの指定方法があります。
そのため、CSSセレクタの書き方を覚えるとたいていのケースをカバーすることができるでしょう。

<!--adsense-->

### XPathを使って要素を取得する方法

CSSセレクタを使った書き方でも取得が難しい場合にはXPathを使った書き方を試してみると良いでしょう。
XPathはXMLやHTML内でノードの位置を特定するために使われます。
指定方法がCSSセレクタと比べて可読性が低いようにも感じますが、その分柔軟な要素の指定が可能になるので覚えておくと便利です。

{{< highlight python >}}
<body>
  <div class="apple">アップル</div>
  <ul class="menu">
    <li class="apple">りんご</li>
    <li class="melon">メロン</li>
    <li class="peach">桃</li>
  </ul>
</body>
{{< /highlight>}}

{{< highlight python >}}
apple = driver.find_element_by_xpath("//ul[@class='menu']/li[1]")
apple = driver.find_element_by_xpath("//li[@class='apple']")
{{< /highlight>}}

