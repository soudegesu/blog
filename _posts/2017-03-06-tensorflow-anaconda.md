---
title: "Anaconda環境にTensorflowをインストールする"
date: 2017-03-06 00:55:00 +0900
categories: tensorflow
tags: tensorflow
lang: ja
---

ここから少しづつ、細切れになってしまいますが、tensorflowで学んだことを書いていこうと思います。

今回はanacondaの仮想環境に対して、tensorflowをインストールします。

## 環境
* Anaconda 4.3.0
* python 3.5

## 発生した問題
tensorflowのversion 1がリリースされましたので、anacondaで構築した仮想環境に対して以下のようにtensorflowをインストールしようとしたところ、まだ対応しているtensorflowのバージョンがない、とエラーが出てしまいました。

``` bash
pip3 install tensorflow 
```

## 解決策

そのため、以下のようにコマンドを変更します。
``` bash
pip install --ignore-installed --upgrade https://storage.googleapis.com/tensorflow/mac/cpu/tensorflow-1.0.0-py3-none-any.whl
```

## 備考
anaconda の方でのパッケージ管理でインストール可能かを調べてみました。

* pypi

``` bash
anaconda search -t pypi tensorflow

>Using Anaconda API: https://api.anaconda.org
>Run 'anaconda show <USER/PACKAGE>' to get more details:
>Packages:
>     Name                      |  Version | Package Types   | Platforms
>     ------------------------- |   ------ | --------------- | ---------------
>     dustindorroh/tensorflow   |    0.6.0 | pypi            |
>                                          : TensorFlow helps the tensors flow
>     jjhelmus/tensorflow       | 0.12.0rc0 | conda, pypi     | linux-64, osx-64
>                                          : TensorFlow helps the tensors flow
```

* conda

``` bash
anaconda search -t conda tensorflow

>Using Anaconda API: https://api.anaconda.org
>Run 'anaconda show <USER/PACKAGE>' to get more details:
>Packages:
>     Name                      |  Version | Package Types   | Platforms
>     ------------------------- |   ------ | --------------- | ---------------
>     HCC/tensorflow            |    1.0.0 | conda           | linux-64
>     HCC/tensorflow-cpucompat  |    1.0.0 | conda           | linux-64
>     HCC/tensorflow-fma        |    1.0.0 | conda           | linux-64
>     SentientPrime/tensorflow  |    0.6.0 | conda           | osx-64
>                                          : TensorFlow helps the tensors flow
>     acellera/tensorflow-cuda  |   0.12.1 | conda           | linux-64
>     anaconda-backup/tensorflow | 0.10.0rc0 | conda           | linux-64
>     anaconda/tensorflow       | 0.10.0rc0 | conda           | linux-64
>     conda-forge/tensorflow    |    1.0.0 | conda           | linux-64, win-64, osx-64
>                                          : TensorFlow helps the tensors flow
>     creditx/tensorflow        |    0.9.0 | conda           | linux-64
>                                          : TensorFlow helps the tensors flow
>     derickl/tensorflow        |   0.12.1 | conda           | osx-64
>     dhirschfeld/tensorflow    | 0.12.0rc0 | conda           | win-64
>     dseuss/tensorflow         | 0.11.0rc0 | conda           | osx-64
>     ijstokes/tensorflow       | 2017.03.03.1349 | conda, ipynb    | linux-64
>     jjhelmus/tensorflow       | 0.12.0rc0 | conda, pypi     | linux-64, osx-64
>                                          : TensorFlow helps the tensors flow
>     kevin-keraudren/tensorflow |    0.9.0 | conda           | linux-64
>     lcls-rhel7/tensorflow     |   0.12.1 | conda           | linux-64
>     marta-sd/tensorflow       |   0.12.0 | conda           | linux-64
>                                          : TensorFlow helps the tensors flow
>     memex/tensorflow          |    0.5.0 | conda           | linux-64, osx-64
>                                          : TensorFlow helps the tensors flow
>     mhworth/tensorflow        |    0.7.1 | conda           | osx-64
>                                          : TensorFlow helps the tensors flow
>     miovision/tensorflow      | 0.10.0.gpu | conda           | linux-64, osx-64
>     msarahan/tensorflow       | 1.0.0rc2 | conda           | linux-64
>     mutirri/tensorflow        | 0.10.0rc0 | conda           | linux-64
>     mwojcikowski/tensorflow   |   0.11.0 | conda           | linux-64
>     rdonnelly/tensorflow      |    0.9.0 | conda           | linux-64
>     rdonnellyr/r-tensorflow   |    0.4.0 | conda           | osx-64
>     test_org_002/tensorflow   | 0.10.0rc0 | conda           |

```

配布元が微妙だったり、バージョンが最新に対応していなかったりの様子なので、しばらくは `storage.googleapis.com` を参照する形でインストールを行いたいと思います。