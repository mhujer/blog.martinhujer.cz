---
title: Consistence brings consistency to the PHP
short: In the article I describe the Consistence library that brings consistency to PHP applications.
showPhpTrainingAd: true
---

**In the article I describe the [Consistence library](https://github.com/consistence/consistence/) that aims to bring consistency to PHP applications.**

There is no argument, that PHP can sometimes be _a bit_ inconsistent about naming stuff and maintaining order of parameters for related functions. Also, in some cases it is not strict and allows you to use the language and the functions in a wrong way. Sometimes you get `false` as a return value where an exception would be appropriate. 

I really like the idea of code being strict because it prevents errors in the application. E.g. `strpos` usually returns `int`, but it returns `false` when the `$needle` was not found. It would be much better to throw `SubstringNotFoundException` in that case.

Consistence provides opinionated strict wrappers with better error handling and consistent naming and consistent parameters order.

> _**Disclaimer:** I haven't created the library, but I find it useful and I hope you will as well. It is one of the packages I use on every project._

Let's dive into it.

## Use Enums for better type safety
It's a good practice to use constants instead of passing magic numbers (or magic strings) around. But you still pass them as a string, so there is nothing that prevents you from passing any other arbitrary string:

```php
<?php
class BodyType
{
    const SUV = 'suv';
    const COMBI = 'combi';
    const HATCHBACK = 'hatchback';
    const CABRIO = 'cabrio';
    // ... 
}

function createCar(string $bodyType) {
    // do something with $bodyType
}

$car = createCar(BodyType::CABRIO);
$car = createCar('doubledecker'); // unexpected things can happen
```

Consistence provides an [enum implementation](https://github.com/consistence/consistence/blob/master/docs/Enum/enums.md). When you extend the class from `Enum`, all constants are automatically treated as possible enum values:

```php
<?php
class BodyType extends \Consistence\Enum\Enum
{
    const SUV = 'suv';
    const COMBI = 'combi';
    const HATCHBACK = 'hatchback';
    const CABRIO = 'cabrio';
    // ...
}

function createCar(BodyType $bodyType) {
    echo $bodyType->getValue(); // you can use `getValue()` method to access the internal enum value
}

// use get() to get an instance of enum
$cabrioBodyType = BodyType::get(BodyType::CABRIO);

// It is a regular class instance
var_dump($cabrioBodyType instanceof BodyType); // bool(true)

// You always get the same instance, so you can compare them
var_dump(BodyType::get(BodyType::CABRIO) === BodyType::get(BodyType::CABRIO)); // bool(true)

// Type-hint checks work as expected
$car = createCar($cabrioBodyType); 

// Argument 1 passed to createCar() must be an instance of BodyType, string given
$car = createCar('doubledecker'); 
```

Enums also make it easier to write an actual code. Compare the following examples. When you want to instantiate the class from the first one, you have to dig into the documentation to check what are the allowed values:

```php
<?php
class Car
{
	public function __construct(
		string $bodyType,
		string $transmissionType,
		string $engineType,
		string $fuelType
	)
	{}
}
```

In the second one, you just start typing `BodyType::get(BodyType::` and then choose from the suggested values:

```php
<?php
class Car
{
	public function __construct(
		BodyType $bodyType,
		TransmissionType $transmissionType,
		EngineType $engineType,
		FuelType $fuelType
	)
	{}
}
```

There are [Doctrine](https://github.com/consistence/consistence-doctrine) and [Doctrine + Symfony](https://github.com/consistence/consistence-doctrine-symfony/) integrations which allow you to use Enums in Doctrine entities:

```php
<?php
use Consistence\Doctrine\Enum\EnumAnnotation as Enum;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 */
class Car
{
    /**
     * @Enum(class=BodyType::class)
     * @ORM\Column(type="string_enum")
     * @var BodyType
     */
    private $bodyType;

    public function __construct(BodyType $bodyType)
    {
        $this->bodyType = $bodyType;
    }

    public function getBodyType(): BodyType
    {
        return $this->bodyType;
    }
}
```

If you need to represent multiple values, have a look at the [MultiEnums](https://github.com/consistence/consistence/blob/master/docs/Enum/multi-enums.md).

_If the Consistence only provided the Enums, it would be enough reason for me to use it._

## Use `ObjectPrototype` to disable magic methods

In PHP you can write to undefined object properties. If the property is not defined and you assign a value to it, it is created in runtime.

I think it is a bad idea because it can hide subtle bugs and typos. Consider the following example, where I made a several mistakes in the code, but PHP almost did not complain.

```php
<?php
class MyClass
{
    public $foo;
}

$a = new MyClass();
$a->boo = 'bb'; // I made a typo, but PHP is fine with that

var_dump($a->foo);  // NULL
var_dump($a->boo);  // string(2) "bb"
var_dump($a->otherProperty);  // Notice:  Undefined property: MyClass::$otherProperty
```

If you want a more real-world example, consider this:
```php
<?php
$finalPrice = $product->price * $customer->distountRate;
```
There is a typo in a property name, so the `$finalPrice` would be `0`, because undefined property has `null` value which is converted to `0` and used in multiplication.

Consistence provides a straightforward way to mitigate this type of bugs. There is an [`ObjectPrototype`](https://github.com/consistence/consistence/blob/master/docs/Type/strict-types.md#strict-object) class which you can extend your classes from. If you try to assign or read something from an undefined property, an exception is thrown. Calling undefined methods throws an exception too. Those exceptions are not meant to be caught, but they should be fixed directly in your code.

```php
<?php
class MyClass extends \Consistence\ObjectPrototype
{
    public $foo;
}

$a = new MyClass();
$a->boo = 'bb'; // throws Consistence\UndefinedPropertyException

var_dump($a->foo); // NULL, but that does not matter, an exception would be thrown before
var_dump($a->boo); // throws Consistence\UndefinedPropertyException
var_dump($a->otherProperty); // throws Consistence\UndefinedPropertyException

$a->foo(); // throws Consistence\UndefinedMethodException
```

You're probably thinking, that using a base class for all classes is an awful code-smell!
 
I agree in general, but this case is different. If you consider the Consistence library to be an extension or augmentation of the standard PHP library, `ObjectPrototype` class is more like `Object` base class in Java. And nobody complains about it there.

The unseen advantage of this is that when you extend `ObjectPrototype`, you can't extend anything else, which is a good thing. You should be using composition as a code reuse mechanism anyway. In cases when the inheritance makes sense, you can use `ObjectMixinTrait` which enables the strict behaviour. Good example are the exceptions (they are objects too!):

```php
<?php
class MyCustomException extends \Exception
{
	use \Consistence\Type\ObjectMixinTrait;
}

$exception = new MyCustomException();
$exception->foo = 'a'; // throws Consistence\UndefinedPropertyException
```

Speaking of exceptions, there is a [`PhpException`](https://github.com/consistence/consistence/blob/master/src/exceptions/PhpException.php) which can be used as their base class. It has a shorter constructor without the mostly useless `$code` argument.

## Strict type checking
PHP type-hints are powerful, but there are still a lot of things they can't check. You can put the detailed type info into the PHPDoc, but it is ignored at runtime. It only helps other developers and the IDE to better understand the code.

In the following example, IDE understands that the array contains `int` values, but PHP only checks that it is an `array`:

```php
<?php
/**
 * @param int[] $data
 */
function foo(array $data)
{
    var_dump($data);
}

foo([0, 1, 2]); // OK,
foo(['0', '1', '2']); // OK
foo(1); // not OK: Argument 1 passed to foo() must be of the type array, integer given
```

You can use `Type` class to manually check that the variable contains expected type:

```php
<?php
use Consistence\Type\Type;

/**
 * @param int[] $data
 */
function foo(array $data)
{
    Type::checkType($data, 'int[]');

    var_dump($data);
}

foo([0, 1, 2]); // OK 
foo(['0', '1', '2']); // throws Consistence\InvalidArgumentTypeException: int[] expected,  [array] given

```

`Type::checkType()` throws an exception when the type-check fails. If you want to throw the exception yourself, you can use `Type::hasType($data, 'int[]')` which returns `boolean` value.

Here are some examples what else you can use as an expected type:

- `object`: useful in < PHP 7.2
- Union types: `int|string` or `int[]|string[]`
- Collection of objects: `Product::class . '[]'`
- Array keys type: `int:string[]` (array of `string` values indexed by `int` keys)


## Consistent array manipulation functions

Standard PHP functions for array manipulation aren't very consistent or strict:

- most of them are not using strict comparison - they do automatic type conversion
- most of them do not accept callbacks to create more complicated logic
- [some](http://php.net/array_filter) accept the source array as first parameter, [some](http://php.net/array_map) as a second parameter

Consistence provides [several array manipulation functions](https://github.com/consistence/consistence/blob/master/docs/Type/arrays.md) in the `ArrayType` namespace. Let's have a look at the examples.

In the first example you can see how the implicit type conversion in `in_array` function can lead to unexpected results:

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = ['1', '2'];

// automatic type conversion
in_array('1', $data); // bool(true)
in_array(1, $data); // bool(true) <- unexpected result!
in_array(true, $data); // bool(true) <- unexpected result!

// strict flag set to true
in_array('1', $data, true); // bool(true)
in_array(1, $data, true); // bool(false) <- works as expected
in_array(true, $data, true); // bool(false) <- works as expected

// ArrayType::containsValue() works as expected by default
ArrayType::containsValue($data, '1'); // bool(true)
ArrayType::containsValue($data, 1);  // bool(false)
ArrayType::containsValue($data, true);  // bool(false)
```
In this case you can get away with just making sure to always add `true` as a third parameter.

The code gets more complicated when you need more complex logic, e.g. you want to check if the array contains a value larger than 3. You can iterate through the array and determine if some value matches the condition:

```php
<?php
$data = [1, 2, 3, 4];

$result = false;
foreach ($data as $value) {
    if ($value > 3) {
        $result = true;
        break;
    }
}
var_dump($result); // bool(true)
```

Consistence provides more succinct way of doing it with `containsValueByValueCallback()`, where you only need to write the actual business logic and not the repetitive boilerplate code:

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = [1, 2, 3, 4];

$result = ArrayType::containsValueByValueCallback($data, function (int $value) {
    return $value > 3;
});

var_dump($result); // bool(true);
```

I often use array filtering by callback:

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = [1, 2, 3, 4];

$result = ArrayType::filterValuesByCallback($data, function (int $value): bool {
	return $value > 2;
});
var_dump($result); // [3, 4]
```

And mapping values by callback:

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = [1, 2, 3, 4];

// map values using callback
$result = ArrayType::mapValuesByCallback($data, function (int $value) {
	return $value * 2;
});
var_dump($result); // [2, 4, 6, 8]
```

Sometimes it may be convenient to use `filterByCallback()` and `mapByCallback()` that pass both _key_ and _value_ to the callback function (they use the [`KeyValuePair`](https://github.com/consistence/consistence/blob/master/docs/Type/arrays.md#keyvaluepair) value object internally).

Did you know, that `array_unique()` is always comparing loosely? Therefore, I prefer to use strict `ArrayType::uniqueValues()`:

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = [1, '1', true];

var_dump(array_unique($data)); // ['1']
var_dump(ArrayType::uniqueValues($data)); // [1, '1', true]
```

Last thing I want to show you regarding the arrays is the `find`/`get` convention. If the method name starts with `find` (e.g. `findValue()`), it can either return the value or `null`. But if the method name starts with `get` (e.g. `getValue()`), it either returns the value or throws an exception.

```php
<?php
use Consistence\Type\ArrayType\ArrayType;

$data = [1, 2, 3, 4];

// we want to get a value at key

ArrayType::findValue($data, 3); // int(4)
ArrayType::findValue($data, 5); // null

ArrayType::getValue($data, 3); // int(4)
ArrayType::getValue($data, 5); // throws ElementDoesNotExistException
```

And there is more, [have a look at the available methods](https://github.com/consistence/consistence/blob/master/src/Type/ArrayType/ArrayType.php) for yourself.

## Regex

This chapter is going to be a short one. Consistence provides a `preg_match` wrapper with more sensible API and exceptions error handling:

```php
<?php
use Consistence\RegExp\RegExp;

// you can either check if the string matches the pattern
RegExp::matches('abc', '/bc+/'); // bool(true)

// or get the matches back
$matches = RegExp::match('abcde', '/[b-d]+/');
var_dump($matches); // ['bcd']
```

## PHPStan integration

There is a static analysis tool called [PHPStan](https://github.com/phpstan/phpstan) (you can read more about it in [Ondřej's blogpost](https://medium.com/@ondrejmirtes/phpstan-2939cd0ad0e3).

I have created [PHPStan rules for the Consistence library](https://github.com/mhujer/phpstan-consistence). There is one which checks that the class extends `ObjectPrototype` or uses `ObjectMixinTrait`. And second which checks that you are using safer Consistence array manipulation functions instead of the plain native PHP ones.


## Conclusion
In the article I've described the most interesting parts of the [Consistence](https://github.com/consistence/consistence/) library. My favourite are enums and strict types everywhere.

If you are not using the Consistence library yet, [give it a try](https://github.com/consistence/consistence/#consistence)!
