---
title: "It's better to use DNS verification for verification of SSL certificate issued by AWS Certification Manager"
description: "I will introduce the conditions for automatic updating SSL certificate issued by AWS Certification Manager."
date: 2018-01-31
thumbnail: /images/icons/acm_icon.png
categories:
    - aws
tags:
    - aws
    - acm
    - route53
    - ssl
url: /en/aws/validate-certification-manager
twitter_card_image: /images/icons/acm_icon.png
---

## Domain verification with Route 53 in Certification Manager became available

![acm_validate](/images/20180131/acm_validate.png)

In November 2017, Domain validation by DNS records of Route 53 was supported as a verification method when `AWS Certification Manager(ACM)` SSL certificate was acquired.
This update has a very great advantage not only for acquiring SSL certificates but also for updating SSL certificates.

<!--adsense-->

## Changes in issuing SSL certificates
### Validation by email is troublesome
Conventionally, in order to verify the domain of SSL certificate at ACM, 
we click on the link in the body of the received email, and push the approval button in the web page.

At that time, **we needed a mail inbox to receive verification confirmation mail from AWS** .
In my case, I often use subdomains delegated by my company.
Since verification confirmation mail comes to the domain administrator who is not nearby me, I can't push approve button on the website.
To avoid that, I create mail inbox for email validation in my AWS account.

In order to complete the verification in the AWS account, we need following procedure.

1. **Create S3 bucket** as a substitute for mail inbox
2. **Create TXT record and MX record** in Route 53 to receive mail
3. Set up Amazon SNS to save the received mail to S3 bucket
4. Download the email file stored in the S3 bucket and click the link in the mail body

### Verification by DNS records makes the verification step much simpler
Validation by DNS records checks the validity of the domain using the `CNAME` record added to Route 53.

We need following procedure.

1. Create `CNAME` record with  "Create record in Route 53"
2. Wait for a while (about 5 minutes)

That's all. Awsome!!

![add_cname_records](/images/20180131/add_record.png)

<!--adsense-->

## Changes in updating SSL certificates
In ACM, SSL certificate expires in 13 months. After about 1 year, we need to renew SSL certificate.

### SSL Certificate updating process（validation by email）
Let's understand the overall flow of updating the SSL certificate of ACM.

#### Step 1. Automatic verification and automatic update of SSL certificate by AWS
60 days before certificate expiration, AWS verifies whether it can be automatically renewed. If succeeded, AWS updates it automatically.(Conditions for automatic updating will be described later)

#### Step 2. Domain administrator receives reminder mail
If step 1 fails, AWS sends email to the domain administrator in the certificate.
(email address stated in WHOIS, or email address with `admin@` prepended to domain name)

#### Step 3. Email address registered in AWS account receives reminder mail 
When step 2 is not verified, AWS sends email to email address registred in AWS account.

#### Step 4. Manual verification
By accessing the URL described in the mail body and pressing the approval button, ACM verification is completed.
However, AWS says that about several hours time lag will occur before the ACM is updated.

#### Conditions for automatic updating

As stated in step 1, ACM can automatically update the SSL certificate, which is wonderful.
However, since there are conditions for automatic updating, it is explained below.

The conditions for automatic updating of SSL certificates verified with Email are as follows.

1. The issued SSL certificate is used in the AWS resource
2. The AWS resource allows HTTPS requests from the Internet
3. It's possible to name resolve the FQDN described in the certificate

For condition `2`, Automatic updates will not be applied in case of public ELB access restricted by Security Groups and internal loadbalancer.

For condition `3`, If you use wild card domain, it must be resolvable in zone APEX and www domain.

In addition, Even if you satisfy three conditions, if you use use same domain name in multiple regions, certificate can not be updated automatically because domain name can not be resolved correctly.

Namely, in verification by email, the applicable conditions of automatic updating are limited.

### SSL Certificate updating process（validation by DNS record）

I investigated the rule of automatic updating of SSL certificate issued by DNS verification.
Since I could not judge from the AWS document, when I contacted AWS support, I received the following answers.

1. The issued SSL certificate is used in the AWS resource
2. The CNAME record added at the time of issue of the certificate exists in Route 53

This application condition is simpler than before.
There are no limitations on network communication requirements, protocols, domains, etc.
You only need to be careful not to delete the CNAME record.

In addition, you will not have to worry about deleting to adopt coding tools like [Terraform](https://www.terraform.io/) and [roadworker](https://github.com/codenize-tools/roadworker).

<!--adsense-->

## Conclusion
This time, I explained the superiority of DNS verification while comparing the two kinds of verification methods.

DNS verification can omit the trouble of preparatory preparation, there are few issue steps.
It is worth switching to the SSL certificate of DNS verification to avoid the risk that the SSL certificate in use will expire.
