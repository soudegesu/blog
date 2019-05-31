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

## 今回のゴール

* Seleniumをインストールする
* Seleniumを使ってブラウザが起動できる

## Seleniumって何？

大上段の話として、まず [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) って何よ？というのがあります。

もともとはブラウザ上で動作するWEBアプリケーションの動作検証を行うための **テストツール郡** の用途として誕生しました。
テストツールというと小難しく聞こえますが、ざっくり言うと「AボタンをクリックしたらB画面に遷移する」といったシステムとしての正しい振る舞いをチェックするためのプログラムを実行するためのソフトウェアと理解してもらうと良いでしょう。

SeleniumはSeleniumを実行するマシン上にインストールされているブラウザを実際に起動して、記述されたテストプログラムの命令が動作するという特徴があります。
加えて、Seleniumを動かすためのプログラミング言語が数多くサポートされていることや、Seleniumで動作させられるブラウザの種類が多いことなどの理由もあり、
今では、テストツールとしての用途だけではなく、ブラウザ上での業務を効率化するプログラムの動作環境としても使われるようになりました。

## 実行環境

動作環境は以下になります。

* Python `3.7.2`
* selenium `3.141.0`

## Seleniumのインストール

まずは [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) をインストールします。

```python
pip install selenium
```

## WebDriverをダウンロードする

次に [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) がブラウザを起動させるためドライバをセットアップしましょう。

[Seleniumの公式ページに各ブラウザのドライバへのリンク](https://www.seleniumhq.org/download/) が貼られているため、動作させたいブラウザに応じたドライバをダウンロードしましょう。

### Mozilla Firefoxの場合

Firefoxを [Selenium](http://oss.infoscience.co.jp/seleniumhq/docs/01_introducing_selenium.html) で動作させるには [geckodriver](https://github.com/mozilla/geckodriver/releases) が必要です。
[Gecko](https://ja.wikipedia.org/wiki/Gecko) というのはFirefoxの中に組み込まれているHTMLなどを描画する機能を持ったエンジンのことです。

[geckodriver](https://github.com/mozilla/geckodriver/releases) のページから自分のマシンに合ったドライバをダウンロードします。

手元の環境がMacであれば `geckodriver-vx.xx.x-macos.tar.gz` 、64bitのWindowsであれば `geckodriver-vx.xx.x-win64.zip` を選択するといった要領です。

ダウンロード後に解凍したzipファイルを環境変数のPATHに通してあげれば良いです。
PATHの通し方はここでは解説しないので、「Windows PATH」「Mac PATH」などで検索いただければと思います。

### Google Chromeの場合

Chromeの場合もFirefoxと同様に [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) が必要になります。
[ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) のページから、自分のインストールしているGoogle Chromeのバージョンと等しいドライバを選択した後、自分のマシンに合ったドライバをダウンロードしてください。

ここでも、ダウンロード後に解凍したzipファイルを環境変数のPATHに通してあげれば良いです。
PATHの通し方はここでは解説しないので、「Windows PATH」「Mac PATH」などで検索いただければと思います。

### Safariの場合


