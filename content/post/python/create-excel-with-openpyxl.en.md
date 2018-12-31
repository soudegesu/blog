---
title: "Use openpyxl - open, save Excel files in Python"
description: "I show how to work Excel with openpyxl. This time, create a new file, save it, and open a Excel file that already exists."
date: "2018-08-30T18:34:52+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "excel"
  - "openpyxl"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Introduction 

In this article I show how to work Excel with openpyxl.
 
<!--adsense-->

## Environment

Runtime environment is as below.

* python 3.6
* openpyxl 2.5.6

## Install

Use [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html). The [openpyxl official document](https://openpyxl.readthedocs.io/en/stable/index.html) says ..

> **openpyxl is a Python library to read/write Excel 2010 xlsx/xlsm/xltx/xltm files.**

However, [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) can also work with `Mac Excel 2016` on my Macbook Pro.

Let's install with `pip` command.

{{< highlight bash "linenos=inline" >}}
pip install openpyxl
{{< / highlight >}}

<!--adsense-->

## Create new Excel file

### Import openpyxl

At first, import `Workbook` class from [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html)

{{< highlight python "linenos=inline" >}}
from openpyxl import Workbook
{{< / highlight >}}

### Create Workbook

The `Workbook` is a Class for Excel file in [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html). 

Creating `Workbook` instance works creating a new empty workbook with at least one worksheet.

{{< highlight python "linenos=inline" >}}
# Create a Workbook
wb = Workbook()
{{< / highlight >}}

### Change the name of Worksheet

Now change the name of `Worksheet` to **"Changed Sheet"** .

{{< highlight python "linenos=inline" >}}
ws =  wb.active
ws.title = "Changed Sheet"
{{< / highlight >}}

The `active` property in `Workbook` instance returns the reference to the active worksheet.

### Save file

Save a file as `sample_book.xlsx` with `save` function.

{{< highlight python "linenos=inline" >}}
wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

The saved `xlsx` file exists in the same folder as the program.

![download_file](/images/20180830/download_file.png)

Now open the file and check that the file name has been changed correctly.

![rename_sheet](/images/20180830/en/rename_sheet.png)

<!--adsense-->

## Open a Excel file that already exists

It is easy to get `Workbook` instance using `load_workbook` function.

{{< highlight python "linenos=inline" >}}
from openpyxl import load_workbook
wb = load_workbook('sample_book.xlsx')
print(wb.sheetnames)
{{< / highlight >}}

## Conclusion

It is available to ..

* Create Excel file creating `Workbook` instance
* Save a Excel file with `save` function
* Change name of default `Worksheet` with `active` property
* Open Excel file with `load_workbook` function

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
