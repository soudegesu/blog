---
title: "Amazon Linux2にdockerをインストールする"
description: "AMIをAmazon Linux2に変更したのですが、yum install docker でdockerがインストールできなくなってしまったので対処方法を調査しました。"
date: 2018-07-10
thumbnail: /images/icons/ec2_icon.png
categories:
  - aws
tags:
  - aws
  - ec2
  - amazonlinux
  - docker
url: /aws/amazonlinux2-docker/
twitter_card_image: /images/icons/ec2_icon.png
---

AMIをAmazon Linux2に変更したのですが、 `yum install docker` でdockerがインストールできなくなってしまったので対処方法を調査しました。

## モチベーション

### Amazon Linux2にDockerがインストールできなくなっている！

Amazon LinuxからAmazon Linux2にアップデートしたのですが、
2018/06に [Amazon Linux 2 LTS Candidate](https://aws.amazon.com/jp/amazon-linux-2/) が発表されたあたりから、
packerのジョブがエラーで止まるようになってしまいました。

内容を確認してみると、Ansible の `yum install docker` の部分で落ちていることがわかりました。

詳細は確認していませんが、yumの設定が変わったのかもしれません。

`yum search docker` をしても docker が見つかりませんでした。

## Extras Library で docker をインストールする

調査をしたところ、案外簡単に答えが見つかりました。

Amazon Linux2から [Extras Library](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/amazon-linux-ami-basics.html#extras-library) が導入され、
一部のライブラリは Extras Library 経由にてインストールができるようになっているようです。

どのようなライブラリがインストールできるか確認してみましょう。

{{< highlight bash "linenos=inline" >}}
amazon-linux-extras list

  0  ansible2                 available  [ =2.4.2 ]
  1  emacs                    available  [ =25.3 ]
  2  memcached1.5             available  [ =1.5.1 ]
  3  nginx1.12                available  [ =1.12.2 ]
  4  postgresql9.6            available  [ =9.6.6  =9.6.8 ]
  5  python3                  available  [ =3.6.2 ]
  6  redis4.0                 available  [ =4.0.5 ]
  7  R3.4                     available  [ =3.4.3 ]
  8  rust1                    available  [ =1.22.1  =1.26.0 ]
  9  vim                      available  [ =8.0 ]
 10  golang1.9                available  [ =1.9.2 ]
 11  ruby2.4                  available  [ =2.4.2  =2.4.4 ]
 12  nano                     available  [ =2.9.1 ]
 13  php7.2                   available  [ =7.2.0  =7.2.4  =7.2.5 ]
 14  lamp-mariadb10.2-php7.2  available  \
        [ =10.2.10_7.2.0  =10.2.10_7.2.4  =10.2.10_7.2.5 ]
 15  libreoffice              available  [ =5.0.6.2_15 ]
 16  gimp                     available  [ =2.8.22 ]
 17  docker                   available  [ =17.12.1  =18.03.1 ]
 18  mate-desktop1.x          available  [ =1.19.0  =1.20.0 ]
 19  GraphicsMagick1.3        available  [ =1.3.29 ]
 20  tomcat8.5                available  [ =8.5.31 ]
{{< / highlight >}}

`docker` が含まれていますね。

早速インストールを試してみましょう。

{{< highlight bash "linenos=inline" >}}
amazon-linux-extras install docker

(中略)

インストール:
  docker.x86_64 0:18.03.1ce-3.amzn2

依存性関連をインストールしました:
  libtool-ltdl.x86_64 0:2.4.2-22.2.amzn2.0.1

完了しました!
  0  ansible2                 available  [ =2.4.2 ]
  1  emacs                    available  [ =25.3 ]
  2  memcached1.5             available  [ =1.5.1 ]
  3  nginx1.12                available  [ =1.12.2 ]
  4  postgresql9.6            available  [ =9.6.6  =9.6.8 ]
  5  python3                  available  [ =3.6.2 ]
  6  redis4.0                 available  [ =4.0.5 ]
  7  R3.4                     available  [ =3.4.3 ]
  8  rust1                    available  [ =1.22.1  =1.26.0 ]
  9  vim                      available  [ =8.0 ]
 10  golang1.9                available  [ =1.9.2 ]
 11  ruby2.4                  available  [ =2.4.2  =2.4.4 ]
 12  nano                     available  [ =2.9.1 ]
 13  php7.2                   available  [ =7.2.0  =7.2.4  =7.2.5 ]
 14  lamp-mariadb10.2-php7.2  available  \
        [ =10.2.10_7.2.0  =10.2.10_7.2.4  =10.2.10_7.2.5 ]
 15  libreoffice              available  [ =5.0.6.2_15 ]
 16  gimp                     available  [ =2.8.22 ]
 17  docker=latest            enabled    [ =17.12.1  =18.03.1 ]
 18  mate-desktop1.x          available  [ =1.19.0  =1.20.0 ]
 19  GraphicsMagick1.3        available  [ =1.3.29 ]
 20  tomcat8.5                available  [ =8.5.31 ]
{{< / highlight >}}

実運用の際にはバージョン固定や `-y` オプションを入れたりします。

{{< highlight bash "linenos=inline" >}}
amazon-linux-extras install -y docker=18.03.1
{{< / highlight >}}

Extras Library に関する説明は [クラスメソッドさんがまとめてくれている](https://dev.classmethod.jp/cloud/aws/how-to-work-with-amazon-linux2-amazon-linux-extras/) ので、こちらを参考にすると良いでしょう。


## 参考にさせていただいたサイト

* [Extras Library](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/amazon-linux-ami-basics.html#extras-library)
* [Amazon Linux 2のExtras Library(amazon-linux-extras)を使ってみた](https://dev.classmethod.jp/cloud/aws/how-to-work-with-amazon-linux2-amazon-linux-extras/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
