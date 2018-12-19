---
title: "AWS LambdaのコードをTerraformでデプロイする"
description: "TerraformでAWS Lambdaのコードをデプロイします。最近ではCloud9がLambdaのコンソールに統合されて、より開発が容易になりました、それでもやはり手元に元ソースを置いておきたいというケースがあります。主にNodeやPythonをランタイムに指定する場合に周辺のエコシステムをコミコミでzipでデプロイする必要があるので、今回はそれを説明しようと思います。"
date: 2018-04-11
thumbnail: /images/icons/lambda_icon.png
categories:
    - aws
tags:
    - aws
    - lambda
    - terraform
url: /aws/deploy-lambda-with-terraform/
twitter_card_image: /images/icons/lambda_icon.png
---

今更感もありますが、今日はTerraformでのAWS Lambdaのコード化について書きます。
AWS Lambdaは [Cloud9](https://aws.amazon.com/jp/cloud9/) がコンソール上に組み込まれたこともあり、開発がさらに容易になりました。
ブラウザエディタは **そのままwebにつながる** というのが最大の強みですが、まだまだ手元のリポジトリでコードを管理している手前、AWSのサービスだけで完結できていないのが現状です。
今回はAWS LambdaのコードをTerraformを使ってデプロイする方法を説明しようと思います。

↓ちなみに下が組み込まれたCloud9

![cloud9_lambda](/images/20180411/cloud9_lambda.png)

<!--adsense-->

## TerraformでAWS Lambdaをデプロイしたい
`Infrastructure as Code` はクラウド界隈でバズってだいぶ時間も立っていますので、あまりここでは触れません。
必要に応じて界隈の方のブログや以下の書籍を読んでください。

<br/>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/4873117968/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4873117968&linkCode=am2&tag=soudegesu-22&linkId=e5283797d3bbc22eb4a74f9cee8af948"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=4873117968&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=4873117968" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
<br/>

AWS Lambdaがサービスとして登場した頃は、簡易なバッチ的な仕組みとしての用途が多く、作り捨てなコードが多かったです。
その後、連携可能な他のAWSサービスも増えて、VPC内に立ち上げることも可能になり(起動時間はかなり遅いですけど)、用途の幅に広がりが出てきました。
そんな **「まぁ、Lambdaでいっか」** ケースが増えると同時に、一度デプロイしたLambdaのコードを修正して再デプロイするというケースも増えてきました。

業務上 `Terraform` を使ってAWSリソースをコード化しているので、Lambdaもその管理の対象にしようと思ったのが契機です。

<!--adsense-->

## やってみる

実際にLambdaをTerraformでデプロイするコード化してみました。
コードサンプルは [こちら](https://github.com/soudegesu/terraform-lambda-practice) にあります。

簡単にリポジトリの説明をしておきます。

デプロイ用のマシンに必要なライブラリ等は以下になります。
* Terraform
* Python 3.6

またディレクトリ構成はこんな感じです。

{{< highlight bash "linenos=inline" >}}
.
├── Makefile
├── README.md
├── build.sh
├── lambda-src
│   ├── __init__.py
│   └── main.py
├── requirements.txt
└── terraform
    ├── backend.tf
    ├── dev.tfvars
    ├── lambda.tf
    ├── provider.tf
    └── variables.tf
{{< / highlight >}}

`lambda-src` ディレクトリにはLambdaで実行するPythonコード、 `terraform` ディレクトリにはLmabdaのデプロイに使用するterraformの設定が格納されています。
めんどい前処理の類はシェル(`build.sh`)でラップしてあって、開発者は `make` のサブコマンドだけ意識しておけば良い、という作りにしています。
この方法自体は我流なので、よりスマートな方法はあると思います。

以降は実装する上でのポイントだけ記載していきます。

### コードのエントリータイプはzipにしよう

Lambdaにソースコードを適用する方法は3種類存在します。

![code_entry_type](/images/20180411/type_of_code_entry.png)

* Edit Code Inline
    * ブラウザ上のエディタに直接書く方法。デプロイ後のコードを突貫で修正したりする時によく使う。
* Upload a .ZIP file
    * zipファイルでアップロードする方法。今回はこれを採用する。
* Uplaod a file from Amazon S3
    * S3からファイルを読み込む方法。

個人的には2番目の **zipファイルでアップロードする方法** をオススメします。

理由としては以下
1. 依存モジュールを含めてアップロードできる
2. わざわざS3を積極的に経由するケースが思いつかない。(Lambdaに対して直接操作できない時とか？)

### シェルでzip圧縮したいソース一式を作成する

シェルを使えば何でもできてしまうので、Terraformで完結させたい方には興ざめかもしれませんが、低コストだったのでこれにしました。
`build.sh` の処理を見ていただければわかるのですが、 zip圧縮させたいファイル郡を管理する必要があるので、
専用の `workspace` ディレクリを作成し、そこに依存モジュールとソースコードをまるごと放り込みます。


* `build.sh`

{{< highlight bash "linenos=inline" >}}
#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)
WORKSPACE=${SCRIPT_DIR}/workspace
SRC_DIR=${SCRIPT_DIR}/lambda-src

if [ -d ${WORKSPACE} ]; then
    rm -rf ${WORKSPACE}
fi
mkdir ${WORKSPACE}

pip3 install -r ${SCRIPT_DIR}/requirements.txt -t ${WORKSPACE}
cp -rf ${SRC_DIR}/* ${WORKSPACE}
{{< / highlight >}}

### Terraformでzip圧縮&デプロイ

`workspace` ディレクトリのzip圧縮とデプロイを定義します。
terraformで `archive_file` というデータリソースを使用することで、指定されたディレクトリをzip圧縮して出力することができます。
加えて、Lambda関数の作成の際に `aws_lambda_function` リソースの `source_code_hash` プロパティに、zipアーカイブしたデータリソースのbase64エンコードを指定することができるので、これでzipのデプロイコードの完成です。

{{< highlight go "linenos=inline" >}}
#####################################
#Lambda
#####################################
resource "aws_lambda_function" "auth_log_monitoring" {
    filename = "../lambda.zip"
    function_name = "do_something"
    role = "arn:aws:iam::${var.account_id}:role/XXXXXXRole"
    handler = "main.lambda_handler"
    source_code_hash = "${data.archive_file.lambda_zip.output_base64sha256}"
    runtime = "python3.6"
    timeout = 150
}

data "archive_file" "lambda_zip" {
    type = "zip"
    source_dir  = "../workspace"
    output_path = "../lambda.zip"
}
{{< / highlight >}}

### ビルド&デプロイをつなげる
あとは `build.sh` でのビルド処理とterraformでのデプロイをつなげてあげればOKです。
今回は `Makefile` に以下のような定義をして、コマンド一発で処理ができるようにラップしています。

* `Makefile`

{{< highlight bash "linenos=inline" >}}
deploy:
	@${CD} && \
		sh ../build.sh && \
		terraform workspace select ${ENV} && \
		terraform apply \
        -var-file=${VARS}
{{< / highlight >}}

あとは `make deploy` を打てば実行できます。(リポジトリ的にはterraformのリモートバケットの初期化を先に行う必要はあります。)

<!--adsense-->

## まとめ
Terraformを使用して、AWS Lambdaのソースコードのデプロイができるようになりました。
実際にはシェルを間にかませてビルドを行なっていますが、シェル内での処理自体はシンプルなので、横展開もしやすくなっています。
1点欠点としては、**ランタイムがpythonの場合にはterraform実行時に毎回ハッシュにdiffが出てしまう** という点。つまり、毎度デプロイしてしまうという所です。
しかし、今あるコードを正としてデプロイし続けることに問題がなければ、目をつむっても良い欠点なので、今の所気にしていません。
ちなみにランタイムがNodeだとこれはおきませんでした。

## 参考にさせていただいたサイト

* [Terraform:aws_lambda_function](https://www.terraform.io/docs/providers/aws/r/lambda_function.html)

<br/>
<br/>
<div style="text-align: center">
<a target="_blank"  href="https://www.amazon.co.jp/gp/offer-listing/B06XKHGJHP/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B06XKHGJHP&linkCode=am2&tag=soudegesu-22&linkId=c8ab2870b7378967fbf5fd25ce31da6c"><img border="0" src="//ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=JP&ASIN=B06XKHGJHP&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=soudegesu-22" ></a><img src="//ir-jp.amazon-adsystem.com/e/ir?t=soudegesu-22&l=am2&o=9&a=B06XKHGJHP" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
