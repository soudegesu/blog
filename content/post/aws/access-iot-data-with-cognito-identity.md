---
title: "AWS IoTのデバイスシャドウにCognito認証済みユーザのIdentityでアクセスした際に403エラーになる"
description: "AWS IoTのデバイスシャドウをモバイルアプリから取得する際に403エラーは発生する場合には、認証済みIAM RoleへのIAM Policyの追加と認証済みのIdentity IDに対してIoTポリシーの付与が必要になります。"
date: "2021-07-14T09:41:08+09:00"
thumbnail: /images/icons/iot_icon.png
categories:
  - "aws"
tags:
  - "iot"
  - "aws"
isCJKLanguage: true
twitter_card_image: /images/icons/iot_icon.png
---

AWS IoT。便利ですよね。遠隔からでもデバイスの状態管理や操作ができます。
一方、AWS IoTを使いこなすにはAWS IoTサービス全体の理解が必要で、操作性が良いとは言えないサービスコンソールを使いこなし、
少しトリッキーな設定を施すこともあります。今回はAWS IoTの小ネタを紹介します。

<!--adsense-->

### やりたいこと

- AWS IoTのデバイスシャドウをモバイルアプリで取得する
- 認証済みのユーザのみがデバイスシャドウにアクセスできる
- 認証にはAWS Amplifyで作成されたCognitoのUserPoolとIdentity Poolを使う

### 環境情報

- Android
  - aws-android-sdk-iot: `2.23.0`

### デバイスシャドウ取得時に403エラーが発生する

Androidにてデバイスシャドウの取得を行います。以下はAWS IoT-Data クライアントを使った簡単なスニペットになります。

{{< highlight kotlin "linenos=inline" >}}
val dataClient = AWSIotDataClient(AWSMobileClient.getInstance().credentials)
dataClient.setRegion(Region.getRegion(Regions.AP_NORTHEAST_1))

val deviceShadowsResult = dataClient.getThingShadow(
  GetThingShadowRequest().withThingName(thingName)
)
{{</ highlight>}}

すると、以下のようなエラーが出力されました。

```
E/AndroidRuntime(15973): Caused by: com.amazonaws.AmazonServiceException: null (Service: AWSIotData; Status Code: 403; Error Code: ForbiddenException
```

これを解決する必要がありそうです。403エラーなので権限が足りないのでしょうか。

<!--adsense-->



[AWSの公式ドキュメント](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/cognito-identities.html) から引用すると、


> 認証済み ID を使用する場合、ID プールにアタッチされた IAM ポリシーに加えて、AttachPolicy API を使用して AWS IoT ポリシーを Amazon Cognito ID にアタッチし、AWS IoT アプリケーションの個々のユーザーにきめ細かいアクセス許可を与えることができます。このように、特定のお客様とそのデバイスの間のアクセス許可を割り当てることができます。Amazon Cognito ID のポリシーの作成の詳細については、パブリッシュ/サブスクライブポリシーの例 を参照してください。

とあります。さっそくやっていきましょう。

### Cognito認証済みのIAM RoleにIAM Policyをアタッチする

まず、Cognitoにおける認証済みユーザに割り当てられるIAM Roleに対してIAM ポリシーを追加します。

AWS Amplifyで作成したCognitoを使っている場合には `xxxxx-authRole` という名前のIAM Roleが該当します。

このRoleに `AWSIotDataAccess` ポリシーと `AWSIoTConfigAccess` をアタッチします。

適用範囲としては少し広いため適宜調整が必要ですが、アタッチしたポリシーの中でも今回必要となる権限は以下のアクションとなります。

```
"iot:Connect",
"iot:Publish",
"iot:Subscribe",
"iot:Receive",
"iot:GetThingShadow",
"iot:UpdateThingShadow",
"iot:DeleteThingShadow",
"iot:ListNamedShadowsForThing",
"iot:AttachPolicy",
"iot:AttachPrincipalPolicy",
"iot:AttachThingPrincipal",
```

### AWS IoT Policyの作成

次に [AWS IoTポリシー](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/iot-policies.html) を作成します。これはAWS IoTのデータプレーンにアクセスするために必要となります。
フォーマットはおなじみのAWS IAM ポリシードキュメントと同じです。

ここでは `HogeIoTPolicy` という名前で作成します。

{{< highlight json "linenos=inline" >}}
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "iot:Connect",
        "iot:Publish",
        "iot:Subscribe",
        "iot:Receive",
        "iot:GetThingShadow",
        "iot:UpdateThingShadow",
        "iot:DeleteThingShadow",
        "iot:ListNamedShadowsForThing"
      ],
      "Resource": "*",
      "Effect": "Allow",
      "Sid": "HogeIoTPolicy"
    }
  ]
}
{{</ highlight>}}

### IoT Attach Policyを行う

さらに、認証済みのユーザに対してIoT Policyをアタッチします。
IoT PolicyのアタッチはIdentity IDに対して個別に適用する必要がある点に注意が必要です。

ユーザの増減を考慮するのであれば、以下のようにモバイルアプリ内でアタッチしてしまうのが良いでしょう。

{{< highlight kotlin "linenos=inline" >}}
val identityId = AWSMobileClient.getInstance().identityId
val iotClient = AWSIotClient(AWSMobileClient.getInstance().credentials)
iotClient.attachPolicy(AttachPolicyRequest().withPolicyName("HogeIoTPolicy").withTarget(identityId))
{{</ highlight>}}

{{< highlight kotlin "linenos=inline" >}}
val thingName = "HogeThing"
val identityId = AWSMobileClient.getInstance().identityId
val iotClient = AWSIotClient(AWSMobileClient.getInstance().credentials)
iotClient.attachThingPrincipal(AttachThingPrincipalRequest().withPrincipal(identityId).withThingName(thingName))
{{</ highlight>}}

### デバイスシャドウを取得する

ここまで設定して、ようやくデバイスシャドウにアクセスができます。

改めて、冒頭の `GetThingShadowRequest` が成功します。

{{< highlight kotlin "linenos=inline" >}}
val dataClient = AWSIotDataClient(AWSMobileClient.getInstance().credentials)
dataClient.setRegion(Region.getRegion(Regions.AP_NORTHEAST_1))

val deviceShadowsResult = dataClient.getThingShadow(
  GetThingShadowRequest().withThingName(thingName)
)
{{</ highlight>}}

### 参考にさせていただいたサイト

- [Amazon Cognito ID](https://docs.aws.amazon.com/ja_jp/iot/latest/developerguide/cognito-identities.html)
