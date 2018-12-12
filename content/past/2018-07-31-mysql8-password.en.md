---
title: "Ansible playbook configuration for MySQL8 (how to change root password etc.)"
description: "MySQL major version 8 was released on 2018/4. I summarize the trouble with my trying to create MySQL 8 AMI with ansible playbook."
date: 2018-07-31
thumbnail: /images/icons/mysql_icon.png
categories:
  - mysql
tags:
  - mysql
  - ansible
  - packer
url: /en/mysql/mysql8-password/
twitter_card_image: /images/icons/mysql_icon.png
---

[MySQL](https://www.mysql.com/jp/) major version `8` was released on April 2018.
I introduce the problem with my trying to creaet MySQL 8 Amazon Machine Image(AMI) with ansible.

## Motivation

I usually use AWS. AWS has a database managed service called RDS, and RDS supports MySQL 5.x series.
To conduct in-house training using MySQL 8, I needed to make AMI of MySQL 8 with ansible.

## Environment

* CentOS 7
* Ansible 2.6.1
* Packer 1.1.3

## Configuration sample of ansible playbook

In this case, I describe **only the main task definition part in Ansible**, I omit Packer configuration because it becomes redundant.

The sample of ansible playbook is now as follows.

{{< highlight yaml "linenos=inline" >}}
---
- name: download epel-release
  yum:
    name: https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
    state: present
- name: delete mariadb
  yum:
    name: mariadb-libs
    state: removed
- name: install mysql
  yum:
    name: "{{ item }}"
    state: present
  with_items:
    - mysql-community-devel*
    - mysql-community-server*
    - MySQL-python
- name: copy my.cnf
  copy:
    src: ../files/etc/my.cnf
    dest: /etc/my.cnf
    mode: 0644
- name: enable mysql
  systemd:
    name: mysqld
    state: restarted
    enabled: yes
- name: get root password
  shell: "grep 'A temporary password is generated for root@localhost' /var/log/mysqld.log | awk -F ' ' '{print $(NF)}'"
  register: root_password
- name: update expired root user password
  command: mysql --user root --password={{ root_password.stdout }} --connect-expired-password --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY '{{ mysql.root.password }}';"
- name: create mysql client user
  mysql_user:
    login_user: root
    login_password: "{{ mysql.root.password }}"
    name: "{{ item.name }}"
    password: "{{ item.password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%'
  with_items:
    - "{{ mysql.users }}"
{{< / highlight >}}

## Points

Now, I explain the above `.yaml` settings.

### Remove mariadb-libs

I delete MariaDB modules that is installed on Centos7 in default.
MariaDB modules conflict MySQL modules when install.

{{< highlight yaml "linenos=inline" >}}
- name: delete mariadb
  yum:
    name: mariadb-libs
    state: removed
{{< / highlight >}}

### Install MySQL-python

If use `mysql_user` module in ansible, **need to install MySQL-python to provisioning host**.
In addition, `MySQL-python` works on only Python 2.

{{< highlight yaml "linenos=inline" >}}
- name: install mysql
  yum:
    name: "{{ item }}"
    state: present
  with_items:
    - mysql-community-devel*
    - mysql-community-server*
    - MySQL-python # Here
{{< / highlight >}}

### Change default authentication plugin in MySQL

MySQL 8 changes default authentication plugin to strengthen security.
For details, see [here](https://dev.mysql.com/doc/refman/8.0/en/upgrading-from-previous-series.html#upgrade-caching-sha2-password).

To use the previous authentication plugin, I edit `my.cnf` and
add `default-authentication-plugin = mysql_native_password` block as follows. 

{{< highlight vim "linenos=inline" >}}
[mysqld]
default-authentication-plugin=mysql_native_password
{{< / highlight >}}

And then, copy to `/etc/my.cnf` .

{{< highlight yaml "linenos=inline" >}}
- name: copy my.cnf
  copy:
    src: ../files/etc/my.cnf
    dest: /etc/my.cnf
    mode: 0644
{{< / highlight >}}

Restart `mysqld` daemon to apply the settings.

{{< highlight yaml "linenos=inline" >}}
- name: enable mysql
  systemd:
    name: mysqld
    state: restarted
    enabled: yes
{{< / highlight >}}

### Get root password written in log file and initialize user

This is the most troublesome point.

**MySQL 8 outputs root user's initial password in `/var/log/mysqld.log`**

To change default password for root user, I save the password text to variable using `register`, and change password with `mysql` command.

{{< highlight yaml "linenos=inline" >}}
- name: get root password
  shell: "grep 'A temporary password is generated for root@localhost' /var/log/mysqld.log | awk -F ' ' '{print $(NF)}'"
  register: root_password # save to variable
- name: update expired root user password
  command: mysql --user root --password={{ root_password.stdout }} --connect-expired-password --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY '{{ mysql.root.password }}';"
{{< / highlight >}}

I explain **the reason why I use `command` module instead of `mysql_user` module** .

For example, I initially configured as follows.
In this case, `MySQL-python` connects to database as root user and change root user's own password.

{{< highlight yaml "linenos=inline" >}}
-  mysql_user:
    login_user: root
    login_password: "{{ root_password }}"
    name: root
    password: "{{ sometinng new password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%'
{{< / highlight >}}

However, the following error occurs.
This error is reported in [github issue](https://github.com/ansible/ansible/issues/41116).

{{< highlight bash "linenos=inline" >}}
unable to connect to database, check login_user and login_password are correct or /root/.my.cnf has the credentials
{{< / highlight >}}

Beacause of the issue, using `mysql` command with `command` module until the issue fixes is better. 

### Create user to connect database

`mysql_user` module creates mysql user to connect database.
`login_user` block is a user who creates a user(`root`), and `login_password` block is the password used to authenticate with.

To the `host` block, set the host of the connection source appropriately.
`%` means `any`. **When the `host` block is not set, only connections from localhost are accepted** .

{{< highlight yaml "linenos=inline" >}}
- name: create mysql client user
  mysql_user:
    login_user: root
    login_password: "{{ mysql.root.password }}"
    name: "{{ item.name }}"
    password: "{{ item.password }}"
    priv: '*.*:ALL,GRANT'
    state: present
    host: '%' # When host is not set, only connections from localhost are accepted
  with_items:
    - "{{ mysql.users }}"
{{< / highlight >}}

## Conclusion

It is available to

* Install mysql with uninstalling mariadb modules
* Change `root` user default password with getting password from `/var/log/mysqld.log`
* Create user to connect database, and change accessible host

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1787125688&asins=1787125688&linkId=e29ca38f6a2a430b19743885ac51de97&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=B00ZUQ4492&asins=B00ZUQ4492&linkId=e2e96554262ff4461c8824fa8ddd6f5a&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491915323&asins=1491915323&linkId=d1e6046e7eadaf9afe507e038d2a5b09&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>        
</div>
