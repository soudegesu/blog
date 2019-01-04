---
title: "Use openpyxl - create a new Worksheet, change sheet property in Python"
description: "In this article, I create a new Worksheet, change sheet property Excel files in Python."
date: "2018-08-31T08:53:18+09:00"
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

In [previous article](/en/post/python/create-excel-with-openpyxl/), I showed how to create a new Excel file with [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) in Python.

In this article, I create a new Worksheet, change sheet property Excel files in Python.

<!--adsense-->

## Environment

Runtime environment is as below.

* python 3.6
* openpyxl 2.5.6

## Create a new Worksheet

Use `create_sheet` function to add new `Worksheet`.

{{< highlight python "linenos=inline" >}}
from openpyxl.workbook import Workbook

wb = Workbook()

ws1 = wb.create_sheet("Sheet_A")
ws1.title = "Title_A"

ws2 = wb.create_sheet("Sheet_B", 0)
ws2.title = "Title_B"

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

The `create_sheet` function can insert sheet at arbitrary position by giving a number to the second argument. Without arguments, `create_sheet` function adds sheet to the end of `Workbook` in default.

![insert_sheet](/images/20180831/en/insert_sheet.png)

## Get all sheet names

To get all sheet names of `Workbook`,  access to `sheetnames` property in `Workbook` instance.

{{< highlight python "linenos=inline" >}}
wb.sheetnames
# Returns all sheet names as list
# ['Title_B', 'Sheet', 'Title_A']
{{< / highlight >}}

Using `for` loop to `Workbook`, it gets each `Worksheet` instance in `Workbook` object.

{{< highlight python "linenos=inline" >}}
for ws in wb:
    print(ws.title)
{{< / highlight >}}

<!--adsense-->

## Select Worksheet

`Workbook` object has key-value pairs. To get the `Worksheet` instance, specify the sheet name as key.

{{< highlight python "linenos=inline" >}}
# wb means Workbook object
ws1 = wb["Title_A"]
{{< / highlight >}}

## Change Worksheet property

### Tab color

The `sheet_properties` property in `Worksheet` instance has a `tabColor` attribute.
To change tab color, specify the color code.

{{< highlight python "linenos=inline" >}}
ws1.sheet_properties.tabColor = "1072BA"
{{< / highlight >}}

![tab_color](/images/20180831/en/tab_color.png)

### Filter mode

Setting `filterMode` to `True`, apply filter mode to specific `Worksheet`.
The structure of data format in the `Workseat` must be in a format that can apply filters.

{{< highlight python "linenos=inline" >}}
ws1.sheet_properties.filterMode = True
{{< / highlight >}}

### Other properties

The `sheet_properties` has other worksheet attribute values in addition.

An example is introduced below.

|property|type|meaning|
|--------|-----|-----|
|codeName|str|Specify CodeName|
|enableFormatConditionsCalculation|bool|Gets or sets a value that determines whether conditional formatting is applied automatically|
|published|bool|Save a collection of items or items in the document in a web page format|
|syncHorizontal|bool|Synchronize the active sheet when scrolling horizontally|
|syncVertical|bool|Synchronize the active sheet when scrolling vertically|

<!--adsense-->

## Conclusion

It is available to

* Create a new `Worksheet` with `create_sheet` function
* Get `Worksheet` instance in `Workbook` object using key-value.
* Set worksheet attributes with `sheet_properties`

Since there are various kinds of operation of the workseat, it will be summarized.

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
