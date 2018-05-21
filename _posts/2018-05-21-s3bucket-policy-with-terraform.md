---
title: "TerraformでS3のバケットポリシーを書く方法"
description: "インフラのコード化を進める作業では、コード化のライブラリ作法に倣うため、ドキュメントを見ながら設定を書いていくことが多いです。Terraformも例外ではないのですが、S3バケットのポリシー設定の所でふと気付いたので書いておきます。"
date: 2018-05-21 00:00:00 +0900
categories: aws
tags: terraform s3 iam
header:
  teaser: /assets/images/icons/terraform_icon.png
---

インフラのコード化を進める作業では、コード化のライブラリ作法に倣うため、ドキュメントを見ながら設定を書いていくことが多いです。

[Terraform](https://www.terraform.io/) も例外ではないのですが、S3バケットのポリシー設定の所でふと気付いたので書いておきます。


* Table Of Contents
{:toc}

## Terraform公式のS3のバケットポリシーが...

Terraform公式の [aws_s3_bucket_policy](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html)
のリソースは `policy` の部分がヒアドキュメントで書かれています。

```
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

## IAMポリシーのデータソースを使う

結論から言うと、 [aws_iam_policy_document](https://www.terraform.io/docs/providers/aws/d/iam_policy_document.html) 
のデータソースを使用することができます。

データソース名から 「IAMポリシーしか書けないのでは？」 と思うかもしれませんが、意外とできました。 

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
            type = "Service"
            identifiers = ["*"]
        }

        actions = [
            "s3:*"
        ]

        resources = [
            "arn:aws:s3:::my_tf_test_bucket/*"
        ]

        condition {
            test = "StringEquals"
            variable = "aws:Referer"
            values = ["XXXXXXXXXXXXX"]
        }
    }
}

```

ポイントは `policy = "${aws_iam_policy_document.bucket_policy_document.json}"` の所です。

データソースをJSON文字列にしてくれます。

S3もTerraformぽいコードにできるよ！という小ネタでした。

## 参考にさせていただいたサイト
* [Terraform - Data Source:aws_iam_policy_document](https://www.terraform.io/docs/providers/aws/d/iam_policy_document.html)
* [Terraform - Data Source: aws_s3_bucket_policy](https://www.terraform.io/docs/providers/aws/r/s3_bucket_policy.html)

