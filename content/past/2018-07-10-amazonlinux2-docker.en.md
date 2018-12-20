---
title: "Install Docker to Amazon Linux2"
description: "Migration of Amazon Linux to Amazon Linux 2 causes yum install docker command doesn't work in Amazon Linux 2, so I investigate how to install docker"
date: 2018-07-10
thumbnail: /images/icons/ec2_icon.png
categories:
  - aws
tags:
  - aws
  - ec2
  - amazonlinux
  - docker
url: /en/aws/amazonlinux2-docker/
twitter_card_image: /images/icons/ec2_icon.png
---

Migration of Amazon Linux to Amazon Linux 2 causes `yum install docker` command doesn't work in Amazon Linux 2, so I investigate how to install docker.

<!--adsense-->

## Motivation

### Install Docker to Amazon Linux2 without error

My [Packer](https://www.packer.io/) build job stopped with error after AWS announced [Amazon Linux 2 LTS Candidate](https://aws.amazon.com/jp/amazon-linux-2/) in June 2018, because I migrated my server os Amazon Linux to Amazon Linux2.

Fail to execute `yum install docker` and `yum search docker` command because yum repository has been changed.

## Install Docker with Extras Library

In Amazon Linux2, [Extras Library](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/amazon-linux-ami-basics.html#extras-library) is adopted to
install some libraries.

Now list the libraries that can be installed.

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

Docker exists in it.

Install Docker with `amazon-linux-extras` command.

{{< highlight bash "linenos=inline" >}}
amazon-linux-extras install docker

...

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

Actually,  install fixed version with `docker=x.x.x` and skip confirmation with -y option.

{{< highlight bash "linenos=inline" >}}
amazon-linux-extras install -y docker=18.03.1
{{< / highlight >}}

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1521822808&asins=1521822808&linkId=55c38198098bf2f719450b7160f12fe0&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1492036730&asins=1492036730&linkId=d51193aa2c1ce435460f0859e99b822e&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1633430235&asins=1633430235&linkId=2c7d89023dd8a04aa1e4f34b0955126d&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>        
</div>
