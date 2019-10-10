---
title: How to configure PHPStan for Symfony applications
short: PHPStan is a tool that analyses PHP code and detects potential issues. This article will show you how to configure it for Symfony + Doctrine ORM applications.
---

[PHPStan](https://github.com/phpstan/phpstan) is a fantastic tool for a static analysis of PHP code. It reads the code and PHPDoc and will try to detect potential issues such as:

* undefined variables
* incorrect types passed throughout the codebase
* use of non-existent methods and attributes
* passing of incorrect number of parameters to a method
* use of possible null-pointers
* lot more...

Apart from being able to analyse regular PHP code, PHPStan can understand even some framework-specific _magic_ using custom-made extensions.

But let's start from the beginning...

## PHPStan installation

You can install PHPStan either directly with all its dependencies by running:

```bash
composer require --dev phpstan/phpstan
```

Or you can install `phpstan-shim`:

```bash
composer require --dev phpstan/phpstan-shim
```

The advantage of `phpstan-shim` is that it is a Phar file with all the dependencies packed inside (and prefixed), so they won't conflict with other dependencies you may have in your project. Therefore, I prefer using `phpstan-shim`.  


## Using PHPStan

PHPStan can be run this way:
```bash
vendor/bin/phpstan analyse -l 0 src tests
```

It will probably report bunch of errors depending on your project size and age. The best approach from here is to gradually fix the issues and raise the level of strictness (`-l 1` etc.).

If there are some issues which cannot be fixed easily, you can [exclude them from the report](https://github.com/phpstan/phpstan#ignore-error-messages-with-regular-expressions). When doing so, try to be specific and put the filename in the exclude, so you won't exclude the issues from the whole project. And don't forget to properly escape the regular expressions, or you may be excluding way more things than you wanted (hint: `|` needs to be escaped too).

You should also have a look at a new [Baseline Feature](https://medium.com/@ondrejmirtes/phpstans-baseline-feature-lets-you-hold-new-code-to-a-higher-standard-e77d815a5dff) in PHPStan, which allows you _ignore_ all the current issues and let the PHPStan check just the new code.


## Adding PHPStan to CI build
To prevent issues from creeping back to the codebase, you should include PHPStan in you CI build to have it fail when a new error appears.

It can be done easily by using [Composer Scripts](/have-you-tried-composer-scripts/). Your `scripts` section in `composer.json` can look like this:

```json
"scripts": {
    "phpstan": "phpstan analyse -c phpstan.neon src tests --level 7 --no-progress", 
    "tests": "phpunit",    
    "ci": [
        "@phpstan",
        "@tests"
    ],
}
```

It will run both the `phpstan` and `tests` scripts when you run `composer ci`.

**Note:** If you have a Symfony application, you will already have a `scripts` section in your `composer.json`, so just add new items there.

You can read more thoroughly about Composer Scripts in my article _[Have you tried Composer Scripts? You may not need Phing](/have-you-tried-composer-scripts/)_.


## Configuring the Symfony extension

You might have noticed that PHPStan reports some issues in Symfony-specific code, that works OK. It is because there is no way for PHPStan to understand Symfony magic just from the code itself. It includes getting services from Container (you should not be doing it anyway!), working with arguments and options in Commands and much more.

To have those errors disappear, you need to install [phpstan/phpstan-symfony](https://github.com/phpstan/phpstan-symfony) extension and configure it in `phpstan.neon`:

```
includes:
    - vendor/phpstan/phpstan-symfony/extension.neon
```

Apart from that you also must provide PHPStan with a path to Symfony container compiled to XML. It is usually stored in the `var/cache/dev` directory.

```yaml
parameters:
    symfony:
        container_xml_path: var/cache/dev/srcApp_KernelDevDebugContainer.xml
```

Also, to have the Commands analysed properly, PHPStan needs a _console loader_. It is a script that initializes the Symfony Console for the application and passes it to PHPStan. It can use it to determine the arguments or options types etc.

I usually put it in `build/phpstan/console-loader.php`:
```php
<?php declare(strict_types = 1);

use App\Kernel;
use Symfony\Bundle\FrameworkBundle\Console\Application;

require dirname(__DIR__) . '/../config/bootstrap.php';
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
return new Application($kernel);
```

The final configuration for `phpstan-symfony` should look like this:

```neon
includes:
    - vendor/phpstan/phpstan-symfony/extension.neon

parameters:
    symfony:
        container_xml_path: var/cache/dev/srcApp_KernelDevDebugContainer.xml
        console_application_loader: build/phpstan/console-loader.php
```

With this configuration, PHPStan can understand the Symfony code. It also checks that you are not fetching non-existent (or private) services from container.


## Configuring PHPStan with PHPUnit

In the previous part we have successfully configured PHPStan to check various things in Symfony projects. However, it is still possible to improve the configuration.

We are now using same configuration file for both `src` and `tests`, but Symfony uses a separate container when running in either `dev` or `test` environments. It means that PHPStan will report errors such as `Service "Doctrine\ORM\EntityManagerInterface" is private.` even if the tests work fine.

The solution is simple - use a separate configuration file for `src` and for `tests`. We can keep the current `phpstan.neon`, but we have to create specific configuration for tests - `phpstan-tests.neon`. It will look very similarly with only change being the `container_xml_path` which now points to the container compiled in `var/cache/test`:

```neon
includes:
    - vendor/phpstan/phpstan-symfony/extension.neon

parameters:
    symfony:
        container_xml_path: var/cache/test/srcApp_KernelTestDebugContainer.xml
        console_application_loader: build/phpstan/console-loader.php
```

You need to adjust the `scripts` setup in `composer.json` to run PHPStan twice - first for the `src` directory and then for the `tests` with a different configuration file. When using this setup, you can still run `composer phpstan` which in turn runs checks for both `src` and `tests`.

```json
"phpstan": [
    "@phpstan-general",
    "@phpstan-tests"
],
"phpstan-general": "phpstan analyse -c phpstan.neon src --level 7 --no-progress",
"phpstan-tests": "phpstan analyse -c phpstan-tests.neon tests --level 7 --no-progress",
```

I know that the PHPStan configuration is duplicated a little bit, but that does not matter much (you are not adding new extensions that often).

One thing that you must keep in mind is that the Symfony container must be compiled before it can be used for analysis. You can do it by running `bin/console cache:warmup --env=dev` and `bin/console cache:warmup --env=test`. As it needs to be part of the CI build, you can put it to the Composer `scripts` as well:  

```json
"phpstan": [
    "@php bin/console cache:warmup --env=dev",
    "@php bin/console cache:warmup --env=test",
    "@phpstan-general",
    "@phpstan-tests"
],
```

Or you can put it into a separate script, so it won't be slowing you down when running PHPStan repeatedly without changes in the container (but you must make sure that the container is recompiled for the `test` environment after change).


Finally, we are getting to configuring the [PHPUnit extension](https://github.com/phpstan/phpstan-phpunit) itself. We need to install it through Composer:

```bash
composer require --dev phpstan/phpstan-phpunit
```

And then configure it in `phpstan-tests.neon`:

```neon
includes:
    - vendor/phpstan/phpstan-phpunit/extension.neon
    - vendor/phpstan/phpstan-phpunit/rules.neon
```

And that's it.


## PHPStan and Doctrine ORM

Doctrine ORM contains even more magic things which can't be inferred just from the code itself. Repository and Entity Manager use `object` type in lot of places, so the PHPStan won't know which type is there and you would need to add lots of inline PHPDoc to make it work.

Or you can install [`phpstan/phpstan-doctrine`](https://github.com/phpstan/phpstan-doctrine) extension which helps PHPStan to understand Doctrine magic.

```bash
composer require --dev phpstan/phpstan-doctrine
```

Like with Symfony extension, you must help Doctrine extension by creating a loader script that provides an Entity Manager so PHPStan can query it about various things. I usually put it into
`build/phpstan/doctrine-orm-bootstrap.php` and the script should look like this:

```php
<?php declare(strict_types = 1);

use App\Kernel;

require dirname(__DIR__) . '/../config/bootstrap.php';
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();
return $kernel->getContainer()->get('doctrine')->getManager();
```

You should add this to respective sections in both `phpstan.neon` and `phpstan-tests.neon`:

```neon
includes:
    - vendor/phpstan/phpstan-doctrine/extension.neon
    - vendor/phpstan/phpstan-doctrine/rules.neon

parameters:
    doctrine:
        objectManagerLoader: build/phpstan/doctrine-orm-bootstrap.php
```

With this setup PHPStan will use the EntityManager to also check your DQLs and Query Builders, which is awesome.

Next version of PHPStan-Doctrine extension will also support analysis of the entity annotations to determine whether the property type matches the column type, whether the property types for associations are defined correctly etc.  

## Bleeding edge features

PHPStan can check even more things when you enable _bleeding edge_ rules from the core of PHPStan. Current PHPStan release is 0.11.x is mostly backwards compatible (not that many new issues are detected between patch versions). However, Ondra practices something along the lines of the trunk-based development, where new features (checks!) are hidden behind feature flags.

You can enable all of them by adding this to your configuration files (applies to `phpstan-shim`, the path will be different for a regular installation):

```neon
includes:
    - phar://phpstan.phar/conf/bleedingEdge.neon
```

## Strict rules

There is a [`phpstan/phpstan-strict-rules`](https://github.com/phpstan/phpstan-strict-rules) package which adds opinionated checks not included in the PHPStan core. You can install it through Composer:

```bash
composer require --dev phpstan/phpstan-strict-rules
```

Afterwards, you just need to add a new include to both configuration files:

```neon
includes:
    - vendor/phpstan/phpstan-strict-rules/rules.neon
```

And suddenly you will get many more potential issues or bad practices reported :-)


## Conclusion

If you configure the PHPStan according to this article, it will change your life :-) (at least a little bit).

Nowadays I can't imagine developing modern PHP applications without PHPStan running on max level with lots of checks. It helps to prevent many issues during development and refactoring of the applications.
