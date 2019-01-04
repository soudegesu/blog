---
title: "Use openpyxl -  Convert to DataFrame in Pandas"
description: "Convert Worksheet object with or without headers to DataFrame object with Pandas. And make it simpler using read_excel function."
date: "2018-10-13T06:52:26+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "excel"
  - "openpyxl"
  - "pandas"  
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Introduction 

Previously, I wrote several articles on working Excel files using [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html).

* [Use openpyxl - open, save Excel files in Python](/en/post/python/create-excel-with-openpyxl/)
* [Use openpyxl - create a new Worksheet, change sheet property in Python](/en/post/python/sheet-excel-with-openpyxl/)
* [Use openpyxl - read and write Cell in Python](/en/post/python/cell-excel-with-openpyxl/)

In this article, I introduce how to convert [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) data to [Pandas](https://pandas.pydata.org/) data format called `DataFrame`.

<!--adsense-->

## Preparation

### Install modules

First, install module with `pip` command.

{{< highlight bsah "linenos=inline" >}}
pip install openpyxl pandas
{{< / highlight >}}

### Make sample data

Second, create a new file named `sample.xlsx` including the following data.

* Workbook has a sheet named `no_header` that doesn't have header line.

![no_header_sample_sheet](/images/20181013/en/no_header_sample_sheet.png)

* Workbook has a sheet named `sample` that has a header line.

![sample_sheet](/images/20181013/en/sample_sheet.png)

<!--adsense-->

## Convert openpyxl object to DataFrame

Load Excel data with [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html) and convert to `DataFrame`. `DataFrame` is used to represent 2D data on [Pandas](https://pandas.pydata.org/).
Since Excel data is also 2D data expressed by rows and columns, `Worksheet` object in [openpyxl] (https://openpyxl.readthedocs.io/en/stable/index.html) can be converted to Pandas` DataFrame` object.

### Data without header line

When converting a file that has no header line, give `values` property on `Worksheet` object to `DataFrame` constructor.

{{< highlight python "linenos=inline" >}}
from openpyxl import load_workbook
import pandas as pd

# Load workbook
wb = load_workbook('sample.xlsx')
# Access to a worksheet named 'no_header'
ws = wb['no_header']

# Convert to DataFrame
df = pd.DataFrame(ws.values)
{{< / highlight >}}

Check the result.

{{< highlight python "linenos=inline" >}}
df.head(3)
{{< / highlight >}}

|  |0	 |1	   |2  |
|----|----|----|----|
| 0|	1|	Mike|	male|
| 1|	2|	Mayor|	female|
| 2|	3|	Jon|	male|

The column number is displayed as a header.

### Data with header line

In case of a file that has a header line, it is necessary to change processing. When creating a `DataFrame` object, specify column name with `columns` option. At this time, the length of array given `columns` option must be equal to length of columns in `DataFrame`.

The sample code is as follows.

{{< highlight python "linenos=inline" >}}
from openpyxl import load_workbook
import pandas as pd

wb = load_workbook('sample.xlsx')
ws = wb['sample']

data = ws.values
# Get the first line in file as a header line
columns = next(data)[0:]
# Create a DataFrame based on the second and subsequent lines of data
df = pd.DataFrame(data, columns=columns)
{{< / highlight >}}

Check the result.

{{< highlight python "linenos=inline" >}}
df.head(3)
{{< / highlight >}}

|  |ID	 |Name	   |Sex  |
|----|----|----|----|
| 0|	1|	Mike|	male|
| 1|	2|	Mayor|	female|
| 2|	3|	Jon|	male|

The column name is displayed.

<!--adsense-->

## Loading Excel file easier with read_excel function

Using the `read_excel` function in [Pandas](https://pandas.pydata.org/), we can do the same processing. To use `read_excel` function, install [xlrd](https://github.com/python-excel/xlrd) and [openpyxl](https://openpyxl.readthedocs.io/en/stable/index.html).

{{< highlight bash "linenos=inline" >}}
pip install openpyxl pandas xlrd
{{< / highlight >}}

Call `read_excel` function as below.

{{< highlight python "linenos=inline" >}}
import pandas as pd

df = pd.read_excel('sample.xlsx', sheet_name='sample')
df.head()
{{< / highlight >}}

## Conclusion

It is available to

* Convert `Worksheet` object with or without headers to `DataFrame` object
* Make it simpler with `read_excel` function in [Pandas](https://pandas.pydata.org/)

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
