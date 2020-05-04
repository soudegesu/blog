---
title: "MediaRecorderでブラウザ上で音声と映像を取得してWebm形式で保存する"
description: "GCPやAzure等のSaaSにて音声認識や画像認識を使う際、予め録音しておいた音声データを学習用の元データとして使うことができます。ここでは、Webブラウザを使って簡単に録画・録音する方法を紹介したいと思います。"
date: "2020-05-04T09:34:18+09:00"
thumbnail: "images/icons/html5_icon.png"
categories:
  - "javascript"
tags:
  - "javascript"
  - "html5"
isCJKLanguage: true
twitter_card_image: "images/icons/html5_icon.png"
---

GCPやAzure等のSaaSにて音声認識や画像認識を使う際、予め録音しておいた音声データを学習用の元データとして使うことができます。
ここでは、Webブラウザを使って簡単に録画・録音する方法を紹介したいと思います。

## ゴール

* 16kbpsのwebm形式のデータが保存できること

## 動作環境

今回は以下の環境で実装

- Google Chrome (v81.0)

<!--adsense-->

## MediaRecorderを使って録画、録音する

[MediaRecorder](https://developer.mozilla.org/ja/docs/Web/API/MediaRecorder) を使うことで、簡単にPCのカメラやマイクから簡単にブラウザ上で録画、録音できます。録画・録音する対象は `navigator.mediaDevices.getUserMedia` で取得できる `MediaStream` になります。

{{< highlight javascript "linenos=inline" >}}
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  }).then((stream) => {
    // ここに処理を追加する
  })
{{</ highlight >}}

取得した MediaStreamを `MediaRecorder` に渡してインスタンス化します。第二引数にはMIMETYPEやビットレートのオプションを指定できます。

{{< highlight javascript "linenos=inline" >}}
  var recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp8',
    audioBitsPerSecond: 16 * 1000
  });
{{</ highlight >}}

`dataavailable` イベント発火時にデータが定期的に入ってくるのでデータチャンクに入れるようにリスナーに登録しておきます。

{{< highlight javascript "linenos=inline" >}}
  var chunks = [];
  recorder.addEventListener('dataavailable', function(ele) {
    if (ele.data.size > 0) {
      chunks.push(ele.data);
    }
  });
{{</ highlight >}}

<!--adsense-->

最後に、`MediaRecorder` が停止された時にチャンクのデータをダウンロードできるようにオブジェクトを生成します。

{{< highlight javascript "linenos=inline" >}}
  recorder.addEventListener('stop', function() {
    var obj = new Blob(chunks);
    var dl = document.querySelector("#dl");
    dl.href = URL.createObjectURL(new Blob(chunks));
    dl.download = 'webm_test.webm';
  });
{{</ highlight >}}

`MediaRecorder` の開始と停止はそれぞれ `start` `stop` 関数です。

{{< highlight javascript "linenos=inline" >}}
  recorder.start();
{{</ highlight >}}

{{< highlight javascript "linenos=inline" >}}
  recorder.stop();
{{</ highlight >}}

