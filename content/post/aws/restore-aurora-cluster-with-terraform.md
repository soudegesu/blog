---
title: "TerraformでRDS Auroraクラスタのリストアをする"
description: "TerraformでRDS Auroraクラスタのリストアを行う方法を紹介します。aws_rds_clusterリソースに対してsnapshot_identifierを指定し、クラスタを再生性する方法です。"
date: "2019-01-09T08:28:42+09:00"
thumbnail: /images/icons/terraform_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "terraform"
isCJKLanguage: true
twitter_card_image: /images/icons/terraform_icon.png
---

今回は [Terraform](https://www.terraform.io/) の小ネタです。
RDS Aurora クラスタをリストアする方法を紹介します。

<!--adsense-->

## モチベーション：うっかりAuroraクラスタをdestroyしてしまった

[Terraform](https://www.terraform.io/) でAurora クラスタをコード化し、運用しているのですが、先日うっかりdestroyしてしまいました。
不幸中の幸いというか、final snapshotを取得していたので、そのsnapshotを使ってクラスタの復元を試みます。

ちなみにfinal snapshotというのは、 **クラスタが削除されるタイミングにてsnapshotを取得するRDSのオプション** のことで、
デイリーでの自動バックアップオプションと併用して設定することで万が一に備えることができます。

今回はその万が一が発生してしまったということです。

## ゴール

今回のゴールは以下です

* Aurora クラスタを特定のsnapshotからリストアする
* 復元はTerraformから行う

<!--adsense-->

## snapshotからのリストア設定

[Terraform](https://www.terraform.io/) でクラスタを作成するときに使う [aws_rds_cluster](https://www.terraform.io/docs/providers/aws/r/rds_cluster.html) リソースに対して `snapshot_identifier` を指定するだけです。

`hogehogehogehoge` という識別子のsnapshotを対象データとしてリストアします。

また `snapshot_identifier` は `ignore_changes` に設定し、`terraform plan` 実行時にdiffを無視してもらいます。

サンプルの設定は以下になります。

{{< highlight go "linenos=inline, hl_lines=19 26 32-35" >}}
// auroraクラスタを構築するための定義
resource "aws_rds_cluster" "hoge_db_cluster" {
    cluster_identifier = "hoge_db_cluster"
    engine = "aurora-postgresql"
    database_name = "${var.db_name}"
    master_username = "${data.aws_kms_secrets.master.plaintext["master_username"]}"
    master_password = "${data.aws_kms_secrets.master.plaintext["master_password"]}"
    backup_retention_period = 7
    preferred_backup_window = "19:30-20:00"
    preferred_maintenance_window = "mon:17:00-mon:17:30"
    port = 5432
    vpc_security_group_ids = [
        "${aws_security_group.hoge_db_sg.id}"
    ]
    db_subnet_group_name = "${aws_db_subnet_group.hoge_db_subnet.name}"
    db_cluster_parameter_group_name = "${aws_rds_cluster_parameter_group.hoge_db_cluster_parameter_group.name}"
    skip_final_snapshot = false
    final_snapshot_identifier = "hogehogehogehoge"
    snapshot_identifier = "${data.aws_db_cluster_snapshot.final_snapshot.id}"
    tags {
        Name = "hoge-db-cluster"
    }
    lifecycle {
        ignore_changes  = [
            "final_snapshot_identifier",
            "snapshot_identifier",
        ]
    }
}

// snapshotを参照するためのdata定義
data "aws_db_cluster_snapshot" "final_snapshot" {
    db_cluster_snapshot_identifier = "hogehogehogehoge"
    most_recent = true
}

// クラスタインスタンスを生成するための定義
resource "aws_rds_cluster_instance" "hoge_db_cluster_instance" {
    (設定は省略)
    cluster_identifier = "${aws_rds_cluster.hoge_db_cluster.id}"
}

{{< / highlight >}}

## 注意点

### 既に構築済みのRDSクラスタにはsnapshotを適用できない

2019/01時点でのRDSの仕様なので仕方ありませんが、**クラスタを新規で構築するときにのみsnapshotからのリストアが可能です。**
既に存在するクラスタを任意の時間のデータに巻き戻したい場合には **ポイントインタイム** のリストア機能を使うことになります。

### Auroraクラスタにはクラスタのsnapshotを適用する

Auroraクラスタの場合はデータストレージを共有しているので、クラスタに対して復元を適用することになります。[Terraform](https://www.terraform.io/)的には [aws_db_cluster_snapshot](https://www.terraform.io/docs/providers/aws/d/db_cluster_snapshot.html) で snapshotの情報を参照します。

逆に他のDBミドルウェアで構築したRDSクラスタであれば、ストレージは独立していますから、インスタンス単位でのリストアが必要です。インスタンスのsnapshotを参照するには [aws_db_snapshot](https://www.terraform.io/docs/providers/aws/d/db_snapshot.html) を使います。

## まとめ

今回は [Terraform](https://www.terraform.io/) を使って RDS Aurora クラスタのリストアを行いました。

* `snapshot_identifier` にsnapshotのIDを指定することでリストアが可能
  * ただしクラスタは再作成になる
* クラスタのsnapshotを参照するには `aws_db_cluster_snapshot` 、インスタンス単体のsnapshotには `aws_db_snapshot` のData Resourceを使う

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B01IB6Q1CA&linkId=b4ca40feb7751f1112ee85917e0b2533"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=1260108279&linkId=c4ac74c453d2e72a86aec32e11bd9a82"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=soudegesu-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=4797392568&linkId=5026f77348a642a4054d5ac9a12a0bf4"></iframe>


