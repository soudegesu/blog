---
title: "Add partitions periodically in AWS RDS Aurora Cluster (MySQL compatible) with the SQL Procedures"
description: "Table partitioning with date in RDS Aurora MySQL compatible. Use SQL procedure to do that."
date: 2018-02-19
thumbnail: /images/icons/rds_icon.png
categories:
  - aws
tags:
  - aws
  - rds
  - aurora
  - SQL
  - MySQL
url: /en/aws/rds-aurora-cluster-partitioning-procedure/
twitter_card_image: /images/icons/rds_icon.png
---

## Introduction

[RDS Aurora](https://aws.amazon.com/rds/aurora/?nc1=h_ls) is a managed service provided by AWS. Aurora is a OSS compatible relational database built on cloud. 

In this article, I explain table partitioning with date in RDS Aurora MySQL compatible.

<!--adsense-->

## Goals

1. Create table **partitioned by date** on [RDS Aurora](https://aws.amazon.com/rds/aurora/?nc1=h_ls) (MySQL compatible)
2. Add **a partition for a day** periodically (once a day)
3. Drop records after a certain period of time
4. Handle errors in these operation running

As an example, I handle the following `hoge` table.

|column      |types       |note                   |
|------------|------------|-----------------------|
|id          |varchar(255)|User ID                |
|info        |varchar(255)|Some information about the user for `id`|
|create_at   |timestamp   |Date and time when the record was created   |

<!--adsense-->

## Add a partition once a day

Create `hoge` table by the following steps.

1. Create a certain number of partitions at first
2. Regist a SQL procedure to add a partition
3. Run the procedure once a day

### Create partition table

First, execute the following query and create `hoge` table.

{{< highlight mysql "linenos=inline" >}}
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
{{< / highlight >}}

In this partitioning scheme, naming rules of partition is `p` + `yyyyMMdd`.
`create_at` column is a partition key. `id` column and  `create_at` column are Composite Primary Keys.
The partition key must be included in the Primary keys.

The partition `p20180219` is created by `PARTITION BY RANGE` clause, but `p20180219` can store only the data for the create_at column before `2018-02-19 00:00:00`.

### Regist a SQL procedure to add a partition

Second, Create a SQL procedure to add a partition.
One partition can store in range of 24 hours of data.
To make the code easier to see, validation is omitted.

{{< highlight mysql "linenos=inline" >}}
--
-- A procedure to add partition to hoge table.
-- This procedure creates partitions in the range of days 'from_date' to 'to_date - 1'.
-- 
-- Arguments 
--       from_date: The start of date time to create partitions
--       to_date: The end of date time to create partitions
-- Execution sample
--       CALL add_hoge_partition(str_to_date('2018-01-01', '%Y-%m-%d'), str_to_date('2019-01-01', '%Y-%m-%d'));

DROP PROCEDURE IF EXISTS add_hoge_partition;
DELIMITER $$
CREATE PROCEDURE add_hoge_partition(IN from_date DATE, IN to_date DATE)
  proc_label:BEGIN
    DECLARE target_date DATE;
    DECLARE partition_range DATE;
    DECLARE p_count INT;

    SET target_date = from_date;
    WHILE DATEDIFF(to_date, target_date) > 0 DO

      SET partition_range = DATE_ADD(target_date, INTERVAL 1 DAY);
      SELECT CONCAT(
        'ALTER TABLE hoge ADD PARTITION ( PARTITION ',
        DATE_FORMAT(target_date, 'p%Y%m%d'),
        ' VALUES LESS THAN (UNIX_TIMESTAMP(', QUOTE(DATE_FORMAT(partition_range, '%Y-%m-%d 00:00:00')), ')))'
      ) INTO @ddl;

      PREPARE ddl_stmt FROM @ddl;
      EXECUTE ddl_stmt;
      DEALLOCATE PREPARE ddl_stmt;

      SET target_date = DATE_ADD(target_date, INTERVAL 1 DAY);
    END WHILE;

  END$$
DELIMITER ;

{{< / highlight >}}

Now add initial partitions using `add_hoge_partition`.
Add the partition for 365 days with the current date as the base date.

{{< highlight mysql "linenos=inline" >}}
CALL add_hoge_partition(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 365 DAY));
{{< / highlight >}}

### Create Event task for procedure call

Use **MySQL Events** that are tasks that run according to a schedule. To use that in RDS, need to set `event_scheduler` to `ON` in parameter group of RDS. A reboot of RDS instances is needless.

Call MySQL Events from SQL with the following query.

{{< highlight mysql "linenos=inline" >}}
CREATE EVENT add_hoge_partition
ON SCHEDULE EVERY 1 DAY STARTS '2018-02-19 00:00:00'
DO CALL
    add_hoge_partition(
        (
          select 
            from_unixtime(max(PARTITION_DESCRIPTION)) 
          from 
            INFORMATION_SCHEMA.PARTITIONS 
          where 
            TABLE_NAME = 'hoge', 
          DATE_ADD(
            (
              select 
                from_unixtime(max(PARTITION_DESCRIPTION)) 
              from 
                INFORMATION_SCHEMA.PARTITIONS 
              where 
                TABLE_NAME = 'hoge'
            ),
            INTERVAL 1 DAY
          )
        );

{{< / highlight >}}

This query get the latest partition information from `INFORMATION_SCHEMA`, and calculate target partition date that should be created.

Now the `add_hoge_partition` procedure is called every day at 0 o'clock.

<!--adsense-->

## On RDS Aurora Cluster, only writer instance executes MySQL Events

Make sure that MySQL Events runs only on Writer instance.

* Execute the below query on **Writer** instance

{{< highlight mysql "linenos=inline" >}}
select * from INFORMATION_SCHEMA.PROCESSLIST where USER = 'event_scheduler' limit 10;
> 1	event_scheduler	localhost		Daemon	40803	Waiting for next activation
{{< / highlight >}}

* Execute the below query on **Reader** instance

{{< highlight mysql "linenos=inline" >}}
select * from INFORMATION_SCHEMA.PROCESSLIST where USER = 'event_scheduler' limit 10;
> Empty set (0.01 sec)
{{< / highlight >}}

If the role of database change with failover, only new switched writer instance executes the events.

<!--adsense-->

## Error handling on Aurora

If there is no way to detect an error, nobody notices database problems. This sentence describes error handling of Aurora instance in procedure call.

### Notification with AWS Lambda

RDS Aurora(MySQL Compatible) has `mysql.lambda_async` procedure as a default.
The `mysql.lambda_async` procedure can execute AWS Lambda function directly with messages.
Developers can be notified some database troubles using `mysql.lambda_async` .

The steps will be explained below.

#### Add IAM Role to Aurora cluster

When RDS Aurora executes AWS Lambda function, it should have a execution permission.
Now, create `rdsToLambdaRole` to do that. The IAM role has a access policy as below

{{< highlight json "linenos=inline" >}}
"Action": [
  "lambda:InvokeFunction"
]
{{< / highlight >}}

Set Amazon Resource Name(ARN) of `rdsToLambdaRole` to parameter named **aws_default_lambda_role** in RDS cluster parameter group. Since this parameter is `dynamic`, rebooting of RDS cluster is needless.

![rds_to_lambda_role](/images/20180219/rds_to_lambda_role.png)

#### Set network routing for subnets

RDS instances need to be permitted outbound communication.
Generally, database instances are placed in private subnets, so developers should allow the subnets to communicate to outbound.

#### Add error handling to procedure

For error handling, add `HANDLER` declaration that executes AWS Lambda function to procedure. Call Lambda function named `rds_monitor` using `mysql.lambda_async` procedure. The `mysql.lambda_async` procedure requires ARN of AWS Lambda as argument. 

Code snippet is as below.

{{< highlight mysql "linenos=inline" >}}
    -- Notify when errors occured
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1 @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
        CALL mysql.lambda_async(
          'arn:aws:lambda:${your_region}:${your_account_id}:function:rds_monitor',
          CONCAT('{"message":"', @p2, '",',
                  '"state":"', @p1, '"}')
        );
      END;

{{< / highlight >}}

Add the above snippet to the previous procedure code.

{{< highlight mysql "linenos=inline,hl_lines=8-16" >}}
DROP PROCEDURE IF EXISTS add_hoge_partition;
DELIMITER $$
CREATE PROCEDURE add_hoge_partition(IN from_date DATE, IN to_date DATE)
  proc_label:BEGIN
    DECLARE target_date DATE;
    DECLARE partition_range DATE;
    DECLARE p_count INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
        GET DIAGNOSTICS CONDITION 1 @p1 = RETURNED_SQLSTATE, @p2 = MESSAGE_TEXT;
        CALL mysql.lambda_async(
          'arn:aws:lambda:${your_region}:${your_account_id}:function:rds_monitor',
          CONCAT('{"message":"', @p2, '",',
                  '"state":"', @p1, '"}')
        );
      END;

    SET target_date = from_date;
    WHILE DATEDIFF(to_date, target_date) > 0 DO

      SET partition_range = DATE_ADD(target_date, INTERVAL 1 DAY);
      SELECT CONCAT(
        'ALTER TABLE hoge ADD PARTITION ( PARTITION ',
        DATE_FORMAT(target_date, 'p%Y%m%d'),
        ' VALUES LESS THAN (UNIX_TIMESTAMP(', QUOTE(DATE_FORMAT(partition_range, '%Y-%m-%d 00:00:00')), ')))'
      ) INTO @ddl;

      PREPARE ddl_stmt FROM @ddl;
      EXECUTE ddl_stmt;
      DEALLOCATE PREPARE ddl_stmt;

      SET target_date = DATE_ADD(target_date, INTERVAL 1 DAY);
    END WHILE;

  END$$
DELIMITER ;

{{< / highlight >}}

#### Implement AWS Lambda function

Implement AWS Lambda function to handle the message from Aurora.
In case of me, I implement to notify errors to [datadog](https://www.datadoghq.com/) that is a monitoring service.

### [Addition] Error log on RDS instances

To check error log for RDS instances, I opened `error/mysql-error-running.log` on AWS Management Console.
However, despite the fact that log file size is 38.2 kB, the log file shows only **'END OF LOG'** as below.

![rds error log is empty](/images/20180219/rds_log_is_empty.png)

Actually, this is the specification of RDS.
**The file includes the log used by AWS, and the log is not displayed to AWS users.**
For this reason, the file size is not 0.

<!--adsense-->

## Conclusion

It is available to 

* Call procedure and add partition table periodically.
* Handle errors when error occured in procedure call.
