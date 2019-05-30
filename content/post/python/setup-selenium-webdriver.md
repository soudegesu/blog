---
title: "Pythonで自動化しよう！ ー Selenium Webdriverをセットアップする"
description: "PythonでSeleniumを使った自動化をします。今回はSeleniumを動かすための初期セットアップであるWebDriverの設定を行います。"
date: "2019-05-31T08:09:27+09:00"
thumbnail: "/images/icons/python_icon.png"
categories:
  - "python"
tags:
  - "python"
  - "selenium"
draft: true
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

最近では、ノンプログラマーでもプログラミングをすることが増えてきました。いいことですね。
特に人気なのはプログラミング言語Pythonを使った作業の自動化です。
今まで人がブラウザで手作業で行っていた定形作業をプログラムで実行して生産性を高めましょうというものです。

今回はPythonでSeleniumを動かしたいニーズ（というか質問）がちらほら出てきたので、文書に起こすことにしました。

## Seleniumって何？

大上段の話として、まず [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) って何よ？というのがあります。

もともとはブラウザ上で動作するWEBアプリケーションの動作検証を行うための **テストツール郡** の用途として誕生しました。
テストツールというと小難しく聞こえますが、ざっくり言うと「AボタンをクリックしたらB画面に遷移する」といったシステムとしての正しい振る舞いをチェックするためのプログラムを実行するためのソフトウェアと理解してもらうと良いでしょう。

SeleniumはSeleniumを実行するマシン上にインストールされているブラウザを実際に起動して、記述されたテストプログラムの命令が動作するという特徴があります。
加えて、Seleniumを動かすためのプログラミング言語が数多くサポートされていることや、Seleniumで動作させられるブラウザの種類が多いことなどの理由もあり、
今では、テストツールとしての用途だけではなく、ブラウザ上での業務を効率化するプログラムの動作環境としても使われるようになりました。

## 実行環境

* Python `3.7.2`
* selenium `3.141.0`

## WebDriverをダウンロードする

https://www.seleniumhq.org/download/

### Mozilla Firefoxの場合

https://github.com/mozilla/geckodriver/releases

### Google Chromeの場合

### Safariの場合


