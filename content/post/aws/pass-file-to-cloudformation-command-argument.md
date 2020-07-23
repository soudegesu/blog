---
title: "AWS CLIのCloudformationのParametersの値に外部ファイルを与える方法"
description: ""
date: "2020-07-23T13:50:02+09:00"
thumbnail: "/images/icons/cloudformation_icon.png"
categories:
  - "aws"
tags:
  - "aws"
isCJKLanguage: true
twitter_card_image: /images/icons/cloudformation_icon.png
---

AWSリソースのコード管理を行うために、AWS Cloudformationを使うことがしばしばあります。
特にAWS AmplifyではAWSリソースの管理をCloudformationに強制されるため、Amplifyの利用を機にCloudformationを触る機会が増えた人も多いのではないでしょうか。私もそうでした。
今回はAWS CLIの `aws cloudformation` コマンドを使う時の小ネタを紹介します。

<!--adsense-->

## Parametersが肥大化しCLIの実行がつらくなる

- デプロイするステージを変えたい
- 一つのCloudformation Templateを雛形にして複数のAWSリソース群を生成したい

等、Cloudformation Templateが成長するにつれ、Parametersブロックの定義が増えていきます。

具体的には、以下のようにCloudformation TemplateにParameter定義を追加することになり、

{{< highlight yaml "linenos=inline,hl_lines=4-10" >}}
AWSTemplateFormatVersion: "2010-09-09"
Description : "Cloudformation template example"

Parameters:
  ParamA:
    Type: String
  ParamB:
    Type: String
  ParamC:
    Type: String

Resources:
(以下略)
{{</ highlight >}}

Cloudformation TemplateをAWS CLIから以下のようにデプロイします。

{{< highlight bash "linenos=inline,hl_lines=4" >}}
aws cloudformation deploy \
  --template-file ${Templateファイル名} \
  --stack-name ${スタック名} \
  --parameter-overrides ParamA=foo ParamB=bar ParamC=baz
{{</ highlight >}}

この `--parameter-overrides` オプションは `Key=Value` 形式で指定する必要があります。
全てのParameterのペアを直接書いてコマンドを実行することは現実的ではありません。

<!--adsense-->

## パラメータを外部ファイルに定義する

そのため、このParamtersのペアを外部ファイルに定義しましょう。
以下のような `parameters.properties` ファイルを作成し、Key-Valueペアを定義していきます。

{{< highlight yaml "linenos=inline,hl_lines=1-3" >}}
ParamA=foo
ParamB=bar
ParamC=baz
{{</ highlight >}}

`--parameter-overrides` オプション部分は `parameters.properties` ファイルの定義を流し込むように書き換えてあげれば良いです。

{{< highlight bash "linenos=inline,hl_lines=4" >}}
aws cloudformation deploy \
  --template-file ${Templateファイル名} \
  --stack-name ${スタック名} \
  --parameter-overrides `cat parameters.properties`
{{</ highlight >}}

## 参考にさせていただいたサイト

- [AWS CloudFormation ユーザーガイド](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-cli-deploy.html)