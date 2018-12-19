---
title: "PDFをPython（PyPDF2）で操作する -  PyPDF2とPyPDF3のどちらを使うと良いのか"
description: "PyPDF2を調査する過程でPyPDF3という別のモジュールを見つけました。PyPDF2とPyPDF3のどちらを使うのが良いのでしょうか。モジュールの発足の経緯とディスカッションを調査しました。"
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

以前に書いた以下の記事では、[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) を用いて、PDFファイルからテキスト情報を抽出するまでを行うことができました。

* [PDFをPython（PyPDF2）で操作する - PDF・暗号化PDFファイルの読み込み](/post/python/open-pdf-with-pypdf2/)
* [PDFをPython（PyPDF2）で操作する - PDFからテキストを抽出する](/post/python/extract-text-from-pdf-with-pypdf2/)

今回は少し毛色が違いますが、[PyPDF3](https://github.com/mstamy2/PyPDF3) について触れたいと思います。

<!--adsense-->

## PyPDF2 と PyPDF3 が存在する問題

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) の調査を進めていく過程で、[とあるStackOverflowのコメント](https://stackoverflow.com/questions/50751267/only-algorithm-code-1-and-2-are-supported) に目を奪われました。

![stack_overflow](/images/20181203/stack_overflow.png)

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) が3年前に死んでいる。。だと！？
そして、[PyPDF3](https://github.com/mstamy2/PyPDF3) なる、新たなバージョンが存在しているのか。。？

**我々はどちらを使うのが正しいのであろうか** 

### `pip` で確認してみる

本当に [PyPDF3](https://github.com/mstamy2/PyPDF3) は存在するのか。 
`pip` コマンドでモジュールをインストールできなければ、そもそも検討の俎上にも上がらないであろう。

こちらは [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) 。

{{< highlight bash "linenos=inline" >}}
pip search PyPDF2
> PyPDF2 (1.26.0)   - PDF toolkit
{{< / highlight >}}

こちらは [PyPDF3](https://github.com/mstamy2/PyPDF3) 。

{{< highlight bash "linenos=inline" >}}
pip search PyPDF3
> PyPDF3 (1.0.1)  - Pure Python PDF toolkit
{{< / highlight >}}

どうやら存在するようです。なんてこったい。

<!--adsense-->

## PyPDF3 は何者なのか

[PyPDF3](https://github.com/mstamy2/PyPDF3) のGithubのページに記載された [Roadmap](https://github.com/mstamy2/PyPDF3/wiki/Roadmap) 、[先程のStackOverflowのコメント](https://stackoverflow.com/questions/50751267/only-algorithm-code-1-and-2-are-supported) や他の調査結果も踏まえて自分の理解をまとめます。

### PyPDF3 発足の経緯

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
