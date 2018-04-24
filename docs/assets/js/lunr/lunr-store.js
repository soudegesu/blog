var store = [{
        "title": "Docker buildコマンドのimage作成〜コンテナ起動まで",
        "excerpt":"自宅PC(mac)で簡単なアプリケーションを作ろうと思い、Dockerを使ってmysqlを構築しようとした際の備忘録として残しておきます。Dockerfile を作成するまず、dockerのバージョンが古かったので、公式サイトからmac用のdockerを再度ダウンロードし、アップデートしておきます。# docker versionClient: Version: 1.13.0 API version: 1.25 Go version: go1.7.3 Git commit: 49bf474 Built: Wed Jan 18 16:20:26 2017 OS/Arch: darwin/amd64Server: Version: 1.13.0 API version: 1.25 (minimum version 1.12) Go version: go1.7.3 Git commit: 49bf474 Built: Wed Jan 18 16:20:26 2017 OS/Arch: linux/amd64 Experimental: true以下のような簡単なDockerfileを作成し、プロジェクトのルートにおいておきます。今回はmysql公式のdocker imageを使用することにしましょう。FROM mysqlMAINTAINER soudegesuRUN...","categories": ["docker"],
        "tags": ["docker"],
        "url": "https://www.soudegesu.com/docker/image/build",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "docker-composeを使ってmysql dockerコンテナを起動する",
        "excerpt":"前回の記事で docker build からの docker run コマンドを使用することでmysqlのdockerコンテナの起動ができました。個人的にはcliのオプション指定が長くなっていくのがあまり好きではないので、今回はdocker-composeを使用して、もう少しお手軽に起動にこぎつけたいと思います。docker-compose をインストールする以下のサイトからdocker-toolboxをインストールしましょう。その中にdocker-composeも含まれています。[https://www.docker.com/products/docker-toolbox:embed:cite]そもそもdocker-composeは複数のコンテナ管理を容易に行う機能を提供してくれるものです。今回はmysqlコンテナでしか利用しませんが、システムコンポーネントの設定や起動順序の制御をyamlファイルに記載するだけで良いので、可読性が高く、VCSでも管理がしやすいです。例えば、以下のようなDockerfileがあったとします。FROM mysql:latestRUN { \\ echo '[mysqld]'; \\ echo 'character-set-server=utf8'; \\ echo 'collation-server=utf8_general_ci'; \\ echo '[client]'; \\ echo 'default-character-set=utf8'; \\} &gt; /etc/mysql/conf.d/charset.cnfEXPOSE 3306CMD [\"mysqld\"]それを呼び出すdocker-compose.ymlを作成します。mysql: build: . dockerfile: Dockerfile ports: - \"3306:3306\" environment: - MYSQL_ROOT_USER=root - MYSQL_ROOT_PASSWORD=root - MYSQL_DATABASE=soudegesu - MYSQL_USER=soudegesu - MYSQL_PASSWORD=soudegesu volumes: -...","categories": ["docker","docker-compose"],
        "tags": [],
        "url": "https://www.soudegesu.com/docker/docker-compose/mysql",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "zsh から fish (shell) へお引っ越しを試みた話",
        "excerpt":"fish との出会いこれは本当に偶然の出会いで、「『大きなスクリーンにソースコードを映して、周囲からいろいろヤジ飛ばされながら、ナビゲーターとドライバーとでペアプロする』あのあれ、なんだったかな？確か頭の方が”fish”みたいな音じゃなかったかな？」と音を頼りに「fish プログラミング」というキーワードで検索したところ、fish shell がヒットしたのであった。仕事用もプレイベート用Macもzshを設定していて、個人的にはそれなりに満足していたのですが、色々zshにインストールしていたこともあって、起動やキー入力に若干もたつきを感じていたのもalternative factでしたので、ちょっと試してみようかなと思ったのが始まりです。fishとはfish のfishは Friendly interactive shell の略でユーザフレンドリーさを売りにしたUNIX shellとのことです。どのあたりがユーザーフレンドリーか、というとざっと以下のようです。 コマンドのautocompleteやシンタックスハイライト web上でカラーチョイスができるカラフルなターミナル 健全でシンプルな文法(bash等とは若干違うらしい) manページの自動生成と親切なヘルプメッセージもちろん、以前使用していたzshでも.zshrcに設定を入れたり、プラグインやテーマをインストールすることで自分好みの使いやすいターミナルに仕上げることができます。セットアップ手順fishのインストールHomebrewを使用してfishをインストールします。(これ以外にもMacportsやインストーラー、Windows版、tarboll等様々サポートしていますので公式サイトを確認してください)brew install fishデフォルトのシェル切り替え/etc/shells を確認すると、使用可能なshellを確認できます。&gt; cat /etc/shells# List of acceptable shells for chpass(1).# Ftpd will not allow users to connect who are not using# one of these shells./bin/bash/bin/csh/bin/ksh/bin/sh/bin/tcsh/bin/zsh今のままでは fish は使用できませんので末尾に1行fishのパスを追記しましょう。&gt;which fish/usr/local/bin/fish #これを/etc/shellsに追記以下のコマンドでターミナル起動時のログインシェルをfishに切り替えることができます。chsh -s /usr/local/bin/fishターミナルを再起動するターミナルを再起動することでシェルが切り替わっていることを確認できます。個人的にはもう少しカラフルでかっこよくしたいのでプラグインを入れる方法を模索します。fisherman でpluginをインストールするfishの場合、fisherman がplugin...","categories": ["fish"],
        "tags": ["sh","fish","zsh"],
        "url": "https://www.soudegesu.com/sh/fish/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "TensorFlowのオンライン学習サイトを利用してみる",
        "excerpt":"機械学習を身につけたい意欲ここ1年で”AI”や”人工知能”のワードを耳にする機会は大変増えました。NHKの朝のニュースでも頻繁に見るくらいですので、世間一般の方でも「なんかすごい技術」として認知はされているのでしょう。先日、ダボス会議が開催された際に、以下のような発言がなされたことがニュースとなったことも記憶に新しいことと思います。  「ダボス会議」で世界のトップリーダーたちが懺悔 「AIの成長が早すぎて超ヤバい。認識が甘かった」これから加速度的に発展し、社会進出してくる機械学習を用いた製品やサービス。このムーブメントはIT業界に関わらず、他の業界にも浸透していくことでしょう。私のような今まで機械学習を業務で利用していなかったエンジニアも、程度の差こそあれ、機械学習の理解に努めなければ完全なブラックボックス製品を使うだけの1エンドユーザーに終わってしまうのではないか、という焦りがあります。アルゴリズムを見つけたり、最適化したり、というのはハードルが高いので、「ライブラリが使える」ようになることを直近の目標にしたいと思います。筆者のレベル感  python はまぁ書ける  coureraの機械学習のコースは受講済  ゼロから作るDeepLearning は一通り読み切った  TensorFlowの公式サイトのMNISTサンプルは実行して「お、おぅ。。」となって中断しているTensorFlowを学べるサイトオンラインでTensorFlowを学べるサイトがあるのかを探してみたところ、kadenzeというサイト「Creative Applications of Deep Learning with TensorFlow」という学習コースがありました。  Creative Applications of Deep Learning with TensorFlow全体としては1h程度の動画 ✕ 5枠にて構成されていました。最初のコースは無料で受講できるようなので、早速登録してみることに。会員登録作業が一通り終わると、「講義で利用するリソースがgithub上に上がっているのでcloneしてね」ということが判明。それが以下。  pkmital/CADLリポジトリ内にjupyter notebook用のファイル(.ipynb)があるので、自分のマシンにjupyter notebookとtensorflowがインストールされていればすんなり起動&amp;実行が可能です。(Dockerもあると良い)結構、notebookファイル内にmarkdown形式の説明文が記載されているので、もしかしたら動画を見なくても感じがつかめるかもしれません。動画を見てみた感想  全編英語(当たり前ですが)  英語字幕の設定が可能          ただし、動画毎に字幕設定が必要(設定が引き継げない)のが若干面倒        約1h時間の枠内で更に細かい動画に分割されていた。(introduction 2min、 about XXX 14minのように)  いきなり文脈が飛ぶときがあって、置いていかれることがある          「なぜ」の部分の説明が割愛されているときがある      そこはForum使って議論 &amp; QA しなさい、といった感じなのでしょうか        .ipynbのソースに解答が既に打ち込まれてしまっているので、動画を追いかけながらタイプしたい方は別途環境を構築した方がよいかも。まとめ実はまだ5枠全部受けきれてないです。自身での内容の整理も含めて、これからまとめていきたいと思います。","categories": ["tensorflow"],
        "tags": [],
        "url": "https://www.soudegesu.com/tensorflow/tensorflow-online-course/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "pyenvとpyenv-virtualenvでanacondaと共存する",
        "excerpt":"はじめに今までローカル環境のpythonを切り替えるためにpyenvのみを利用してきました。anacondaを使用する機会も増えてきたので、pyenv installからのpyenv localコマンドでanaconda環境が構築するのですが、activateの部分をもう少しスマートに行いたいため、 pyenv-virtualenv も用いる方法に変更します。今回やりたいこと 1台のマシンの中で使用するpythonのバージョンを切り替えたい さらに言えば、ディストリビューションも切り替えたい(anaconda) anacondaとpyenvの activate の競合を解決したい anacondaをactivateする際にフルパスで指定するのを避けたい 1と2はpyenvで、3はpyenv-virtualenvで解決できることになります。環境 MacOSX Yosemite homebrew zshセットアップ手順仮想環境切り替え用のモジュールをインストール# pyenvをインストールするbrew install pyenv#pyenv-virtualenvをインストールするbrew install pyenv-virtualenvシェル起動時の設定ファイルを修正 .zshrcに以下を追記する # pyenvの設定export PYENV_ROOT=\"${HOME}/.pyenv\"if [ -d \"${PYENV_ROOT}\" ]; then export PATH=${PYENV_ROOT}/bin:${PYENV_ROOT}/shims:${PATH} eval \"$(pyenv init -)\"fi# pyenv-virtualenvの設定if which pyenv-virtualenv-init &gt; /dev/null; then eval \"$(pyenv virtualenv-init -)\"; fi ターミナルを再起動する(sourceコマンドでの再読込でも可)Pythonの仮想環境を作成するテスト用のディレクトリを作成hoge ディレクトリ配下を任意のpythonバージョンで動作するようにしましょう。pythonのバージョンを確認しておきます。mkdir hogecd...","categories": ["pyenv","anaconda"],
        "tags": ["python","pyenv","pyenv-virtualenv","anaconda"],
        "url": "https://www.soudegesu.com/python/pyenv/anaconda",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "Anaconda環境にTensorflowをインストールする",
        "excerpt":"ここから少しづつ、細切れになってしまいますが、tensorflowで学んだことを書いていこうと思います。今回はanacondaの仮想環境に対して、tensorflowをインストールします。環境 Anaconda 4.3.0 python 3.5発生した問題tensorflowのversion 1がリリースされましたので、anacondaで構築した仮想環境に対して以下のようにtensorflowをインストールしようとしたところ、まだ対応しているtensorflowのバージョンがない、とエラーが出てしまいました。pip3 install tensorflow 解決策そのため、以下のようにコマンドを変更します。pip install --ignore-installed --upgrade https://storage.googleapis.com/tensorflow/mac/cpu/tensorflow-1.0.0-py3-none-any.whl備考anaconda の方でのパッケージ管理でインストール可能かを調べてみました。 pypianaconda search -t pypi tensorflow&gt;Using Anaconda API: https://api.anaconda.org&gt;Run 'anaconda show &lt;USER/PACKAGE&gt;' to get more details:&gt;Packages:&gt; Name | Version | Package Types | Platforms&gt; ------------------------- | ------ | --------------- | ---------------&gt; dustindorroh/tensorflow | 0.6.0 | pypi |&gt;...","categories": ["tensorflow"],
        "tags": ["tensorflow"],
        "url": "https://www.soudegesu.com/tensorflow/tensorflow-anaconda/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "ブログ(静的サイト)をHUGOを使って作成する",
        "excerpt":"本サイトでは jekyll を使用してブログを作成しているのですが、他にも HUGO や hexo を使用されている方も多くいらっしゃるようなので、今回はHUGOを使用してブログコンテンツを作成する方法を紹介したいと思います。 ゴール 事前準備 HUGOをインストールする前に… HUGOのインストール(MacOSの場合) HUGOを使ってコンテンツを作成する HUGOテンプレートで生成する サイトのデザイン(theme)を設定する themeを探す themeをインストールする themeを設定する 記事を作成する (余談)archetypes/defaults.md を利用して手間を減らす コンテンツの出来栄えをローカル環境で確認する コンテンツをビルドする まとめゴール HUGOで静的サイトの作成ができるようになる事前準備HUGOをインストールする前に…以下がローカルマシン上にインストールされていると以降の手順が捗ります。 Homebrew gitHUGOのインストール(MacOSの場合)Homebrewを使用するとHUGOを簡単にインストールできます。#brew install hugoHUGOのバージョンを確認してみましょう。#hugo versionHugo Static Site Generator v0.20.7 darwin/amd64 BuildDate: 2017-05-05T22:14:37+09:00v0.20.7(2017/05時点で最新)がインストールされていることがわかります。HUGOを使ってコンテンツを作成するHUGOテンプレートで生成するhugo new siteのサブコマンドを実行するだけで静的サイトのテンプレートをgenerateしてくれます。今回は hoge というディレクトリ配下に作成します。#hugo new site hogehoge 配下で tree コマンドを実行すると以下のようなファイルレイアウトが生成されていることがわかります。#cd hoge#tree -L 1 .├──...","categories": ["blog"],
        "tags": ["hugo","blog"],
        "url": "https://www.soudegesu.com/blog/hugo/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "AWS Certification ManagerのSSL証明書の検証にはDNS検証を使った方が良い",
        "excerpt":"Route53でCertification Managerのドメイン検証ができるようになった SSL証明書”発行”の違い E-mail検証は手間がかかる DNS検証によって検証ステップが格段に簡素になる SSL証明書”更新”の違い ACMのSSL証明書有効期限は13ヶ月 ACM更新のプロセス ①AWS側によるACMの自動検証と自動更新 ②ドメイン管理者に催促メールを通知 ③AWSアカウントに催促メールを通知 ④手動でのACM検証作業 E-mail検証の自動更新条件は複雑 DNS検証の自動更新条件は単純 まとめ 参考にさせていただいたページRoute53でCertification Managerのドメイン検証ができるようになったDNS を使って AWS Certificate Manager の検証を簡単にの記事にも記載があるように、2017/11に AWS Certification Manager(以下ACM) のSSL証明書取得の際の検証手順に Route53のDNS検証 が追加されました。実はこれは、ACMで取得したSSL証明書の 取得 だけではなく 更新 においてもとても大きな利点があるので、今回はそれを紹介します。SSL証明書”発行”の違いE-mail検証は手間がかかる従来、ACMにてSSL証明書を取得する際のドメイン検証の方法は、Certificatioin Managerで証明書発行依頼を出した後、受信したE-mailの本文に記載されている一時リンクを踏んで承認ボタンを押す、という手続きを踏んでいました。その際の注意点は、AWSからの検証確認メールを受信できるメール受信箱が必要になる ことでした。私の場合、会社が取得しているドメインのサブドメインを委譲してもらい新規プロダクトを実装することが多いため、身近にいないドメイン管理者(別部署や別会社)の受信箱にのみメールが届いてしまい、自分のタイミングで承認ボタンを押すことができませんでした。そのため、私の場合は自分のAWSアカウント内にE-mail検証のためのメール受信箱を作成していました。自前のAWSアカウント内で検証を完結させるためには、 受信ボックス代わりになるS3バケットを作成し Route53にTXTレコードやMXレコードを作成し SNSで受けたメールをS3に振り分け、 S3バケットで受け取ったメール本文をダウンロードして、リンクを踏むという手順を踏まなくてはいけません。こちらの設定の手順はクラスメソッドさんのブログ「 [ACM] SSL証明書発行時のドメイン認証メールをSESで受け取ってみた 」に掲載されておりますので、興味のある方はご参照ください。DNS検証によって検証ステップが格段に簡素になるDNS検証ではRoute53に追加されたCNAMEレコードを用いてドメインの有効性を確認します。そのため 「Create record in Route 53」 でCNAMEレコードを作成\bし 少し待つ(10分くらい?)で検証が終了\bします。ね、簡単でしょう？SSL証明書”更新”の違いACMのSSL証明書有効期限は13ヶ月ACMで発行したSSL証明書の有効期限は13ヶ月です。そのため、1年程経過したらSSL証明書の更新作業が発生します。これはSSL証明書を運用されている人でしたら毎度のことなのですが、 証明書の更新時期を忘れないよう に通知の仕組みを入れたり、引き継ぎをしたり様々な工夫をされていることかと思います。ACM更新のプロセスまず、ACM\bのSSL証明書更新の全体の流れを\b抑えましょう。①AWS側によるACMの自動検証と自動更新ACM期限切れの60日前に自動更新可能なものかAWS側で検証し、検証に成功した場合には自動更新を実施してくれます。(自動更新の条件は後述します)②ドメイン管理者に催促メールを通知①の自動更新に失敗した場合には、証明書に記載されているドメインの管理者に対してメールが通知されます。(WHOISに記載されているメールアドレスもしくは、ドメイン名の前にadmin@を付加したメールアドレスになります)③AWSアカウントに催促メールを通知②のメールからも検証が確認されない場合、AWSアカウントに登録されているメールアドレスに対して通知されます。④手動でのACM検証作業メールに記載されたURLにアクセスし、承認ボタンを押すことでACMの検証が完了します。ただし、実際にACMが更新されるまでに数時間程度のタイムラグが発生することをAWSでは謳っています。①にも記載の通り、素晴らしいことにACMはSSL証明書を自動更新することができます。ただし、自動更新するためには条件がありますので、以下に説明します。E-mail検証の自動更新条件は複雑E-mailで検証したSSL証明書の自動更新の条件は以下になります。...","categories": ["aws"],
        "tags": ["aws","acm","route53","ssl"],
        "url": "https://www.soudegesu.com/aws/validate-certification-manager",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "JavaプロジェクトをModule System(Java9のProject Jigsaw)にマイグレーションするステップ",
        "excerpt":"はじめに 注意点 どうなる？これからのJava 半年に1度訪れるJava SEのリリース ウォッチすべき話題はJavaのサポート期限 Java8はいつまでサポートされるか 他にも気をつけておいた方が良いこと Module Systemへのマイグレーションに挑戦 Step 1. Module Systemの基礎を勉強する Step 2. 依存ライブラリのバージョンアップを行う ライブラリのリリース\bノートを読んで「大丈夫だな」と\b早合点するのは危険 Step 3. Unnamed Moduleにマイグレーションする Step 4. Named Moduelにマイグレーションする Step 5. 負荷試験とリソースモニタリングをする まとめ 参考にさせていただいたページはじめに今回はJava 9\bで追加されたModule System移行に関して説明します。自身で手を動かすことで、\b\bJavaのプロダクションコードをJPMSに適用するための作業手順の\b一定の目処がたったのでまとめておきます。実は 社内向けにも同様の発表 はしています。少し\b\bネガティブなニュアンスで資料を書いていますが、社内の(いろんな意味で)危機意識を煽るため、という背景もあったので、その点ご了承ください。\u001c注意点2018/1時点での情報を基に記載をしていますので、今後変更になる可能性があります。最新の情報と照らし合わせながら適宜情報の補填を行っていただければと思います。どうなる？これからのJavaここではまず最初に、足元のJPMSの話ではなく、Javaエンジニアが把握しておくべき今後の全体的な流れについて触れておきます。半年に1度訪れるJava SEのリリース昨年のJava Oneにて Java9 以降のJavaのリリースロードマップが発表\bされました。要点だけまとめると以下\bになります。 リリース頻度は半年に1度(次は2018/3、その次は2018/9) バージョニングは 9, 10, 11 Oracle社の\bページでは yy.MM 形式で記載されているで注意 \b\b\b時間軸でリリースがされていくため、\b\b期限までに実装終了したフィーチャーがリリース対象\bの機能として取り込まれる early access...","categories": ["java"],
        "tags": ["java","gradle","springboot","JPMS"],
        "url": "https://www.soudegesu.com/java/java9-modularity/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "Q# 量子コンピューティングプログラミング言語を試す",
        "excerpt":"もともとは 仮想通貨 を調べていた時に、 量子耐性 という言葉を発見し、量子耐性から 量子耐性のあるアルゴリズム や量子プログラミング言語である Q# に行き着きました。Wikipediaなどを見てみると、Q# はどちらかといえば研究者向けの言語らしいので、普段の業務との関連性は少なそうですが、せっかくなので触ってみようと思います。 Q#の環境構築 Azure上でのWindowsインスタンスセットアップ Microsoft Quantum Development Kitのインストール サンプルコードのインポート サンプルコードの実行(なるほど、わからん) 基本を抑える Qubit 量子コンピューティングの基本を抑える [注意点]Reference to unknown namespace xxx が出る場合 Q#の標準ライブラリを見てみる 少し変わったプリミティブ型 Qubit Pauli Result 標準関数も少し見てみる まとめ Q#の理解\b自体はそこまで難しくない 今後Q#はどのように活用されるのか 参考にさせていただいたサイトQ#の環境構築開発環境の構築に関しては大きく補足することは無さそうです。公式サイトも手順が手厚めに記載されています。ただし、セットアップの途中で気づいたのですが、 Macは Microsoft Quantum Development KitのExtensionをインストールできない ことが判明しました。手順の序盤に記載があったのですが、すっかり読み飛ばしていました。 現時点のVisual Studio for Mac がこのExtensionをサポートしていない、というのです。仕方がないので、Mac使いの私はAzure上にWindowsのインスタンスを構築し、Remote Desktop接続にて作業をすることにしました。Azure上でのWindowsインスタンスセットアップMicrosoft Azureは30日間フリーで使えるクレジットを準備してくれているので、Visual...","categories": ["q_sharp"],
        "tags": ["q#"],
        "url": "https://www.soudegesu.com/q_sharp/what-is-q-sharp/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "AWS RDS Aurora Cluster(MySQL互換)でパーティションをプロシージャで定期的に追加しつつ、エラーハンドリングもする",
        "excerpt":"AWSのRDS AuroraはOSSのDBミドルウェアと互換性のあるマネージドサービスです。\b\b今回はAuroraのMySQL互換での日付パーティションの作成に関して説明します。AuroraというよりはMySQLの仕様に関する説明も多いのでご了承ください。 今回やりたかったこと パーティションを日次で追加する \bテーブル作成とパーティションの指定 パーティション追加用のプロシージャを作成\b 初期パーティションを作成する プロシージャ実行をEVENT登録し定期実行する RDS Aurora Clusterの場合を考える EVENTはWriterのみで実行される エラーが発生したらどうするか プロシージャ実行時のエラーはlambdaで検知する Aurora ClusterにIAM Roleを追加する RDSインスタンスのあるsubnetのルーティング設定をする プロシージャ側のエラーハンドリングを追加する lambda関数を作成する [備考]RDSのエラーログが出力されない? まとめ 参考にさせていただいたサイト今回やりたかったこと今回はRDS Aurora(MySQL互換)にてClusterを組み、テーブルは日でパーティショニングすることにし\bました。要件はざっくり以下です。 ユーザ操作の都度データが格納されていく(データは常にINSERT) 一定\b期間が経過した\bデータには利用価値が薄い ため退避した後削除して良いそもそもDynamoDBでよくない？というツッコミがあるかもしれませんが、システムとは別の理由があるため採用していません。今回は以下のような hoge テーブルを考えます。hoge テーブルにはユーザ(id)が行なった操作を info \bカラムに\b格納します。create_at はパーティションキーであり、 id と create_at が PKです。なお、パーティションキーはPKに含める必要があります\b。 カラム名 型 備考 id varchar(255) ユーザのID info varchar(255) ユーザが行なった操作の情報 create_at timestamp レコードが作成された日時...","categories": ["aws"],
        "tags": ["aws","rds","aurora","SQL","MySQL"],
        "url": "https://www.soudegesu.com/aws/rds-aurora-cluster-partitioning-procedure/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "Udemyでサイバーセキュリティコース「The Complete Cyber Security Course : Hackers Exposed」を受講した",
        "excerpt":"昨今の仮想通貨流出問題を受けて、システム開発に携わるエンジニアにとって、セキュリティの専門家でなくても、サイバーセキュリティに関する学習の必要性を感じている方はいらっしゃるのではないでしょうか。かくいう私もその口で、今回は Udemy というオンライン学習プラットフォームを活用してサイバーセキュリティの基礎を学んだ感想を書きます。 Udemyとは何か 学習のため購入したコンテンツ なぜこのコンテンツにしたのか レベル感が視聴者(私)に合ってそうだったから 有料コンテンツのしかも「トップヒット」だから 英語のコンテンツだから 実際に受けてみた感想 良かった点 包括的かつ理解しやすいコンテンツだった サイバー犯罪＝スーパーハカーの仕業という幻想を壊せた 未知の領域の学習は映像がオススメ 反省点 コースコンテンツをちゃんと読めば良かった まとめUdemyとは何かUdemyはオンライン学習プラットフォームです。自身の目的に合った学習コンテンツを購入し、オンラインで受講することができます。今回はサイバーセキュリティのコンテンツを購入したのですが、Robotics や 機械学習 のような別のIT分野の授業もありますし、投資信託 のような経済系のコンテンツ等の幅広いジャンルの取り扱いがあります。学習のため購入したコンテンツ今回はUdemyの中でもサイバーセキュリティのコンテンツのジャンルの中で人気のコンテンツ 「The Complete Cyber Security Course : Hackers Exposed!」 を購入しました。価格は 1,300円 ほどで、クレジットカードでお支払いです。この The Complete Cyber Security Course シリーズは全部で以下4つのコースが提供されており、先に進む程応用的な内容になっているそうです。(全部まだ受けていないので、伝聞で書いています) The Complete Cyber Security Course : Hackers Exposed! The Complete Cyber Security...","categories": ["security"],
        "tags": ["cyber","security","udemy","beginner"],
        "url": "https://www.soudegesu.com/security/take-udemy-cyber-security-hacker-exposed/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "EthereumでDApps開発のための開発環境を構築する(Ethereumで別アカウントに送金まで)",
        "excerpt":"以前、IPFS を調査したことがあり、そこから Ethereum の存在を知りました。昨年頃から本格的に日本でも名前が売れてきて、日本語のソースも増えてきたこともあるので、これを機にサンプルでも作成しようかと思いました。今回はDApps開発のための下準備までを纏めます。 環境情報 Etehreumのセットアップ Ethereumのインストール 設定ファイルの作成 プライベートネットワークの初期化 アカウントの作成 マイニングの動作確認をする 別アカウントにEthを送ってみる まとめ 参考にさせていただいたサイト環境情報今回、私は以下の環境にて構築を行いました Mac Book Pro OS: High Seria 10.13.2 Homebrew 1.5.6 Etehreumのセットアップ今回は Ethereum を使用します。理由としては、DApps開発のためのOSSとして開発が積極的に行われており、様々なDAppsにて使用されている(らしい)からです。EthereumのインストールHomebrewがあれば簡単にインストールができます。 リポジトリを追加brew tap ethereum/ethereum Ethereum をインストールbrew install ethereum バージョンを確認geth -h&gt; NAME:&gt; geth - the go-ethereum command line interface&gt;&gt; Copyright 2013-2017 The go-ethereum Authors&gt;&gt; USAGE:&gt; geth...","categories": ["ethereum"],
        "tags": ["ethereum","dapps","truffle","ganache"],
        "url": "https://www.soudegesu.com/ethereum/ethereum-development-environment/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "EthereumでDApps開発のための開発環境を構築する(Truffle&Ganache接続まで)",
        "excerpt":"前回の記事 で Ethereum の開発環境の構築を行いました。今回はさらに Ethereum 用のフレームワークである Truffle と Ganache を使ってローカルでの開発環境を整えようと思います。 Truffleとは Ganacheとは セットアップ 設定 package.json の修正 truffleを初期化する Ganacheと接続する まとめTruffleとはTruffle は Ethereum アプリケーションの開発効率を上げるためのフレームワークです。ボイラープレート的な仕事をしてくれるところから始まり、 ネットワーク接続の設定管理や、ネットワークのマイグレーション実行や初期化、テストフレームワークをバンドルしていたりなど、一通り開発できるように準備を整えてくれます。GanacheとはGanache はDAppsを開発時のテストをする際に使用するローカル用のプライベートネットワークを構築してくれます。自動マイニングしてくれるので、別でターミナルを立ち上げて、マイニング用のコマンドを実行する必要もありません。発生したトランザクションは順番にソートされて表示もされるので、動作確認も比較的容易にできると思います。セットアップ以前同様の記事を書きましたが、簡単におさらいします。 Etehreum のインストールbrew tap ethereum/ethereumbrew install ethereum nodenvのインストール私の場合、ローカル環境のグローバルなnodeのバージョンを変更したくないので、 nodenv を使って切り替えています。brew install nodenvnodenv起動のために、 ~/.zshrc に以下を追記します。export PATH=\"$PATH:$HOME/.nodenv/bin:\"eval \"$(nodenv init --no-rehash -)\" node(9.6.1)のインストールと設定nodenv install 9.6.1nodenv local 9.6.1node -v package.json の作成npm...","categories": ["ethereum"],
        "tags": ["ethereum","truffle","ganache","dapps"],
        "url": "https://www.soudegesu.com/ethereum/ethereum-development-with-ganache/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "springboot-webfluxのバックプレッシャーを体験してたらいい感じだった",
        "excerpt":"2018/3にリリースされた springboot2 から spring5 がバンドルされるようになりました。リリースの中でも注目機能と言われている webflux 、とりわけ webflux が内包しているリアクティブプログラミングライブラリである Reactor はspringユーザであれば気になるはずです。今回はバックプレッシャーがいい感じだったので、それをまとめてみました。 今回作成したリポジトリ RouterFunctionを登録する パフォーマンスを測定してみた 環境情報 バックプレッシャーを体験する springboot-webfluxは普通に生きている springboot-webmvcはやっぱり死んだ スレッド増加の傾向を見てみる まとめ 参考にさせていただいたサイト今回作成したリポジトリ今回作成したリポジトリは こちら です。全てローカル環境で動かせるように docker-compose でコンポーネント化してあるものの、 ローカルマシンのリソースを食い合うため、負荷試験をするときはLinuxサーバ上に展開することをオススメします。RouterFunctionを登録する以下のような RouterFunction を作成し、 @Bean で登録しておきます。RouterFunctionのレスポンスを返す部分はもう少しいい実装がありそうですが、一旦こうしました。 RouterFunction@Componentpublic class HelloWebClientHandler { @Value(\"${app.backend.uri}\") private String baseUri; private static final String PATH = \"/test\"; public RouterFunction&lt;ServerResponse&gt; routes() { return...","categories": ["java"],
        "tags": ["java","spring","webflux","reactor"],
        "url": "https://www.soudegesu.com/java/non-blocking-webflux/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "Cloudfront+Lambda@Edgeのサーバレス構成で費用を抑えつつ、動的なWEBコンテンツを作ろう[貧テック]",
        "excerpt":"このブログ自体は github-pages と cloudflare を使って無料でホスティングをしているのですが、稀に 「動的なwebコンテンツを提供したい」 と思うことがあります。今回はお金を節約しつつ、動的なwebコンテンツを提供する方法を紹介します。 モチベーション 動的なwebコンテンツを作りたい！ 問題点：アクセスが少ない時期はランニングコストが高くつく サーバレスで費用を抑えよう 案1 Cloudfront + Lambda@Edge 案2 API Gateway + Lambda 案3 GCPのGCE f1-micro インスタンス AWSで構築してみる IAM Roleの作成 ドメインを設定する Certification ManagerでSSL証明書を取得する Lambda関数の作成とpublish Lambda@EdgeはCloudfrontのオリジンリクエスト時に実行させる Lambda@EdgeからCloudfrontへのレスポンス形式に注意する Cloudfrontで配信する Lambda関数はpublishして使う キャシュクリアをする(2回目以降のデプロイ時) まとめ 参考にさせていただいたサイトモチベーション動的なwebコンテンツを作りたい！Google Adsense等を使った広告収入で小遣い稼ぎをしたいと思った場合に、はてなブログ のような無料ブログサービスや Github Pages を利用すると、主に静的ファイルでのコンテンツ配信が中心になります。1ページあたり1記事を作成する必要があり、1ページあたりの作成コストが高くなるデメリットがあるため、リクエストパラメータないしはパスパラメータを使ってサーバ側で動的なページ生成を行う機構があれば、ロングテールでのページのクローリングを狙うことができます。ちなみに、ロングテールをざっくり説明すると、 単体の検索ボリュームでは少ないけど、複数カテゴリの検索クエリの組み合わせのバリエーションに対応することで、検索ボリュームの総和に対してリーチする 方法です。問題点：アクセスが少ない時期はランニングコストが高くつく従来、動的なwebコンテンツを作成しようとする場合、ページ生成プログラムを動かすためのサーバが必要 でした。環境調達の方法としては「レンタルサーバを借りる」のが一般的ですが、バンドルされている WordPress で要件が充足されないケースがある場合には、VPS サービスを契約しなければいけません。VPSサービスは通常のレンタルサーバよりもランニングコストが少しお高めになってしまいます。参考までに2種類のサービス料金を記載しますが、コンテンツ配信のための月額料金がボディブローのようにじわじわ効いてくることが容易に想像できます。 サービス名...","categories": ["aws"],
        "tags": ["aws","lambda","cloudfront","serverless"],
        "url": "https://www.soudegesu.com/aws/hosting-with-cloudfront-lambda-edge-serverless/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "AWS LambdaのコードをTerraformでデプロイする",
        "excerpt":"今更感もありますが、今日はTerraformでのAWS Lambdaのコード化について書きます。AWS Lambdaは Cloud9 がコンソール上に組み込まれたこともあり、開発がさらに容易になりました。ブラウザエディタは そのままwebにつながる というのが最大の強みですが、まだまだ手元のリポジトリでコードを管理している手前、AWSのサービスだけで完結できていないのが現状です。今回はAWS LambdaのコードをTerraformを使ってデプロイする方法を説明しようと思います。↓ちなみに下が組み込まれたCloud9 TerraformでAWS Lambdaをデプロイしたい やってみる コードのエントリータイプはzipにしよう シェルでzip圧縮したいソース一式を作成する Terraformでzip圧縮&amp;デプロイ ビルド&amp;デプロイをつなげる まとめ 参考にさせていただいたサイトTerraformでAWS LambdaをデプロイしたいInfrastructure as Code はクラウド界隈でバズってだいぶ時間も立っていますので、あまりここでは触れません。必要に応じて界隈の方のブログや以下の書籍を読んでください。AWS Lambdaがサービスとして登場した頃は、簡易なバッチ的な仕組みとしての用途が多く、作り捨てなコードが多かったです。その後、連携可能な他のAWSサービスも増えて、VPC内に立ち上げることも可能になり(起動時間はかなり遅いですけど)、用途の幅に広がりが出てきました。そんな 「まぁ、Lambdaでいっか」 ケースが増えると同時に、一度デプロイしたLambdaのコードを修正して再デプロイするというケースも増えてきました。業務上 Terraform を使ってAWSリソースをコード化しているので、Lambdaもその管理の対象にしようと思ったのが契機です。やってみる実際にLambdaをTerraformでデプロイするコード化してみました。コードサンプルは こちら にあります。簡単にリポジトリの説明をしておきます。デプロイ用のマシンに必要なライブラリ等は以下になります。 Terraform Python 3.6またディレクトリ構成はこんな感じです。.├── Makefile├── README.md├── build.sh├── lambda-src│   ├── __init__.py│   └── main.py├── requirements.txt└── terraform ├── backend.tf ├── dev.tfvars ├── lambda.tf ├── provider.tf └──...","categories": ["aws"],
        "tags": ["aws","lambda","terraform"],
        "url": "https://www.soudegesu.com/aws/deploy-lambda-with-terraform/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "クロスアカウントで共有されたS3バケットはAWSコンソール上から参照可能なのか",
        "excerpt":"AWS S3はバケットポリシーを設定することで、クロスアカウントでのバケット共有ができます。設定により、複数のアカウントからバケットに対して操作を行うことができるため、大変便利な機能です。しかし、バケットのオーナーアカウントではAWSコンソール上でバケットを確認できるのですが、共有された側ではS3バケットのコンソールにバケットが表示されません。今回はなんとかして閲覧する方法はないものかと試行錯誤してみました。 やりたいこと S3をファイルストレージサービス的にファイル共有に使いたい でもバケットのあるAWSアカウントにログインさせたくない 課題 ユーザはブラウザしか使えない コンソール上のバケットリストはバケットのオーナーアカウント側でしか見れない 案1 バケットのURLを直接叩かせる[非公式] 案2 Switch Roleを使う[正攻法] まとめやりたいことS3をファイルストレージサービス的にファイル共有に使いたい今回やろうとしていたことを簡単に説明します。以下の図にまとめました。既に本番環境で稼働しているサービスがあり(アカウントA)、アカウントA内にあるS3バケットにストアしているデータを他部門に提供する必要が出てきました。でもバケットのあるAWSアカウントにログインさせたくない普通に考えれば、アカウントAで他部門向けのIAM GroupとIAM Userを作成する、というのが簡易な解になるのですが、少し事情があります。アカウントA自体が社内のセキュリティレベルが高めに規定されているため、他部門のIAM UserをアカウントAの中に作るのが難しいのです。そのため、 他部門向けの 別のAWSアカウントBを作成し、アカウントBに対して対象のバケットのみを共有するようにすれば要求が充足されるのではないか、という話になり、その方法を中心に検討をすることになりました。課題ユーザはブラウザしか使えない今回のケースでは他部門の人間がエンジニアではないため、ブラウザでのファイルダウンロードしかできない という制約がありました。 AWS CLIのインストールも嫌がられてしまったため、 「AWSのS3コンソールからファイルを見せる」 必要がありました。コンソール上のバケットリストはバケットのオーナーアカウント側でしか見れないアカウントAで soudegesu-bucket-foo というS3バケットを作成し、以下のようにバケットポリシーを作成することでアカウントBにバケット共有の設定をしました。{ \"Version\": \"2012-10-17\", \"Statement\": [ { \"Sid\": \"GetObject\", \"Action\": [ \"s3:GetObject\" ], \"Effect\": \"Allow\", \"Resource\": \"arn:aws:s3:::soudegesu-bucket-foo/*\", \"Principal\": { \"AWS\": [ \"アカウントBのAWSアカウントID\" ] } }, {...","categories": ["aws"],
        "tags": ["aws","s3"],
        "url": "https://www.soudegesu.com/aws/s3-cross-account/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "継続的デリバリのためにfeatureのリリースと改善系アイテムのリリースは分けよう",
        "excerpt":"継続的デリバリ(Continuous Delivery)はITの現場で一般的なものと浸透してきました。継続的デリバリを実現するためには、継続的インテグレーションの仕組みと再現性のあるデプロイメントパイプライン基盤の整備が必要です。これにより出荷可能なプロダクトを頻繁にリリースすることが可能になります。今回は頻繁にリリース可能な環境下において、より安全にサービスをデリバリするための個人的な考えをまとめたものです。 デプロイの失敗を考える Decoupling deployment from release(デプロイとリリースは分離しよう) 失敗した時の「被ダメージ」 失敗したときの被ダメージを「軽減」する 一度にリリースする量を減らす Decoupling improvement from feature(改善とフィーチャーは分離しよう) 失敗リスクを細分化する まとめデプロイの失敗を考えるDecoupling deployment from release(デプロイとリリースは分離しよう)かつて、Technology Readerのtechniquesに Decoupling deployment from release というものが紹介されていました。これは、ITの現場で「商用作業」または「本番リリース」と言われている作業を2つのプロセスに分割して行うことを提案しています。 商用環境へのシステムの展開(デプロイ) デプロイされたシステムをサービスインさせる(リリース)デプロイしてもエンドユーザに成果物は提供されません。リリースして初めて利用可能になります。つまり、リリースしない限りはビジネスに与える影響がないのです。デプロイ後に成果物の動作確認をし、問題があれば切り戻せば良いのです。これはビジネス上のリスクを軽減するための方法としてとても画期的な発想で、私もプロダクト開発に携わる時には可能な限り Decoupling deployment from release ができるシステム構成やデプロイメント基盤の構築を心がけています。チームのメンバーにも「デプロイ」と「リリース」という単語を明確に意味を分けて使うようにお願いしているし、彼らも納得してそうしてくれているので有り難い限りです。エンジニアが「自分の行っている行為がビジネスラインに与える影響」を意識するのはとても良いことで、単にビジネスインパクトといっても、「新しいfeatureを提供する」というポジティブなビジネスインパクト もあれば、「システム障害」「セキュリティインシデント」のようなネガティブなビジネスインパクト もありますから、ポジティブなものは「どうやって最大化するか」を、ネガティブなものは「どうやって最小化するか」を考えながら仕事をするのはエンジニア冥利に尽きるわけです。Decoupling deployment from release はどちらかと言えば後者の、ネガティブなビジネスインパクトを軽減するためのテクニックに分類できると私は理解しています。失敗した時の「被ダメージ」仮にデプロイ後の動作確認で何らか問題が見つかったとします。その場合、サービスされているシステムはそのままに、デプロイしたリソースを切り戻すことになるでしょう。問題が発生したリソースは撤収され、ビジネスにネガティブなインパクトを与えることはありませんでした。あー良かった良かった。…本当にそうなのでしょうか？もし、今回リリースする成果物のfeatureが プレスリリースを打っていたら？ 法人のお客様に約束をしていたら？どうなるでしょうか。そうですね。プロダクトにおける重要なマイルストーンを含む場合、「新しいfeatureを提供する」というポジティブなビジネスインパクトを妨げる 機会損失 というネガティブなビジネスインパクトを与えているはずです。優れたアジャイル開発チームであれば「顧客が本当に必要だったもの」を肌でも感じていますが、取り組むべき価値のあるfeatureから順次提供している はずです。この観点を踏まえると、「マイルストン通りfeatureを提供できないこと」は「重度のシステム障害が起こる」よりはマシですが、問題に変わりはありません。失敗したときの被ダメージを「軽減」する結局、エンジニアは自分の置かれた環境と判断材料を基にして リスクの発生のしやすさ と 顕在化した時の被ダメージ を頭の片隅において仕事をしているのです。先程の例は更に突き詰めていくと、 「デプロイ作業の工数が無駄になった」 とか、会社によっては 「障害報告の工数が発生した」...","categories": ["continuous-delivery"],
        "tags": ["continuous-delivery","agile"],
        "url": "https://www.soudegesu.com/continuous-delivery/separate-improvement-and-feature/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "Pythonで日付文字列からのdatetime変換やタイムゾーンの変更などをいい加減覚えたい",
        "excerpt":"仕事がらpythonを使って、データのコンバータを作成することも度々あるのですが、pythonのdatetimeを使った文字列から日時への変換 や タイムゾーンの変更 を毎回ネットで調べているので、いい加減覚えないと業務効率上差し支えそうです。今回は自分の備忘録的な意味も込めて書こうと思います。 環境情報 頻繁に使う変換 epochtimeからdatetime epochtimeからdatetime ミリ秒を含むepochtimeからdatetime エポックミリ秒からdatetime 文字列からdatetime タイムゾーンあり日付文字列からdatetime タイムゾーンなし日付文字列からdatetime 日時データを扱う上で注意すべきこと naiveとaware マシン上のタイムゾーンで処理しないように注意する まとめ 参考にさせていただいたサイト環境情報今回のPythonの実行環境は以下になります。 python 3.6 pytz jupyter notebook頻繁に使う変換データのクレンジング作業などで時系列データを取り扱う場合には、特定のミドルウェアや他人のコンバータが出力するデータ仕様を調査した上で加工処理を施すことが多いです。Pythonでは日付時刻の処理を行う場合に datetime や date、 time などの型を使って処理をしますが、今回は datetime を使います。epochtimeからdatetimeepochtimeを表す 数値型 から datetime に変換します。epochtimeはUnix時間とも言われますが、世界標準時の1970年1月1日午前0時0分0秒からの経過秒数を整数値で表したものです。詳細はwikipediaを見た方が早いと思いますので、 こちら をみてください。UTCからの経過秒数を表現していることから、その数字からタイムゾーン付きのデータに変換することは容易です。強いて言えば、epochtimeの数値データが エポック秒 なのか エポックミリ秒 なのかの確認をしておくと良いでしょう。桁数を見るか、関数に実データを放り込んで判別することが多いです。datetime型の fromtimestamp 関数を使えば記述もシンプルに済ませることができます。epochtimeからdatetimefromtimestamp 関数を使った変換のサンプルは以下になります。import datetimee = 1524349374dt = datetime.datetime.fromtimestamp(e)print(dt)# &gt;&gt; 2018-04-22...","categories": ["python"],
        "tags": ["python"],
        "url": "https://www.soudegesu.com/python/python-datetime/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "AWS LambdaでCasperJSを実行してファイルアップロードを自動化する",
        "excerpt":"AWS上のデータを別サービスに連携するために、AWS LambdaからCasperJSを使ってファイル配置を自動化する仕組みを作ってみました。APIでデータをPOSTできれば簡単なのですが、今回はGUI上からファイルをアップロードしないといけないため、技術の無駄遣いをしてみます。 日次でファイルをアップロードしたい CasperJSとは Lambda + CasperJS で実現してみよう 実装時のポイント Lambdaに割り当てるリソースは大きめに、タイムアウトは長く設定する AWS LambdaにPhantomJSのパスを通す S3オブジェクトを一度Lambdaのコンテナ上にダウンロードする Lambda実行の最後にS3バケットへ画面キャプチャをアップロードする ブラウザの言語設定を英語にした まとめ 参考にさせていただいたサイト日次でファイルをアップロードしたいことの発端は以前書いた記事 「クロスアカウントで共有されたS3バケットはAWSコンソール上から参照可能なのか」 にて、S3のバケット共有の機能を使ってファイルの提供をしようと試みた のですが、社内のセキュリティ統制的にNGを喰らってしまいましたので、指定のファイルストレージサービスを経由してファイルの授受を行う必要が出てきました。そのファイルストレージサービスというのが若干レガシーなシステムで、APIを使ったファイルのアップロードができません。そのため、ヘッドレスブラウザでのGUI操作ができるライブラリを使用してファイルアップロードをしようと考えた次第です。これを実装しないと、私が毎朝システムにログインしてファイルをアップロードするという苦行が発生するため、是が非でも作る必要がありました。退屈なことはプログラムにやらせましょう。CasperJSとはCasperJS は PhantomJS のラッパーライブラリです。PhantomJS 自体はwebkitをベースとしたヘッドレスブラウザです。実ブラウザを起動するSeleniumよりも高速に動作するので、GUIを持つ必要のない処理（例えばGUIの自動テストや、今回のような機械的な処理)に向いています。昨年頃に Chromeもヘッドレスで起動できる ようになっているため、PhantomJSでなくても良いのですが、過去にPhantomJSを使った経験があったため、再びこれを採用しています。ラッパーであるCasperJSを使う利点は、ブラウザ操作のユーティリティが揃っていることです。セレクタに対するwaitや、イベントの発火、データ入力等のコードをシンプルに書くことができます。というか、PhantomJS単体だと自前定義のfunctionが多くなるためオススメできません。Lambda + CasperJS で実現してみよう早速実装してみましょう。今回作成したプログラムは こちら です。なお、このプログラム自体は node-casperjs-aws-lambda を参考にしています。今回実装したアーキテクチャはざっくり以下のようなイメージです。実行環境やライブラリは以下になります。 Node 6.10 CasperJS 1.1.4 PhantomJS 2.1.1また、処理の流れは以下になります。 LambdaがETL処理をする ETL処理終了後にS3にファイルをアップロード BucketのPUTイベントを基にファイルアップロード用のLambdaが実行される LambdaでCasperJSが動き、他サービスにファイルをアップロードする実装時のポイントLambdaに割り当てるリソースは大きめに、タイムアウトは長く設定するヘッドレスとは言え、CasperJSを実行するために、Lambdaに割り当てるメモリは大きめにした方が良いです。加えて、Lambdaのタイムアウト値は最大値の5分に設定しておきましょう。もちろん、これらは実装する処理の重さに依存します。AWS LambdaにPhantomJSのパスを通すnode_module 内のPhantomJSはLambda上ではいい感じに見てくれなかったので、PhantomJSのバイナリをダウンロードして直接パスを通してあげました。余談ですが、AWS Lambdaの環境変数一覧は ここ に纏められています。はじめて知りました。S3オブジェクトを一度Lambdaのコンテナ上にダウンロードするS3のPUTイベントをトリガーに処理が実行されるのですが、event オブジェクトにはバケットの情報やオブジェクトキーの情報しかないため、そこから一度、Lambdaコンテナの /tmp/...","categories": ["aws"],
        "tags": ["aws","lambda","casperjs"],
        "url": "https://www.soudegesu.com/aws/casperjs-on-lambda/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"},{
        "title": "MySQL/PostgreSQLの脆弱性が発表された時に、RDS Aurora使いはどう対処すべきか",
        "excerpt":"アプリケーションの脆弱性対応は調査にも時間がかかりますし、大変ですよね。RDS Auroraのようなマネージドサービスの場合、互換性のあるデータベースエンジン(MySQLやPostrgeSQL)の脆弱性が発表されたら、どうしたらよいのでしょうか。少し気になったので調べてみました。 [経緯]セキュリティバスターズからの依頼 Auroraの仕組み サポートに聞いてみよう Latest Bulletins を見てみよう まとめ 参考にさせていただいたサイト[経緯]セキュリティバスターズからの依頼そこそこ大きい会社になってくると、セキュリティを専門とする部署があって、CVE の情報を収集しては「こんな脆弱性が発表されたぞ！君たちのプロダクトは大丈夫なのか！？報告したまえ！」みたいなやりとりが発生します。情報を展開してくれるのは大変ありがたいのですが、やりたまえって、なんかそういうエージェント仕込むやつでもいいから少しは手伝ってくだされ。例のごとく、「MySQLの脆弱性が発表されたぞ！これな！」というお達しと共にCVE-2018-XXXXCVE-2018-XXXXCVE-2018-XXXX(以下略)対象と思しきCVEのリストが展開されるのです。純粋なMySQL/PostgreSQLでないにせよ、OSSのデータベースエンジンに互換性のあるAuroraを使用している場合、我々は公表された脆弱性にどう対処するのが良いのか？とふと思ったわけです。なお、私の使っているAuroraのバージョンは 1.15.1 、互換のあるMySQLのバージョンは 5.6.10-log でした。Auroraの仕組みそもそも「互換性がある」 からと言って、内部的な仕組みは違うので、一概に言えないのが難しい所です。例えば、下のスライドを見ると少しわかるのですが、ストレージ部分のアーキテクチャはAurora独自な感があるので、CVE-2018-2755 みたいなレプリケーションに関連する脆弱性は対象にならないのではないか、と推察したりもできます。 Amazon Aurora - Auroraの止まらない進化とその中身 from Amazon Web Services Japan サポートに聞いてみようただ、推察の域を出ないので、AWSのサポートに聞いてみました。結果、結論を簡単にまとめると、 MySQLのバージョンに存在する脆弱性は一概にAuroraにもあるとは限らない AWSのセキュリティ適用状況は Latest Bulletins を確認して欲しい インスタンスへのセキュリティパッチの適用状況についてはユーザが確認することはできない メンテナンスウィンドウにて必須のパッチの適用がスケジューリングされ、時限的に適用される(緊急の場合にはその限りではない)マネージドサービスだし、「まかせておけ」ということか。Latest Bulletins を見てみよう過去にどのような対応があったかを見てみます。Latest Bulletins はRDSだけでなく、他のAWSサービス全般のセキュリティアップデートが表示されます。その中から、過去のRDSの対応した脆弱性を探してみます。 Amazon RDS Security Advisory (CVE-2016-6663 and CVE-2016-6664) Amazon RDS - MySQL Security...","categories": ["aws"],
        "tags": ["aurora"],
        "url": "https://www.soudegesu.com/aws/aurora-security/",
        "teaser":"https://www.soudegesu.com/assets/images/soudegesu.jpg"}]
