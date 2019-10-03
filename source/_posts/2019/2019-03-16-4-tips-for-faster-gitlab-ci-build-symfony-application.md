---
title: 4 Tips for Faster Gitlab CI Builds for Symfony Applications
short: Some of those tips apply not only to Symfony applications and not just to Gitlab CI
---

> Some of those tips are also applicable to non-Symfony applications and to non-Gitlab CI pipelines, so keep reading even if you are not using them.

Waiting for a CI build to finish so can merge the feature is annoying, but it is still by an order of magnitude better than not having CI at all.

In this article I will show you some tips which I used in OutdoorVisit to make our CI build faster.


# Tip #1: You may not need PHP Lint

Linting of PHP files can be done as easily as running `php -l myfile.php`. I've included PHP Lint as a part of the build since ever. At first, I was using `PhpLintTask` from Phing which checks each file separately. Later I switched to [PHP-Parallel-Lint](https://github.com/JakubOnderka/PHP-Parallel-Lint) which checks multiple files in parallel.

Recently I noticed that our CI build is taking more time to run. It wasn't a glitch, we were just adding more and more files to the project. The PHP Lint **was taking 31&nbsp;s** of the build time although it ran 10 parallel checks. I couldn't remember the last time it discovered something, so I considered removing it completely. But it would open a risk of missing an error somewhere.

I took a different approach. When the Symfony compiles the DI container, it tries to load all the files and fails on syntax errors. At least when you have this configured in `config/services.yaml`:


```yaml
services:
    App\:
        resource: '../src/*'
```

So instead of completely removing the PHP Lint, I just added `--exclude src` flag to the command, so it looks like this:

```bash
parallel-lint -j 10 --exclude vendor --exclude var --exclude src .
``` 

**It helped me to cut 20&nbsp;s from the build time without risking anything!**


# Tip #2: Enable PHP_CodeSniffer cache and cache it between builds

PHP_CodeSniffer check can take quite a lot of time when there are many files to check. It used to take around 60&nbsp;s in our build. We also usually run it locally before pushing so the waiting was annoying.

Luckily, PHPCS has a built-in caching feature, which can be enabled by passing a command line argument: `--cache=./var/.phpcs-cache`. The cache-file path can be changed to anything else and you can also configure it as an option in your `phpcs.xml.dist` ruleset.

**This sped up our CS check from 60&nbsp;s to 3&nbsp;s!**

But it worked only locally, because the Gitlab CI and others like Bitbucket Pipelines create a new environment for each build. For Gitlab all you need to do is to add the path to `cache` section in `.gitlab-ci.yml` (We already had `vendor/` and `node_modules` there). Gitlab takes care of backing it up after the build and restoring it before the next build.  

```yaml
  cache:
    paths:
      - node_modules/
      - vendor/
      - var/.phpcs-cache  <-- added the PHPCS cache here
```

# Tip #3: Run Symfony tests with `debug=false`

Apart from having a good number of unit tests, we also use some container tests and lots of controller tests for most of the frontend. They are slow (running against a database) but they are worth it because they detect tremendous number of issues and regressions.

When you are running your Symfony application in `dev` or `test` environment, cache freshness is automatically checked on each request and invalidated if necessary. The great thing is that you don't have to worry about it, and you will never be surprised by stale cache. In `prod` mode, cache is not invalidated automatically, and you must take care of it manually during deploy.

If you are running your whole test suite at once, there is no need to check the cache freshness before each test.

It can be done by changing `APP_DEBUG` flag in `phpunit.xml.dist` file to `0`:
```xml
<env name="APP_DEBUG" value="0" />
```

However, this solution is not perfect, because you will need to take care on invalidating the cache manually while you are developing. You can use this [custom `bootstrap.php` for tests](https://github.com/symfony/recipes/pull/530#issuecomment-467387200) from Github.

I chose a different approach for our project and just changed the environment variable for CI builds in `.gitlab-ci.yml`:

```yaml
variables:
  APP_DEBUG: 0
```

As it affects only the CI, running the tests locally does not benefit from this - but on the other hand I don't have to worry about properly invalidating the cache (and I'm usually running just a few tests locally anyway).


**This helped me to cut the tests running time in CI from 90 seconds to 53 seconds!**


# Tip #4: Run `npm install` with `--no-audit`

If you have an application where you use NodeJS and npm just to compile assets such as CSS and JS, there is no need to stay on the very latest versions of the packages. However, because Webpack depends on lots of packages, npm will start spitting out messages like this during `npm install`: 

```text
audited 9438 packages in 16.958s
found 222 vulnerabilities (5 low, 213 moderate, 3 high, 1 critical)
```

As the JavaScript code installed through npm is never facing the hostile environment of the internet, those are not very scary. But they are unnecessarily cluttering the build output, so I decided to disable them. It can be done by adding `--no-audit` switch to `npm install`

```bash
npm install --no-audit
```

Apart from cleaning out the build output, it **saved several seconds from the `npm install` run** which is neat.

# Conclusion

Do you know other tricks how to make the CI build faster? Please share them in comments!
