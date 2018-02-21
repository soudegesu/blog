---
title: "AWS RDS Aurora Cluster(MySQL互換)でパーティションをプロシージャで定期的に追加する"
description: "RDS Aurora Cluster(MySQL互換)で日付でのパーティションを作成する方法を紹介します。プロシージャとCREATE EVENTを組み合わせて定期的にイベント実行する方法を中心に、ClusterのWriter/Readerの特性などにも触れます"
date: 2018-02-19 00:00:00 +0900
categories: aws
tags: aws rds aurora SQL MySQL
lang: ja
---

AWSのRDS AuroraはOSSのDBミドルウェアと互換性のあるRDSマネージドサービスです。
今回はAuroraのMySQL互換での日付パーティションの作成に関して説明します。
AuroraというよりはMySQLの仕様に関する説明も多いです。

* Table Of Contents
{:toc}


## 今回やりたかったこと
1. ユーザ操作の都度データが格納されていくので、 **データは常にINSERT** したい
2. 1.のため、データの重複は発生しない
3. **一定期間が経過したデータには利用価値が薄い(=消して良い)**
ということもあり、今回はRDS Aurora(MySQL互換)にてClusterを組み、テーブルは日でパーティショニングすることにしました。
(そもそもDynamoDBでよくない？というツッコミがあるかもしれませんが、システムとは別の理由があるため採用していません)

### hogeテーブル

以下のような `hoge` テーブルを考えます。
`hoge` テーブルには `id` を持つユーザが行なった操作を `info` カラムに格納します。
`create_at` パーティションキーであり、 `id` と `create_at` が Primary Keyです。
(パーティションキーはPKに含める必要があります)

|カラム名     |型           |備考                   |
|------------|------------|-----------------------|
|id          |varchar(255)|ユーザのID              |
|info        |varchar(255)|ユーザが行なった操作の情報 |
|create_at   |timestamp   |レコードが作成された日時   |

## パーティションを日次で追加する

ここから具体的な手順を説明します。
`hoge` テーブルには以下のような操作をすることにしました。

* 最初に1年分のパーティションを作成しておく(365パーティション作成する)
* パーティションの作成はプロシージャで実施する
* 日次でパーティションの最後+1日ぶんのパーティションを追加する

一般的に、 **「プロシージャの追加は一定量をまとめて実施した方が良い」** と言われていますが、
運用要件や、格納するデータの想定量を設計に加え、左記を踏まえた負荷試験も実施したところ、オンラインでの日次パーティション追加でもパフォーマンス上問題がなかったため、そのようにしました。

### テーブル作成とパーティションの指定
以下のようなクエリを発行し `hoge` テーブルを作成します。
加えて、パーティション名のルールは `p` + `yyyyMMdd` として、`create_at` カラムでRANGEパーティション指定します。

```
-- create hoge table
DROP TABLE IF EXISTS hoge;
CREATE TABLE hoge (
  id varchar(255) NOT NULL,
  info varchar(255) NOT NULL,
  create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, create_at),
  INDEX index_id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE hoge PARTITION BY RANGE (UNIX_TIMESTAMP(create_at)) (
  PARTITION p20180219 VALUES LESS THAN (UNIX_TIMESTAMP('2018-02-19 00:00:00'))
);
```

### パーティション追加用のプロシージャを作成
次にパーティションを追加するためのプロシージャを登録します。
可視性の観点でバリデーション等は省略しています。

```
--
-- hogeテーブルにパーティションを追加するストアドプロシージャ
-- 引数 from_date: パーティション作成の開始日時 to_date: パーティション作成の終了日時
-- パーティションは from_date < to_date - 1日 分まで作成されます。
-- 呼び出しサンプル
-- CALL add_hoge_partition(str_to_date('2018-01-01', '%Y-%m-%d'), str_to_date('2019-01-01', '%Y-%m-%d'));
--
DROP PROCEDURE IF EXISTS add_hoge_partition;
DELIMITER $$
CREATE PROCEDURE add_hoge_partition(IN from_date DATE, IN to_date DATE)
  proc_label:BEGIN
    DECLARE target_date DATE;
    DECLARE partition_range DATE;
    DECLARE p_count INT;

    -- 日次パーティションの作成
    SET target_date = from_date;
    WHILE DATEDIFF(to_date, target_date) > 0 DO

      -- パーティションはLESS THANになるので1日追加
      SET partition_range = DATE_ADD(target_date, INTERVAL 1 DAY);
      -- パーティションの追加
      SELECT CONCAT(
        'ALTER TABLE hoge ADD PARTITION ( PARTITION ',
        DATE_FORMAT(target_date, 'p%Y%m%d'),
        ' VALUES LESS THAN (UNIX_TIMESTAMP(', QUOTE(DATE_FORMAT(partition_range, '%Y-%m-%d 00:00:00')), ')))'
      ) INTO @ddl;

      PREPARE ddl_stmt FROM @ddl;
      EXECUTE ddl_stmt;
      DEALLOCATE PREPARE ddl_stmt;

      -- 次の日次のパーティションの設定
      SET target_date = DATE_ADD(target_date, INTERVAL 1 DAY);
    END WHILE;

  END$$
DELIMITER ;

```

### 1年ぶんのパーティション(初期パーティション)を作成する
登録したプロシージャ `add_hoge_partition` を使用して、現在日付から1年(365日)ぶんのパーティションを追加します。

```
CALL add_hoge_partition(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY));
```

なお、パーティションは **追加しかできない** ことに注意しましょう。 

### 定期実行するためにプロシージャ実行をEVENT登録する

MySQLには `CREATE EVENT` にてイベントをスケジュール実行する仕組みがあるので今回はこれを利用しましょう。

まず、 RDSのDBのパラメータグループにて `event_scheduler` を `ON` にします。
なお、`event_scheduler`　パラメータグループの変更による再起動は不要です。

その後以下のようなクエリを発行し、日次でパーティションを追加できるようにしましょう。
少々見づらいですが、`INFORMATION_SCHEMA` から既に存在するパーティションの情報を取得し、それに +1日してパーティションを追加しています。

```
CREATE EVENT add_hoge_partition
ON SCHEDULE EVERY 1 DAY STARTS '2018-02-19 00:00:00'
COMMENT 'hogeテーブルに対して1日毎に1日分のパーティションを追加します'
DO CALL 
    add_hoge_partition(
        (select from_unixtime(max(PARTITION_DESCRIPTION)) from INFORMATION_SCHEMA.PARTITIONS where TABLE_NAME = 'hoge', DATE_ADD(
            (select from_unixtime(max(PARTITION_DESCRIPTION)) from INFORMATION_SCHEMA.PARTITIONS where TABLE_NAME = 'hoge'),INTERVAL 1 DAY)
        );

```

これで、毎日0時にパーティションが追加のプロシージャが実行されるようになりました。

## RDS Aurora Clusterの場合を考える
ここで、Aurora Clusterの場合を考えます。
Auroraでクラスタを組んだ場合、Master/Slaveの構成ではなく、Writer/Readerの構成になります。
詳細は割愛しますが、Auroraに関しては以下のBalckBeltの資料を参照してください。

{ oembed https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-amazon-aurora/29 }

### EVENTはWriterのみで実行される
先程、`CREATE EVENT` 構文にてプロシージャを日次で実行するように登録しました。
Clusterを組んだ場合においては、「WriterとReaderの両方で実行されてしまうのでは？」と思い、以下のクエリを実行してみました。
結論から言うと、**プロシージャはWriterで1回だけ呼ばれている** ようです。

* WriterでEVENTを確認
```
select * from INFORMATION_SCHEMA.PROCESSLIST where USER = 'event_scheduler' limit 10;
> 1	event_scheduler	localhost		Daemon	40803	Waiting for next activation	
```

* ReaderでEVENTを確認
```
select * from INFORMATION_SCHEMA.PROCESSLIST where USER = 'event_scheduler' limit 10;
> Empty set (0.01 sec)
```

### 実行時エラーの捕捉の仕方

## 動作確認
* 出た

## まとめ


## 参考にさせていただいたサイト
* [MySQL 5.6 リファレンスマニュアル 13.1.11 CREATE EVENT 構文](https://dev.mysql.com/doc/refman/5.6/ja/create-event.html)
* [AWS Black Belt Online Seminar Amazon Aurora](https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-amazon-aurora/)
* [Amazon Aurora MySQL DB クラスターからの Lambda 関数の呼び出し](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/AuroraMySQL.Integrating.Lambda.html#AuroraMySQL.Integrating.ProcLambda)
