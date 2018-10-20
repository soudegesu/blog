---
title: "Codebuildでポリシー数が多すぎてエラーになる時の対処法"
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
今回、 `CodeBuild` をコード化するに当たって困ったことが発生したので、それの共有です。

## Service Roleを複数のCodeBuildプロジェクトで共有したい

これが、そもそものモチベーションでした。



## CodeBuildのService Roleのポリシーが勝手に増えている？

**Cannot exceed quota for PoliciesPerRole: 10**

## CodeBuildが

```
マネジメントコンソールから CodeBuild のプロジェクトを作成する場合は "Allow AWS CodeBuild to modify this service role so it can be used with this build project" のチェックを外すことにより、CodeBuild は該当のロールを編集しないようになるため、本事象が回避可能でございます。(※ 参考資料2)
一方で、Terraform で CodeBuild のプロジェクトを作成する場合につきましては、Terraform のドキュメントを確認いたしましたが、本事象を回避できるような引数は用意されていないように見受けられました。(※ 参考資料3)
```
