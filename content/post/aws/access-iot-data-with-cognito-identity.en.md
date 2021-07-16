---
title: "Error 403 when accessing AWS IoT device shadow with Cognito authenticated user Identity"
description: "If the 403 error occurs when retrieving the AWS IoT device shadow from the mobile app, you will need to add an IAM Policy to the authenticated IAM Role and grant an IoT Policy to the authenticated Identity ID."
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

AWS IoT is useful. You can manage and control the status of devices even remotely.
On the other hand, mastering AWS IoT requires an understanding of the entire AWS IoT service, a familiarity with the not-so-friendly service console, and some tricky configuration.
In this article, I will introduce some small AWS IoT tips.

<!--adsense-->

### Goals

- Getting AWS IoT Device Shadows in Mobile Apps
- Only authenticated users can access device shadows
- Use Cognito's UserPool and Identity Pool created by AWS Amplify

### Environment

- Android
  - aws-android-sdk-iot: `2.23.0`

### Error 403 occurs when getting device shadow

Get the device shadow in Android. The following is a simple snippet using the AWS IoT-Data client.

{{< highlight kotlin "linenos=inline" >}}
val dataClient = AWSIotDataClient(AWSMobileClient.getInstance().credentials)
dataClient.setRegion(Region.getRegion(Regions.AP_NORTHEAST_1))

val deviceShadowsResult = dataClient.getThingShadow(
  GetThingShadowRequest().withThingName(thingName)
)
{{</ highlight>}}

Then, the following error was printed.

```
E/AndroidRuntime(15973): Caused by: com.amazonaws.AmazonServiceException: null (Service: AWSIotData; Status Code: 403; Error Code: ForbiddenException
```

Is the client lacking permissions because of the 403 error?

<!--adsense-->

[The AWS Developer Guide](https://docs.aws.amazon.com/iot/latest/developerguide/cognito-identities.html) says the following


> When you use authenticated identities, in addition to the IAM policy attached to the identity pool, you must attach an AWS IoT policy to an Amazon Cognito Identity by using the AttachPolicy API and give permissions to an individual user of your AWS IoT application. You can use the AWS IoT policy to assign fine-grained permissions for specific customers and their devices.

### Attach an IAM Policy to a Cognito-authenticated IAM Role

First, attach an IAM policy to the IAM Role that will be assigned to the authenticated user in Cognito.

AWS Amplify Auth should have created an IAM Role named `xxxxx-authRole`. Attach the `AWSIotDataAccess` policy and `AWSIoTConfigAccess` to this IAM Role.

The following actions are the ones that are required this time.

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

### Creating an AWS IoT Policy

Nest, create [AWS IoT Policy](https://docs.aws.amazon.com/iot/latest/developerguide/iot-policies.html). This is required to access the AWS IoT data plane.
The format is the same as the familiar AWS IAM policy document.

In this time, create IoT Policy named `HogeIoTPolicy`.

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

### Attach IoT Policy

In addition, attach the IoT Policy to the authenticated user.
It is important to note that IoT Policy attachments must be applied to each Identity ID.

If you are considering increasing or decreasing the number of users, it would be better to attach them within the mobile app as follows.

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

### Get the device shadow

After all these settings, you can finally access the device shadow.

Once again, the `GetThingShadowRequest` at the beginning will succeed.

{{< highlight kotlin "linenos=inline" >}}
val dataClient = AWSIotDataClient(AWSMobileClient.getInstance().credentials)
dataClient.setRegion(Region.getRegion(Regions.AP_NORTHEAST_1))

val deviceShadowsResult = dataClient.getThingShadow(
  GetThingShadowRequest().withThingName(thingName)
)
{{</ highlight>}}

### References

- [Amazon Cognito identities](https://docs.aws.amazon.com/iot/latest/developerguide/cognito-identities.html)
