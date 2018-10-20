---
title: "CodebuildプロジェクトをTerraformでコード化する時のハマりポイント"
description: ""
date: "2018-10-21T09:22:45+09:00"
thumbnail: /images/icons/codebuild_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "codebuild"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/codebuild_icon.png
---

`CodeBuild` の小ネタです。普段は [Terraform](https://www.terraform.io/) を使って、インフラのコード化を行っています。
今回、 `CodeBuild` をコード化するに当たって発生した困ったことの共有をします。

## Service Roleを複数のCodeBuildプロジェクトで共有したい

これが、そもそものモチベーションでした。下図のような `CodeBuild` プロジェクトたちを [Terraform](https://www.terraform.io/) を使って一発で作ってしまおうと考えたわけです。

![codebuild_servicerole](/images/20181021/codebuild_servicerole.png)

複数の `CodeBuild` プロジェクトを作成するにあたり、 **`ServiceRole` を個別に作成するのが面倒なので、共有してしまおう、** 
と考えたのです。


## Service Roleのポリシーが勝手に増えている？

`CodeBuild` プロジェクトたちをプロビジョニングした後、コンソールから `CodeBuild` の設定を確認していた、その時です。

**Cannot exceed quota for PoliciesPerRole: 10**

エラーメッセージが表示されました。

## CodeBuildが

```
マネジメントコンソールから CodeBuild のプロジェクトを作成する場合は "Allow AWS CodeBuild to modify this service role so it can be used with this build project" のチェックを外すことにより、CodeBuild は該当のロールを編集しないようになるため、本事象が回避可能でございます。(※ 参考資料2)
一方で、Terraform で CodeBuild のプロジェクトを作成する場合につきましては、Terraform のドキュメントを確認いたしましたが、本事象を回避できるような引数は用意されていないように見受けられました。(※ 参考資料3)
```
