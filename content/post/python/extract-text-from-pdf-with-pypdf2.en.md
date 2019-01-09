---
title: "Use PyPDF2 - extract text data from PDF file"
description: "Access to specified or all of pages in PDF file and extract text on the file as string type with extractText by PyPDF2"
date: "2018-12-02T17:29:29+09:00"
thumbnail: /images/icons/python_icon.png
categories:
  - "python"
tags:
  - "python"
  - "pdf"
  - "pypdf2"
isCJKLanguage: true
twitter_card_image: /images/icons/python_icon.png
---

## Introduction

In previous article titled '[Use PyPDF2 - open PDF file or encrypted PDF file](/en/post/python/open-pdf-with-pypdf2/)', I introduced how to read PDF file with `PdfFileReader`. Extract text data from opened PDF file this time.

<!--adsense-->

## Preparation

Prepare a PDF file for working. Download [Executive Order](https://www.federalregister.gov/presidential-documents/executive-orders) as before.
It looks like below. There are three pages in all.

![executive_order](/images/20181202/executive_order.png)

## Accessing to pages

### Accessing to arbitrary page

The following code describes accessing the specified page in read PDF file.

{{< highlight python "linenos=inline,hl_lines=7" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    page = reader.getPage(0) #accessing to first page in file
{{< / highlight >}}

After loading file with `PdfFileReader`, specify by The `getPage` function.
Giving a page index to `getPage` as an aruguments, the function returns its page instance. The page index starts 0.
This Executive Order file has three pages in file, so we can specify 0 to 2.

### Accessing to all of pages

The following code describes accessing all of pages in read PDF file.

{{< highlight python "linenos=inline,hl_lines=7-8" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    for page in reader.pages:
        pass
{{< / highlight >}}

`PdfFileReader` class has a `pages` property that is a list of `PageObject` class.
Iterating `pages` property with for loops can access to all of page in order from first page.

<!--adsense-->

## Extarct text from page object

Now extract text string data from page object.
The `extractText` function returns text in page as string type.

{{< highlight python "linenos=inline,hl_lines=8" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    page = reader.getPage(0)
    print(page.extractText())
{{< / highlight >}}

The result is printed as below.

```
Presidential Documents
55243 Federal Register
Vol. 83, No. 213
Friday, November 2, 2018
Title 3Ñ
The President
Executive Order 13850 of November 1, 2018
Blocking Property of Additional Persons Contributing to the
Situation in Venezuela
By the authority vested in me as President by the Constitution and the
laws of the United States of America, including the International Emergency
Economic Powers Act (50 U.S.C. 1701
et seq.
) (IEEPA), the National Emer-
gencies Act (50 U.S.C. 1601
et seq.
), section 212(f) of the Immigration and
Nationality Act of 1952 (8 U.S.C. 1182(f)) (INA), the Venezuela Defense
of Human Rights and Civil Society Act of 2014 (Public Law 113Ð278),
as amended (the Venezuelan Defense of Human Rights Act), and section
301 of title 3, United States Code,
I, DONALD J. TRUMP, President of the United States of America, in order
to take additional steps with respect to the national emergency declared
in Executive Order 13692 of March 8, 2015, and relied upon for additional
steps taken in Executive Order 13808 of August 24, 2017, Executive Order
13827 of March 19, 2018, and Executive Order 13835 of May 21, 2018,
particularly in light of actions by the Maduro regime and associated persons
to plunder VenezuelaÕs wealth for their own corrupt purposes, degrade Ven-
ezuelaÕs infrastructure and natural environment through economic mis-
management and confiscatory mining and industrial practices, and catalyze
a regional migration crisis by neglecting the basic needs of the Venezuelan
people, hereby order as follows:
Section 1
. (a) All property and interests in property that are in the United
States, that hereafter come within the United States, or that are or hereafter
come within the possession or control of any United States person of the
following persons are blocked and may not be transferred, paid, exported,
withdrawn, or otherwise dealt in: any person determined by the Secretary
of the Treasury, in consultation with the Secretary of State:
(i) to operate in the gold sector of the Venezuelan economy or in any
other sector of the Venezuelan economy as may be determined by the
Secretary of the Treasury, in consultation with the Secretary of State;
(ii) to be responsible for or complicit in, or to have directly or indirectly
engaged in, any transaction or series of transactions involving deceptive
practices or corruption and the Government of Venezuela or projects or
programs administered by the Government of Venezuela, or to be an
immediate adult family member of such a person;
(iii) to have materially assisted, sponsored, or provided financial, material,
or technological support for, or goods or services to or in support of,
any activity or transaction described in subsection (a)(ii) of this section,
or any person whose property and interests in property are blocked pursu-
ant to this order; or
(iv) to be owned or controlled by, or to have acted or purported to
act for or on behalf of, directly or indirectly, any person whose property
and interests in property are blocked pursuant to this order.
(b) The prohibitions in subsection (a) of this section apply except to
the extent provided by statutes, or in regulations, orders, directives, or
licenses that may be issued pursuant to this order, and notwithstanding
any contract entered into or any license or permit granted prior to the
date of this order.
VerDate Sep<11>2014 18:13 Nov 01, 2018Jkt 247001PO 00000Frm 00003Fmt 4705Sfmt 4790E:\FR\FM\02NOE0.SGM02NOE0
```

I can extract text in page, but some symbols are garbled like `Title 3Ñ` and `ezuelaÕs`.
In addition, since all the sentence on the page is extracted as one stinrg, it seemns necessary to devise such as processing the extracted character string by natural language processing.


## Conclusion

It is available to

* Access to specified or all of pages in PDF file.
* Extract text on the file as string type with `extractText`


<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
