---
title: "Use openpyxl - read and write Cell in Python"
description: "Enter or read values to Cell with Cell instance property or cell function. Process data row by row or colum. Enter a value for a row with append function."
date: "2018-09-02T09:38:14+09:00"
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

In previous article, "[Use openpyxl - create a new Worksheet, change sheet property in Python](/en/post/python/sheet-excel-with-openpyxl/)",  I introduced how to create a new Worksheet and change Worksheet properties.

In this article I show how to read and write `Cell` in Excel with Python.

<!--adsense-->

## Enter values to Cell

`Worksheet` object has a **position of Cell** as property. That is dictionary type and consists of **row and column** number.
Using them, access to `Cell` and edit the values. A sample code is as below.

{{< highlight python "linenos=inline" >}}
from openpyxl import Workbook
from openpyxl.compat import range
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active

# Enter `hogehogehoge` in column of `B` and row of `2`
ws['B2'] = 'hogehogehoge'
# Enter `fugafugaufga` in column of `F` and row of `5`
ws['F5'] = 'fugafugaufga'

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

![fill_cell](/images/20180902/fill_cell.png)

Or, using `cell` function can do the same. However, `cell` function must be given arguments column number and line number.

{{< highlight python "linenos=inline" >}}
ws.cell(row=2, column=2, value='hogehogehoge')
ws.cell(row=5, column=6, value='fugafugaufga')
{{< / highlight >}}

<!--adsense-->

## Read values in Cell

To read values in `Cell`, access to `value` property in `Cell` object.

{{< highlight python "linenos=inline" >}}
b2 = ws['B2'].value
{{< / highlight >}}

Or, using `cell` function can do the same when reading.

{{< highlight python "linenos=inline" >}}
b2 = ws.cell(column=2, row=2).value
{{< / highlight >}}

<!--adsense-->

## Processing for each row

The `iter_rows` function can get instances for **each row**.
For specifying to range of extracting data,  `min_row`, `max_row`, `min_col` and `max_col` options exist.
In addition, if `max_row` or `max_col` options are not given in arguments, it is the processing target up to the position where the data is entered.

Actually, it's rarely to read datas from column A of the first row when handling files.

In the following example, processing in units of one line with the second line as the starting line.

{{< highlight python "linenos=inline" >}}
for row in ws.iter_rows(min_row=2):
    for cell in row:
        print(f"col {cell.col_idx}：{cell.value}")
    print('------------------------------------------')
{{< / highlight >}}

The output result is as follows.

{{< highlight python "linenos=inline" >}}
col 1：None
col 2：hogehogehoge
col 3：None
col 4：None
col 5：None
col 6：None
------------------------------------------
col 1：None
col 2：None
col 3：None
col 4：None
col 5：None
col 6：None
------------------------------------------
col 1：None
col 2：None
col 3：None
col 4：None
col 5：None
col 6：None
------------------------------------------
col 1：None
col 2：None
col 3：None
col 4：None
col 5：None
col 6：fugafugaufga
------------------------------------------
{{< / highlight >}}

<!--adsense-->

## Processing for each column

The `iter_cols` function can get instances for **each column**.
Usage is similar to `iter_rows` function.

In the following example, processing in units of one column with the second column as the starting column.

{{< highlight python "linenos=inline" >}}
for col in ws.iter_cols(min_row=2):
    for cell in col:
        print(f"row {cell.row}：{cell.value}")
    print('------------------------------------------')
{{< / highlight >}}

The output result is as follows.

{{< highlight python "linenos=inline" >}}
row 2：None
row 3：None
row 4：None
row 5：None
------------------------------------------
row 2：hogehogehoge
row 3：None
row 4：None
row 5：None
------------------------------------------
row 2：None
row 3：None
row 4：None
row 5：None
------------------------------------------
row 2：None
row 3：None
row 4：None
row 5：None
------------------------------------------
row 2：None
row 3：None
row 4：None
row 5：None
------------------------------------------
row 2：None
row 3：None
row 4：None
row 5：fugafugaufga
------------------------------------------
{{< / highlight >}}

<!--adsense-->

## Enter values for a row

The `append` function in `Worksheet` instance can enter data for one row. 
By giving list type data as an argument, data goes into the sheet left-aligned.

{{< highlight python "linenos=inline" >}}
wb = Workbook()
ws = wb.active

data = [
        ['A', 100, 1.0],
        ['B', 200, 2.0],
        ['C', 300, 3.0],    
        ['D', 400, 4.0],        
]

for row in data:
    ws.append(row)

wb.save(filename = 'sample_book.xlsx')
{{< / highlight >}}

![bulk_insert](/images/20180902/bulk_insert.png)

## Conclusion

It is available to 

* Enter or read values to `Cell` with `Cell` instance property or `cell` function
* Process data row by row or colum
* Enter a value for a row with `append` function

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
