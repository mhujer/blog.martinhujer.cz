---
title: Clean up your Sass with SCSS Lint
---

As you may have already noticed, I'm a little obsessed with code quality, particularly its <a href="/bp/" hreflang="cs">automatic checking and monitoring</a> (Czech only, sorry). In this article, I want to show you how to ensure that your SCSS files have consistent formatting style. And it may even help you to detect some mistakes!

At [w3w](http://w3w.cz/) we've been using SASS for quite a while. [Shopio's](http://www.shopio.cz/) new responsive template is based upon Twitter Boostrap (we are using an unofficial Sass version of Twitter Boostrap v2.3.2 - we used the it before it was cool!). We are using Sass together with [Compass](http://compass-style.org/) framework. Apart from that, I also worked on two mobile apps based upon Sencha Touch. It is a HTML5+JS+CSS framework for cross-platform mobile app development, with styling powered by Saas.

Demo
======
See this code snippet (`demo.scss` file):
~~~css
$highContrastMode: true;

@if ($highContrastMode) {
  body {
    background: black;
    color: yellow;
  }
} else {
  body {
    background: white;
    color: gray;
  }
}
~~~

If we have the `$highContrastMode` variable set to `true`, we want to render yellow text on black background; if not, we don't care about those with poor vision.
Would it work as described? No! We missed the `@` character before the else keyword! Compass compiles it without complaint as the code is completely valid SASS. And we will have a cute `else body` selector in the compiled css.

How could we have prevented this? By using [scss-lint](https://github.com/causes/scss-lint)!

If we had scss-lint as part of our CI (Continuous Integration) build process, we would have been notified immediately. When you run scss-lint on the code snippet above `scss-lint demo.scss`, it complains about a lot of things, including the `else` error:

`demo.scss:8 [W] Rule declaration should be preceded by an empty line`


Custom style
==========
At Shopio, the SCSS coding style is not the same as the default coding style in scss-lint. When we ran it for the first time, unsurprisingly, we got a few thousand errors and warnings.

Luckily, scss-lint allows you to configure custom settings that will then be used for checking. So I asked [Stuart](https://github.com/jackplug/) questions such as, *Do you use 2 or 4 spaces for indentation?"*, *"Do you prefer single or double quotes?"* or, *"Do you use colour names or hex codes?"*. After receiving the answers and doing some testing I was able to come up with a `.scss-lint.yml` file, which suits our needs (there are many [more options in the docs!](https://github.com/causes/scss-lint/blob/master/config/default.yml)). It still results in a few hundreds warnings, which we are fixing continually.



Continuous integration
===================
scss-lint offers a XML output option (with `--format=XML`) which can be consumed by Jenkins or similar tools. But for some strange reason, the XML output does not work on my Windows machine. (I hope it would work on our Jenkins machine)



Conclusion
===========
It's not hard to setup the scss-lint to check SCSS files and the benefits are obvious. It will ensure that you use a consistent coding style and it may even prevent some errors.
And if your coding style is different from the default one, then you can simply redefine the rules.

*Thanks  [Stuart](https://github.com/jackplug/) for language and technical review.*
