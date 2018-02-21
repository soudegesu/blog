---
title: "AWS RDS Aurora Cluster(MySQL互換)で日付パーティションをプロシージャで作成する"
description: "RDS Aurora Cluster(MySQL互換)で日付でのパーティションを作成する方法を紹介します。プロシージャとCREATE EVENTを組み合わせて定期的に作成する方法を中心に、ClusterのWriter/Readerの特性などにも触れます"
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

### 1年ぶんのパーティションを作成する
登録したプロシージャ `add_hoge_partition` を使用して、現在日付から1年(365日)ぶんのパーティションを追加します。

```
CALL add_hoge_partition(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY));
```

なお、パーティションは **追加しかできない** ことに注意しましょう。 

### パーティションの実行をEVENT登録する

MySQLには `CREATE EVENT` にてイベントをスケジュール実行する仕組みがあります。



## Aurora Clusterでのプロシージャはどう動くのか
* WriterとReaderと関係性


## 動作確認
* 出た

## まとめ


## 参考にさせていただいたサイト
* [MySQL 5.6 リファレンスマニュアル 13.1.11 CREATE EVENT 構文](https://dev.mysql.com/doc/refman/5.6/ja/create-event.html)
