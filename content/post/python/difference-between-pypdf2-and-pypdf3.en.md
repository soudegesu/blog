---
title: "Use PyPDF2 - which PyPDF 2 or PyPDF 3 should be used?"
description: ""
date: "2018-12-03T10:19:07+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pdf"
  - "pypdf2"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Introduction

In previous article, we can extract text on a PDF file using [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).

* [Use PyPDF2 - open PDF file or encrypted PDF file](/en/post/python/open-pdf-with-pypdf2/)
* [Use PyPDF2 - extract text data from PDF file](/en/post/python/extract-text-from-pdf-with-pypdf2/)

I will introduce [PyPDF3](https://github.com/mstamy2/PyPDF3) in this article.

<!--adsense-->

## PyPDF2 and PyPDF3 exist

When I looked for various usage of [PyPDF2](https://pythonhosted.org/PyPDF2/index.html), I found the follwing [StackOverflow commnet](https://stackoverflow.com/questions/50751267/only-algorithm-code-1-and-2-are-supported).

![stack_overflow](/images/20181203/stack_overflow.png)

The [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) has been stopped since 3 years ago?! And, new version [PyPDF3](https://github.com/mstamy2/PyPDF3) exists?! Really?

**Which should I use PyPDF2 or PyPDF3 ??**

### Check the PyPI

Does [PyPDF3](https://github.com/mstamy2/PyPDF3) exist on PyPI? Check with `pip` command.

This is [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).

{{< highlight bash "linenos=inline" >}}
pip search PyPDF2
> PyPDF2 (1.26.0)   - PDF toolkit
{{< / highlight >}}

This is [PyPDF3](https://github.com/mstamy2/PyPDF3).

{{< highlight bash "linenos=inline" >}}
pip search PyPDF3
> PyPDF3 (1.0.1)  - Pure Python PDF toolkit
{{< / highlight >}}

Both are present!!

<!--adsense-->

## What is PyPDF3??

[PyPDF3](https://github.com/mstamy2/PyPDF3) のGithubのページに記載された [Roadmap](https://github.com/mstamy2/PyPDF3/wiki/Roadmap) 、[先程のStackOverflowのコメント](https://stackoverflow.com/questions/50751267/only-algorithm-code-1-and-2-are-supported) や他の調査結果も踏まえて自分の理解をまとめます。

### What happed to PyPDF3?

3年程前から [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) の更新が止まってしまったため、有志が [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を forkして　[PyPDF3](https://github.com/mstamy2/PyPDF3) プロジェクトを始めた。

### PyPDF3の機能

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) が抱えていた **パフォーマンスの問題** や **多くの不具合** 、 加えて、 **不足している機能** や **既存機能の改善** を [PyPDF3](https://github.com/mstamy2/PyPDF3) では解決する予定、とのこと。

### ただし開発は活発ではない

一方で、[PyPDF3](https://github.com/mstamy2/PyPDF3) のコミットログを見ても、あまり開発は進んでいないように伺えます。
[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) と比較して、GithubのStarの数も少ないですし。
これは一体どういうことだ。。

<!--adsense-->

## 解決：PyPDF2のissueにすべてはあった

その後、更に調査を進めていくと一本のissueにたどり着いた。

* [Rebooting PyPDF2 Maintenance #385](https://github.com/mstamy2/PyPDF2/issues/385)

![reboot_pypdf2](/images/20181203/reboot_pypdf2.png)

サマリー部分を要約すると下記のような感じです。

* 忙しくて全くメンテナンスできていなかった
* 気づかないうちに、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) がめちゃめちゃ人気が出ていたので、改めて活動を再開しようと思う
* しかし、手がまわらないので、誰か collaborator になってくれないか？

また、issueの中のディスカッションで、[PyPDF3](https://github.com/mstamy2/PyPDF3) についても触れられており、
2018/12現在においては **[PyPDF3](https://github.com/mstamy2/PyPDF3) 自体の立ち位置や今後の進め方を検討中** というステータスのようでした。

他のissueやpull requestも確認しましたが、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) は活発に開発が再開されているようでした。

## まとめ

[PyPDF3](https://github.com/mstamy2/PyPDF3) と [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) のどちらを使えば良いのか、という今回のテーマについては、

**[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使えば良い**

が結論になりました。

ただし、「[PyPDF3](https://github.com/mstamy2/PyPDF3) を今後どうように進めるか」の議論は未決着なので、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を使うタイミングで、[Rebooting PyPDF2 Maintenance #385](https://github.com/mstamy2/PyPDF2/issues/385) の流れを確認しておくと安全でしょう。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=c147d28e189fdaae2d03d9fa71dd1ea2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=fffb54546b0abb4066b8c70034e45cee&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=479738946X&linkId=a0f1182a7478439bc70e51d189ec3179&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
