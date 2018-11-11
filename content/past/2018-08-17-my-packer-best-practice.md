---
title: "AMI作成のPackerプロジェクトのワタシ的ベストプラクティス！"
description: "様々なプロジェクトで仕事をするにあたって、AWSのAMI（Amazon Machine Image）を多くつくるようになりました。今回はPackerプロジェクトの個人的なベストプラクティスをまとめました。"
date: 2018-08-17
thumbnail: /images/icons/packer_icon.png
categories:
    - aws
tags:
    - aws
    - packer
url: /aws/my-packer-best-practice/
twitter_card_image: /images/icons/packer_icon.png
---

様々なプロジェクトで仕事をするにあたって、AWSのAMI（Amazon Machine Image）を多くつくるようになりました。
今回はPackerプロジェクトの個人的なベストプラクティスをまとめました。

## 作成したリポジトリ

はじめに、作成したリポジトリを以下に晒しておきます。

* [soudegesu/my_packer_best_practice](https://github.com/soudegesu/my_packer_best_practice)

また、前提条件は以下とします。

* 作成対象はAMI（Amazon Machine Image）
* プロビジョニングには [Packer](https://www.packer.io/) と [Ansible](https://www.ansible.com/) を使う
* インスタンスのテストには [Sererspec](https://serverspec.org/) を使う

PackerやAnsible、Sererspec自体の解説は割愛します。

## Vagrantを使ってローカル環境でデバッグできるようにしておく

**Ansible Playbookの書き始めの頃は、可能であればローカル環境上に [Vagrant](https://www.vagrantup.com/) と [Virtual Box](https://www.virtualbox.org/) を使ってインスタンスを起動して、それに対してプロビジョニングするようにしました。**

記述したAnsible PlaybookをいきなりAWS環境上のEC2へプロビジョニングをすることはやめました。
それは、プロビジョニング以外の処理（インスタンスの起動/停止処理）もあって、デバッグに時間がかかるためです。

### Vagrantfileの準備

まずは、以下のような `Vagrantfile` を準備します。とりあえず `centos/7` を指定しています。

{{< highlight vim "linenos=inline" >}}
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
{{< / highlight >}}

公開されているAMIとVagentの `centos/7` には、インストール済みのモジュールや、設定に差分があるため、
可能なかぎり `config.vm.provision` ブロックで差分を吸収しています。ここはハマると若干時間を取られます。

ここではAnsibleがSSHしてプロビジョニングするための `centos` ユーザの追加と `sudo` 権限の追加、`sshd` への設定を追加しています。

### Null BuilderでVagrantに対してプロビジョニングする

`vagrant up` コマンドを使って自前で起動する場合は `ssh` コマンドだけできれば良いので、 [Null Builder](https://www.packer.io/docs/builders/null.html) を使います。

Packerのtemplateファイルの `builders` を抜粋します。

{{< highlight json "linenos=inline" >}}
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
{{< / highlight >}}

templateファイル上で展開される変数は以下を与えます。

{{< highlight json "linenos=inline" >}}
{
    "ssh_host": "127.0.0.1",
    "ssh_user": "centos",
    "ssh_key": "../.vagrant/machines/default/virtualbox/private_key",
    "ssh_port": "2222"
}
{{< / highlight >}}

なお、ポート `2222` は `Vagrantfile` 内で `22` 番と既にポートフォワードする設定を追加済みです。

### Vagrantのスナップショット機能を使う

[Vagrant](https://www.vagrantup.com/) はバージョン `1.8` から `vagrant snapshot` サブコマンドが使用可能になっています。
これは、インスタンスの状態を保存＆復元するための機能です。

Ansible Playbook が何度でも流せるように、初期化時に Vagrantインスタンスの状態を一度スナップショットとして取得し、
Packer実行前に毎回 `restore` するようにします。

## Ansibleの後にServerSpecで検査する

Ansible Playbookが実行された後は [Serverspec](https://serverspec.org/) を実行したいですよね。

残念ながら、PakcerにはServerspecのprovisionerがついていないので、 シェルを実行するためのprovisionerを使ってServerspecを実行します。

### provisionerは ansible や shell-local を使う

Packerのtemplateファイルで記載するprovisionerには [ansible](https://www.packer.io/docs/provisioners/ansible.html) や [shell-local](https://www.packer.io/docs/provisioners/shell-local.html) を使います。

[ansible-local](https://www.packer.io/docs/provisioners/ansible-local.html) や [shell](https://www.packer.io/docs/provisioners/shell.html)を使いません。

理由として、`ansible-local` や `shell` は Packerでのプロビジョニング時に [Ansible](https://www.ansible.com/) や [Serverspec](https://serverspec.org/) を **プロビジョニング先のインスタンスにインストールする必要がでてきてしまうため** です。実際のサービスで稼働させるインスタンスに不要なライブラリがインストールされているのは何とも気持ちの悪いものです。

必ず、ローカルマシンやCIサーバといったプロビジョニングする側にモジュールはインストールします。

ここでは `rake` コマンドをラップした `run_spec.sh` を呼び出していて、SSHするために必要な情報を引数として渡しています。

{{< highlight json "linenos=inline" >}}
    "provisioners": [
        {
            "type": "ansible",
            "playbook_file" : "ansible/playbook-{{user `provision_target`}}.yml",
            "user": "centos",
            "ssh_host_key_file": "{{user `ssh_key`}}",
            "ansible_env_vars": [
                "ANSIBLE_HOST_KEY_CHECKING=False",
                "ANSIBLE_NOCOLOR=True"
            ]
        },
        {
            "type": "shell-local",
            "command": "cd serverspec && sh ./run_spec.sh {{user `ssh_host`}} {{user `ssh_port`}} {{user `ssh_key`}} {{user `provision_target`}} {{user `ssh_user`}}"
        }
    ]
{{< / highlight >}}

## 設定ファイルは、roleごと、環境ごとに準備する

Packerのtemplateファイルでは多くの変数を必要とします。
それらの依存関係を理解して、適切な設定ファイルに分割するのは割と重要だと思っています。

個人的には以下の3種類を作成し、Packer実行時に引数としてこれらの3種類を組合せて渡します。

### プラットフォームに依存するPacker template

Packerのtemplateファイルはプロビジョニングするプラットフォーム毎に作成します。
ローカルなのか、AWSなのか、Azureなのか、で1つずつ作るイメージです。

|ファイル名|用途|
|---------|---|
|ami-aws-template.json|AWSにプロビジョニングするために使うPacker template|
|ami-local-template.json|ローカルのVagrantにプロビジョニングするために使うPacker template|

### 環境に依存する設定ファイル

プラットフォームの環境に依存する設定ファイルです。
ここで言う「環境」とは、開発環境、ステージング環境、商用環境のような、システムを管理する単位一式のことを指しています。

ざっくり以下のようなイメージです。

|ファイル名                    |用途|
|----------------------------|---|
|env-A-variables.json|AWSアカウント Aにプロビジョニングするときに使う設定|
|env-B-variables.json|AWSアカウント Bにプロビジョニングするときに使う設定|
|env-local-variables.json   |ローカルのVagrantにプロビジョニングするために使う設定|

{{< highlight json "linenos=inline" >}}
{
    "aws_region": "your-region",
    "aws_vpc_id": "vpc-xxxxxxxxxxxxxx",
    "aws_subnet_id": "subnet-xxxxxxxxxxx",
    "ssh_user": "centos",
    "use_profile": "your-profile",
    "aws_instance_role": "your-packer-role",
    "aws_keypair_name": "your-keypair-name"
}
{{< / highlight >}}

AWSアカウント単位でVPCのIDやキーペアの情報は変わってくるので、そのような情報はここにもたせます。

### Ansible Role（システムコンポーネント）に依存する設定ファイル

|ファイル名              |用途|
|-----------------------|---|
|role-hoge-variables.json|Role `hoge` をプロビジョニングするときに使う設定|

AnsibleのRole（システムコンポーネント）に依存する設定ファイルです。
ベースとするAMIのインスタンスIDや、作成したAMI名のprefixなど置いておくといいと思います。

{{< highlight json "linenos=inline" >}}
{
    "packer_tag_prefix":  "Packer-Hoge-AMI",
    "instance_tag_prefix": "HOGE_OPTIMIZED",
    "aws_source_ami": "ami-xxxxxxxx"
}
{{< / highlight >}}

## 実行コマンドは別ファイルでラップしておく

一連のPacker実行コマンドの量が増えてしまうため、 コマンドをラップします。
シェルでもなんでもいいですが、私は `Makefile` にしています。

実行引数は最低限以下の2つで済みます。

* Ansibleのプロビジョニング対象のRole
* AnsibleやServerspecがEC2へSSHするためのSSH鍵

{{< highlight bash "linenos=inline" >}}
PACKER = cd packer
# AnsibleのRole
ROLE = $1
# EC2へのSSH鍵（絶対パス）
AWS_KEY_FILE = $2

# Vagrant初期化時に make init-vagrant を実行します。 initial-saveという名前でスナップショットを保存
init-vagrant:
	vagrant halt && vagrant destroy -f && vagrant up --provision && \
		vagrant snapshot save initial-save

# Vagrantに対して先程のNull Builderでプロビジョニングします
test-local:
	@${PACKER} && \
		vagrant snapshot restore initial-save && \
		packer build -var-file=env-local-variables.json \
		-var 'ssh_key=$(CURDIR)/.vagrant/machines/default/virtualbox/private_key' \
		-var 'provision_target=${ROLE}' \
		ami-local-template.json

# AWSのAMIを作成します
create-ami:
	@${PACKER} && \
		packer build \
		-var-file=env-aws-variables.json \
		-var-file=role-${ROLE}-variables.json \
		-var 'aws_key_file=${AWS_KEY_FILE}' \
		-var 'provision_target=${ROLE}' \
		ami-aws-template.json
{{< / highlight >}}

## まとめ

今回はPackerでAMIを作成するときの個人的ベストプラクティスを紹介しました。

* ローカル環境でVagrantインスタンスを使って、Ansible PlaybookとServerspecの動作確認をする
  * `Vagrantfile` では `config.vm.provision` ブロックでAMIとの差分を減らす努力は必要
* Ansibleの後にServerspecを流す
  * provisoner は `ansible` と `shell-local` を使う
* 変数ファイルは依存関係ごとに分ける
* 実行コマンドをラップしたファイルを作る

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155160&linkId=e31b0f9652aedc2ee6735408ac519d5e&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4774196479&linkId=c178f192d7778c77187b44c226c4e071&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
