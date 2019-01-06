---
title: "Use PyPDF2 - open PDF file or encrypted PDF file"
description: "Open PDF file with PdfFileReader on PyPDF2 and decrypt an encrypted PDF file with decrypt function. Troubleshoot when NotImplementedError is occured."
date: "2018-11-30T10:54:40+09:00"
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

## Motivation

Since I want to work PDF file with Python on my work, I investigate what library can do that and how to use it.

<!--adsense-->

## Preparation

The runtime and module version are as below.

* python 3.6
* PyPDF2 1.26.0

### Install PyPDF2

To work PDF file with Python, [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) is often used.

[PyPDF2](https://pythonhosted.org/PyPDF2/index.html) can

* Extract text from PDF file
* Work existing PDF file and create new one

Let's install with `pip` command.

{{< highlight bash "linenos=inline" >}}
pip install PyPDF2
{{< / highlight >}}

### Prepare PDF file

Prepare a new PDF file for working. Download [Executive Order](https://www.federalregister.gov/presidential-documents/executive-orders) in this time.
It looks like below. There are three pages in all.

![executive_order](/images/20181130/executive_order.png)

<!--adsense-->

## Read PDF file

In this section, Open and read a normal PDF file.
Print number of pages in the PDF file in the following sample code.

{{< highlight python "linenos=inline" >}}
import PyPDF2

FILE_PATH = './files/executive_order.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

Open the PDF file as binary read mode after importing `PyPDF2`.
And then, create a `PdfFileReader` object to work PDF.

Check the result.

{{< highlight bash >}}
Number of pages: 3
{{< / highlight >}}

<!--adsense-->

## Read a PDF file with password(Encrypted PDF)

In this section, Open and read an **encrypted PDF file** that has a password when opening a file. To create an encrypted PDF file, set a password with enabling encryption option when saving a PDF file.

### Failed example

Save a PDF file named `executive_order_encrypted.pdf` with a password `hoge1234`. 
Open the PDF file and execute with the previous code that read the **PDF without password**.

{{< highlight python "linenos=inline" >}}
# Failed example
import PyPDF2

FILE_PATH = './files/executive_order_encrypted.pdf'

with open(FILE_PATH, mode='rb') as f:
    reader = PyPDF2.PdfFileReader(f)
    print(f"Number of pages: {reader.getNumPages()}")
{{< / highlight >}}

The following error message will be printed.

{{< highlight bash >}}
PdfReadError: File has not been decrypted
{{< / highlight >}}

### Success example

The `decrypt` function given a password string to an argument decrypts an encrypted PDF file.
It is a better way to check if the file is encrypted with `isEncrypted` function before calling `decrypt` function.

{{< highlight python "linenos=inline,hl_lines=7-9" >}}
import PyPDF2

ENCRYPTED_FILE_PATH = './files/executive_order_encrypted.pdf'

with open(ENCRYPTED_FILE_PATH, mode='rb') as f:        
    reader = PyPDF2.PdfFileReader(f)
    if reader.isEncrypted:
        reader.decrypt('hoge1234')
        print(f"Number of page: {reader.getNumPages()}")
{{< / highlight >}}

{{< highlight bash >}}
Number of pages: 3
{{< / highlight >}}

<!--adsense-->

## Troubleshooting: `NotImplementedError` is thrown in calling `decrypt` function

The following error message may be thrown when working an encrypted PDF file.

{{< highlight bash >}}
NotImplementedError: only algorithm code 1 and 2 are supported
{{< / highlight >}}

The error message means that [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) doesn't have an implementation to decrypt an algorithm that encrypts the PDF file. 
If this happens, it's difficult to open the PDF file with [PyPDF2](https://pythonhosted.org/PyPDF2/index.html) only.

### Decrypt with qpdf

Using [qpdf](https://github.com/qpdf/qpdf) is a quick solution.
[qpdf](https://github.com/qpdf/qpdf) is a tool to work PDF file on command line interface.
We can download its installer for Windows from [SourceForge](https://sourceforge.net/projects/qpdf/), or install it for Mac with `brew install qpdf` command.

Sample code that [qpdf](https://github.com/qpdf/qpdf) decrypts a PDF file is below.

{{< highlight python "linenos=inline,hl_lines=14-19"  >}}
import PyPDF2
import os

ENCRYPTED_FILE_PATH = './files/executive_order_encrypted.pdf'
FILE_OUT_PATH = './files/executive_order_out.pdf'

PASSWORD='hoge1234'

with open(ENCRYPTED_FILE_PATH, mode='rb') as f:        
    reader = PyPDF2.PdfFileReader(f)
    if reader.isEncrypted:
        try:
            reader.decrypt(PASSWORD)
        except NotImplementedError:
            command=f"qpdf --password='{PASSWORD}' --decrypt {ENCRYPTED_FILE_PATH} {FILE_OUT_PATH};"
            os.system(command)            
            with open(FILE_OUT_PATH, mode='rb') as fp:
                reader = PyPDF2.PdfFileReader(fp)
                print(f"Number of page: {reader.getNumPages()}")
{{< / highlight >}}

The point is that Python executes the `qpdf` command as the OS command and
save decrypted PDF file as new PDF file without password. Then, create `PdfFileReader` instance to work the PDF file with [PyPDF2](https://pythonhosted.org/PyPDF2/index.html).

## Conclusion

It is available to

* Open PDF file with `PdfFileReader` on [PyPDF2](https://pythonhosted.org/PyPDF2/index.html)
* Decrypt an encrypted PDF file with `decrypt` function
* Decrypt an encrypted PDF file with [qpdf](https://github.com/qpdf/qpdf) when `NotImplementedError` is occured

<div align="center">
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1593275994&asins=1593275994&linkId=365e065e9a34c2f0591dd8776c437d42&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449357016&asins=1449357016&linkId=76478fed9537a1dcdb17f90ac79fa493&show_border=true&link_opens_in_new_window=true"></iframe>
<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491946008&asins=1491946008&linkId=a0d89601ba231dccc5db55892c0fef31&show_border=true&link_opens_in_new_window=true"></iframe>
</div>
