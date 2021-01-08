---
title: "プライベートネットワーク内のデバイスにAWS Session Managerを経由してAnsibleでプロビジョニングする"
description: "プライベートネットワーク内のデバイスにはSSHができないため、SSHを使ったプロビジョニングが簡単にはできません。ここではAWS System ManagerのSession Managerを使ってAnsible Playbookを実行する方法を紹介します。"
date: "2021-01-08T15:12:06+09:00"
thumbnail: /images/icons/ssm_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "ssm"
isCJKLanguage: true
twitter_card_image: /images/icons/ssm_icon.png
---

ここしばらくリモートワークが続いてきて困るのが遠隔地にあるデバイスのモジュールのアップデート作業をどう行うか、というところです。
今回は AWS System Manager の Session Manager の機能と Ansible を組み合わせて遠隔地にあるプライベートネットワーク内のデバイスの構成管理の方法を紹介します。

<!--adsense-->

## 遠隔地にあるプライベートネットワーク内のデバイスにプロビジョニングを行いたい

会社のような遠隔地に配置したデバイスに対して自宅内の開発用マシンから構成管理のスクリプトを実行したいと思います。イメージとしては以下です。

![purpose](/images/20210108/purpose.drawio.png)

たいていの場合、遠隔地に配置されているデバイスはプライベートネットワーク内にあることが多いと思いますので、そう簡単に Ansible を実行することが（=SSH が）できる環境にありません。

エッジデバイスへの簡単なモジュール更新なら AWS Greengrass を使う方法も検討できますが、
真面目な構成管理には向かないので Ansible を実行できる方法を模索します。

## 環境情報

上記の構成での環境情報は以下です。

- PC(ローカルマシン)
  - Mac Book Pro (Mac OS X `10.15.7`)
  - Ansible `2.9.9`
  - AWS CLI `2.1.16`
  - [AWS Session Manager Plugin](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html#install-plugin-macos)
- Device(Ansible の実行ホスト)
  - Jetson AGX Xavier (JetPack `4.4`)
  - [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html)

<!--adsense-->

## 実施手順

### AWS System Manager Session Manager を設定する

まず最初に [AWS System Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) の設定をします。
[AWS System Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) は踏み台サーバの代替として使われることも多いのですが、仮想サーバ（EC2）へのアクセスだけでなく、設定を行えばオンプレミスサーバにもセッションを張ることができます。オンプレミスサーバと言いいましたが、AWS 提供のモジュールが OS のディストリビューションをサポートしていれば、エッジデバイスにもインストールすることができます。

なお、JetPack は AWS 的にはサポートしていませんが、Ubuntu の兄弟だし動くだろう、とやってみたら動きました。

設定手順については[公式ドキュメント](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) を参照しましょう。手厚く書かれています。

おおまかな流れだけ紹介しておくと

1. Device(Ansible の実行ホスト)にアタッチする IAM Instance Profile を作成する
2. System Manager 自体の設定を行う
3. PC(ローカルマシン)に[AWS Session Manager Plugin](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html#install-plugin-macos) をインストールする
4. Device(Ansible の実行ホスト) にモジュールをインストールし、System Manager にインスタンスを登録する

<!--adsense-->

### AWS Session Manager でポートフォワーディングのセッションを開く

PC(ローカルマシン)で以下のコマンドを実行します。Session Manager を経由してローカルマシンからデバイスにポートフォワードできるようになります。 `--target` オプションには Session Manager に登録したデバイスの Instance ID を指定しましょう。
また、ここではローカルマシンの `9090` ポート を デバイスの `22` ポートに転送しています。

{{<highlight bash "linenos=inline">}}
aws ssm start-session \
 --target mi-xxxxxxxx \
 --document-name AWS-StartPortForwardingSession \
 --parameters '{"portNumber":["22"],"localPortNumber":["9090"]}'
{{</highlight>}}

### Playbook ファイルを作成し Ansible を実行する

次に Ansible の Playbook ファイル一式を作成します。タスクの内容はどんなものでも構いません。
ここで大事なのはインベントリーの指定方法です。
プロビジョニングターゲットを `localhost` の `9090` ポートにしています。

{{<highlight bash "linenos=inline,hl_lines=2 5">}}
[jetson]
localhost

[jetson:vars]
ansible_port=9090
ansible_user=XXXXXXX
ansible_ssh_pass=XXXXXX
ansible_become_password=XXXXXX
ansible_python_interpreter=/usr/bin/python3
{{</highlight>}}

ここまで来ればポートフォワードを経由してローカルマシンからデバイスに対して `ansible-playbook` コマンドが実行できるはずです。

<!--adsense-->

## どうしてポートフォワーディグするのか

ここでは、どうしてポートフォワーディングセッションを先に開いておくのかを説明します。

[AWS Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html) の手順に準じてローカルマシンの設定を行うと、 `~/.ssh/config` に `ProxyCommand` を記載する設定が紹介されています。

{{<highlight bash "linenos=inline">}}
Host i-_ mi-_
ProxyCommand sh -c "aws ssm start-session \
 --target %h \
 --document-name AWS-StartSSHSession \
 --parameters 'portNumber=%p'"
{{</highlight>}}

この設定 は `ssh user@mi-xxxxxxx` のように Instance ID 指定での SSH ログインを実現できるため、とても便利なのです。

しかしここで指定されている `AWS-StartSSHSession` は呼び出される度に新規で ローカルマシン -> Session Manager -> デバイスのセッションを開く **だけ** です。 **明示的に aws ssm terminate-session を呼び出すか、セッションがアイドルタイムアウトするまで SSH 接続を維持するためのセッションや session-worker は残り続けます** 。

例えば、上記の `ProxyCommand` 設定が入った状態で、以下のように接続ホストを Instance ID で指定するとしましょう。
すると、比較的長い Ansible タスクでは実行の途中で `Connection reset by peer` エラーが発生します。

{{<highlight bash "linenos=inline,hl_lines=2">}}
[jetson]
mi-xxxxxxxx

[jetson:vars]
ansible_user=XXXXXXX
ansible_ssh_pass=XXXXXX
ansible_become_password=XXXXXX
ansible_python_interpreter=/usr/bin/python3
{{</highlight>}}

Ansible 実行ホスト側の `/var/log/amazon/ssm/errors.log` ファイルを確認すると `too many open files` が出力されていることがわかります。また、Ansible 実行中に Ansible 実行ホスト側の `sshd` プロセスがどんどん増えていることも確認できます。

{{<highlight bash "linenos=inline">}}
ERROR [NewFileWatcherChannel @ filechannel.go.79] [ssm-session-worker] [xxxxxxx-07679fe2fa5825aa8] \
filewatcher listener encountered error when start watcher: too many open files
ERROR [createFileChannelAndExecutePlugin @ main.go.105] [ssm-session-worker] \
[xxxxxxx-07679fe2fa5825aa8] failed to create channel: too many open files
ERROR [handleSSHDPortError @ port.go.292] [ssm-session-worker] \
[xxxxxxx-0590c3ea63794d55f] [DataBackend] [pluginName=Port] \
Failed to read from port: read tcp 127.0.0.1:41294->127.0.0.1:22: use of closed network connection
{{</highlight>}}

## まとめ

Session Manager を経由して Ansible コマンドを実行する時はポートフォワーディングのセッションを開いてから、localhost に対して実行すると良い。
