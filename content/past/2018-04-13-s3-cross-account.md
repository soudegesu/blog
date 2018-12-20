---
title: "クロスアカウントで共有されたS3バケットはAWSコンソール上から参照可能なのか"
description: "S3はバケットポリシーを設定することで、クロスアカウントでのバケット共有ができます。両アカウントからバケットに対して操作を行うことができるため、大変便利な機能です。バケットのオーナーアカウントではAWSコンソール上でバケットを確認できるのですが、共有された側ではS3バケットのコンソールにバケットが表示されません。なんとかして閲覧する方法はないものかと試行錯誤してみました。"
date: 2018-04-13
thumbnail: /images/icons/s3_icon.png
categories:
    - aws
tags:
    - aws
    - s3
url: /aws/s3-cross-account/
twitter_card_image: /images/icons/s3_icon.png
---

AWS S3はバケットポリシーを設定することで、クロスアカウントでのバケット共有ができます。
設定により、複数のアカウントからバケットに対して操作を行うことができるため、大変便利な機能です。
しかし、バケットのオーナーアカウントではAWSコンソール上でバケットを確認できるのですが、
共有された側ではS3バケットのコンソールにバケットが表示されません。
今回はなんとかして閲覧する方法はないものかと試行錯誤してみました。

<!--adsense-->

## やりたいこと
### S3をファイルストレージサービス的にファイル共有に使いたい

今回やろうとしていたことを簡単に説明します。
以下の図にまとめました。

![share_bucket](/images/20180413/share_bucket.png)

既に本番環境で稼働しているサービスがあり(アカウントA)、
アカウントA内にあるS3バケットにストアしているデータを他部門に提供する必要が出てきました。

### でもバケットのあるAWSアカウントにログインさせたくない
普通に考えれば、アカウントAで他部門向けのIAM GroupとIAM Userを作成する、というのが簡易な解になるのですが、少し事情があります。
アカウントA自体が社内のセキュリティレベルが高めに規定されているため、他部門のIAM UserをアカウントAの中に作るのが難しいのです。
そのため、 他部門向けの **別のAWSアカウントBを作成し、アカウントBに対して対象のバケットのみを共有するようにすれば要求が充足されるのではないか**、という話になり、その方法を中心に検討をすることになりました。

<!--adsense-->

## 課題
### ユーザはブラウザしか使えない

今回のケースでは他部門の人間がエンジニアではないため、**ブラウザでのファイルダウンロードしかできない** という制約がありました。
AWS CLIのインストールも嫌がられてしまったため、 **「AWSのS3コンソールからファイルを見せる」** 必要がありました。

### コンソール上のバケットリストはバケットのオーナーアカウント側でしか見れない

アカウントAで `soudegesu-bucket-foo` というS3バケットを作成し、以下のようにバケットポリシーを作成することで
アカウントBにバケット共有の設定をしました。

{{< highlight json "linenos=inline" >}}
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "GetObject",
            "Action": [
                "s3:GetObject"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:s3:::soudegesu-bucket-foo/*",
            "Principal": {
                "AWS": [
                    "アカウントBのAWSアカウントID"
                ]
            }
        },
        {
            "Sid": "ListBucket",
            "Action": [
                "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:s3:::soudegesu-bucket-foo",
            "Principal": {
                "AWS": [
                    "アカウントBのAWSアカウントID"
                ]
            }
        }
    ]
}
{{< / highlight >}}

アカウントAのS3コンソールからは共有対象のバケットを確認できるのですが、

![account_a_bucket_list](/images/20180413/account_a_bucket_list.png)

アカウントBでのS3コンソールから共有されたバケットを確認できないのです。

![account_b_bucket_list](/images/20180413/account_b_bucket_list.png)

実は **S3のバケットリストはバケットを作成したオーナー側にしか表示されない** というAWSのS3の仕様があります。
これは AWS CLIでも同様で、 `aws s3 ls` コマンドを実行しても、自分のアカウントで作成されたバケットの一覧しか取得できません。

なんてこったい。

<!--adsense-->
## 解決策
### 案1 バケットのURLを直接叩かせる[非公式]

一瞬「やばい」と思いましたが、どうにかなりそうな方法が見つかりました。
それは **共有バケットのURLを直接ブラウザに入力する** という方法です。

AWSコンソール上のS3のURLのルールは以下のようになっていて、
AWSコンソールにログインしたセッション上で直叩きするとブラウザ上で表示することができます。

{{< highlight bash "linenos=inline" >}}
https://s3.console.aws.amazon.com/s3/buckets/{バケット名}/
{{< / highlight >}}

今回の例で言えば、AWSアカウントBにログインした状態で下のURLを直叩きします。

{{< highlight bash "linenos=inline" >}}
https://s3.console.aws.amazon.com/s3/buckets/soudegesu-bucket-foo/
{{< / highlight >}}

![find_bucket](/images/20180413/find_bucket_b.png)

見えました。やったぜ。

ただし、この方法は現時点(2018年4月現在)でのS3コンソールの仕様ということらしく、公式でサポートされている仕様ではありません。
一応AWSのサポートにも聞いてみましたが、結果的に見えているけど、今後変わるかもしれない、ということでした。

### 案2 Switch Roleを使う[正攻法]

結局、マルチアカウント間でコンソール上でいい感じに見せたい場合の正攻法はSwitch Roleになりそうです。
Switch Roleを使ったアカウントの切り替えは記事にされている方がいっぱいいらっしゃるのでそちらを参考にいただいた方が良いです。

参考までにいくつかリンクを貼っておきます。

* [Swith Roleで複数のAWSアカウント間を切替える](https://qiita.com/yoshidashingo/items/d13a9b17f111d5d91a2e)
* [ロールの切り替え（AWS マネジメントコンソール）](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_use_switch-role-console.html)

<!--adsense-->

## まとめ
**「クロスアカウントで共有されたS3バケットはAWSコンソール上から閲覧可能なのか」** というタイトルで今回書きましたが、
結論を言うと


**可能**

しかし、以下の条件を知っておく必要がありそうです。

* 共有されたバケットがS3コンソールのバケット一覧で参照可能なのは**バケットのオーナーアカウント**のみ
* **バケットのURLを直接入力する**ことで、共有先のアカウントでもブラウザ上で確認ができる
* ただし、URL直接入力の方法は公式サポートされていないので、真面目にやるならSwitch Roleで対応する

今回はURLを直接入力する方法で大丈夫そうだったので、よかったよかった。


<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4797392568/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4797392568&linkCode=am2&tag=soudegesu-22&linkId=2317c39300679077409ccb55e8076219"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4797392568&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4797392568" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
