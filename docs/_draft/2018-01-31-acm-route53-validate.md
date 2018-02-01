---
title: "AWS Certification ManagerのSSL証明書の検証にはDNS検証を使った方が良い"
description: "AWS Certification Managerで発行されるSSL証明書には自動更新されるための条件があるのです。"
date: 2018-01-31 00:00:00 +0900
categories: blog
tags: AWS ACM route53 ssl validate
permalink: /blog/aws/validate-certification-manager
---

* Table Of Contents
{:toc}

## Route53でCertification Managerのドメイン検証ができるようになった
[DNS を使って AWS Certificate Manager の検証を簡単に](https://aws.amazon.com/jp/blogs/news/easier-certificate-validation-using-dns-with-aws-certificate-manager/)
の記事にも記載があるように、2017/11に `AWS Certification Manager(以下ACM)` のSSL証明書取得の際の検証手順に *Route53のDNS検証* が追加されました。実はこれは、ACMで取得したSSL証明書の *取得* だけではなく *更新* においてもとても大きな利点があるので、今回はそれを紹介します。

## SSL証明書"発行"の違い
### E-mail検証は手間がかかる
従来、ACMにてSSL証明書を取得する際のドメイン検証の方法は、受信したE-mailの本文に記載されている一時リンクを踏み、承認ボタンを押すことで検証を完了する、という手続きを踏んでいました。

その際の注意点は、*AWSからの検証確認メールを受信できるメール受信箱が必要になる* ことです。
私の場合、会社が取得しているドメインのサブドメインを委譲してもらい新規プロダクトを実装することが多いため、
身近にいないドメイン管理者(別部署や別会社)の受信箱にのみメールが届いてしまい、
自分のタイミングで承認ボタンを押すことができませんでした。

自前のAWSアカウント内で検証を完結させるためには、
* 受信ボックス代わりになるS3バケットを作成し
* Route53にTXTレコードやMXレコードを作成し
* SNSで受けたメールをS3に振り分け、
* S3バケットで受け取ったメール本文をダウンロードして、リンクを踏む
という手順を踏まなくてはいけません。

こちらの設定の手順はクラスメソッドさんのブログ「 [[ACM] SSL証明書発行時のドメイン認証メールをSESで受け取ってみた](https://dev.classmethod.jp/cloud/aws/acm-verifydomain-ses/) 」に掲載されておりますので、
興味のある方はご参照ください。

### DNS検証によって検証ステップが格段に簡素になる

上記のステップを経て、


## SSL証明書"更新"の違い
### ACMのSSL証明書有効期限は13ヶ月
ACMで発行したSSL証明書の有効期限は13ヶ月です。そのため、1年程経過したらSSL証明書の更新作業が発生します。
これはSSL証明書を運用されている人でしたら毎度のことなのですが、 *証明書の更新時期を忘れないよう* に通知の仕組みを入れたり、
引き継ぎをしたり様々な工夫をされていることかと思います。

### ACMはSSL証明書を「自動更新」できる
素晴らしいことにACMはSSL証明書を自動更新することができます。
ただし、自動更新するためには条件があります。

### E-mail検証で作成したSSL証明書の自動更新仕様は複雑
E-mailで検証したSSL証明書の自動更新の条件は以下になります。
1. 発行したSSL証明書がAWSリソースでを使用されていること
2. インターネットからのHTTPSリクエストを許可すること
3. 証明書記載のFQDNが名前解決できること

`2` 番目に関して言えば、Public ELBでもSecurityGroupでアクセス制限を施しているケースや、
Internal ELBを使っている場合には適用されません。
`3` 番目に関して言えば、ワイルドカードドメインの場合では、ゾーンAPEX、wwwドメインで名前解決できる必要があります。
例えば、 「*.soudegesu.com」の場合には「soudegesu.com」と「www.soudegesu.com」が解決できなければいけません。
加えて、3つの条件を満たしていても、複数のリージョンで同一ドメイン名を使用している場合には、正しく名前解決できずにNGとなってしまいます。

つまり、E-mail検証での証明書自動更新は適用可能範囲が限定的なのです。

### DNS検証で作成したSSL証明書の自動更新の仕様は単純

・証明書が使用されている。
・証明書発行の際に設定された CNAME レコードが残っている。


### 手動更新が必要な場合には？
【ACM更新のプロセス】
 1. AWS側によるACMの自動更新検証
　-> 上記の更新条件を満たすかをAWS側で検証し、検証に成功した場合は更新完了となります。
　　 検証はACM期限切れの60日前に実施されます。
 
 2. ドメインオーナーに催促メールを通知
  -> 自動更新に失敗した場合、証明書に記載されているドメインのオーナーに対してメールが通知されます。
     (WHOIS情報記載のメールアドレスもしくは、ドメイン名の前にadmin@を付加したメールアドレス)
 
 3. AWSアカウントに催促メールを通知
　-> 上記のメールからも検証が確認されない場合、AWSアカウントに登録されたメールに対して通知されます。
 
 4. 手動でのACM検証作業
　-> メールに記載されたURLにアクセスし、承認ボタンを押すことでACMの検証が完了し更新可能な状態になります。
     ただし、実際にACMが更新されるまでには数時間タイムラグが発生します。


## まとめ


## 参考にさせていただいたページ
* [DNS を使って AWS Certificate Manager の検証を簡単に](https://aws.amazon.com/jp/blogs/news/easier-certificate-validation-using-dns-with-aws-certificate-manager/)
* [[ACM] SSL証明書発行時のドメイン認証メールをSESで受け取ってみた](https://dev.classmethod.jp/cloud/aws/acm-verifydomain-ses/)
