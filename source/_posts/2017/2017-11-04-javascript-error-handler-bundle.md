---
title: JavaScript Error Handler Bundle for Symfony
---

I've created Symfony [JavaScriptErrorHandlerBundle](https://github.com/mhujer/JavaScriptErrorHandlerBundle) for visualizing accidental errors in JavaScript.

## Why?

It is easy to break JavaScript code by an unrelated change. If you have JavaScript-only app, you will notice it immediately, because the app won't render at all (and your framework would report the error somehow).

On the other hand, if you are creating more traditional application with HTML rendered on the server and some interactions enhanced by jQuery, you may not notice that you've broken it. The browser reports the error into the Developer Console, but if you don't have it open, you are out of luck.

My [JavaScriptErrorHandlerBundle](https://github.com/mhujer/JavaScriptErrorHandlerBundle) listens to [`window.onerror` events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror) and converts them to alerts, which are hard to miss.

![example alert with error](/data/2017/2017-11-04-javascript-error-handler-bundle/javascript-error-handler-bundle.png)

## How does it work?

The Bundle works automatically with zero configuration. You only have to install it through Composer and register in `AppKernel.php` (see [README for instructions](https://github.com/mhujer/JavaScriptErrorHandlerBundle)).

It registers an event listener, which injects JavaScript snippet with error into the `<head>` section of the response (similarly to Symfony WebDebugToolbar). By default, the listener is registered only when the `%kernel.debug%` is set to `true`, so the error alert won't be ever displayed to your end users. The configuration cab be changed if necessary - e.g. you may want to have enabled also at the staging server.


## Conclusion

I know that the bundle is very simple. I wanted to experiment with what it takes to create a proper Bundle, before I work on something more complicated. One of the challenging things was the automatic testing of the container extension (it contains the logic for registering the listener). Luckily, there is [SymfonyDependencyInjectionTest](https://github.com/matthiasnoback/SymfonyDependencyInjectionTest) library created by Matthias Noback which makes container extension testing a breeze.

If you have time to dive into the bundle code, can you spot something that can I improve?
