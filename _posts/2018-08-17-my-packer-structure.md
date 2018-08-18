---
title: "AMI作成のPackerプロジェクトのワタシ的ベストプラクティス！"
description: "様々なプロジェクトで仕事をするにあたって、AWSのAMI（Amazon Machine Image）を多くつくるようになりました。今回はPackerプロジェクトの個人的なベストプラクティスをまとめました。"
date: 2018-08-17 00:00:00 +0900
categories: aws
tags: aws packer
header:
  teaser: /assets/images/icon/packer_icon.png
---

様々なプロジェクトで仕事をするにあたって、AWSのAMI（Amazon Machine Image）を多くつくるようになりました。
今回はPackerプロジェクトの個人的なベストプラクティスをまとめました。

* Table Of Contents
{:toc}

## 作成したリポジトリ

はじめに、作成したリポジトリを以下に晒しておきます。
* [soudegesu/my_packer_best_practice](https://github.com/soudegesu/my_packer_best_practice)

また、前提条件は以下とします。

* 作成対象はAMI（Amazon Machine Image）
* プロビジョニングには [Packer](https://www.packer.io/) と [Ansible](https://www.ansible.com/) を使う

PackerやAnsible自体の解説は割愛します。

## Vagrantを使ってローカル環境でデバッグできるようにしておく

**Ansible Playbookの書き始めの頃は、可能であればローカル環境上に [Vagrant](https://www.vagrantup.com/) と [Virtual Box](https://www.virtualbox.org/) を使ってインスタンスを起動して、それに対してプロビジョニングするようにしました。**

記述したPlaybookをいきなりAWS環境上のEC2へプロビジョニングをすることはやめました。
それは、プロビジョニング以外の処理（インスタンスの起動/停止処理）もあって、デバッグに時間がかかるためです。

### Vagrantfileの準備

まずは、以下のような `Vagrantfile` を準備します。今回は `centos/7` を使います。

```vim
Vagrant.configure("2") do |config|
  config.vm.box = "centos/7"

  config.vm.network :forwarded_port, id: "ssh", guest: 22, host: 2222

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end
  config.vm.provision "shell", inline: <<-SHELL
    #yum -y update
    # add user centos
    useradd centos
    passwd -f -u centos
    echo "centos ALL = NOPASSWD: ALL" >> /etc/sudoers.d/centos
    echo "centos ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/centos
    # setup SSH
    mkdir -p /home/centos/.ssh; chown centos /home/centos/.ssh; chmod 700 /home/centos/.ssh
    cp /home/vagrant/.ssh/authorized_keys /home/centos/.ssh/authorized_keys
    chown centos /home/centos/.ssh/authorized_keys
    chmod 600 /home/centos/.ssh/authorized_keys
    # setup sshd config
    sed -ri 's/#PermitRootLogin yes/PermitRootLogin yes/g' /etc/ssh/sshd_config
    sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
    sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config
    systemctl restart sshd
  SHELL
end
```

公開されているAMIとVagentの `centos/7` には、インストール済みのモジュールや、設定に差分があるため、
可能なかぎり `config.vm.provision` ブロックで差分を吸収しています。ここはハマると若干時間を取られます。

ここではAnsibleがSSHしてプロビジョニングするための `centos` ユーザの追加と `sudo` 権限の追加、`sshd` への設定を追加しています。

### Null BuilderでVagrantに対してプロビジョニングする

`vagrant up` コマンドを使って自前で起動する場合は `ssh` コマンドだけできれば良いので、 [Null Builder](https://www.packer.io/docs/builders/null.html) を使います。

Packerのtemplateファイルの `builders` を抜粋します。

```json
"builders":[
    {
        "type": "null",
        "communicator": "ssh",
        "ssh_pty": true,
        "ssh_timeout" : "1m",
        "ssh_host": "{{user `ssh_host`}}",
        "ssh_port": "{{user `ssh_port`}}" ,
        "ssh_username": "{{user `ssh_user`}}",
        "ssh_private_key_file": "{{user `ssh_key`}}"
    }
]
```

templateファイル上で展開される変数は以下を与えます。

```json
{
    "ssh_host": "127.0.0.1",
    "ssh_user": "centos",
    "ssh_key": "../.vagrant/machines/default/virtualbox/private_key",
    "ssh_port": "2222"
}
```

なお、ポート `2222` は `Vagrantfile` 内で `22` 番と既にポートフォワードする設定を追加済みです。

### Vagrantのスナップショット機能を使う

[Vagrant](https://www.vagrantup.com/) はバージョン `1.8`

## Ansibleの後にServerSpecで検査する



## 変数ファイルは、roleごと、環境ごとに準備する




## 参考にさせていただいたサイト

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
