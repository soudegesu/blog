---
title: "AWS RDS Aurora Cluster(MySQL互換)でパーティションをプロシージャで定期的に追加しつつ、エラーハンドリングもする"
description: "RDS Aurora Clusterで日付でのパーティションを作成する方法を紹介します。CREATE EVENTイベントからのプロシージャを定期実行をはじめ、Cluster時の振る舞いやエラーハンドリングについても触れます"
date: 2018-02-19 00:00:00 +0900
categories: aws
tags: aws rds aurora SQL MySQL
lang: ja
---


AWSのRDS AuroraはOSSのDBミドルウェアと互換性のあるマネージドサービスです。
今回はAuroraのMySQL互換での日付パーティションの作成に関して説明します。
AuroraというよりはMySQLの仕様に関する説明も多いのでご了承ください。


* Table Of Contents
{:toc}


## 今回やりたかったこと
今回はRDS Aurora(MySQL互換)にてClusterを組み、テーブルは日でパーティショニングすることにしました。
要件はざっくり以下です。

1. ユーザ操作の都度データが格納されていく(**データは常にINSERT**)
2. **一定期間が経過したデータには利用価値が薄い** ため退避した後削除して良い

そもそもDynamoDBでよくない？というツッコミがあるかもしれませんが、システムとは別の理由があるため採用していません。

今回は以下のような `hoge` テーブルを考えます。
`hoge` テーブルにはユーザ(`id`)が行なった操作を `info` カラムに格納します。
`create_at` はパーティションキーであり、 `id` と `create_at` が PKです。

なお、パーティションキーはPKに含める必要があります。

|カラム名     |型           |備考                   |
|------------|------------|-----------------------|
|id          |varchar(255)|ユーザのID              |
|info        |varchar(255)|ユーザが行なった操作の情報 |
|create_at   |timestamp   |レコードが作成された日時   |

## パーティションを日次で追加する

ここから具体的な手順を説明します。
`hoge` テーブルには以下のような操作をすることにしました。

* 最初に一定量のパーティションを作成しておく
* パーティションの**追加**はプロシージャで実施する
* 日次でパーティションの最後に+1日ぶんのパーティションを**追加**する

一般的に **「プロシージャの追加は一定量をまとめて実施した方が良い」** と言われています。

私の場合、システムの運用要件や、格納するデータの想定量を設計に加え、左記を踏まえた負荷試験も実施したところ、オンラインでの日次パーティション追加でもパフォーマンス上問題がなかったため、上記の対応方針にしました。

### テーブル作成とパーティションの指定
以下のようなクエリを発行し `hoge` テーブルを作成します。
加えて、パーティション名のルールは `p` + `yyyyMMdd` として、`create_at` カラムでRANGEパーティション指定をします。

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

### 初期パーティションを作成する
登録したプロシージャ `add_hoge_partition` を使用して、初期パーティションを追加します。

とりあえず、現在日付から365日ぶんのパーティションを追加しましょう。

```
CALL add_hoge_partition(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY));
```

なお、パーティションは **追加しかできない** ことに注意してください。 

### プロシージャ実行をEVENT登録し定期実行する

MySQLには `CREATE EVENT` 構文にてイベントをスケジュール実行する仕組みがあります。
これを利用することにしましょう。

まず、 RDSのDBのパラメータグループにて `event_scheduler` を `ON` に指定します。(デフォルトでは `OFF` )
その際、`event_scheduler` パラメータグループの変更に伴うDBの再起動は不要です。

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

これで、毎日0時にパーティション追加のプロシージャが実行されるようになりました。

## RDS Aurora Clusterの場合を考える
ここで、Aurora Clusterの場合を考えます。
Auroraでクラスタを組んだ場合、Master/Slaveの構成ではなく、Writer/Readerの構成になります。
詳細は割愛しますが、Auroraに関しては以下のBalckBeltの資料を参照してください。

{% oembed https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-amazon-aurora/29 %}

### EVENTはWriterのみで実行される
先程、`CREATE EVENT` 構文にてプロシージャを日次で実行するように登録しました。
Clusterを組んだ場合においては、「WriterとReaderの両方で実行されてしまうのでは？」と思い、以下のクエリを実行してみたところ、**プロシージャはWriterで1回だけ呼ばれている** ことが確認できました。

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

Failoverさせた状態でも、翌日にもパーティションが作成されていることも確認できたため、Writerのみが実行できているといえます。

## エラーが発生したらどうするか
今回の「定期的にプロシージャを実行」という方法は **Auroraインスタンスの中に閉じた処理** になります。
仮に実行時エラーやバリデーションエラー等が発生した場合に、開発者がそれを拾えなければサイレント障害になりかねません。
そのため、**エラーが発生した場合に検知する機構** が必要になってきます。

### プロシージャ実行時のエラーはlambdaで検知する
今回はAurora(MySQL互換)に標準で組み込まれたプロシージャ `mysql.lambda_async` を使用して問題発生を検知するようにします。
`mysql.lambda_async` は、RDSから直接AWS Lambdaを実行することができ、その際にメッセージを指定できるのです。
以降ではその手順を説明します。

#### Aurora ClusterにIAM Roleを追加する
Auroraからlambdaを実行するために、別途権限を付与する必要があります。
IAMのメニューから専用のIAM Roleを作成しましょう(今回は `rdsToLambdaRole` という名前にします)。
`rdsToLambdaRole` には 

```
"Action": [
  "lambda:InvokeFunction"
]
```

が許可されていれば良いので、AWSから提供されている `AWSLambdaRole` ポリシーを適用すればOKです。

作成した `rdsToLambdaRole` のARNを **クラスタのパラメータグループ**の**aws_default_lambda_role**に指定しましょう。

こちらのパラメータも `dynamic` のためクラスタ再起動は不要です。

![rds_to_lambda_role]({{site.baseurl}}/assets/images/20180219/rds_to_lambda_role.png)

#### RDSインスタンスのあるsubnetのルーティング設定をする
RDSからのoutbound通信を許可してあげる必要があるので、ルーティングの設定を行います。
一般的にDBサーバはprivate subnetに置くケースが大半だと思いますので、private subnetから外に出られるように設定してあげましょう。

#### プロシージャ側のエラーハンドリングを追加する
プロシージャ内でエラーが発生した場合に、lambdaを実行する `HANDLER` を先程のプロシージャに追加しましょう。
lambda関数 `rds_monitor` を `mysql.lambda_async` プロシージャで呼び出します。

追記箇所は以下のようになります。

```
    -- 失敗したらlambdaで通知する
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1 @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
        CALL mysql.lambda_async(
          'arn:aws:lambda:ap-northeast-1:${account_id}:function:rds_monitor',
          CONCAT('{"message":"', @p2, '",',
                  '"state":"', @p1, '"}')
        );
      END;

```

先程のプロシージャに組み込んだ場合は以下のようになります。

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
    -- 失敗したらlambdaで通知する
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1 @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
        CALL mysql.lambda_async(
          'arn:aws:lambda:ap-northeast-1:${account_id}:function:rds_monitor',
          CONCAT('{"message":"', @p2, '",',
                  '"state":"', @p1, '"}')
        );
      END;

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

`mysql.lambda_async`の引数には**lambdaのARN指定が必要**という点が注意ポイントです。

DBのマイグレーションツールを使用して複数のAWSアカウントを運用されている方は、AWSのアカウント番号が異なるため、チェックサムが変わってしまいます。マイグレーションツールがテンプレート変数をサポートしているか確認すると良いでしょう。

#### lambda関数を作成する

Auroraから渡されたメッセージを処理して、監視システムやチャットツールに通知するためのlambda関数を実装します。
私の場合は監視用SaaSである [datadog](https://www.datadoghq.com/) に通知していました。

#### [備考]RDSのエラーログが出力されない?
コンソール上からRDSインスタンスのエラーログを参照しようと `error/mysql-error-running.log` を選択しても、
以下のように **END OF LOG** しか表示されない場合があります。
コンソール上部には 38.2kB とログの容量が記載されているにも関わらずに、です。

![rds error log is empty]({{site.baseurl}}/assets/images/20180219/rds_log_is_empty.png)

実はこれは、**「AWS側で使用するログを上記のログファイルに出力しているらしく、我々AWSのユーザ側には表示されない」という仕様** によるものです。少しわかりにくいですが、このログファイルの容量はAWS用のログの容量も含まれて表示されている、ということですね。

## まとめ
今回はAurora Clusterからプロシージャを定期実行することで、日付パーティションを定期追加する方法をまとめました。
マネージドサービスであるRDSのプロシージャ内部の処理は隠蔽されて見通しが悪くなるため、エラーハンドリングをきちんと定義してあげることが肝要です。今回はRDSからlambdaを実行しましたが、`CloudwatchLogs` へ連携することもできるそうなので、機会があれば試してみたいと思います。

## 参考にさせていただいたサイト
* [MySQL 5.6 リファレンスマニュアル 13.1.11 CREATE EVENT 構文](https://dev.mysql.com/doc/refman/5.6/ja/create-event.html)
* [AWS Black Belt Online Seminar Amazon Aurora](https://www.slideshare.net/AmazonWebServicesJapan/aws-black-belt-online-seminar-amazon-aurora/)
* [Amazon Aurora MySQL DB クラスターからの Lambda 関数の呼び出し](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/AuroraMySQL.Integrating.Lambda.html#AuroraMySQL.Integrating.ProcLambda)
