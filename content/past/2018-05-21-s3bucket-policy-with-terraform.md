---
title: "TerraformでS3のバケットポリシーを書く方法"
description: "インフラのコード化を進める作業では、コード化のライブラリ作法に倣うため、ドキュメントを見ながら設定を書いていくことが多いです。Terraformも例外ではないのですが、S3バケットのポリシー設定の所でふと気付いたので書いておきます。"
date: 2018-05-21
categories:
  - aws
tags:
  - terraform
  - s3
  - iam
url: /aws/s3bucket-policy-with-terraform/
twitter_card_image: https://www.soudegesu.com/images/icons/terraform_icon.png
---

インフラのコード化を進める作業では、コード化のライブラリ作法に倣うため、ドキュメントを見ながら設定を書いていくことが多いです。

[Terraform](https://www.terraform.io/) も例外ではないのですが、S3バケットのポリシー設定の所でふと気付いたので書いておきます。

## Terraform公式のS3のバケットポリシーが...

Terraform公式の [aws_s3_bucket_policy](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html)
のリソースは `policy` の部分がヒアドキュメントで書かれています。

```terraform
resource "aws_s3_bucket" "b" {
  bucket = "my_tf_test_bucket"
}

resource "aws_s3_bucket_policy" "b" {
  bucket = "${aws_s3_bucket.b.id}"
  policy =<<POLICY
{
  "Version": "2012-10-17",
  "Id": "MYBUCKETPOLICY",
  "Statement": [
    {
      "Sid": "IPAllow",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my_tf_test_bucket/*",
      "Condition": {
         "IpAddress": {"aws:SourceIp": "8.8.8.8/32"}
      }
    }
  ]
}
POLICY
}
```

だめではないのですが、折角コード化を進めているので、ここもキレイにしたいですよね。

## IAMポリシードキュメントのデータソース（aws_iam_policy_document）を使う

結論から言うと、 [aws_iam_policy_document](https://www.terraform.io/docs/providers/aws/d/iam_policy_document.html)
のデータソースを使用することができます。

データソース名から 「IAMにしか適用できないのでは？」 と思うかもしれませんが、結局はポリシードキュメントなので使えます。

```
resource "aws_s3_bucket" "b" {
  bucket = "my_tf_test_bucket"
}

resource "aws_s3_bucket_policy" "b" {
  bucket = "${aws_s3_bucket.b.id}"
  policy = "${aws_iam_policy_document.bucket_policy_document.json}"
}

data "aws_iam_policy_document" "bucket_policy_document" {

    statement {
        sid = "IPAllow"
        effect = "Deny"
        principals {
            type = "*"
            identifiers = ["*"]
        }
        actions = [
            "s3:*"
        ]
        resources = [
            "arn:aws:s3:::my_tf_test_bucket/*"
        ]
        condition {
            test = "IpAddress"
            variable = "aws:SourceIp"
            values = [
              "8.8.8.8/32"
            ]
        }
    }
}

```

ポイントは `policy = "${aws_iam_policy_document.bucket_policy_document.json}"` の所です。

データソースをJSON文字列にしてくれます。

AWS公式の [IAM JSON ポリシーエレメント: 条件演算子](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html) にもある通り、
`IpAddress` も条件演算子のひとつとして定義されているので、ちゃんと `condition` ブロックで使えます。

強いてクセを挙げるとしたら、

```
"Principal": "*",
```

を表現するために

```
principals {
    type = "*"
    identifiers = ["*"]
}
```

と記述しないといけない所でしょうか。

## まとめ

S3バケットのポリシードキュメントも `aws_iam_policy_document` を使えば、Terraformのコードとして管理できます。
HCLからポリシードキュメント（JSON）を生成するために、微妙に書き方が違う部分がありますが、それは普段通りTerraformの公式を読めばなんとかなるでしょう。
さらばヒアドキュメント！！

## 参考にさせていただいたサイト

* [Terraform - Data Source:aws_iam_policy_document](https://www.terraform.io/docs/providers/aws/d/iam_policy_document.html)
* [Terraform - Data Source: aws_s3_bucket_policy](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html)

<br>
<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B06XKHGJHP&linkId=a3a59917979f77c73643421d8d843a47"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4844339265&linkId=81ad40d815fd96079a683238ffb6a249"></iframe>
</div>
