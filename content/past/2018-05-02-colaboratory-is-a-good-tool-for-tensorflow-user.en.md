---
title: "Google Colaboratory is the best tool for machine learning engineer"
description: "For engineer who use Jupyter Notebook in often, web IDE named Colaboratory provided by Google is the best tool."
date: 2018-05-02
thumbnail: /images/icons/colaboratory_icon.png
categories:
    - python
tags:
    - colaboratory
    - machine-learning
    - tensorflow
    - python
url: /en/python/colaboratory-is-a-good-tool-for-tensorflow-user/
twitter_card_image: /images/icons/colaboratory_icon.png
---

For engineer who use Jupyter Notebook in often, web IDE named [Colaboratory](https://colab.research.google.com/) is the best tool. Try [Colaboratory](https://colab.research.google.com/).

<!--adsense-->

## What is Colaboratory?

[Colaboratory](https://colab.research.google.com/) is a web IDE based on [Jupyter notebook](http://jupyter.org/) and hosted by Google.

Not only editor, but also runtime is provided by Google, users don't need to create the environment for development. 

Everyone can use [Colaboratory](https://colab.research.google.com/) without Google account, however, links the account, users earn lots of advantages.

![colaboratory_top](/images/20180502/colaboratory_top.png)

<!--adsense-->

## The good points of Colaboratory
### Free of charges

About usage fee is written in the [FAQ](https://research.google.com/colaboratory/faq.html).

> **Is it free to use?**
>
> Yes. Colaboratory is a research project that is free to use.

Free to use. Awesome!!
In addition, running code with **GPU is also free to use**.

### GPU is available

Users can select **GPU** as code runtime in [Colaboratory](https://colab.research.google.com/).

In case of execution of high cost operation, using a local machine, the fan rotates with full power and other operations of the machine is delayed, but [Colaboratory](https://colab.research.google.com/) uses computer resources on the cloud.

Change settings is just 2 steps.

* **Select [Runtime] > [Change runtime type] from Menu**

{{< figure src="/images/20180502/switch_to_gpu_1.png" class="center" width="70%" >}}

* Change **"Hardware accelerator" to "GPU" and [Save]**

{{< figure src="/images/20180502/switch_to_gpu_2.png" class="center" width="70%" >}}

Now check running on GPU with executing following codes.

{{< highlight python "linenos=inline" >}}
import tensorflow as tf
tf.test.gpu_device_name()
{{< / highlight >}}

The device name is printed, in case of running on CPU, empty string is.

![switch_to_gpu_3](/images/20180502/switch_to_gpu_3.png)

### TPU is available

In September 2018, [Colaboratory](https://colab.research.google.com/) supports **TPU（Tensor Processing Unit）** runntime.

Google sells [Edge TPU](https://cloud.google.com/edge-tpu/) for edge cmomputing, developer can execute codes for TPU.

### Collaborate with Google Drive 

Just Google's service, easy to collaborate with Google Drive.
Google Drive supports Jupyter notebook file saving with `.ipynb` extension.

![save_to_drive](/images/20180502/save_to_drive.png)

In order to upload an `.ipynb` file existed on the local machine, select `[Upload notebook]` and drag and drop to the upload form.

![upload_notebook](/images/20180502/upload_notebook.png)

When `.ipynb` files is opened on the Google Drive with [Colaboratory] (https://colab.research.google.com/), display popup.
And file icons looks different in file created by [Colaboratory](https://colab.research.google.com/) or in uploaded.


### Default code snipets

[Colaboratory](https://colab.research.google.com/) enhances Jupyter notebook, supports code snipets. Select the code snipets and paste it to cell of Jupyter notebook, particularly, code snipets for Google Drive API is useful.

![use_snipet](/images/20180502/use_snipet.png)

`Command/Ctrl + Alt + P` is a keyboard shortcut for opening snipet window.

### Choices runtime machine

This is unusual use case, switching machine runtime from Colaboratory to local machine.
The setting is somewhat special, so summarize below.

#### Setup local machine

* Install Jupyter noteboook

{{< highlight bash "linenos=inline" >}}
pip install jupyter\[notebook\]
{{< / highlight >}}

* Enable `serverextension`

{{< highlight bash "linenos=inline" >}}
pip install jupyter_http_over_ws
jupyter serverextension enable --py jupyter_http_over_ws
{{< / highlight >}}

* Allow access from Colaboratory

{{< highlight bash "linenos=inline" >}}
jupyter notebook --NotebookApp.allow_origin='https://colab.research.google.com' --port=8888
{{< / highlight >}}

#### Setting in Colaboratory

Select "Connect" menu on the upper right side of the screen, and select "Connect to local runtime...", and then, code is run on local machine.

![switch_runtime](/images/20180502/switch_runtime.png)

<!--adsense-->

## Important notice

### Colaboratory is not suitable for running for a long time

Colaboratory is grateful to be able to use GPU, but Google doesn't recommend running the runtime for a long time, especially not to use for crypt currency mining.

It's written in the [FAQ](https://research.google.com/colaboratory/faq.html).

> **How may I use GPUs and why are they sometimes unavailable?**
>
> Colaboratory is intended for interactive use. Long-running background computations, particularly on
> GPUs, may be stopped. Please do not use Colaboratory for cryptocurrency mining. Doing so is
> unsupported and may result in service unavailability. We encourage users who wish to run continuous
> or long-running computations through Colaboratory’s UI to use a local runtime.

I found [a developer who tried to run GPU for more than 12 hours](https://stackoverflow.com/questions/49438284/google-colaboratory-with-gpu), but Google doesn't announce about limit of continuous execution time per execution.

### Need to check security policy for executing code on cloud

In companies with strict security governance, Colaboratory may not be available because of security policy.
Even if temporary use, valuable assets in company is uploaded on the cloud.

### Be careful for python module differences when swithcing runtime

When swithcing runtime from Colaboratory to local machine, 
Python modules installed in Colaboratory are different from in local machine.

Execute Python code as follows, check installed modules.

{{< highlight python "linenos=inline" >}}
import pkg_resources
[pkg for pkg in pkg_resources.working_set]
{{< / highlight >}}

Colaboratory has modules as follows in default.

{{< highlight python "linenos=inline" >}}
[xgboost 0.7.post4 (/usr/local/lib/python3.6/dist-packages),
 wheel 0.31.0 (/usr/local/lib/python3.6/dist-packages),
 Werkzeug 0.14.1 (/usr/local/lib/python3.6/dist-packages),
 webencodings 0.5.1 (/usr/local/lib/python3.6/dist-packages),
 wcwidth 0.1.7 (/usr/local/lib/python3.6/dist-packages),
 urllib3 1.22 (/usr/local/lib/python3.6/dist-packages),
 uritemplate 3.0.0 (/usr/local/lib/python3.6/dist-packages),
 traitlets 4.3.2 (/usr/local/lib/python3.6/dist-packages),
 tornado 4.5.3 (/usr/local/lib/python3.6/dist-packages),
 testpath 0.3.1 (/usr/local/lib/python3.6/dist-packages),
 terminado 0.8.1 (/usr/local/lib/python3.6/dist-packages),
 termcolor 1.1.0 (/usr/local/lib/python3.6/dist-packages),
 tensorflow 1.7.0 (/usr/local/lib/python3.6/dist-packages),
 tensorboard 1.7.0 (/usr/local/lib/python3.6/dist-packages),
 sympy 1.1.1 (/usr/local/lib/python3.6/dist-packages),
 statsmodels 0.8.0 (/usr/local/lib/python3.6/dist-packages),
 six 1.11.0 (/usr/local/lib/python3.6/dist-packages),
 simplegeneric 0.8.1 (/usr/local/lib/python3.6/dist-packages),
 setuptools 39.1.0 (/usr/local/lib/python3.6/dist-packages),
 seaborn 0.7.1 (/usr/local/lib/python3.6/dist-packages),
 scipy 0.19.1 (/usr/local/lib/python3.6/dist-packages),
 scikit-learn 0.19.1 (/usr/local/lib/python3.6/dist-packages),
 scikit-image 0.13.1 (/usr/local/lib/python3.6/dist-packages),
 rsa 3.4.2 (/usr/local/lib/python3.6/dist-packages),
 requests 2.18.4 (/usr/local/lib/python3.6/dist-packages),
 requests-oauthlib 0.8.0 (/usr/local/lib/python3.6/dist-packages),
 pyzmq 16.0.4 (/usr/local/lib/python3.6/dist-packages),
 PyYAML 3.12 (/usr/local/lib/python3.6/dist-packages),
 PyWavelets 0.5.2 (/usr/local/lib/python3.6/dist-packages),
 pytz 2018.4 (/usr/local/lib/python3.6/dist-packages),
 python-dateutil 2.5.3 (/usr/local/lib/python3.6/dist-packages),
 pyparsing 2.2.0 (/usr/local/lib/python3.6/dist-packages),
 Pygments 2.1.3 (/usr/local/lib/python3.6/dist-packages),
 pyasn1 0.4.2 (/usr/local/lib/python3.6/dist-packages),
 pyasn1-modules 0.2.1 (/usr/local/lib/python3.6/dist-packages),
 ptyprocess 0.5.2 (/usr/local/lib/python3.6/dist-packages),
 psutil 5.4.5 (/usr/local/lib/python3.6/dist-packages),
 protobuf 3.5.2.post1 (/usr/local/lib/python3.6/dist-packages),
 prompt-toolkit 1.0.15 (/usr/local/lib/python3.6/dist-packages),
 portpicker 1.2.0 (/usr/local/lib/python3.6/dist-packages),
 plotly 1.12.12 (/usr/local/lib/python3.6/dist-packages),
 pip 10.0.1 (/usr/local/lib/python3.6/dist-packages),
 Pillow 4.0.0 (/usr/local/lib/python3.6/dist-packages),
 pickleshare 0.7.4 (/usr/local/lib/python3.6/dist-packages),
 pexpect 4.5.0 (/usr/local/lib/python3.6/dist-packages),
 patsy 0.5.0 (/usr/local/lib/python3.6/dist-packages),
 pandocfilters 1.4.2 (/usr/local/lib/python3.6/dist-packages),
 pandas 0.22.0 (/usr/local/lib/python3.6/dist-packages),
 pandas-gbq 0.4.1 (/usr/local/lib/python3.6/dist-packages),
 opencv-python 3.4.0.12 (/usr/local/lib/python3.6/dist-packages),
 olefile 0.45.1 (/usr/local/lib/python3.6/dist-packages),
 oauthlib 2.0.7 (/usr/local/lib/python3.6/dist-packages),
 oauth2client 4.1.2 (/usr/local/lib/python3.6/dist-packages),
 numpy 1.14.3 (/usr/local/lib/python3.6/dist-packages),
 notebook 5.2.2 (/usr/local/lib/python3.6/dist-packages),
 nltk 3.2.5 (/usr/local/lib/python3.6/dist-packages),
 networkx 2.1 (/usr/local/lib/python3.6/dist-packages),
 nbformat 4.4.0 (/usr/local/lib/python3.6/dist-packages),
 nbconvert 5.3.1 (/usr/local/lib/python3.6/dist-packages),
 mpmath 1.0.0 (/usr/local/lib/python3.6/dist-packages),
 mistune 0.8.3 (/usr/local/lib/python3.6/dist-packages),
 matplotlib 2.1.2 (/usr/local/lib/python3.6/dist-packages),
 MarkupSafe 1.0 (/usr/local/lib/python3.6/dist-packages),
 Markdown 2.6.11 (/usr/local/lib/python3.6/dist-packages),
 Keras 2.1.6 (/usr/local/lib/python3.6/dist-packages),
 jupyter-core 4.4.0 (/usr/local/lib/python3.6/dist-packages),
 jupyter-client 5.2.3 (/usr/local/lib/python3.6/dist-packages),
 jsonschema 2.6.0 (/usr/local/lib/python3.6/dist-packages),
 Jinja2 2.10 (/usr/local/lib/python3.6/dist-packages),
 ipython 5.5.0 (/usr/local/lib/python3.6/dist-packages),
 ipython-genutils 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 ipykernel 4.6.1 (/usr/local/lib/python3.6/dist-packages),
 idna 2.6 (/usr/local/lib/python3.6/dist-packages),
 httplib2 0.11.3 (/usr/local/lib/python3.6/dist-packages),
 html5lib 0.9999999 (/usr/local/lib/python3.6/dist-packages),
 h5py 2.7.1 (/usr/local/lib/python3.6/dist-packages),
 grpcio 1.11.0 (/usr/local/lib/python3.6/dist-packages),
 googleapis-common-protos 1.5.3 (/usr/local/lib/python3.6/dist-packages),
 google-resumable-media 0.3.1 (/usr/local/lib/python3.6/dist-packages),
 google-colab 0.0.1a1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-translate 1.3.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-storage 1.8.0 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-language 1.0.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-core 0.28.1 (/usr/local/lib/python3.6/dist-packages),
 google-cloud-bigquery 1.1.0 (/usr/local/lib/python3.6/dist-packages),
 google-auth 1.4.1 (/usr/local/lib/python3.6/dist-packages),
 google-auth-oauthlib 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 google-auth-httplib2 0.0.3 (/usr/local/lib/python3.6/dist-packages),
 google-api-python-client 1.6.7 (/usr/local/lib/python3.6/dist-packages),
 google-api-core 1.1.1 (/usr/local/lib/python3.6/dist-packages),
 gast 0.2.0 (/usr/local/lib/python3.6/dist-packages),
 future 0.16.0 (/usr/local/lib/python3.6/dist-packages),
 entrypoints 0.2.3 (/usr/local/lib/python3.6/dist-packages),
 decorator 4.3.0 (/usr/local/lib/python3.6/dist-packages),
 cycler 0.10.0 (/usr/local/lib/python3.6/dist-packages),
 crcmod 1.7 (/usr/local/lib/python3.6/dist-packages),
 chardet 3.0.4 (/usr/local/lib/python3.6/dist-packages),
 certifi 2018.4.16 (/usr/local/lib/python3.6/dist-packages),
 cachetools 2.0.1 (/usr/local/lib/python3.6/dist-packages),
 bleach 1.5.0 (/usr/local/lib/python3.6/dist-packages),
 beautifulsoup4 4.6.0 (/usr/local/lib/python3.6/dist-packages),
 astor 0.6.2 (/usr/local/lib/python3.6/dist-packages),
 absl-py 0.2.0 (/usr/local/lib/python3.6/dist-packages)]
{{< / highlight >}}

Jupyter notebook has modules as follows in default.

{{< highlight python "linenos=inline" >}}
[widgetsnbextension 3.2.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 webencodings 0.5.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 wcwidth 0.1.7 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 traitlets 4.3.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 tornado 5.0.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 testpath 0.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 terminado 0.8.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 six 1.11.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 simplegeneric 0.8.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 setuptools 28.8.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Send2Trash 1.5.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 qtconsole 4.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pyzmq 17.0.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 python-dateutil 2.7.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Pygments 2.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ptyprocess 0.5.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 prompt-toolkit 1.0.15 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pip 10.0.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pickleshare 0.7.4 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pexpect 4.5.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 parso 0.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 pandocfilters 1.4.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 notebook 5.4.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 nbformat 4.4.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 nbconvert 5.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 mistune 0.8.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 MarkupSafe 1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter 1.0.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-core 4.4.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-console 5.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jupyter-client 5.2.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jsonschema 2.6.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 Jinja2 2.10 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 jedi 0.12.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipywidgets 7.2.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipython 6.3.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipython-genutils 0.2.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 ipykernel 4.8.2 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 html5lib 1.0.1 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 entrypoints 0.2.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 decorator 4.3.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 bleach 2.1.3 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 backcall 0.1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages),
 appnope 0.1.0 (/Users/soudegesu/.pyenv/versions/3.6.1/envs/test/lib/python3.6/site-packages)]
{{< / highlight >}}

Colaboratory includes Machine learning, scientific computing, and Google API libraries etc.
If necessary, install the same libraries to the local machine.

## Conclusion

Google Colaboratory is the best tool for machine learning engineer, because ...

* Free to use any processor(CPU, GPU, and TPU)
* Easy to collaborate with Google services
* No preparation to write and execute python code

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491962291&asins=1491962291&linkId=e07521a4c1a85d21dc931bcd754d5712&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1449369413&asins=1449369413&linkId=51b507455cf7ed5b67c72127080d5760&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1617294438&asins=1617294438&linkId=ed793d680806ca93d63f27cc8b04c07b&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>
    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=qf_sp_asin_til&ad_type=product_link&tracking_id=soudegesu-20&marketplace=amazon&region=US&placement=1491989386&asins=1491989386&linkId=4cc62f82f226ce76b8c7ee8ea5e97477&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff">
    </iframe>