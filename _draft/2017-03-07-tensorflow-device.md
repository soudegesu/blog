---
title: "Tensorflow使用時にデバイスを指定する"
date: 2017-03-07 22:43:00 +0900
categories: tensorflow
tags: tensorflow
---

機械学習のライブラリでは処理をGPUに移譲することで計算速度の向上を図ることがあります。
Tensorflowにおいても、マシン上の特定のデバイスに対して演算を行うよう指定することが可能です。

## 書き方
`tf.device` にて使用するデバイスの指定ができます。以下の例ではGPUに処理をさせようとしています。

``` python
import tensorflow as tf
# Create Graph
with tf.device('/gpu:0'):
    a = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[2, 3], name='a')
    b = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[3, 2], name='b')
    c = tf.matmul(a, b)
    
# Creates a session with log_device_placement set to True
sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))

# Run the op.
print(sess.run(c))
```

CPUを使用する場合には `with` 文の箇所を

``` python
with tf.device('/cpu:0'):
```

と変更することでcpuでの演算が可能です。

## 問題点
実行時に以下のようなエラーが出ました。

``` bash
W tensorflow/core/platform/cpu_feature_guard.cc:45] The TensorFlow library wasn't compiled to use SSE4.1 instructions, but these are available on your machine and could speed up CPU computations.
W tensorflow/core/platform/cpu_feature_guard.cc:45] The TensorFlow library wasn't compiled to use SSE4.2 instructions, but these are available on your machine and could speed up CPU computations.
W tensorflow/core/platform/cpu_feature_guard.cc:45] The TensorFlow library wasn't compiled to use AVX instructions, but these are available on your machine and could speed up CPU computations.
W tensorflow/core/platform/cpu_feature_guard.cc:45] The TensorFlow library wasn't compiled to use AVX2 instructions, but these are available on your machine and could speed up CPU computations.
W tensorflow/core/platform/cpu_feature_guard.cc:45] The TensorFlow library wasn't compiled to use FMA instructions, but these are available on your machine and could speed up CPU computations.
```

インストールされているtensorflowがcpuのみ利用可能のライブラリの場合に、このようなエラーが出ます。
そのため、GPU版をインストールしなおしましょう。

``` bash
pip install --ignore-installed --upgrade https://storage.googleapis.com/tensorflow/mac/gpu/tensorflow_gpu-1.0.0-py3-none-any.whl
```

GPU版はCPU版とは別名でインストールされるようです
```
pip freeze | grep tensorflow                                                                                                                                           (git)-[master]
> tensorflow==1.0.0
> tensorflow-gpu==1.0.0
```

## cudaをインストールする
TBD
