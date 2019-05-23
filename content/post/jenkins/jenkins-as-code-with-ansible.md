---
title: "Jenkins2をコード化しよう - その１：Ansibleでマシンイメージを作成する"
description: "Jenkins2をAnsibleでコード化する場合のTipをまとめました。"
date: "2019-05-15T15:35:08+09:00"
thumbnail: "/images/icons/jenkins_icon.png"
categories:
  - "jenkins"
tags:
  - "jenkins"
  - "ansible"
isCJKLanguage: true
twitter_card_image: /images/icons/jenkins_icon.png
---

今回は、CIサーバとして広く使われているJenkinsのマシンイメージをAnsibleでコード化するための手順を紹介します。

## 背景：Jenkinsサーバがカオスだった

配属された現場で使用されていたJenkinsサーバが誰もメンテンナンスできていない状態でしたので、「完璧にコード化案件ですねこれは」と頑張ってみました。


困ったことに、複数存在するJenkinsサーバのそれぞれにインストールされているJenkins PluginやOSコマンドが異なっていましたし、
Jenkins自体もHomebrew経由でインストールしているものもあれば、直接Jarファイルをダウンロードしたものもあり、「これは再現性がないぞ」と思いました。
更に、Jenkinsたちはオンプレのサーバに立っていて、バックアップも取られていません。

これでは、サーバが死んだら開発が止まってしまいますよね。
このような状況はきっと他にもあるのだろうと思ったので、Tipsをまとめてみました。

<!--adsense-->

## Ansibleを使ってJenkinsコード化する

以降では、JenkinsをAnsible化するにあたってのポイントを `aisible-playbook` の `yml` 形式で順に説明します。

### 環境情報

* Ansible
  * `2.3.1`
* プロビジョニング対象のOS
  * AWS EC2の `AmazonLinux2` (CentOS7がベースになっています)
* インストールするJenkins
  * `2.164.2`

<!--adsense-->

### Jenkinsのインストール

Jenkinsの起動に必要なJava8をインストールした後、Jenkinsのyumリポジトリを追加します。
インストールには公開鍵が必要なので、取得を行った後にJenkinsを `yum` でインストールします。

{{< highlight yaml "linenos=inline" >}}
- name: yumリポジトリを有効にします（私の場合はAWS EC2上でマシンイメージを作成しています）
  shell: amazon-linux-extras enable corretto8
- name: OpenJDK 8(corretto) をインストールします
  yum:
    name: java-1.8.0-amazon-corretto-devel
    state: present
- name: jenkinsのyumリポジトリを追加します
  get_url:
    url: http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
    dest: /etc/yum.repos.d/jenkins.repo
- name: 公開鍵をインストールします
  rpm_key:
    key: http://pkg.jenkins-ci.org/redhat-stable/jenkins-ci.org.key
- name: jenkinsをインストールします
  yum:
    name: "jenkins-2.164.2-1.1"
    state: present
{{< / highlight >}}

### Jenkinsの起動設定の変更

Jenkinsの起動引数を変更したい場合には、いくつか方法はありますが、今回は `/etc/sysconfig/jenkins` ファイルを差し替えます。
ここでは `${JENKINS_HOME}` の場所や、待受ポート、SSL証明書へのパス、Jenkinsの起動引数の追加等が行えます。

{{< highlight yaml "linenos=inline" >}}
- name: jenkinsの起動引数を変更します
  copy:
    src: "../files/etc/sysconfig/jenkins"
    dest: /etc/sysconfig/jenkins
    owner: root
    group: root
    mode: 0600
{{< / highlight >}}

セッションタイムアウトを伸ばしたければ、 `JENKINS_ARGS="--sessionTimeout=120"` といった要領です。

### Jenkinsを起動

Jenkinsを起動します。AmazonLinux2(CentOS7)から `systemd` になっているので、デーモンに登録しておきます。

{{< highlight yaml "linenos=inline" >}}
- name: jenkinsを起動します
  systemd:
    name: jenkins
    state: started
    enabled: yes
{{< / highlight >}}

Jenkinsが起動すると初期化処理に時間がかかるので、ログイン画面が表示されるまで待ちましょう。

{{< highlight yaml "linenos=inline" >}}
- name: Jenkinsが起動するまでwaitします
  uri:
    url: http://localhost:8080/login
    status_code: 200
    timeout: 10
  register: jenkins_service_status
  retries: 15
  delay: 20
  until: >
     'status' in jenkins_service_status and
     jenkins_service_status['status'] == 200
{{< / highlight >}}

<!--adsense-->

### Jenkins ユーザに sudo権限を付与

Jenkinsをインストールすると、Jenkinsユーザが誕生します。
Jenkinsユーザに何らかの理由で `sudo` させたいのであれば、以下のように `sudoers.d` 配下のファイルに追記しておきます。

{{< highlight yaml "linenos=inline" >}}
- name: jenkinsユーザにsudo権限を付与します
  lineinfile:
    dest: "/etc/sudoers.d/users"
    owner: root
    group: root
    mode: 0440
    state: present
    create: yes
    line: "jenkins ALL=(ALL) NOPASSWD:ALL"
    validate: 'visudo -cf %s'
{{< / highlight >}}

### セットアップウィザードを無効にする

Jenkinsを初回起動した時にセットアップウィザードが表示されます。

![setupwizard_jenkins](/images/20190515/setupwizard_jenkins.png)

これを無効化するために、 `${JENKINS_HOME}/jenkins.install.InstallUtil.lastExecVersion` ファイルを作成してしまいましょう。
ファイルの中身にはJenkinsのバージョン番号（今回は `2.164.2` ）が記載されていればOKです。

{{< highlight yaml "linenos=inline" >}}
- name: セットアップウィザードを無効化します
  copy:
    content: "2.164.2"
    dest: /var/lib/jenkins/jenkins.install.InstallUtil.lastExecVersion
    owner: jenkins
    group: jenkins
    mode: 0644
{{< / highlight >}}

### アップグレードウィザードを無効にする

同様にしてアップグレードウィザードも無効にします。アップグレードウィザードは `${JENKINS_HOME}/jenkins.install.UpgradeWizard.state` です。

{{< highlight yaml "linenos=inline" >}}
- name: アップグレードウィザードを無効化します
  copy:
    content: "2.164.2"
    dest: /var/lib/jenkins/jenkins.install.UpgradeWizard.state
    owner: jenkins
    group: jenkins
    mode: 0644
{{< / highlight >}}

<!--adsense-->

### Jenkinsのセキュリティ設定を一時的にオフにする

以降の処理でJenkins2のセキュリティ設定がプロビジョニングの邪魔をすることがあるので、一時点にオフにします。
`${JENKINS_HOME}/config.xml` を変更します。

{{< highlight yaml "linenos=inline" >}}
- name: セキュリティ無効化します
  copy:
    src: "../files/var/lib/jenkins/config.xml.unsecure"
    dest: /var/lib/jenkins/config.xml
    owner: jenkins
    group: jenkins
    mode: 0644
{{< / highlight >}}

ここは **`xml` を置き換える** という少し泥臭い方法を取ります。

{{< highlight xml "linenos=inline" >}}
<?xml version='1.1' encoding='UTF-8'?>
<hudson>
  <disabledAdministrativeMonitors/>
  <version>2.164.2</version>
  <installStateName>RUNNING</installStateName>
  <numExecutors>60</numExecutors>
  <mode>NORMAL</mode>
  <!-- CLI実行のためにセキュリティ設定をOFFにする ココから -->
  <useSecurity>false</useSecurity>
  <authorizationStrategy class="hudson.security.AuthorizationStrategy$Unsecured"/>
  <securityRealm class="hudson.security.SecurityRealm$None"/>
  <!-- ココまで -->
  <disableRememberMe>false</disableRememberMe>
  <projectNamingStrategy class="jenkins.model.ProjectNamingStrategy$DefaultProjectNamingStrategy"/>
  <workspaceDir>${JENKINS_HOME}/workspace/${ITEM_FULL_NAME}</workspaceDir>
  <buildsDir>${ITEM_ROOTDIR}/builds</buildsDir>
  <jdks/>
  <viewsTabBar class="hudson.views.DefaultViewsTabBar"/>
  <myViewsTabBar class="hudson.views.DefaultMyViewsTabBar"/>
  <clouds/>
  <scmCheckoutRetryCount>0</scmCheckoutRetryCount>
  <views>
    <hudson.model.AllView>
      <owner class="hudson" reference="../../.."/>
      <name>all</name>
      <filterExecutors>false</filterExecutors>
      <filterQueue>false</filterQueue>
      <properties class="hudson.model.View$PropertyList"/>
    </hudson.model.AllView>
  </views>
  <primaryView>all</primaryView>
  <slaveAgentPort>21000</slaveAgentPort>
  <label></label>
  <crumbIssuer class="hudson.security.csrf.DefaultCrumbIssuer">
    <excludeClientIPFromCrumb>false</excludeClientIPFromCrumb>
  </crumbIssuer>
  <nodeProperties/>
  <globalNodeProperties/>
{{< / highlight >}}

セキュリティ設定を変更したら、再起動で設定ファイルの再読込をします。

{{< highlight yaml "linenos=inline" >}}
- name: jenkinsを再起動します
  systemd:
    name: jenkins
    state: restarted
    enabled: yes
{{< / highlight >}}

<!--adsense-->

### Jenkins Pluginをインストールする

Jenkinsのプラグインをインストールするには Jenkins CLIを使うのがオススメです。
JenkinsプラグインのIDはAnsibleの `vars/` 配下のファイルに書き出すなどしてループでインストールしてしまうのが良いでしょう。

セットアップウィザードをスキップしてしまっているので、セットアップウィザードでデフォルトでインストールするプラグインは
このタイミングでインストールすると良いでしょう。

プラグインのインストール終了後のJenkins再起動も忘れずに行います。

{{< highlight yaml "linenos=inline" >}}
- name: jenkins-cliをインストールします
  shell: wget http://localhost:8080/jnlpJars/jenkins-cli.jar -P /usr/lib/jenkins/
- name: jenkins pluginをjenkins-cli経由でインストールします
  shell: java -jar /usr/lib/jenkins/jenkins-cli.jar -s http://localhost:8080 install-plugin {{ item.plugin_name }}
  with_items: "{{ jenkins_plugins }}"
- name: jenkinsを再起動します
  systemd:
    name: jenkins
    state: restarted
    enabled: yes
{{< / highlight >}}

### Jenkinsの起動スクリプトを配置する

Jenkinsは起動したタイミングで、`${JENKINS_HOME}/init.groovy.d/` 配下にあるGroovyスクリプトを実行させることができます。
Groovyスクリプトを使うことで、 `${JENKINS_HOME}` 配下にxmlをひたすらコピーするソリューションを防ぐことができます。

`${JENKINS_HOME}/init.groovy.d` ディレクトリはデフォルトで存在しないので、ディレクトリを作成しておきます。

{{< highlight yaml "linenos=inline" >}}
- name: jenkins起動時のHOOK Groovy Scriptディレクトリを作成します
  file:
    dest: "/var/lib/jenkins/init.groovy.d/"
    state: directory
    owner: jenkins
    group: jenkins
    mode: 0700
{{< / highlight >}}

Groovyスクリプトの書き方については、「[Jenkins2をコード化しよう - その２：Jenkinsの起動時にプログラム（Groovy Hook Script）を動かす](/post/jenkins/jenkins-as-code-with-init-groovy-d/)」 を参考にしてください。

<!--adsense-->

### xmlファイルを配置する

JenkinsやJenkinsプラグインの設定は `xml` ファイルで管理されています。

必要に応じて `${JENKINS_HOME}` 配下に置きましょう。

{{< highlight yaml "linenos=inline" >}}
- name: Slackの設定をコピーします
  copy:
    src: "../files/var/lib/jenkins/jenkins.plugins.slack.SlackNotifier.xml"
    dest: /var/lib/jenkins/jenkins.plugins.slack.SlackNotifier.xml
    force: yes
    owner: jenkins
    group: jenkins
    mode: 0755
{{< / highlight >}}

### Jenkinsのセキュリティ設定をオンに戻す

プラグインをインストールするためにオフにしたセキュリティ設定を元にもどします。

{{< highlight yaml "linenos=inline" >}}
- name: セキュリティ有効化します
  copy:
    src: "../files/var/lib/jenkins/config.xml.secure"
    dest: /var/lib/jenkins/config.xml
    owner: jenkins
    group: jenkins
    mode: 0644
{{< / highlight >}}

Jenkinsインストール時の `${JENKINS_HOME}/config.xml` の内容に戻してあげましょう。
サンプルは以下のような感じです。

{{< highlight xml "linenos=inline" >}}
<?xml version='1.1' encoding='UTF-8'?>
<hudson>
  <disabledAdministrativeMonitors/>
  <version>2.164.2</version>
  <installStateName>RUNNING</installStateName>
  <numExecutors>60</numExecutors>
  <mode>NORMAL</mode>
  <useSecurity>false</useSecurity>
  <authorizationStrategy class="hudson.security.FullControlOnceLoggedInAuthorizationStrategy">
    <denyAnonymousReadAccess>true</denyAnonymousReadAccess>
  </authorizationStrategy>
  <securityRealm class="hudson.security.HudsonPrivateSecurityRealm">
    <disableSignup>true</disableSignup>
    <enableCaptcha>false</enableCaptcha>
  </securityRealm>
  <disableRememberMe>false</disableRememberMe>
  <projectNamingStrategy class="jenkins.model.ProjectNamingStrategy$DefaultProjectNamingStrategy"/>
  <workspaceDir>${JENKINS_HOME}/workspace/${ITEM_FULL_NAME}</workspaceDir>
  <buildsDir>${ITEM_ROOTDIR}/builds</buildsDir>
  <jdks/>
  <viewsTabBar class="hudson.views.DefaultViewsTabBar"/>
  <myViewsTabBar class="hudson.views.DefaultMyViewsTabBar"/>
  <clouds/>
  <scmCheckoutRetryCount>0</scmCheckoutRetryCount>
  <views>
    <hudson.model.AllView>
      <owner class="hudson" reference="../../.."/>
      <name>all</name>
      <filterExecutors>false</filterExecutors>
      <filterQueue>false</filterQueue>
      <properties class="hudson.model.View$PropertyList"/>
    </hudson.model.AllView>
  </views>
  <primaryView>all</primaryView>
  <slaveAgentPort>21000</slaveAgentPort>
  <label></label>
  <crumbIssuer class="hudson.security.csrf.DefaultCrumbIssuer">
    <excludeClientIPFromCrumb>false</excludeClientIPFromCrumb>
  </crumbIssuer>
  <nodeProperties/>
  <globalNodeProperties/>
{{< / highlight >}}

### Jenkinsの再起動

最後にJenkinsを再起動して終了です。

{{< highlight yaml "linenos=inline" >}}
- name: jenkinsを再起動します
  systemd:
    name: jenkins
    state: restarted
    enabled: yes
{{< / highlight >}}

<!--adsense-->

## 注意点

### プロビジョニングに時間がかかる

Jenkinsのマシンイメージのコード化にあたってプロビジョニングの所要時間を計測したところ、
インスタンスタイプが `c5.xlarge` で15分ほどかかりました。特に、プラグインインストールの所で時間がかかっているようでした。

### xml編集という泥臭い作業は残る

コード化するにあたって、**xmlを編集する** という苦行は避けたかったのですが、全回避はできなかったです。
Jenkinsの設定をymlでかけるようにするための [Configuration as Code Plugin](https://github.com/jenkinsci/configuration-as-code-plugin) というものがありますが、各プラグインが[Configuration as Code Plugin](https://github.com/jenkinsci/configuration-as-code-plugin) に対応する必要があるため、対応していないプラグインを使いたい場合には厄介です。
