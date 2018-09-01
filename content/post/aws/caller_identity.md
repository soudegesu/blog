---
title: "Terraformで自身のAWSアカウント番号を取得するにはaws_caller_identityを使うと良い"
description: "今回はTerraformの小ネタです。AWSアカウント番号を.tfvarsファイルに記載しない方法を紹介します。"
date: "2018-09-02T06:32:25+09:00"
thumbnail: /images/icons/terraform_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "terraform"
isCJKLanguage: true
twitter_card_image: /images/icons/terraform_icon.png
---

今回は [Terraform](https://www.terraform.io/) の小ネタです。AWSアカウント番号を `.tfvars` ファイルに記載しない方法を紹介します。

## .tfvars に記載しがちな情報

ってありますよね。 例えば、AWSアカウント番号がそうです。 [Terraform Module](https://www.terraform.io/docs/modules/usage.html) を使って、それなりのサイズ感のシステムコンポーネント定義を書いていくと、モジュール毎の `variables.tf` ファイルに

```terraform
variable "account_id" {
}
```

と定義した後、 `.tfvars` ファイルに

```
account_id = "XXXXXXXXXXX"
```

という記載が増えて冗長に感じます。

定義された `account_id` という変数は、例えば、ポリシードキュメントの作成や、ARN指定、ECRリポジトリのドメイン名などに埋め込むことがあります。

こんな感じだったり、

```
data "aws_iam_policy_document" "xxxxx" {
    statement {
        effect = "Allow"

        actions = [
            "s3:PutObject",
        ]

        resources = [
            "arn:aws:s3:::xxxxx/*"
        ]

        principals = {
            type = "AWS"
            identifiers = [
                "${var.account_id}"
            ]
        }
    }
}
```

こんな感じで使ったりしていました。

```
${var.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/xxxxxxxxx:${var.image_tag},
```

## aws_caller_identity を使う

最近知ったのですが、 [aws_caller_identity](https://www.terraform.io/docs/providers/aws/d/caller_identity.html) のData Sourceを使うことで記述をすっきりさせることができることがわかりました。

[aws_caller_identity](https://www.terraform.io/docs/providers/aws/d/caller_identity.html) は読んで字のごとく、 [Terraform](https://www.terraform.io/) コマンドを実行している側の情報を取得できるのです。

以下のように `data` 定義をします。

```
data "aws_caller_identity" "current" {}
```

`aws_caller_identity` から `account_id` の属性値が参照できるので、以下のようにアクセスできます。

```
principals = {
  type = "AWS"
  identifiers = [
    "${data.aws_caller_identity.current.account_id}"
  ]
}
```

こうすることで、 `.tfvars` ファイルの変数定義も減らせてすっきりですね！

## 参考にさせていただいたサイト
* [aws_caller_identity](https://www.terraform.io/docs/providers/aws/d/caller_identity.html)
