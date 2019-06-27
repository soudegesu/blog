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
