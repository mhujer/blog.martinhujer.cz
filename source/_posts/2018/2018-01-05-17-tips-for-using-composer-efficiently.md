---
title: 24 Tips for Using Composer Efficiently
showPhpTrainingAd: true
---

Although most PHP developers know how to use Composer, not all of them are using it efficiently or in a best possible way. So I decided to summarize things which are important for my everyday workflow.

The philosophy of most of the tips is *"Play it safe"*, which means that if there are more ways how to handle something, I would use the approach which is least error-prone.

## Tip #1: Read the documentation

I really mean it. [The documentation](https://getcomposer.org/doc/) is great and a few hours of reading it will save you more time in the long run. You would be surprised how many things Composer can do.

## Tip #2: Be aware of differences between a "project" and a "library"

It's important to know, whether you are creating a *"project"* or a *"library"*. Each of them requires separate set of practices.

A library is a reusable package, that you would add as a dependency - such as `symfony/symfony`, `doctrine/orm` or [`elasticsearch/elasticsearch`](https://github.com/elastic/elasticsearch-php).

A project is typically an application, that depends on several libraries. It is usually not reusable (no other projects would require it as a dependency). Typical example is an ecommerce website, customer support system etc.

I will distinguish between library and a project in the tips bellow.

## Tip #3: Use specific dependencies' versions for applications

If you are creating an application, you should use the most specific version to define the dependency. If you need to parse YAML files, you should specify the dependency like this `"symfony/yaml": "4.0.2"`.

Even if the library follows [Semantic Versioning](https://semver.org/), there may be backwards-compatibility breaks in the minor and patch versions. For example, if you are using `"symfony/symfony": "^3.1"`, there may be something deprecated in 3.2 which may break your application tests. Or there may be a bug fixed in PHP_CodeSniffer and it would detect new formatting issues in your code, which again may lead to a broken build.

The update of dependencies should be deliberate, not accidental. One of the tips bellow discusses it in greater detail.

It may sound as an overkill, but it will prevent your co-workers from accidentally updating all dependencies when adding a new library to project (which you may miss during Code Review). 

## Tip #4: Use version ranges for libraries dependencies

If you are creating a library, you should define the broadest version range possible. If you create a library that uses `symfony/yaml` library for YAML parsing, you should require it like this:

```json
"symfony/yaml": "^3.0 || ^4.0"
```

It means that your library can utilize `symfony/yaml` from any Symfony 3.x or 4.x versions. It is important, because this constraint is passed to the application that uses your library.

In case there are two libraries with conflicting requirements, e.g. one requires `~3.1.0` and other requires `~3.2.0`, the installation would fail. 


## Tip #5: You should commit `composer.lock` to git in applications
If you are creating *a project*, you definitely want to commit `composer.lock` to git. This ensures that everyone - you, your co-workers, your CI server and your production server - is running the application with the same dependencies versions.

At first glance, it may sound superfluous - you are already using a specific version in the constraint, as mentioned in the tip #3. But no, there are also the dependencies of your dependencies which are not bound by these constraints (e.g. `symfony/console` depends on `symfony/polyfill-mbstring`). So without committing the `composer.lock`, you won't get the exact same set of dependencies.

## Tip #6: Put `composer.lock` into `.gitignore` in libraries

If you are creating *a library* (let's call it `acme/my-library`), you should not commit a `composer.lock` file. It [does not have any effect](https://getcomposer.org/doc/02-libraries.md#lock-file) on the projects that are using your library.

Imagine that the `acme/my-library` uses `monolog/monolog` as a dependency. If you have committed a `composer.lock`, everyone who is developing the `acme/my-library` would be using an older version of Monolog. But when the library is finished, and you use it in a real project, a newer version of Monolog may be installed, and it may not be compatible with the library. But you didn't notice it before, because of the `composer.lock`!

It is best to put `composer.lock` into your `.gitignore` so you won't commit it accidentally.

If you want to make sure that the library is compatible with different versions of its dependencies, read the next tip!

## Tip #7: Run Travis CI builds with different versions of dependencies

> This tip applies only to libraries (because you use specific versions for applications).

If you are building an open-source library, you are probably using Travis CI for running its builds. 

By default, Composer installs the latest possible versions of dependencies which are allowed by the constraints in `composer.json`. It means that for the dependency constraint `^3.0 || ^4.0`, the build would always use the latest version of the v4 release. As the 3.0 is never tested, the library may not be compatible with it and that would make your users sad.

Luckily, Composer provides a switch to install the lowest possible versions of dependencies `--prefer-lowest` (should be used with `--prefer-stable` to prevent installation of non-stable versions).

Updated `.travis.yml` configuration may look like this:

```yaml
language: php

php:
  - 7.1
  - 7.2

env:
  matrix:
    - PREFER_LOWEST="--prefer-lowest --prefer-stable"
    - PREFER_LOWEST=""

before_script:
  - composer update $PREFER_LOWEST

script:
  - composer ci
```

See it live in [my mhujer/fio-api-php library](https://github.com/mhujer/fio-api-php/blob/master/.travis.yml) and [the build matrix on Travis CI](https://travis-ci.org/mhujer/fio-api-php)

Even though this solution would catch most of the incompatibilities, remember that there are many combinations of dependencies between lowest and latest versions. And they may be incompatible together.

## Tip #8: Sort packages in require and require-dev by name

It is a good practice to keep packages in `require` and `require-dev` sorted by name. It can prevent unnecessary merge conflicts when rebasing a branch. Because if you have added a package to the end of the list in two branches, there would be a merge conflict every time.

It is a tedious task to do manually, so it is best to [configure it](https://getcomposer.org/doc/06-config.md#sort-packages) in `composer.json`:

```json
{
...
	"config": {
		"sort-packages": true
	},
…
}
```

Next time, you `require` a new package, it will be added to a proper place (and not to the end).

## Tip #9: Do not attempt to merge `composer.lock` when rebasing or merging

If you add a new dependency to `composer.json` (and `composer.lock`) and before your branch is merged, there is another dependency added in master, you need to rebase your branch. And you will get a merge-conflict in `composer.lock`.

You should never try to resolve this conflict manually, because the `composer.lock` file contains a hash of dependencies defined in `composer.json`. So even if you resolve the conflict, the resulting lock file would be incorrect.

Best thing to do is to create `.gitattributes` in the project root with the following line, which means that the git won't even attempt to merge the `composer.lock`:

```ini
/composer.lock -merge
```

You can remedy this issue by using short-lived feature branches as suggested in [Trunk Based Development](https://trunkbaseddevelopment.com/) (you should be doing this anyway). When you have a short-lived branch, which is merged promptly, the risk of merge conflict in `composer.lock` is minimal. You may even create a branch just for adding a dependency and merge it right away.

But what to do, if you encounter a merge conflict in `composer.lock` when rebasing? Resolve it with the version from master, so you will have changes only in `composer.json` (the newly added package). And then run `composer update --lock`, which will to update the `composer.lock` file with changes from `composer.json`. Now you can stage the updated  `composer.lock` and continue with the rebase.

## Tip #10: Know the difference between `require` and `require-dev`
It is important to be aware of the difference between `require` and `require-dev` blocks.

Packages which are required to run the application or library should be defined in `require` (e.g. Symfony, Doctrine, Twig, Guzzle, …). If you are creating a library, be careful about what you put to `require`. Because each dependency from this section is also a dependency of the application, which uses the library.

Packages necessary for developing the application (or library) should be defined in `require-dev` (e.g. PHPUnit, PHP_CodeSniffer, PHPStan).


## Tip #11: Update dependencies safely

I guess we can agree on the fact that dependencies should be updated regularly. What I want to discuss here is that dependencies updating should be explicit and deliberate, not done just by-the-way with some other work. If you refactor something and at the same time update some library, you can't easily tell if the app was broken by the refactoring or by the update.

You can use `composer outdated` command to see what dependencies can be updated. It is a good idea to include `--direct` (or `-D`) switch to list only dependencies specified in `composer.json`. There is also a `-m` switch to list only minor version updates.

**For each outdated dependency follow these steps**:

1. Create a new branch
2. Update the dependency version in `composer.json` to the latest one
3. Run `composer update phpunit/phpunit --with-dependencies` (replace `phpunit/phpunit` with the library you are updating)
4. Check the CHANGELOG in the library repository on Github to see if there are any breaking changes. If so, update the application
5. Test the application locally (If you are using Symfony, you can find deprecation warnings in the Debug Bar)
6. Commit the changes (`composer.json`, `composer.lock` and anything else what was necessary for new version to work)
7. Wait for the CI build to finish
8. Merge and deploy

Sometimes it makes sense to update more dependencies at once, e.g. when you are updating Doctrine or Symfony. In this case you can list them all in update command:

```bash
composer update symfony/symfony symfony/monolog-bundle --with-dependencies
```

Or you can use a wildcard to update all dependencies from a specific namespace:

```bash
composer update symfony/* --with-dependencies
```

I know that this all sounds tedious, but you will probably update dependencies just occasionally, so it is worth the extra safety.

One shortcut which is acceptable to make is to update all `require-dev` dependencies at once (if they do not require changes in the code, otherwise I would suggest using separate branches for easier code review).

## Tip #12: You can define other types of dependencies in `composer.json`
Apart from defining libraries as dependencies, you can also define other things there.

You can define, which PHP versions your application/library supports:
```json
"require": {
	"php": "7.1.* || 7.2.*",
},
```

You can also define which extensions are required for the application/library. It is super-useful when you are trying to dockerize your application or your new colleague is setting-up the application for the first time.

```json
"require": {
	"ext-mbstring": "*",
	"ext-pdo_mysql": "*",
},
```
(You should use `*` for the extensions version as [they may be a bit inconsistent](https://getcomposer.org/doc/01-basic-usage.md#platform-packages)).


## Tip #13: Validate the `composer.json` during the CI build
`composer.json` and `composer.lock` should be always kept in sync. Therefore, it is a good idea to have an automatic check for it. Just add this as a part of you build script and it will ensure that `composer.lock` is in sync with `composer.json`:

```bash
composer validate --no-check-all --strict
```

## Tip #14: Use a Composer plugin in PHPStorm

There is a [composer.json plugin for PHPStorm](https://plugins.jetbrains.com/plugin/7631-php-composer-json-support). It adds autocompletion and some validations when changing `composer.json` manually.

If you are using other IDE (or just a code editor), you can setup validation against [its JSON schema](https://getcomposer.org/schema.json).

## Tip #15: Specify the production PHP version in `composer.json`

If you are like me and you are sometimes [running pre-released PHP versions locally](https://blog.martinhujer.cz/php-7-2-is-due-in-november-whats-new/), you are in risk of updating the dependencies to a version that won't work in production. Right now, I'm using PHP 7.2.0 which means, that I can install libraries, that would not work on 7.1. As the production is running 7.1, the installation would fail there.

But no need to worry, there is an easy way out. Just specify the production PHP version in `config` section of `composer.json`:

```json
"config": {
	"platform": {
		"php": "7.1"
	}
}
```

Don't confuse it with `require` section, which behaves differently. Your application may be able to run on 7.1 or 7.2 and at the same time specify 7.1 as a platform (which means that the dependencies will be always updated to a version compatible with 7.1):

```json
"require": {
	"php": "7.1.* || 7.2.*"
},
"config": {
	"platform": {
		"php": "7.1"
	}
},
```

## Tip #16: Using private packages from self-hosted Gitlab
It is recommended to use `vcs` as a repository type and the Composer should determine the proper way of fetching the packages. For example, if you are adding a fork from Github, it would use its API to download the .zip file instead of cloning the whole repository.

But it is more complicated for a private Gitlab installation. If you use `vcs` as a repository type, Composer will detect that it is a Gitlab installation would try to download the package using the API (which requires an API key. I didn't want to set it up, so I settled for this setup (which uses SSH for cloning):

First specify the repository with the type `git`:

```json
"repositories": [
	{
		"type": "git",
		"url": "git@gitlab.mycompany.cz:package-namespace/package-name.git"
	}
]
```

Then use the package as you would have normally:
```json
"require": {
	"package-namespace/package-name": "1.0.0"
}
```

## Tip #17: How to temporarily use a branch with bugfix from fork
If you find a bug in some public library and you fix it in your fork on Github, you need to install the library from this repository instead of the official one (until the bugfix is merged and fixed version is released).

It can be done easily with [inline aliasing](https://getcomposer.org/doc/articles/aliases.md#require-inline-alias):

```json
{
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/you/monolog"
        }
    ],
    "require": {
        "symfony/monolog-bundle": "2.0",
        "monolog/monolog": "dev-bugfix as 1.0.x-dev"
    }
}
```

You can test the bugfix locally before pushing it by [using `path` as a repository type](https://getcomposer.org/doc/05-repositories.md#path).


## Update 2018-01-08:
After publishing the article, I got suggestions for several more tips. So here they are:

## Tip #18: Install prestissimo to speed up package installation

There is a Composer plugin [hirak/prestissimo](https://github.com/hirak/prestissimo) which speeds up dependencies installation by downloading them in parallel.

And the best thing? You only need to install it once, globally and it will work automatically for all projects:

```bash
composer global require hirak/prestissimo
```


## Tip #19: Test your version constraints if you are not sure

Writing correct version constraints may sometimes be tricky even after reading [the documentation](https://getcomposer.org/doc/articles/versions.md#writing-version-constraints).

Luckily, there is a [Packagist Semver Checker](https://semver.mwl.be/) where you can check which versions match the specified constraint. Instead of only analysing the version constraint, it downloads the data from Packagist to display the actual released versions.

See [the result for `symfony/symfony:^3.1`](https://semver.mwl.be/#?package=symfony%2Fsymfony&version=%5E3.1&minimum-stability=stable).


## Tip #20: Use authoritative class map in production

You should [generate authoritative class map](https://getcomposer.org/doc/articles/autoloader-optimization.md#optimization-level-2-a-authoritative-class-maps) in production. It will speed-up class loading by including everything in class-map and skipping any filesystem checks.

You can do it by running this as a part of your production build:

```bash
composer dump-autoload --classmap-authoritative
```

## Tip #21: Configure `autoload-dev` for tests

You don't want to include test files in production class map (because of the file size and memory). It can be done by configuring the `autoload-dev` (similarly to `autoload`):

```json
"autoload": {
	"psr-4": {
		"Acme\\": "src/"
	}
},
"autoload-dev": {
	"psr-4": {
		"Acme\\": "tests/"
	}
},
```

## Tip #22: Try Composer scripts

Composer scripts are a lightweight tool to create build scripts. I have written [a separate article about them](/have-you-tried-composer-scripts/).


## Tip #23: Use Composer CLI to remove packages
> added on April 23th 2019

The best way to remove the package from `composer.json` is by using a Composer command line interface. In the following example I'm removing `phpoffice/phpspreadsheet` because it is not needed in the project anymore. You can see that its sub-dependencies which are no longer necessary are automatically uninstalled as well:

```bash
> composer remove phpoffice/phpspreadsheet

Package operations: 0 installs, 0 updates, 3 removals
  - Removing phpoffice/phpspreadsheet (1.6.0)
  - Removing markbaker/matrix (1.1.4)
  - Removing markbaker/complex (1.4.7) 
```

This is much better approach than removing it manually from `composer.json` and running `composer update`. That would make unrelated changes to the installed dependencies (see Tip #11 for more information on how to update the dependencies safely).


## Tip #24: Do not use code from transitive dependencies
> added on April 23th 2019

Imagine that you have required some library (e.g. _AcmePayment_) which in turn requires `nette/utils` package (`nette/utils` is called a _transitive_ dependency in this case - it is a dependency of a dependency).

Because `nette/utils` package provides lot of helper functions, you start to use them. But then you stopped using the _AcmePayment_ library and removed it from the project. In an unexpected turn of events, `nette/utils` was also removed, because it wasn't required in the project (from the Composer's point of view).

The solution is to include all libraries you use in the `require` section of the `composer.json`. There is a tool called [ComposerRequireChecker](https://github.com/maglnet/ComposerRequireChecker) which should be able to detect the missing ones.
  

## Conclusion 

If you disagree with some of the tips, I would be happy if you can describe why in the comments (don't forget to put the tip number there).
