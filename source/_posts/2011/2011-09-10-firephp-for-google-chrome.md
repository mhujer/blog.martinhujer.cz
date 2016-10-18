---
title: FirePHP for Google Chrome [EN]
---

There is a great extension for Firefox’s Firebug - [FirePHP](http://www.firephp.org/) ([github](https://github.com/firephp/firephp)). It allows you to log to Firebug console from PHP scripts. It uses extra HTTP headers so it does not interfere with page at all and works fine also for AJAX.

For a long time, it was not possible to use FirePHP in Google Chrome. There is project out there called [Webug](https://github.com/fedosov/webug), which adds support for it. However, it uses an extra request (browser loads page and the extension then requests HEAD of it again - it is neccesary, because Chrome won’t let you change first request headers). It can cause you some problems when you have CSRF protection, because hash will change during second request and the form submission won’t work.

<!--more-->

Latest Chrome added more experimental APIs for extensions. On of them is [chrome.experimental.devtools.network](http://code.google.com/chrome/extensions/trunk/experimental.devtools.network.html) which allows you to interfere with request headers before the request happens. You need to download [Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html) and add parameter [--enable-experimental-extension-apis](http://code.google.com/chrome/extensions/experimental.html#using) to Canary shortcut.

I wanted to try it and create some proof-of-concept, but then I stumbled accross existing implementation in [API Samples](http://code.google.com/chrome/extensions/trunk/samples.html#4efa12eaaa442b6b7c880e7a38ceeb0cff7e8b77).

I’ve added loging of filename and line and also fixed a problem which occured when loging arrays. You can try it by getting sources from [github](https://github.com/mhujer/chrome-firephp) and then [installing the extension](http://code.google.com/chrome/extensions/getstarted.html#load-ext) into Canary Chrome.

Example PHP file:
-----------------
[![](/data/2011/2011-09-10-firephp-for-google-chrome/code.png)](https://gist.github.com/mhujer/1208179)

This is how it looks in Chrome:
-------------------------------
![](/data/2011/2011-09-10-firephp-for-google-chrome/console_log.png)


Request and response headers:
-----------------------------
![](/data/2011/2011-09-10-firephp-for-google-chrome/log_headers.png)

UPDATE: 2011-09-11 0:32: I've added SQL queries loging:
-------------------------------------------------------
![](/data/2011/2011-09-10-firephp-for-google-chrome/sql-queries-loging.png)


**I wish those experimental API’s will make it to Stable soon!**
