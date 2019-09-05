---
title: How to use Data Providers in PHPUnit
short: Even if you are already using Data Providers, you will find some of those tips useful.
---

> I think that even if you are already using Data Providers, you will find some of those tips useful.

Data Providers are a handy feature of PHPUnit which allows you to run the same test with different inputs and expected results. This is useful when you are writing some text filtering, transformations, URL generation, price calculations, etc. 

Let's say you are implementing your own `trim` function and you need to test it with lots of tests like the following one:

```php
<?php

public function testTrimTrimsLeadingSpace(): void
{
    $input = ' Hello World';
    $expectedResult = 'Hello World';

    self::assertSame($expectedResult, trim($input));
}
```

Instead of duplicating the test method and just changing the inputs, you can use Data Providers:

```php
<?php

/**
 * @dataProvider provideTrimData
 */
public function testTrim($expectedResult, $input): void
{
    self::assertSame($expectedResult, trim($input));
}

public function provideTrimData()
{
    return [
        [
            'Hello World',
            ' Hello World',
        ],
        [
            'Hello World',
            " Hello World \n",
        ],
    ];
}
```

**Data Provider** is just a regular public method in the test case class which returns an array of arrays.

* You link it to the test method with a `@dataProvider` annotation followed by the method name.
* Parameters returned from the data provider are added to the method definition. (I prefer to pass the _expected_ value as a first parameter to match the `assert*` methods)
* PHPUnit runs the test method with each data set as a separate test.

Here is a screenshot of running the test above in PhpStorm: 
![PHPUnit: basic data providers in PhpStorm](/data/2019/2019-09-03-how-to-use-data-providers-in-phpunit/phpunit-basic-data-providers.png)

Now you know how to use basic Data Providers. In the rest of the article I will dive into more advanced stuff and tips.


## Tip #1: Always name the data providers

By default, each data provider is referenced by its array index. It means that when running it, PHPUnit will tell you, that the test failed _with data set #0_.

To prevent confusion when having lot of data providers, you should always name them. Because the data provider method returns a regular array, it is as easy as adding keys there:

```php
<?php

public function provideTrimData()
{
    return [
        'leading space is trimmed' => [
            'Hello World',
            ' Hello World',
        ],
        'trailing space and newline are trimmed' => [
            'Hello World',
            "Hello World \n",
        ],
        'space in the middle is removed' => [
            'HelloWorld',
            "Hello World",
        ],
    ];
}
```

It makes test results much easier to understand: 

![PHPUnit: named data providers in PhpStorm](/data/2019/2019-09-03-how-to-use-data-providers-in-phpunit/phpunit-named-data-providers.png)

I recommend that you name the data sets the same way you would use for separate tests.



## Tip #2: You can run single data set from data provider

When there is something wrong with one of the data sets, you probably want to run the test only with it. You can do so by using PHPUnit's `--filter` option in CLI.

Here are examples of what is possible (the documentation shows examples with `'`, but that does not work on Windows, where you have to use `"` to wrap the argument):

* `--filter "testTrimTrims#2"` runs data set #2 (third data set, as the array keys start at zero)
* `--filter "testTrimTrims#0-2"` runs data sets #0, #1 and #2
* `--filter "testTrimTrims@trailing space and newline are trimmed"` runs specific named data set
* `--filter "testTrimTrims@.*space.*"` runs named data sets that match the regexp

Don't forget to check [the other possible patterns in docs](https://phpunit.readthedocs.io/en/8.3/textui.html#textui-examples-filter-patterns).

PhpStorm does not currently allow you to run a single data set from the code (please vote for the issue [WI-43933](https://youtrack.jetbrains.com/issue/WI-43933)), but you can run all of them and then [rerun one from the test results](https://blog.jetbrains.com/phpstorm/2017/12/phpunit-support-enhancements/). When you have the JetBrains issue tracker open, please also vote for [WI-43811](https://youtrack.jetbrains.com/issue/WI-43811) (possibility to go to the data set from the test results).

When I want to run a single data set from the PhpStorm I usually just comment out all the other data sets.



## Tip #3: Add type definitions

I always add type hints to the method definitions when possible. When using data providers, it means adding parameter type hints to the method that accepts data sets and adding a return type (and phpdoc) to data provider method: 

```php
<?php

/**
 * @dataProvider provideTrimData
 */
public function testTrimTrims(
    string $expectedOutput,    // <-- added typehint here
    string $input              // <-- added typehint here
): void
{
    self::assertSame($expectedOutput, trim($input));
}

/**
 * @return string[][]          // <-- added typehint here
 */
public function provideTrimData(): array     // <-- added typehint here
{
    return [
        'leading space is trimmed' => [
            'Hello World',
            ' Hello World',
        ],
        'trailing space and newline are trimmed' => [
            'Hello World',
            "Hello World \n",
        ],
    ];
}
```

If you need to have a nullable type in the test method, I recommend splitting it into two separate methods and data providers. Instead of having `testTransformData(?string $expectedResult, string $input)` with a nullable parameter I would create those:

`testTransformData(string $expectedResult, string $input)`
`testTransformingInvalidDataReturnsNull(string $invalidInput)`


## Tip #4: Data providers are supported well in PhpStorm
Despite the issues I mentioned above ([WI-43933](https://youtrack.jetbrains.com/issue/WI-43933) and [WI-43811](https://youtrack.jetbrains.com/issue/WI-43811)) I think that Data providers support in PhpStorm is quite good.

When you reference non-existing data provider, you can use quick action to generate it:
![PhpStorm: create data provider quick action](/data/2019/2019-09-03-how-to-use-data-providers-in-phpunit/create-data-provider-quick-action.png)

Auto-completion of data provider name works in the `@dataProvider` annotation:
![PhpStorm: rename data provider refactoring](/data/2019/2019-09-03-how-to-use-data-providers-in-phpunit/phpstorm-data-provider-autocompletion.png)

Renaming the data provider using Rename refactoring also works as expected:
![PhpStorm: rename data provider refactoring](/data/2019/2019-09-03-how-to-use-data-providers-in-phpunit/phpstorm-rename-data-provider-refactoring.png)



## Tip #5: More complex data providers

Instead of having a static array written in the code, the data providers can be more complex and prepare the data set dynamically.

For example, when having the external data, you can easily generate resulting array this way:

```php
<?php
/**
 * @return string[][]
 */
public function provideSpams(): array
{
    $spamStrings = require __DIR__ . '/fixtures/spams.php';

    $result = [];
    foreach ($spamStrings as $spamString) {
        $result[mb_substr($spamString, 0, 40)] = [$spamString];
    }

    return $result;
}
```

You should be careful with adding lot of logic to the data provider. Otherwise you would have to write a test that tests the data provider...


You can even return instances from the data provider:

```php
<?php

public function provideDateTimesPartOfDay(): array
{
    return [
        [
            'morning',
            new DateTimeImmutable('2018-10-01 10:00:00'),
        ],
        [
            'afternoon',
            new DateTimeImmutable('2019-09-01 15:00:00'),
        ],
    ];
}
```


## Tip #6: You can use Closures in Data providers to delay evaluation

The disadvantage of data providers is that they are evaluated before anything else (to allow PHPUnit calculate the total number of tests). It means that they can't access anything initialized in `setUpBeforeClass()` or `setUp()`.

You can work around this limitation by returning closures from data providers. Have a look at the code bellow - data provider returns a closure which is called in the test itself.

```php
<?php

/**
 * @dataProvider provideDateTransformations
 */
public function testWithClosuresInDataProvider(
    string $expectedResult,
    Closure $setTime
): void
{
    $dateTime = new DateTime('2019-09-01');

    $setTime($dateTime);

    self::assertSame($expectedResult, $dateTime->format('Y-m-d H:i:s'));
}

public function provideDateTransformations()
{
    return [
        'midnight' => [
            '2019-09-01 00:00:00',
            function (DateTime $date): void {
                $date->setTime(0, 0, 0);
            },
        ],
        '3 o\'clock in the afternoon' => [
            '2019-09-01 15:00:00',
            function (DateTime $date): void {
                $date->setTime(15, 0, 0);
            },
        ],
    ];
}
```

## Tip #7: Use `yield` to simplify large nested arrays

Instead of having large arrays in the data provider, you can use yield for each data set:

```php
<?php
public function provideTrimData()
{
    yield 'leading space is trimmed' => [
        'Hello World',
        ' Hello World',
    ];
    yield 'trailing space and newline are trimmed' => [
        'Hello World',
        "Hello World \n",
    ];
    yield 'space in the middle is removed' => [
        'HelloWorld',
        'Hello World',
    ];
}
```

I think it may help with code readability for large arrays. However similarly to arrays, all yields are evaluated before tests start (PHPUnit calculates the total number of tests before running them).



## Tip #8: Don't use `@testWith` annotation

Instead of using a separate method for data provider, PHPUnit supports inlining the data sets as JSON in PHPDoc using the [`@testWith`](https://phpunit.readthedocs.io/en/8.3/annotations.html#testwith) annotation.

```php
<?php
/**
 * @testWith
 *        ["Hello World", " Hello World"]
 *        ["Hello World", "Hello World \n"]
 *
 */
public function testTrim($expectedResult, $input): void
{
    self::assertSame($expectedResult, trim($input));
}

```

**Please do not use this, because PHPDocs is not a good place where to put your code:**

* syntax highlighting does not work there
* IDE code validation does not work there
* automatic code formatting does not work there
* it cannot be analysed statically by PHPStan
 

## Conclusion

Do you have other tips to use Data Providers even more efficiently? Please share them in the comments!
