---
title: "jibを使ってJavaアプリケーションのDockerイメージをビルドする"
description: ""
date: 2018-07-17 00:00:00 +0900
categories: java
tags: docker gradle
---

実案件でもJavaアプリケーションをDockerコンテナ上で稼働させる事例もかなり増えていますね。
今回は `Jib` を使ったDockerfileイメージのビルドを紹介します。

![jib]({{site.baseurl}}/assets/images/20180717/jib.png)

* Table Of Contents
{:toc}


## モチベーション

### アプリケーションのビルドとDockerイメージのビルドをいい感じに統合したい

おそらく、これに尽きると思います。

**最終的な実行可能なDockerイメージを作成するために、ビルド定義を複数管理する** というのはまどろっこしいです。

Javaアプリケーションの場合、RubyやPythonなどのスクリプト言語と異なり、アプリケーションのビルドという工程が発生します。

加えて、Dockerfile内で `COPY` コマンドを定義し、ビルド成果物をコンテナ内にコピーすることで、ようやくDockerイメージを作成できるわけです。

ビルドにおける一連の流れを、列挙すると以下のようになります。

1. 依存モジュールの解決とインストール
2. アプリケーションのビルド
3. Dockerイメージのビルド

`3` がDockerfileに定義を記載する処理なので、この部分をGradleやMavenの定義ファイルに移動できれば、管理対象ファイルを減らすことができます。

## やってみる



## 参考にさせていただいたサイト

* [Extras Library](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/amazon-linux-ami-basics.html#extras-library)
* [Amazon Linux 2のExtras Library(amazon-linux-extras)を使ってみた](https://dev.classmethod.jp/cloud/aws/how-to-work-with-amazon-linux2-amazon-linux-extras/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117763&linkId=79c46472dbb03ff135ffc54e14dbc065&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B0191B5FE4&linkId=f8b67e42a31b772b2c59912c2eb6d869&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155373&linkId=769a9339f83ab25e7baa1540833975b8&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798136433&linkId=17aac70d0b700057a0ce1b0c64de44f7&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
