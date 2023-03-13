---
title: Use different Google Analytics ID by domain in Google Tag Manager
short: Using two chained Lookup Tables to determine correct UA code for the domain and environment.
---


When setting up Google Analytics (or Facebook Pixel) in the Google Tag Manager the typical approach is to put the UA-code or the Pixel ID into the _Constant_ Variable. And that ID is then used in the GA/Facebook _Tag_.

But soon after launch the people from Marketing will start complaining that some strange orders and conversions are appearing in the Google Analytics.

What happened? Apart from real orders, also the orders made in testing and dev environments are sent there. 

There is a better way. 
**You can easily use different UA codes in production and in testing environments.**
In the rest of the article I will guide you through setting it up.

## Analysis

It is clear that we want to use testing UA code in dev/test environments, but apart from that we also want to use it when testing the Google Tag Manager configuration itself with _Preview feature_ (even on production website).

The decision process for the UA code goes like this:

- **Are we running in Debug mode?**
 - **YES**: use test ID
 - **NO**:
 	- **Are we on production domain?**
 		- **YES**: use real ID
 		- **NO**: use test ID 

## Preparation

1. Go to Google Tag Manager and create two _Constant_ Variables:
	- `GA_ID_DEV` with the testing ID
	- `GA_ID_PROD` with the production ID

2. In the Variables section in _Built-In Variables_ enable `Debug Mode` and `Page Hostname` variables.



## Setting up the hostname detection

1. Create a Variable of type `Lookup Table` and name it `GA_ID_BY_HOSTNAME`
2. _Input Variable_ is `{% raw %}{{Page Hostname}}{% endraw %}`
3. Click _Add row_
4. Put your production domain into the _Input_ field (just the domain without `https://` and the trailing `/`)
5. Put `{% raw %}{{GA_ID_PROD}}{% endraw %}` into the _Output_ field
6. Check _Set default value_ checkbox
7. Put `{% raw %}{{GA_ID_DEV}}{% endraw %}` to the _Default value_ field 

It should look like this:
![GA_ID_BY_HOSTNAME variable configuration](/data/2018/2018-08-26-use-different-code-id/01-by-hostname.png)

By defining only the production domain and using _default value_ for anything else, we handle any testing or dev environment.



## Setting up the Debug environment detection

If you look back into the _Analysis_ chapter, we have covered the _Are we on production domain?_ part. Now we will cover the _Are we running in Debug mode?_.

1. Create a Variable of type `Lookup Table` and name it `GA_ID`
2. _Input Variable_ is `{% raw %}{{Debug Mode}}{% endraw %}`
3. Click _Add row_
4. Put `true` into the _Input_ field and `{% raw %}{{GA_ID_DEV}}{% endraw %}` into the _Output_ field
5. Click _Add row_ again
6. Put `false` into the _Input_ field and `{% raw %}{{GA_ID_BY_HOSTNAME}}{% endraw %}` into the _Output_ field

It should look like this:
![GA_ID variable configuration](/data/2018/2018-08-26-use-different-code-id/02-by-debugmode.png)

You might have noticed that we have used the variable `GA_ID_BY_HOSTNAME` which we prepared in previous step. 



## Setting up the Google Analytics Tag

With all those variables prepared, you can set up the Google Analytics tag as usual. But when creating the `Google Analytics Settings`, put `{% raw %}{{GA_ID}}{% endraw %}` into the _Tracking ID_ field as in the following picture. It will be resolved to correct UA code depending on the environment.

![Google Analytics Settings variable](/data/2018/2018-08-26-use-different-code-id/03-tag-settings.png)


That's it!



## Conclusion

Apart from Google Analytics ID, you can use this guide to set up Facebook Pixel ID or any other system where you can easily create different IDs for different environments. 

Are you using similar approach? Or did you find a better way? Let me know in the comments!
