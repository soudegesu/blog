---
title: "Change Soft/Hard limits and file descriptor limits on Amazon Linux 2(systemd)"
description: "When I migrate Amazon Linux to Amazon Linux 2, I investigate how to change file descriptor limits and number of process per user on Linux server working with systemd"
date: 2018-06-10
categories:
  - linux
tags:
  - systemd
url: /en/linux/systemd_limits/
---

## Motivation 

When I migrate `Amazon Linux` to `Amazon Linux2`, I investigate how to change file descriptor limits and number of process per user on Linux server working with `systemd`.
This post is technical memo for myself.

I try the following procedure after booting the official Amazon Linux 2 AMI as it is.

<!--adsense-->

## Soft limits and Hard limits

Let me review what Soft limits and Hard limits are.

Linux limits the number of process per user.
There are two kinds of limits named **Soft limits** and **Hard limits**.
Soft limits mean number of the process for the current user, and Hard limits mean upper limit of Soft limits that can be changed by the user.

## Setting for Linux login user

### Edit limits.conf
 
The configurations in `/etc/security/limits.conf` are applied to Linux login user only login with pluggable authentication module(PAM).
The [pam_limits](https://docs.ansible.com/ansible/2.3/pam_limits_module.html) module in [Ansible](https://www.ansible.com/) edits this file.

{{< highlight "linenos=inline" >}}
cat /etc/security/limits.conf

# /etc/security/limits.conf
#
#This file sets the resource limits for the users logged in via PAM.
#It does not affect resource limits of the system services.
#
#Also note that configuration files in /etc/security/limits.d directory,
#which are read in alphabetical order, override the settings in this
#file in case the domain is the same or more specific.
#That means for example that setting a limit for wildcard domain here
#can be overriden with a wildcard setting in a config file in the
#subdirectory, but a user specific setting here can be overriden only
#with a user specific setting in the subdirectory.
#
#Each line describes a limit for a user in the form:
#
#<domain>        <type>  <item>  <value>
#
#Where:
#<domain> can be:
#        - a user name
#        - a group name, with @group syntax
#        - the wildcard *, for default entry
#        - the wildcard %, can be also used with %group syntax,
#                 for maxlogin limit
#
#<type> can have the two values:
#        - "soft" for enforcing the soft limits
#        - "hard" for enforcing hard limits
#
#<item> can be one of the following:
#        - core - limits the core file size (KB)
#        - data - max data size (KB)
#        - fsize - maximum filesize (KB)
#        - memlock - max locked-in-memory address space (KB)
#        - nofile - max number of open file descriptors
#        - rss - max resident set size (KB)
#        - stack - max stack size (KB)
#        - cpu - max CPU time (MIN)
#        - nproc - max number of processes
#        - as - address space limit (KB)
#        - maxlogins - max number of logins for this user
#        - maxsyslogins - max number of logins on the system
#        - priority - the priority to run user process with
#        - locks - max number of file locks the user can hold
#        - sigpending - max number of pending signals
#        - msgqueue - max memory used by POSIX message queues (bytes)
#        - nice - max nice priority allowed to raise to values: [-20, 19]
#        - rtprio - max realtime priority
#
#<domain>      <type>  <item>         <value>
#

#*               soft    core            0
#*               hard    rss             10000
#@student        hard    nproc           20
#@faculty        soft    nproc           20
#@faculty        hard    nproc           50
#ftp             hard    nproc           0
#@student        -       maxlogins       4

# End of file
{{< / highlight >}}

### Overriding limits.conf

A part of comments in `/etc/security/limits.conf` explains the priority of settings as bellow.

>Also note that configuration files in /etc/security/limits.d directory, which are read in alphabetical order, override the settings in this file in case the domain is the same or more specific.

There is a default Soft limits settings in `/etc/security/limits.d/20-nproc.conf` on Amazon Linux 2.

{{< highlight "linenos=inline" >}}
cat /etc/security/limits.d/20-nproc.conf

> # Default limit for number of user's processes to prevent
> # accidental fork bombs.
> # See rhbz #432903 for reasoning.
>
> *          soft    nproc     4096
> root       soft    nproc     unlimited
{{< / highlight >}}

### Check current configuration

`ulimit -a` command lists available system resources for **current user**. 
`ulimit` command sets Hard limits with `-H` option, and Soft limits with `-S` option.

{{< highlight "linenos=inline" >}}
ulimit -a

> core file size          (blocks, -c) 0
> data seg size           (kbytes, -d) unlimited
> scheduling priority             (-e) 0
> file size               (blocks, -f) unlimited
> pending signals                 (-i) 3828
> max locked memory       (kbytes, -l) 64
> max memory size         (kbytes, -m) unlimited
> open files                      (-n) 1024
> pipe size            (512 bytes, -p) 8
> POSIX message queues     (bytes, -q) 819200
> real-time priority              (-r) 0
> stack size              (kbytes, -s) 8192
> cpu time               (seconds, -t) unlimited
> max user processes              (-u) 3828
> virtual memory          (kbytes, -v) unlimited
> file locks                      (-x) unlimited
{{< / highlight >}}

<!--adsense-->

## Configures daemon

Now limits the system resources for daemon process.
The daemon process in systemd uses the configuration in `/etc/security/limits.conf`, but
`/etc/systemd/system.conf` and `/etc/systemd/user.conf,/etc/systemd/<systemd_unit>/override.conf`.

### Change overall default settings

To change default settings for process controlled by systemd, edit `/etc/systemd/system.conf`.
For instance, changing the file descriptor limits and upper limits of the process is as bellow.

{{< highlight vim "linenos=inline" >}}
[Manager]
DefaultLimitNOFILE=65536
DefaultLimitNPROC=65536
{{< / highlight >}}

### Settings per daemon

When system administrators give services in systemd appropriate system resources,
they creates `/etc/systemd/system/(service name).service` and add `[Service]` block.

Changing only system resource despite of `/etc/systemd/system/（service name）.service` file already exists, override with creating `/etc/systemd/system/（service name）.service.d/override.conf`.

In addition, the setting of `override.conf` takes precedence over` (service name) .service`.

Changing the number of file descriptor limits is as below.

{{< highlight vim "linenos=inline" >}}
[Service]
LimitNOFILE=40000
{{< / highlight >}}

Now restart daemon.

{{< highlight "linenos=inline" >}}
systemctl daemon-reload

systemctl stop (service)
systemctl start (service)
{{< / highlight >}}

Check the configuration.

{{< highlight "linenos=inline" >}}
cat /proc/${process ID}/limits

Limit                     Soft Limit           Hard Limit           Units
Max cpu time              unlimited            unlimited            seconds
Max file size             unlimited            unlimited            bytes
Max data size             unlimited            unlimited            bytes
Max stack size            8388608              unlimited            bytes
Max core file size        0                    unlimited            bytes
Max resident set          unlimited            unlimited            bytes
Max processes             65536                65536                processes
Max open files            40000                40000                files
Max locked memory         65536                65536                bytes
Max address space         unlimited            unlimited            bytes
Max file locks            unlimited            unlimited            locks
Max pending signals       29779                29779                signals
Max msgqueue size         819200               819200               bytes
Max nice priority         0                    0
Max realtime priority     0                    0
Max realtime timeout      unlimited            unlimited            us
{{< / highlight >}}

The file descriptor (Max open files) is 40000.

## Conclusion

It is available to ...

* Change Soft limits for current login user
* Change Hard limits for current login user
* Change default settings for daemon process managed by systemd
