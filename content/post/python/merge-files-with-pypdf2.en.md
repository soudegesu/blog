---
title: "Use PyPDF2 - Merging multiple pages and adding watermarks"
description: "This article shows how to merge multiple pages using PyPDF2. This time the sample is to create a PDF with a watermark."
date: "2018-12-05T10:23:41+09:00"
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

In the following article I wrote previously, I was able to use [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) to extract text information from PDF files.

* [open PDF file or encrypted PDF file](/en/post/python/open-pdf-with-pypdf2/)
* [Use PyPDF2 - extract text data from PDF file](/en/post/python/extract-text-from-pdf-with-pypdf2/)

In this article we will use the page merging feature of [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) to achieve a way to put a "watermark" in the file.

## Goals

- Use [PyPDF2](https://pythonhosted.org/PyPDF2/index.html)
- Add a common "watermark" to the file.

<!--adsense-->

## Preparation

As before, we will use the file downloaded from the [Executive Orders](https://www.federalregister.gov/presidential-documents/executive-orders).

It looks like the following. There are about three pages in total. Save it as `executive_order.pdf`.

![executive_order](/images/20181205/executive_order.png)

Next, prepare a PDF file for the "watermark". Save it as `confidential.pdf`.

![confidential](/images/20181205/confidential_pdf.png)

## Merging PDF files

Let's merge the two files with [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).
The sample code now looks like the following

{{< highlight python "linenos=inline" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'
CONFIDENTIAL_FILE_PATH = './files/confidential.pdf'
OUTPUT_FILE_PATH = './files/executive_order_merged.pdf'

with open(FILE_PATH, mode='rb') as f, open(CONFIDENTIAL_FILE_PATH, mode='rb') as cf, open(OUTPUT_FILE_PATH, mode='wb') as of:
    conf_reader = PyPDF2.PdfFileReader(cf)
    conf_page = conf_reader.getPage(0)
    reader = PyPDF2.PdfFileReader(f)    
    writer = PyPDF2.PdfFileWriter()    
    for page_num in range(0, reader.numPages):
        obj = reader.getPage(page_num)
        obj.mergePage(conf_page)
        
        writer.addPage(obj)
    
    writer.write(of)
{{< / highlight >}}

I'll explain it briefly, step by step.
First, get the first page from the `confidential.pdf` file with `getPage(0)` to get the first page with the "watermark" printed on it.
Next, call the `mergePage` function on all page objects in the `executive_order.pdf` file.
Then, merge the watermark page that you have just obtained.

Finally, we will use `PdfFileWriter` to write in a file with the alias `executive_order_merged.pdf`.

<!--adsense-->

## Check the results

![executive_order_merged](/images/20181205/executive_order_merged_pdf.png)

It's watermarked properly. In this sample code, all three pages are watermarked.

## Conclusion

In this article we have shown how to merge PDF pages using [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).
This is very easy to achieve since you only need to use the `mergePage` function.

I'm sure there are situations where it could be used, such as inserting a common footer or signature into a page.


<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=487311778X&linkId=c147d28e189fdaae2d03d9fa71dd1ea2&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=4873117380&linkId=fffb54546b0abb4066b8c70034e45cee&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=soudegesu-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=479738946X&linkId=a0f1182a7478439bc70e51d189ec3179&bc1=ffffff&lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
</iframe>



