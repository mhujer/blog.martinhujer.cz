---
title: PHP 7.2 is due in November. What's new?
showPhpTrainingAd: true
---

> I've published [the Czech translation of the article on Zdroják.cz](https://www.zdrojak.cz/clanky/jake-novinky-prinese-php-7-2/).

PHP 7.2 is planned to be released on 30th November 2017 (see [the timetable](https://wiki.php.net/todo/php72#timetable)). And it comes with two new security features in the core, several smaller improvements and some language legacy clean-ups. In the article, I will describe what the improvements and changes are. I read [the RFCs](https://wiki.php.net/rfc#php_next_72), discussions on _internals_ and [PRs on Github](https://github.com/php/php-src/pulls), so you don't have to.

_I'll update the article if there are any significant changes in PHP 7.2 until release._

You can try the pre-release version right now. Just download it using the links in the [PHP 7.2.0 Release Candidate 1 Released](http://php.net/archive/2017.php#id2017-08-31-1). I've been using it locally for development since the 7.2.0-beta1 without issues.


## RFC: Argon2 Password Hash ([link](https://wiki.php.net/rfc/argon2_password_hash))

[`password_hash`](http://php.net/password_hash) function has been available in PHP since 5.5. It was designed to be able to utilize different password hashing algorithms. But back then only `PASSWORD_BCRYPT` was available.

> **IMPORTANT:** If you are using `sha1()` or `md5()` for password hashing, please stop reading immediately and go fix your systems to use `password_hash()`. I recommend reading Michal's article [Upgrading existing password hashes](https://www.michalspacek.com/upgrading-existing-password-hashes).

PHP 7.2 adds an option to use Argon2i algorithm with `PASSWORD_ARGON2I` constant:

```php
password_hash('password', PASSWORD_ARGON2I)
```

Using `PASSWORD_BCRYPT` is still perfectly valid and safe option. Argon2i is just another option, which may become a default in the future.

Argon2i supports providing custom cost factors (like providing single `cost` factor to `bcrypt`):

```php
$options = [
    'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
    'time_cost' => PASSWORD_ARGON2_DEFAULT_TIME_COST,
    'threads' => PASSWORD_ARGON2_DEFAULT_THREADS,
];
password_hash('password', PASSWORD_ARGON2I, $options);
```

You should determine appropriate costs for Argon2i by experimenting on the target server (like you do with bcrypt `cost`).

It is also time to check your password column length! `PASSWORD_BCRYPT` generates 60 characters long hashes. `PASSWORD_ARGON2I` hash is 96 characters long. The [`password_hash` documentation]( http://php.net/password_hash) recommends columns length of 255 characters to accommodate any future hash (especially when using `PASSWORD_DEFAULT` as an algorithm):
> _It is recommended to store the result in a database column that can expand beyond 60 characters (255 characters would be a good choice)._

There is a good article about [Protecting passwords with Argon2 in PHP 7.2](https://framework.zend.com/blog/2017-08-17-php72-argon2-hash-password.html) on Zend Framework blog.

**Note:** Argon2i is available only if the PHP was compiled with `--with-password-argon2` flag. (It is included in Windows binaries available from php.net). 

## RFC: Make Libsodium a Core Extension ([link](https://wiki.php.net/rfc/libsodium))

PHP 7.2 comes with cryptography library libsodium in the core. It was previously available through PECL. There is also a [polyfill available](https://github.com/paragonie/sodium_compat) so you can start using it right now (it even supports PHP 5.2.4!).

I don't know much about the cryptography, but the single most important thing I know is this: *Don't invent your own cryptography!* (See [this StackExchange answer](https://security.stackexchange.com/a/18198) for reasoning.). 

**So just use the `sodium_` functions instead of implementing it by yourself.**


I recommend reading two following articles about upcoming improvements in PHP cryptography (both written by Scott Arciszewski, the author of the Libsodium RFC):

1. [PHP 7.2: The First Programming Language to Add Modern Cryptography to its Standard Library](https://dev.to/paragonie/php-72-the-first-programming-language-to-add-modern-cryptography-to-its-standard-library) 
	
	> _When version 7.2 releases at the end of the year, PHP will be the first programming language to adopt modern cryptography in its standard library._

2. [It Turns Out, 2017 is the Year of Simply Secure PHP Cryptography](https://paragonie.com/blog/2017/07/it-turns-out-2017-is-year-simply-secure-php-cryptography) (by Scott Arciszewski as well).



## Other Interesting Changes

### RFC: Object typehint ([link](https://wiki.php.net/rfc/object-typehint))
It will be possible to use `object` as parameter type and as a return type.

```php
<?php declare(strict_types = 1);

function foo(object $definitelyAnObject): object
{
    return 'another string';
}

foo('what about some string?');
// TypeError: Argument 1 passed to foo() must be an object, string given, called in...


foo(new \stdClass());
// TypeError: Return value of foo() must be an object, string returned

```

`object` becomes a keyword in 7.2, so make sure you are not using it as a name for a class, interface or trait. It was a [soft-reserved word since PHP 7.0](http://php.net/manual/en/reserved.other-reserved-words.php).

It is useful mainly for libraries (ORMs, DI containers, serializers, [and others](https://externals.io/message/96554#96586)). But it may help clean up some of your code as well. In our codebase, it will allow us to improve the helper method used in tests:

```php
class TestUtils
{

    /**
     * @param object $object
     * @param string $propertyName
     * @param mixed $value
     */
    public static function setPrivateProperty($object, string $property, $value): void
    {
        if (!is_object($object)) {
            throw new \Exception('An object must be passed');
        }
```

Will be simplified to this:

```php
class TestUtils
{
    public static function setPrivateProperty(object $object, string $property, $value): void
    {
```

### RFC: Parameter Type Widening ([link](https://wiki.php.net/rfc/parameter-no-type-variance))
With this change, it is possible to omit the parameter type declaration in the child classes. I know that may sound confusing, so let's have a look at the example:


```php
<?php declare(strict_types = 1);

class LibraryClass 
{
    public function doWork(string $input)
    {

    }
}

class UserClass extends LibraryClass
{
    public function doWork($input)
    {

    }
}

// PHP <7.2.0
// Warning: Declaration of UserClass::doWork($input) should be compatible with LibraryClass::doWork(string $input) in …

// PHP 7.2.0+
// no errors
```

It would allow libraries to introduce scalar typehints without breaking subclasses created by the library users. But it is rather theoretical possibility because the library cannot do the same for the return types. And when the library is adding parameter typehints, it makes sense to add return types as well.

Omitting type hints in subclasses follows the [Liskov substitution principle - LSP](https://en.wikipedia.org/wiki/Liskov_substitution_principle) because it widens the accepted types. But the subclass cannot omit return typehints, because that would widen the possible return types (and that is LSP violation).


This behaviour was also changed for abstract classes in separate RFC: [RFC: Allow abstract function override](https://wiki.php.net/rfc/allow-abstract-function-override).


### RFC: Counting of non-countable objects ([link](https://wiki.php.net/rfc/counting_non_countables))

Did you know, that it is possible to count scalar values? Well, it does not really do much counting, it only returns 1 for scalars.

```php
<?php

var_dump(count(null)); // int(0)
var_dump(count(0)); // int(1)
var_dump(count(4)); // int(1)
var_dump(count('4')); // int(1)

```

Since PHP 7.2, it will begin emitting a warning:
```
Warning: count(): Parameter must be an array or an object that implements Countable in /in/4aIl2 on line 3
```

I really like this change, because no one writes such code intentionally, but rather as a bug that needs fixing.

I guess that you may find some of those is your codebase as well - have a look at a less obvious example:
```php
<?php declare(strict_types = 1);

class Data
{
    /** @var string[] */
    private $data;

    public function addOne(string $item)
    {
        if (count($this->data) >= 5) {
            throw new \Exception('too much data');
        }

        $this->data[] = $item;
    }
}

$data = new Data();
$data->addOne('item1');
$data->addOne('item2');
$data->addOne('item3');

// Warning: count(): Parameter must be an array or an object that implements Countable in ...
```

It will report a warning, because you are counting a `null` value in the `if`.




### RFC: Deprecations for PHP 7.2 ([link](https://wiki.php.net/rfc/deprecations_php_7_2))

Can be also called _"Nikita Popov's language clean-up"_ :-)

The following will throw a deprecation warning in PHP 7.2 and will be removed later (probably in 8.0). See [the RFC](https://wiki.php.net/rfc/deprecations_php_7_2) for detailed explanation of each one:

- `__autoload()` - use [`spl_autoload_register()`](http://php.net/spl_autoload_register) instead
- `$php_errormsg` - use [`error_get_last()`](http://php.net/error_get_last) instead
- `create_function()` - use closures instead
- `mbstring.func_overload` (ini setting) - use `mb_*` functions directly
- `(unset)` cast - this is not deprecating `unset($var)` but `$foo = (unset) $bar` which is equal to `$foo = null` (yes, strange one)
- `parse_str()` without second argument - directly creating variables when parsing query string is not something you should be doing (`register_globals` anyone?)
- `gmp_random()` - use `gmp_random_bits()` and `gmp_random_range()` instead
- `each()` - use `foreach` instead (it is more than 10 times faster)
- `assert()` with string argument - it is using `eval()` internally!
- `$errcontext` argument of error handler - use `debug_backtrace()` instead



## Smaller changes

### RFC: get_class() disallow null parameter ([link](https://wiki.php.net/rfc/get_class_disallow_null_parameter))

Did you know, that `get_class()` without parameters returns the same value as `__CLASS__`? I didn't. But the RFC does not change this.

```php
<?php

class MyClass
{
    public function myInfo()
    {
        var_dump(get_class()); // string(7) "MyClass"
        var_dump(__CLASS__); // string(7) "MyClass"
    }
}

$a = new MyClass();
$a->myInfo();

var_dump(get_class($a)); // string(7) "MyClass"
```

The RFC deprecates calling it with `null` as parameter. Consider this example from the RFC. If the item is fetched from the repository and `$result` is not null, it will print the class name of the fetched object. But if it is null, `Foo` will be printed.

```php
class Foo
{

    function bar($repository)
    {
        $result = $repository->find(100);

        echo get_class($result);
    }
}

// In 7.2: Warning: get_class() expects parameter 1 to be object, null given in ...
```


### RFC: Allow loading extensions by name ([link](https://wiki.php.net/rfc/load-ext-by-name))

If you configured the PHP extensions before 7.2, you had to use full filename in the `.ini` file:

On Windows:
```ini
extension=php_mbstring.dll
```

On Linux:
```ini
extension=mbstring.so
```

That's fine if you are using only one platform. But it gets a bit harder, if you need to write some automation scripts supporting multiple platforms. It was improved in 7.2 and now you can use this both on Linux and Windows:

```ini
extension=mbstring
```

Legacy syntax is still supported, but it is recommended to use the new one.


### RFC: Deprecate and Remove Bareword (Unquoted) Strings ([link](https://wiki.php.net/rfc/deprecate-bareword-strings))

This is another step in making PHP safer to use. If you mistype a constant in 7.2, it will throw a warning instead of notice (and will throw an error in PHP 8.0).

Simplest example is this:
```php
<?php
var_dump(NONEXISTENT_CONSTANT);


// PHP 7.1
// Notice: Use of undefined constant NONEXISTENT_CONSTANT - assumed 'NONEXISTENT_CONSTANT' in …

// PHP 7.2
// Warning: Use of undefined constant NONEXISTENT_CONSTANT - assumed 'NONEXISTENT_CONSTANT' (this will throw an Error in a future version of PHP) in …
```

I really like the bug examples [in the RFC](https://wiki.php.net/rfc/deprecate-bareword-strings) showing what it's aiming to prevent:

```php
$foo = flase; // typo!
// ...
if ( $foo ) {
   var_dump($foo); // string(5) "flase"
}
```
And:
```php
$found = false;
foreach ( $list as $item ) {
   if ( is_null($item) ) {
       contniue; // this statement issues a notice and does nothing
   }
   // lines assuming $item is not null
}
```


### RFC: Trailing Commas in List Syntax ([link](https://wiki.php.net/rfc/list-syntax-trailing-commas))

It has [always been possible](https://3v4l.org/J8r9B) to use trailing comma after last array item:

```php
$foo = [
    'foo',
    'bar',
];
```

It is useful for creating clean diffs in VCS and makes adding new items to the list simple.

This RFC proposed adding an optional trailing comma to all list-like places:

- Grouped namespaces
- Function/method arguments (declarations & calls)
- Interface implementations on a class
- Trait implementations on a class
- Class member lists
- Inheriting variables from the parent scope in anonymous functions

I especially hoped for method arguments declarations and calls. But it did not pass the vote (which needed 2/3 majority, as it is a language change).

Surprisingly, only the _"Grouped namespaces"_ passed:

```php
use Foo\Bar\{ 
	Foo,
	Bar, 
	Baz, 
}; 

// note the comma after "Baz"
```

## Conclusion

PHP 7.2 will contain new security features (sodium, Argon2i), several language improvements (`object` typehint, type widening) and a variety of minor changes that polish legacy parts of the language.

The [RC1](http://php.net/archive/2017.php#id2017-08-31-1) was released on 31st August, so it is now a right time to try it out. If you can't or don't want to use it locally for development just yet, you should at least run your test suite against PHP 7.2 to see if there is anything to be fixed. I think there won't be many compatibility issues in a well-managed codebase.
 
If you are maintaining an open-source project, you should add 7.2 to TravisCI build matrix to ensure that your users won't encounter any compatibility issues. Or you can require PHP 7.2 in the next major version [like Doctrine ORM will](https://github.com/doctrine/doctrine2/pull/6577).

Thank you, Sara and Remi, and all the contributors for making this PHP release great!

What are you looking forward to most in the PHP 7.2?
