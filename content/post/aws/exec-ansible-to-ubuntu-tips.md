---
title: "Ubuntu 18に対してPacker + Ansibleを実行すると/usr/bin/pythonが見つからない問題への対処"
description: "Ubuntu 18に対してPackerでAMIを作成しようとAnsibleでプロビジョニングするときに表示される　/usr/bin/python が存在しないエラーへの対処法を紹介します"
date: "2019-06-28T07:35:02+09:00"
thumbnail: /images/icons/packer_icon.png
categories:
    - aws
tags:
    - aws
    - packer
    - ansible
isCJKLanguage: true
twitter_card_image: /images/icons/packer_icon.png
---

今までCentOSや派生のAmazonLinux2を使うことが多かったです。AMIをコード化するにあたり [Packer](https://www.packer.io/) やプロビジョナーの [Ansible](https://www.ansible.com/) もそれらのOSに対応するよう書いていたのですが、Ubuntuに適用した時に従来の書き方だとエラーになってしまったので、その備忘録として残しておきます。

<!--adsense-->

## Ubuntu 18へAnsibleを実行するとPythonが見つからない問題

まさにこれに尽きるのですが、Packerのテンプレートファイルで `ansible` プロビジョナーを使う設定を以下にように書いたとします。

{{< highlight json "linenos=inline" >}}
"provisioners": [
  {
    "type": "ansible",
    "playbook_file": "ansible/playbook-{{user `provision_target`}}.yml",
    "ssh_host_key_file": "{{user `aws_key_file`}}",
    "user": "ec2-user",
    "ansible_env_vars": [
      "ANSIBLE_HOST_KEY_CHECKING=False"
    ]
  }
]
{{</ highlight >}}

これはCentOS7以前やAmazomLinux2以前では問題なくプロビジョニングが開始されました。
しかし、Ubuntuに対して実行した際には以下のエラーが表示されました。

{{< highlight bash "linenos=inline" >}}
/usr/bin/python: No such file or directory
{{</ highlight >}}

そのまんまですが、`/usr/bin/python` が見当たらないと申しております。

<!--adsense-->

## /usr/bin/python3を使うように指定する

実は最近のUbuntuでは `/usr/bin/python3` がデフォルトでインストールされており、 `/usr/bin/python` が存在しません。
Ansibleはデフォルトで `/usr/bin/python` を使いにいくのでエラーになってしまうのです。

そのため、Ansibleの `--extra-vars` オプションを使います。 `ansible_python_interpreter=/usr/bin/python3` と指定することにより
Ansible実行時に使うPythonのパスを切り替えることができるのです。

{{< highlight json "linenos=inline,hl_lines=10-13" >}}
"provisioners": [
  {
    "type": "ansible",
    "playbook_file": "ansible/playbook-{{user `provision_target`}}.yml",
    "ssh_host_key_file": "{{user `aws_key_file`}}",
    "user": "{{user `aws_ssh_user`}}",
    "ansible_env_vars": [
      "ANSIBLE_HOST_KEY_CHECKING=False"
    ],
    "extra_arguments": [
      "--extra-vars",
      "ansible_python_interpreter=/usr/bin/python3"
    ]
  }
]
{{</ highlight >}}

<div style="text-align: center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4295003271&linkId=3f5e3d94cfcde23bb3e20d26916569ec"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4873117658&linkId=8013f3d0aed6442a1cb1c8bfbebc2cb9"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4798155128&linkId=4ff34bcebac1cb9f6cd27b2361bc3884"></iframe>
</div>
