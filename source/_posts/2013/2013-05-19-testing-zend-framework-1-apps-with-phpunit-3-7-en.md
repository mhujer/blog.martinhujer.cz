---
title: Testing Zend Framework 1 apps with PHPUnit 3.7+ [EN]
---

Great Zend Framework apps definitely should have automated tests. ZF helps you with that by providing PHPUnit extension which allows you to test controllers - adds special asserts for response and DOM queries. But there is a big downside - it works only with PHPUnit 3.4. I agree with the goal to maintain ultimate backwards compatibility, but I prefer to use latest versions of my tools. So I have latest PHPUnit installed for testing other apps and 3.4 for testing ZF1 apps (see [this tutorial](http://tech.vg.no/2011/11/29/running-multiple-versions-of-phpunit/) to install PHPUnit 3.4 and the latest one). I hate having to set up two PHPUnits after reinstall (and setting them up on CI server).

So I decided to fix the Zend_Test (for myself) to work with latest PHPUnit. I originally thought I would have to do it myself, but then I found [this patch](http://opensource.hqcodeshop.com/Zend%20Framework/PHPUnit%203.7%20-%201.12.1/) (thanks!) which I have applied to [a branch in my fork of ZF1](https://github.com/mhujer/zf1/tree/phpunit37).

After that, I needed to fix my tests to work with latest PHPUnit. Luckily it meant just replacing `assertType()` with `assertInstanceOf()`.

## Shortly, you need to do this:
1. Fix the Zend_Test (see [diff](https://github.com/mhujer/zf1/commit/177a075248f7df836b6991505c54ce848c553064))
2. Fix your tests
3. Get rid of the old PHPUnit 3.4
4. Profit

After that the tests run fine with latest PHPUnit.

If you have any questions or trouble fixing ZF1 and tests for latest PHPUnit, feel free to ask in the comments.
