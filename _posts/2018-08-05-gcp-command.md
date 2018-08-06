---
title: "Google Cloud "
description: ""
date: 2018-08-05 00:00:00 +0900
categories: gcp
tags: gcp
header:
  teaser: /assets/images/icon/google_cloud_icon.png
---

* Table Of Contents
{:toc}

## GCPを使ってみることにした

仕事でGCPのサービスの利用を検討することになり、事前に試してみようと言うので


## Google Cloud SDK をインストールする

まずは Google Cloud SDK をインストールしましょう。私は普段遣いのPCがMacOSですので、MacOS向けのバイナリでのセットアップを行います。

手順は [Quickstart for macOS](https://cloud.google.com/sdk/docs/quickstart-macos) に記載されているので、
そちらを参考にいただければ問題なくインストールでいきます。

ただ、上記ではtarballを解凍する手段になるので、 今回は Homebrew を使っています。

```bash
brew tap caskroom/cask
brew cask install google-cloud-sdk
```

設定を初期化します。ブラウザでgmailでログイン済みの場合には、デフォルトの設定が読み込まれます。
今回は新規で作成するので `2` を選択します。

```bash
gcloud init

Welcome! This command will take you through the configuration of gcloud.

Settings from your current configuration [default] are:
core:
  account: xxxxxxxxxxxx@xxxx.xxx
  disable_usage_reporting: 'True'

Pick configuration to use:
 [1] Re-initialize this configuration [default] with new settings
 [2] Create a new configuration
Please enter your numeric choice:

```

設定名称を要求されるので、入力します。

```bash
Enter configuration name. Names start with a lower case letter and
contain only lower case letters a-z, digits 0-9, and hyphens '-':
```

設定が進むと、紐付けるGoogleアカウントを指定します。
今回は新規で紐付けるので `2` にします。

```bash
Your current configuration has been set to: [(設定名称)]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic detects and fixes local network connection issues.
Checking network connection...done.
Reachability Check passed.
Network diagnostic (1/1 checks) passed.

Choose the account you would like to use to perform operations for
this configuration:
 [1] xxxxxx@xxxx.xxx
 [2] Log in with a new account
Please enter your numeric choice:
```

すると、ブラウザが起動し、googleアカウントの認証が要求されます。

![sign_in_google](/assets/images/20180805/sign_in_google.png)

利用規約を確認し許可します。

![allow](/assets/images/20180805/allow.png)

認証が終了した後、ターミナルに戻って、GCP上のプロジェクトを選択します。 既にGCP上でプロジェクトを作成してしまっていたので `1` を選択します。

```bash
You are logged in as: [xxxxxxxxxxx@xxxxx.xxx].

Pick cloud project to use:
 [1] xxxxxxxxxx
 [2] Create a new project
Please enter numeric choice or text value (must exactly match list
item):
```

Compute Engineのデフォルトのリージョンの設定有無が聞かれます。とりあえず `Y` にします。

```bash
Your current project has been set to: [xxxxxxxx].

Do you want to configure a default Compute Region and Zone? (Y/n)?
```

リージョン番号のリストの入力を求められるので、日本のある `32`, `33`, `34` のいずれかで選択しておきます。

```bash
Which Google Compute Engine zone would you like to use as project
default?
If you do not specify a zone via a command line flag while working
with Compute Engine resources, the default is assumed.
 [1] us-east1-b
 [2] us-east1-c
 [3] us-east1-d
 (中略)
 [32] asia-northeast1-b
 [33] asia-northeast1-c
 [34] asia-northeast1-a
 (中略)
Did not print [3] options.
Too many options [53]. Enter "list" at prompt to print choices fully.
Please enter numeric choice or text value (must exactly match list
```

設定が完了しました。

## 自然言語APIを試してみる

CLIで自然言語APIを試してみます。解釈するテキストは過去に私がツイートした文章を適当に拾って放り込みます。

```bash
gcloud ml language analyze-syntax --language=ja-JP --content='子供が嫌いな野菜とか3種類くらい取皿に乗せて、1個だけ残す代わりに残りは全部キレイに食べるルールにしてる。'
```

権限がないと言われるので、CLI経由でAPIを使う権限を設定します。

```bash
API [language.googleapis.com] not enabled on project [(プロジェクト番号)].
Would you like to enable and retry (this will take a few minutes)?
(y/N)?
```

```
{
  "language": "ja-JP",
  "sentences": [
    {
      "text": {
        "beginOffset": 0,
        "content": "\u5b50\u4f9b\u304c\u5acc\u3044\u306a\u91ce\u83dc\u3068\u304b3\u7a2e\u985e\u304f\u3089\u3044\u53d6\u76bf\u306b\u4e57\u305b\u3066\u30011\u500b\u3060\u3051\u6b8b\u3059\u4ee3\u308f\u308a\u306b\u6b8b\u308a\u306f\u5168\u90e8\u30ad\u30ec\u30a4\u306b\u98df\u3079\u308b\u30eb\u30fc\u30eb\u306b\u3057\u3066\u308b\u3002"
      }
    }
  ],
  "tokens": [
    {
      "dependencyEdge": {
        "headTokenIndex": 11,
        "label": "NSUBJ"
      },
      "lemma": "\u5b50\u4f9b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 0,
        "content": "\u5b50\u4f9b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 0,
        "label": "PRT"
      },
      "lemma": "\u304c",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "NOMINATIVE",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 6,
        "content": "\u304c"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 4,
        "label": "AMOD"
      },
      "lemma": "\u5acc\u3044\u3060",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "ADJ",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 9,
        "content": "\u5acc\u3044"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 2,
        "label": "AUX"
      },
      "lemma": "\u3060",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "ADNOMIAL",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 15,
        "content": "\u306a"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 11,
        "label": "NSUBJ"
      },
      "lemma": "\u91ce\u83dc",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 18,
        "content": "\u91ce\u83dc"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 4,
        "label": "CC"
      },
      "lemma": "\u3068\u304b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 24,
        "content": "\u3068\u304b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 7,
        "label": "NUM"
      },
      "lemma": "3",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NUM",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 30,
        "content": "3"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 4,
        "label": "CONJ"
      },
      "lemma": "\u7a2e\u985e",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 31,
        "content": "\u7a2e\u985e"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 4,
        "label": "PRT"
      },
      "lemma": "\u304f\u3089\u3044",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 37,
        "content": "\u304f\u3089\u3044"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 11,
        "label": "ADVPHMOD"
      },
      "lemma": "\u53d6\u76bf",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 46,
        "content": "\u53d6\u76bf"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 9,
        "label": "PRT"
      },
      "lemma": "\u306b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "ADVERBIAL",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 52,
        "content": "\u306b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "ADVCL"
      },
      "lemma": "\u4e57\u305b\u308b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "GERUND",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 55,
        "content": "\u4e57\u305b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 11,
        "label": "PRT"
      },
      "lemma": "\u3066",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 61,
        "content": "\u3066"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "P"
      },
      "lemma": "\u3001",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PUNCT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 64,
        "content": "\u3001"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 17,
        "label": "NPADVMOD"
      },
      "lemma": "1",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NUM",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 67,
        "content": "1"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 14,
        "label": "SNUM"
      },
      "lemma": "\u500b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "AFFIX",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 68,
        "content": "\u500b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 14,
        "label": "PRT"
      },
      "lemma": "\u3060\u3051",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 71,
        "content": "\u3060\u3051"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 18,
        "label": "RCMOD"
      },
      "lemma": "\u6b8b\u3059",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "ADNOMIAL",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 77,
        "content": "\u6b8b\u3059"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "ADVPHMOD"
      },
      "lemma": "\u4ee3\u308f\u308a",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 83,
        "content": "\u4ee3\u308f\u308a"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 18,
        "label": "PRT"
      },
      "lemma": "\u306b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "ADVERBIAL",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 92,
        "content": "\u306b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "NSUBJ"
      },
      "lemma": "\u6b8b\u308a",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 95,
        "content": "\u6b8b\u308a"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 20,
        "label": "PRT"
      },
      "lemma": "\u306f",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 101,
        "content": "\u306f"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 25,
        "label": "ADVMOD"
      },
      "lemma": "\u5168\u90e8",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "ADV",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 104,
        "content": "\u5168\u90e8"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 25,
        "label": "ADVMOD"
      },
      "lemma": "\u30ad\u30ec\u30a4",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "ADJ",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 110,
        "content": "\u30ad\u30ec\u30a4"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 23,
        "label": "AUX"
      },
      "lemma": "\u306b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "ADVERBIAL",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 119,
        "content": "\u306b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 26,
        "label": "RCMOD"
      },
      "lemma": "\u98df\u3079\u308b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "ADNOMIAL",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 122,
        "content": "\u98df\u3079\u308b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "ATTR"
      },
      "lemma": "\u30eb\u30fc\u30eb",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "NOUN",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 131,
        "content": "\u30eb\u30fc\u30eb"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 26,
        "label": "PRT"
      },
      "lemma": "\u306b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "COMPLEMENTIVE",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PRT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 140,
        "content": "\u306b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "ROOT"
      },
      "lemma": "\u3059\u308b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "GERUND",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 143,
        "content": "\u3057"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "AUXVV"
      },
      "lemma": "\u3066\u308b",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FINAL_ENDING",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "VERB",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 146,
        "content": "\u3066\u308b"
      }
    },
    {
      "dependencyEdge": {
        "headTokenIndex": 28,
        "label": "P"
      },
      "lemma": "\u3002",
      "partOfSpeech": {
        "aspect": "ASPECT_UNKNOWN",
        "case": "CASE_UNKNOWN",
        "form": "FORM_UNKNOWN",
        "gender": "GENDER_UNKNOWN",
        "mood": "MOOD_UNKNOWN",
        "number": "NUMBER_UNKNOWN",
        "person": "PERSON_UNKNOWN",
        "proper": "NOT_PROPER",
        "reciprocity": "RECIPROCITY_UNKNOWN",
        "tag": "PUNCT",
        "tense": "TENSE_UNKNOWN",
        "voice": "VOICE_UNKNOWN"
      },
      "text": {
        "beginOffset": 152,
        "content": "\u3002"
      }
    }
  ]
}
```


## まとめ


## 参考にさせていただいたサイト

* [Quickstart for macOS](https://cloud.google.com/sdk/docs/quickstart-macos)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4822257908&linkId=96562e30fee0c86028881bf8ff961412&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798137146&linkId=8519a36037ae78c56c57df76fd8e0342&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4798155373&linkId=18c7903300574449f8b95d74c97a5a8f&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4865941053&linkId=7d7b23bc20001ccbcc6f87feb17d24b4&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
</div>
