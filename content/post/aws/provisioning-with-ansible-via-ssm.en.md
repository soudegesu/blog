---
title: "Provisioning a edge device in a private network with Ansible via AWS Session Manager"
description: "Since SSH is not available for devices in a private network, provisioning using SSH is not an easy task. In this post, I will show you how to run the Ansible Playbook using Session Manager in AWS System Manager."
date: "2021-01-08T15:12:06+09:00"
thumbnail: /images/icons/ssm_icon.png
categories:
  - "aws"
tags:
  - "aws"
  - "ssm"
isCJKLanguage: true
twitter_card_image: /images/icons/ssm_icon.png
---

In this article, I will show you how to access devices in a private network in a remote location to manage the device configuration by AWS System Manager Session Manager and Ansible.

<!--adsense-->

## Device provisioning in a private network

I would like to run a configuration management script from my development machine at home on a remotely located device. The image is as follows.

![purpose](/images/20210108/purpose.drawio.png)

In most cases, the remotely located devices are probably in a private network, so it is not that easy to run Ansible.

We can consider using AWS Greengrass for simple module updates to edge devices, but it is not suitable for serious configuration management, so we will look for a way to run Ansible.

## Environment

- PC in my home
  - Mac Book Pro (Mac OS X `10.15.7`)
  - Ansible `2.9.9`
  - AWS CLI `2.1.16`
  - [AWS Session Manager Plugin](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html#install-plugin-macos)
- Devices in remote location
  - Jetson AGX Xavier (JetPack `4.4`)
  - [AWS Systems Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html)

<!--adsense-->

## Setup procedure

### Configuring AWS System Manager Session Manager

The first step is to configure the [AWS System Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) settings.

[AWS System Manager Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) is often used as a replacement for a stepping server, but it can be used not only to access virtual servers (EC2), but can also be configured to put up sessions to on-premises servers. This means that if the AWS-provided module supports the OS distribution, it can be installed on edge devices as well.

Refer to the [official documentation](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager.html) for the setup procedure. It's very well written.

I'll just give you a rough outline of the process.

1. Create an IAM Instance Profile that will be attached to the Device (the host where Ansible will run)
2. Configure the System Manager.
3. Install the [AWS Session Manager Plugin](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html#install-plugin-macos) on your PC (local machine).
4. Install the AWS Session Manager modules on the Device (the host where Ansible will run) and register the device to System Manager as a on-premise instance.

<!--adsense-->

### Open a port forwarding session in AWS Session Manager

Execute the following command on your PC to enable port forwarding from your PC to the device via Session Manager. The `--target` option should be the Instance ID of the device registered in Session Manager.
And set forwarding the `9090` port on the your PC to the `22` port on the device.

{{<highlight bash "linenos=inline">}}
aws ssm start-session \
 --target mi-xxxxxxxx \
 --document-name AWS-StartPortForwardingSession \
 --parameters '{"portNumber":["22"],"localPortNumber":["9090"]}'
{{</highlight>}}

### Create an Ansible Playbook file and run it

The next step is to create a set of Ansible Playbook files. The content of the tasks can be anything you want.
The important thing here is how you specify the inventory.
We have set the provisioning target to the `9090` port on `localhost`.

{{<highlight bash "linenos=inline,hl_lines=2 5">}}
[jetson]
localhost

[jetson:vars]
ansible_port=9090
ansible_user=XXXXXXX
ansible_ssh_pass=XXXXXX
ansible_become_password=XXXXXX
ansible_python_interpreter=/usr/bin/python3
{{</highlight>}}

You can run the `ansible-playbook` command from your PC to the device via port forwarding.

<!--adsense-->

## Why port forwarding?

This section explains why you should open a port forwarding session first.

[AWS Session Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html) document introduces the configuration of `~/.ssh/config` by `ProxyCommand`.

This setting is very useful because it allows you to specify an Instance ID for SSH login, such as `ssh user@mi-xxxxxxx`.

{{<highlight bash "linenos=inline">}}
Host i-_ mi-_
ProxyCommand sh -c "aws ssm start-session \
 --target %h \
 --document-name AWS-StartSSHSession \
 --parameters 'portNumber=%p'"
{{</highlight>}}

However, the `AWS-StartSSHSession` specified here will only open a new session (Local Machine -> Session Manager -> Device) every time it is called. **The session or session-worker will remain to maintain the SSH connection until you explicitly call aws ssm terminate-session or the session idle times out**.

For example, with the `ProxyCommand` setting in place, if you specify the connection host by Instance ID, a `Connection reset by peer` error will occur in the middle of execution for relatively long Ansible tasks.

{{<highlight bash "linenos=inline,hl_lines=2">}}
[jetson]
mi-xxxxxxxx

[jetson:vars]
ansible_user=XXXXXXX
ansible_ssh_pass=XXXXXX
ansible_become_password=XXXXXX
ansible_python_interpreter=/usr/bin/python3
{{</highlight>}}

If you check the `/var/log/amazon/ssm/errors.log` file on the Ansible host, you can see that `too many open files` is output. You can also see that the number of `sshd` processes on the Ansible host is increasing while Ansible is running.

{{<highlight bash "linenos=inline">}}
ERROR [NewFileWatcherChannel @ filechannel.go.79] [ssm-session-worker] [xxxxxxx-07679fe2fa5825aa8] \
filewatcher listener encountered error when start watcher: too many open files
ERROR [createFileChannelAndExecutePlugin @ main.go.105] [ssm-session-worker] \
[xxxxxxx-07679fe2fa5825aa8] failed to create channel: too many open files
ERROR [handleSSHDPortError @ port.go.292] [ssm-session-worker] \
[xxxxxxx-0590c3ea63794d55f] [DataBackend] [pluginName=Port] \
Failed to read from port: read tcp 127.0.0.1:41294->127.0.0.1:22: use of closed network connection
{{</highlight>}}

## Conclusion

When you run Ansible commands via Session Manager, you should open a port forwarding session and then run them against localhost.
