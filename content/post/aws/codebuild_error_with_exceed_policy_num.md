---
title: "CodeBuildプロジェクトをコード化する時のServiceRoleのハマりポイント"
description: ""
date: "2018-10-21T09:22:45+09:00"
thumbnail: /images/icons/codebuild_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "codebuild"
  - "terraform"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/codebuild_icon.png
---

`CodeBuild` の小ネタです。普段は [Terraform](https://www.terraform.io/) を使って、インフラのコード化を行っています。
今回、 `CodeBuild` をコード化するに当たって発生した困ったことの共有をします。

## 複数のCodeBuildプロジェクトでService Roleを共有したい

これが、そもそものモチベーションでした。目的は、下図のような `CodeBuild` プロジェクトたちの [Terraform](https://www.terraform.io/) を使ったプロビジョニングです。

![codebuild_servicerole](/images/20181021/codebuild_servicerole.png)

複数の `CodeBuild` プロジェクトを作成するにあたり、 **`ServiceRole` を個別に作成するのが面倒なので、共有してしまおう、** 
と考えたのです。


## Service Roleのポリシーが勝手に増えている？

`CodeBuild` プロジェクトたちをプロビジョニングした後、コンソールから `CodeBuild` の設定を確認していた、その時です。

**Cannot exceed quota for PoliciesPerRole: 10**

エラーメッセージが表示されました。 

`CodeBuild` に適用している `ServiceRole` を確認してみると、
自分が [Terraform](https://www.terraform.io/) で指定していない多くのポリシーがアタッチされていることがわかりました。

![aws_attached_policy.png](/images/20181021/aws_attached_policy.png)

実は、 CodeBuildプロジェクト作成時に **CodeBuildが自動でポリシーを生成し、ServiceRoleに対してアタッチしている** のです。
`ServiceRole` を共有化していたことによって、**作成されたCodeBuildプロジェクトの数ぶんのポリシーがアタッチされ、上限に達した** というのです。

## 解決策

### 案１：CodeBuild作成時にロールの編集を許可しない

１つ目は `CodeBuild` 生成時にAWS側から `CodeBuild` の `ServiceRole` の編集を許可しない設定を行うことです。

![codebuild_settings.png](/images/20181021/codebuild_settings.png)

AWSコンソール上から、「**Allow AWS CodeBuild to modify this service role so it can be used with this build project**」 の
チェックを外すことで、不要なポリシーのアタッチを防ぐことができます。

しかし、これは **`CodeBuild` プロジェクトを手動で新規作成した場合にのみ設定可能なオプションなのです（2018/10現在）** 。つまり、 **Terraformでのプロビジョニングを諦める** ことを意味します。

### 案２: アタッチ可能なポリシーの上限数を増やす

２つ目は、アタッチ可能なポリシー数の上限緩和申請をAWSのサポートセンターから行うことです。

[IAM Group and Users] から [Policies per Role] を選ぶことで上限緩和申請ができます。

![policies_per_role.png](/images/20181021/policies_per_role.png)

根本的な解決策ではありませんが、現実的な落とし所だと思います。

## まとめ

[Terraform](https://www.terraform.io/) で `CodeBuild` プロジェクトをプロビジョニングするときには、 
`ServiceRole` に対して、自動生成されたポリシーがアタッチされることに注意が必要です。

ポリシー適用の上限エラーを回避するためには、

* `ServiceRole` への編集許可を与えずに、AWSコンソール上から `CodeBuild` プロジェクトを **手動で新規作成する**
* ポリシーが自動適用されても問題ないくらいの `Policies per Role` を、サポートセンターにて上限緩和申請する

という感じです。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=1260108279&linkId=c4ac74c453d2e72a86aec32e11bd9a82"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4797392568&linkId=5026f77348a642a4054d5ac9a12a0bf4"></iframe>
