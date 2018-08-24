---
title: "AWS Certification ManagerのSSL証明書の検証にはDNS検証を使った方が良い"
description: "AWS Certification Managerで発行されるSSL証明書には自動更新されるための条件があるのです。"
date: 2018-01-31
thumbnail: /images/icons/acm_icon.png
categories:
    - aws
tags:
    - aws
    - acm
    - route53
    - ssl
url: /aws/validate-certification-manager
twitter_card_image: /images/icons/acm_icon.png
---

## Route53でCertification Managerのドメイン検証ができるようになった

![acm_validate](/images/20180131/acm_validate.png)

[DNS を使って AWS Certificate Manager の検証を簡単に](https://aws.amazon.com/jp/blogs/news/easier-certificate-validation-using-dns-with-aws-certificate-manager/)
の記事にも記載があるように、2017/11に `AWS Certification Manager(以下ACM)` のSSL証明書取得の際の検証手順に **Route53のDNS検証** が追加されました。実はこれは、ACMで取得したSSL証明書の **取得** だけではなく **更新** においてもとても大きな利点があるので、今回はそれを紹介します。

## SSL証明書"発行"の違い
### E-mail検証は手間がかかる
従来、ACMにてSSL証明書を取得する際のドメイン検証の方法は、Certificatioin Managerで証明書発行依頼を出した後、受信したE-mailの本文に記載されている一時リンクを踏んで承認ボタンを押す、という手続きを踏んでいました。

その際の注意点は、*AWSからの検証確認メールを受信できるメール受信箱が必要になる* ことでした。
私の場合、会社が取得しているドメインのサブドメインを委譲してもらい新規プロダクトを実装することが多いため、
身近にいないドメイン管理者(別部署や別会社)の受信箱にのみメールが届いてしまい、
自分のタイミングで承認ボタンを押すことができませんでした。
そのため、私の場合は自分のAWSアカウント内にE-mail検証のためのメール受信箱を作成していました。

自前のAWSアカウント内で検証を完結させるためには、

* 受信ボックス代わりになるS3バケットを作成し
* Route53にTXTレコードやMXレコードを作成し
* SNSで受けたメールをS3に振り分け、
* S3バケットで受け取ったメール本文をダウンロードして、リンクを踏む

という手順を踏まなくてはいけません。

こちらの設定の手順はクラスメソッドさんのブログ「 [[ACM] SSL証明書発行時のドメイン認証メールをSESで受け取ってみた](https://dev.classmethod.jp/cloud/aws/acm-verifydomain-ses/) 」に掲載されておりますので、
興味のある方はご参照ください。

### DNS検証によって検証ステップが格段に簡素になる
DNS検証ではRoute53に追加されたCNAMEレコードを用いてドメインの有効性を確認します。
そのため

* 「Create record in Route 53」 でCNAMEレコードを作成し
*  少し待つ(10分くらい?)

で検証が終了します。

ね、簡単でしょう？

![add_cname_records](/images/20180131/add_record.png)

## SSL証明書"更新"の違い
### ACMのSSL証明書有効期限は13ヶ月
ACMで発行したSSL証明書の有効期限は13ヶ月です。そのため、1年程経過したらSSL証明書の更新作業が発生します。
これはSSL証明書を運用されている人でしたら毎度のことなのですが、 **証明書の更新時期を忘れないよう** に通知の仕組みを入れたり、
引き継ぎをしたり様々な工夫をされていることかと思います。

### ACM更新のプロセス
まず、ACMのSSL証明書更新の全体の流れを抑えましょう。

#### ①AWS側によるACMの自動検証と自動更新
ACM期限切れの60日前に自動更新可能なものかAWS側で検証し、検証に成功した場合には自動更新を実施してくれます。(自動更新の条件は後述します)

#### ②ドメイン管理者に催促メールを通知
①の自動更新に失敗した場合には、証明書に記載されているドメインの管理者に対してメールが通知されます。(WHOISに記載されているメールアドレスもしくは、ドメイン名の前にadmin@を付加したメールアドレスになります)

#### ③AWSアカウントに催促メールを通知
②のメールからも検証が確認されない場合、AWSアカウントに登録されているメールアドレスに対して通知されます。

#### ④手動でのACM検証作業
メールに記載されたURLにアクセスし、承認ボタンを押すことでACMの検証が完了します。
ただし、実際にACMが更新されるまでに数時間程度のタイムラグが発生することをAWSでは謳っています。




①にも記載の通り、素晴らしいことにACMはSSL証明書を自動更新することができます。
ただし、自動更新するためには条件がありますので、以下に説明します。

### E-mail検証の自動更新条件は複雑
E-mailで検証したSSL証明書の自動更新の条件は以下になります。
1. 発行したSSL証明書がAWSリソースでを使用されていること
2. インターネットからのHTTPSリクエストを許可すること
3. 証明書記載のFQDNが名前解決できること

`2` に関して言えば、Public ELBでもSecurityGroupでアクセス制限を施しているケースや、
Internal ELBを使っている場合には適用されません。


`3` に関して言えば、ワイルドカードドメインの場合では、ゾーンAPEX、wwwドメインで名前解決できる必要があります。
例えば、 「*.soudegesu.com」の場合には「soudegesu.com」と「www.soudegesu.com」での解決が必要です。

加えて、仮に3つの条件を満たしていても、複数のリージョンで同一ドメイン名を使用している場合には、正しく名前解決できずにNGとなってしまうそうです。

つまり、E-mail検証での証明書自動更新は仕様上、適用条件が限定的なのです。

### DNS検証の自動更新条件は単純

DNS検証で作成したSSL証明書の自動更新のルールはどうでしょうか。
AWSのドキュメントをパッと漁れなかったので、サポートに問い合わせてみたところ、以下のような回答をいただきました。

1. 発行したSSL証明書がAWSリソースでを使用されていること
2. 証明書発行の際に設定された `CNAME` レコードが残っていること

こちらの方が適用条件が単純明快です。
インターネット経由の通信要件やプロトコル、ドメインの縛りがありません。
証明書リクエスト時に追加するCNAMEレコードを消さないように死守するだけでよいのです。

[Terraform](https://www.terraform.io/) や [roadworker](https://github.com/codenize-tools/roadworker) といったコード化ツールを使っていればなおのこと敷居は下がりますね。


## まとめ
今回は2種類の検証方法を比較しながらDNS検証の優位性を説明しました。

DNS検証は事前準備の手間を省略でき、発行時のステップも少ないです。

また、証明書の自動更新の適用条件も広いため、オススメです。

稼働中のサービスがいきなりSSL証明書の期限切れでエラーを吐き続けるといったリスクを緩和するためにも、DNS検証のSSL証明書に切り替えていく価値はあると思います。(一応Route53はSLA100%ですし)

## 参考にさせていただいたページ
* [DNS を使って AWS Certificate Manager の検証を簡単に](https://aws.amazon.com/jp/blogs/news/easier-certificate-validation-using-dns-with-aws-certificate-manager/)
* [[ACM] SSL証明書発行時のドメイン認証メールをSESで受け取ってみた](https://dev.classmethod.jp/cloud/aws/acm-verifydomain-ses/)
