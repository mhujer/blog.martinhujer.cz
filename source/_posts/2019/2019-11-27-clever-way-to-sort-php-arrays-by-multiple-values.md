---
title: Clever way to sort PHP arrays by multiple values
short: 
---

In the post I will describe a clever trick which allows you to easily sort PHP array or collection by multiple values.

Let's start from the beginning. Sorting using `usort` and `uasort` functions works by providing a callback for comparing two values in the array. From the docs:

> _The comparison function must return an integer less than, equal to, or greater than zero if the first argument is considered to be respectively less than, equal to, or greater than the second._


## Basic sorting

The simplest example may look like this (when having an array of `Product` instances):

```php
// order products by: price ASC
usort($products, function (Product $a, Product $b): int {
    return $a->getPrice() <=> $b->getPrice();
});
```

You can notice that I'm using a _spaceship operator_ `<=>` which [was added in PHP 7.0](https://www.php.net/manual/en/migration70.new-features.php#migration70.new-features.spaceship-op). It compares two expressions, `$a` and `$b`, and returns -1, 0 or 1 when `$a` is respectively less than, equal to, or greater than `$b`.

The example above can be simplified more using the arrow functions from PHP 7.4 (although I wouldn't say that it is more readable):
```php
usort($products, fn (Product $a, Product $b): int => $a->getPrice() <=> $b->getPrice());
```

To sort the values in the descending order, just swap `$a` and `$b` expressions in the callback: 

```php
// order products by: price DESC
usort($products, function (Product $a, Product $b): int {
    return $b->getPrice() <=> $a->getPrice();
});
```

## Sorting by two properties

If you want to sort the products by two fields, price ASC and products in stock first, it gets tricky.
First you need to check whether the prices are equal. If they are you compare the `inStock` flag to have the available products first. Otherwise just compare the prices.

```php
// order products by: price ASC, inStock DESC
usort($products, function (Product $a, Product $b): int {
    if ($a->getPrice() === $b->getPrice()) {
        return $b->isInStock() <=> $a->isInStock();
    }
    return $a->getPrice() <=> $b->getPrice();
});
```
## Sorting by multiple properties

It will get much more complex when you want to sort the array by three or four properties:

```php
// order products by: price ASC, inStock DESC, isRecommended DESC, name ASC
usort($products, function (Product $a, Product $b): int {
    if ($a->getPrice() === $b->getPrice()) {
        if ($a->isInStock() === $b->isInStock()) {
            if ($a->isRecommended() == $b->isRecommended()) {
                return $a->getName() <=> $b->getName();
            }
            return $b->isRecommended() <=> $a->isRecommended();
        }
        return $b->isInStock() <=> $a->isInStock();
    }
    return $a->getPrice() <=> $b->getPrice();
});
```

You have to carefully craft the conditions and don't miss the places where you are comparing `$b` with `$a` instead of `$a` with `$b` to sort them in descending order.

This example is quite close to what I needed when working on OutdoorVisit.com tickets list in activity detail. I couldn't do it in the database because there was some preprocessing (non-database filtering etc.) required. 

I didn't want to have this complex sorting logic written as above, so I came up with the following solution.

## Solution

```php
// order products by: price ASC, inStock DESC, isRecommended DESC, name ASC
usort($products, function (Product $a, Product $b): int {
    return
        ($a->getPrice() <=> $b->getPrice()) * 1000 + // price ASC
        ($b->isInStock() <=> $a->isInStock()) * 100 + // inStock DESC
        ($b->isRecommended() <=> $a->isRecommended()) * 10 + // isRecommended DESC
        ($a->getName() <=> $b->getName()); // name ASC
});
```

I compare all attributes that impact the sorting in the same expression. I also add weight to each comparison to prioritize them. 

The trick is that the return value from the callback can be any positive or negative integer, not just -1 or 0 or 1. It allows me to sum the separate comparisons together and return it as a result.


It can be further simplified using arrow function from PHP 7.4:

```php
// order products by: price ASC, inStock DESC, isRecommended DESC, name ASC
usort($products, fn (Product $a, Product $b): int =>
    ($a->getPrice() <=> $b->getPrice()) * 1000 + // price ASC
    ($b->isInStock() <=> $a->isInStock()) * 100 + // inStock DESC
    ($b->isRecommended() <=> $a->isRecommended()) * 10 + // isRecommended DESC
    ($a->getName() <=> $b->getName()) // name ASC
);
```

## Solution (from [František Maša](https://frantisekmasa.cz/))

[František Maša](https://frantisekmasa.cz/) suggested even better solution in the comments. Thanks!

```php
usort($products, fn (Product $a, Product $b): int =>
    [$a->getPrice(), $b->isInStock(), $b->isRecommended(), $a->getName()]
    <=>
    [$b->getPrice(), $a->isInStock(), $a->isRecommended(), $b->getName()]
);
```

## Conclusion

Let me know in the comments if you find this trick useful.
 
Or do you have a better way of doing this?
