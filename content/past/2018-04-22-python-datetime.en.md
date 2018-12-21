---
title: "Convert a string representing the date or epoch time to datetime and change timezone in Python"
description: "Convert date formatted string or epochtime to datetime, and change timezone in Python.I often convert epochtime and string formatted datetime from middlware and other data sources. This post is a memo for myself."
date: 2018-04-22
thumbnail: /images/icons/python_icon.png
categories:
    - python
tags:
    - python
url: /en/python/python-datetime/
twitter_card_image: /images/icons/python_icon.png
---

## Motivation

Because I always google the way to convert a string representing the date to datetime and change timezone on the Internet, this is note to self article.

There are three types to process date and time in Python. `datetime`, `date`, and `time`. 
I mainly use `datetime` in this article.

<!--adsense-->

## Environment

* python 3.6
* pytz
* jupyter notebook

## Convert epoch time to datetime
Now convert numeric data types of `eopch time` to `datetime`.

The `epoch time` is also called as `Unix time` and this counts starts at the Unix Epoch on January 1st, 1970 at UTC. Therefore, the unix time is merely the number of seconds between a particular date and the Unix Epoch.

Just one thing to be careful of this conversion is to check whether the numeric types of epoch time is in **second or millisecond**. It is often the case that I judge it by digits or actual calculation by fuction.

Using the `fromtimestamp` function in `datetime` module makes the code simpler as well.

### Covert epoch second

Sample code with `fromtimestamp` function is as bellow.

{{< highlight python "linenos=inline" >}}
import datetime

e = 1524349374
dt = datetime.datetime.fromtimestamp(e)

print(dt)
>> 2018-04-22 07:22:54
{{< / highlight >}}

### Covert epoch millisecond expressed in decimal

The `fromtimestamp` function can convert without problems even if a value is milliseconds format below the decimal point.

{{< highlight python "linenos=inline" >}}
import datetime

mills = 1524349374.099776
dt2 = datetime.datetime.fromtimestamp(mills)

print(dt2)
>> 2018-04-22 07:22:54.099776
{{< / highlight >}}

### Convert epoch millisecond expressed in integer

In milliseconds expressed as an integer (epoch millisecond notation), divide a value after checking how many digits represent milliseconds.

{{< highlight python "linenos=inline" >}}
import datetime

mills = 1524349374099
dt3 = datetime.datetime.fromtimestamp(mills / 1000)

print(dt3)
>> 2018-04-22 07:22:54.099000
{{< / highlight >}}

<!--adsense-->

## Convert string to datetime

### Convert date string with timezone

It is easy to convert date string with timezone to datetime by using `strptime` function. %z means that UTC offset in the form `+HHMM` or `-HHMM` and `%f` means microsecond as a decimal number which zero-padded on the left.

{{< highlight python "linenos=inline" >}}
import datetime

utc_date_str = '2018-04-01 20:10:56.123+0900'
dt = datetime.datetime.strptime(utc_date_str, '%Y-%m-%d %H:%M:%S.%f%z')

print(dt)
>> 2018-04-01 20:10:56.123000+09:00
{{< / highlight >}}

### Convert date string without timezone

Converting a date string without timezone to datetime is troublesome because checking what timezone the string represents is neccesarry.
After checking the specification of data, using string joining is a quick solution.

{{< highlight python "linenos=inline" >}}
import datetime

utc_date_str = '2018-04-01 20:10:56'
# as JST
dt = datetime.datetime.strptime(utc_date_str + '+0900', '%Y-%m-%d %H:%M:%S%z')

print(dt)
print(dt.tzinfo)
>> 2018-04-01 20:10:56+09:00
>> UTC+09:00
{{< / highlight >}}

Here's another way to use `parse` function in `dateutil` library.
The way to giving `tzinfos` object to argument, compared to the previous `fromtimestamp` example, improves readability of the code.

{{< highlight python "linenos=inline" >}}
import datetime
from dateutil.parser import parse
from dateutil.tz import gettz

tzinfos = {'JST' : gettz('Asia/Tokyo')}
date_str = '2018-04-01 20:10:56'
str_to_dt = parse(date_str + ' JST', tzinfos=tzinfos)
print(str_to_dt)
{{< / highlight >}}

<!--adsense-->

## Points to keep in mind when dealing with date and time
### naive and aware

In dealing with date and time in Python, keep in mind two kind of data **naive** and **aware**.

The official Python document says as below,

* aware 

> An aware object has sufficient knowledge of applicable algorithmic and political time adjustments, such as time zone and daylight saving time information, to locate itself relative to other aware objects. An aware object is used to represent a specific moment in time that is not open to interpretation

* naive

> A naive object does not contain enough information to unambiguously locate itself relative to other date/time objects. Whether a naive object represents Coordinated Universal Time (UTC), local time, or time in some other timezone is purely up to the program, just like it is up to the program whether a particular number represents metres, miles, or mass. Naive objects are easy to understand and to work with, at the cost of ignoring some aspects of reality.

In short, the `aware` object should be used in dealing with time data with timezone.
 
However, relationship between **types and `aware`/`naive` objects** is complicated because 
objects created from types are not unique.

|types      |object|
|-----------|----------|
|date       |naive|
|time       |naive or aware|
|datetime   |naive or aware|

Whether the `time` and` datetime` types  are `aware` or` naive` can be checked below.

|object    |condition to become aware |condition to become naive |
|--------------|-------------|--------------|
| time         | `t.tzinfo` of object `t` is not None, and `t.tzinfo.utcoffset(None)` returns not None|Other than aware|
| datetime     | `t.tzinfo` of object `t` is not None, and `t.tzinfo.utcoffset(t)` returns not None| `d.tzinfo` is None. Or `d.tzinfo` is not None and `d.tzinfo.utcoffset(d)` returns None|

### Pay attention to processing with timezone on application execution environment

If executing the timezone conversion code without paying attention to aware and naive,
the response of code will be changed depending on runtime environment.

{{< highlight python "linenos=inline" >}}
import datetime
from pytz import timezone
import pytz

date_str = '2018-04-01 20:10:56'
# str_to_dt is `naive`
str_to_dt = datetime.datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
print("Str to dt")
print(str_to_dt)                      # 2018-04-01 20:10:56
print(str_to_dt.timestamp())          # 1522581056.0
print(str_to_dt.tzname())             # None

# calculating with naive object, returns wrong time
utc = timezone('UTC')
utc_dt = str_to_dt.astimezone(utc)
print("UTC dt")
print(utc_dt)                         # 2018-04-01 11:10:56+00:00
print(utc_dt.timestamp())             # 1522581056.0
print(utc_dt.tzname())                # UTC
print(utc_dt.tzinfo.utcoffset(utc_dt))# 0:00:00

jst = timezone('Asia/Tokyo');
jst_dt = str_to_dt.astimezone(jst);
print("JST dt")
print(jst_dt)                         # 2018-04-01 20:10:56+09:00
print(jst_dt.timestamp())             # 1522581056.0
print(jst_dt.tzname())                # JST
print(jst_dt.tzinfo.utcoffset(jst_dt))# 9:00:00

{{< / highlight >}}

In the example code above it shows conversion of string without timezone to datetime as variable named `str_to_dt`. And when changing timezone with `astimezone` function, relative calculation is performed from the timezone on the runtime environment to the target timezone.

For that reason, when using multiple regions of the public cloud,   
behavior may be different depending on where the program is deployed.

## Conclusion

It is available to 

* Convert epochtime (second and millsecond) to datetime with `fromtimestamp` function
* Convert string to datetime with `strptime` function
* Change timezone with `dateutil` library

And in dealing with date and time in Python, keep in mind two kind of data **naive** and **aware**.

<div style="text-align: center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449355730&asins=1449355730&linkId=2bcac713b26ea9254a799c102127aa5b&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491933178&asins=1491933178&linkId=af0703a1479cb865d795cf0ffe65b565&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593276036&asins=1593276036&linkId=777aed95358ef80635f1e6f313f0fe1f&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
