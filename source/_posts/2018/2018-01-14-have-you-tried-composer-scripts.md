---
title: Have you tried Composer Scripts? You may not need Phing.
---

Phing is a great tool (I'm using it as well), but in this article, I want to show you that some projects may not need it. Composer contains a powerful feature called "[Scripts](https://getcomposer.org/doc/articles/scripts.md)", which can be used to create a simple build script.

> If you haven't read it yet, I suggest that you read my article [17 Tips for Using Composer Efficiently](/17-tips-for-using-composer-efficiently/) before reading this one.

## Creating a build script for launching PHP_CodeSniffer

Let's say that you have installed PHP_CodeSniffer and you run it with this command:

```bash
vendor/bin/phpcs --standard=PSR2 src
```

You probably want your colleagues and CI server to run it with the same parameters. To do so, you need to store it somewhere. You can either create a `build.xml` for Phing or put it in a bash script (and batch file to cover Windows). Or you can leverage the power of Composer scripts.

Put the command to the `composer.json` file with all its parameters:

```json
  "scripts": {
      "phpcs": "phpcs --standard=PSR2 src"
  }
```

And run it this way:

```bash
# either explicitly:
composer run-script phpcs

# or via shortcut:
composer phpcs
```

## Tip: Use alias for running Composer
If you are launching Composer by typing `composer` (or even `php composer.phar`) every time, you may want to save time by creating an alias for it.

On Windows, you need to create a `.cmd` file in a directory which is in the system PATH. I've created `c:\dev\php\x.cmd` with this content (`%*` passes through all the parameters):
```bash
php c:\devweb\php\composer.phar %*
```

On Linux, you can add an alias to `~/.bashrc`:
```
alias x="composer"
```

Now you can run Composer just by typing `x` and a command (e.g. `x phpcs`).


## Tip: Don't type whole Composer command name
Because Composer CLI is powered by Symfony Console, you can save some characters on unambiguous commands. Instead of writing `composer update`, it is enough to write `composer up` (or only `x up` if you also applied the previous tip) 



## Creating more complex build script

Let's start with an example:
```json
  "scripts": {
      "ci": [
          "@phpcs",
          "@test"
      ],
      "phpcs": "phpcs --standard=PSR2 src",
      "test": "phpunit"
  }
```

I've added a new script called `test` which just launches PHPUnit with default configuration.

The `ci` script is more interesting. It is not an actual script, but a meta-script that references several other scripts. The referenced scripts are prefixed by `@`. This way, you can create more complex scripts without duplication.

## Launching Composer or PHP from scripts

You can use the `@composer` and `@php` commands to launch the same Composer or PHP executable that is running the script.

For example you may want to validate the `composer.json` file during CI build:

```json
  "scripts": {
      "ci": [
          "@composer validate --no-check-all --strict",
          ...
      ]
  }
```

Or you want to use YAML validation that is available as a Symfony Console command:

```json
"scripts": {
    "yamllint": "@php bin/console lint:yaml app"
}
```


## Don't forget to document the custom scripts

You can use the `scripts-descriptions` section to document what custom scripts do:

```json
"scripts-descriptions": {
    "phpcs": "Checks that the application code conforms to coding standard",
    "test": "Launches the preconfigured PHPUnit"
}
```


## Configure timeout for long-running scripts

If you have some long-running scripts, you should configure the process timeout. It defaults to `300` which means that Composer will terminate the script after 300s. You can either set a specific time limit in seconds, or `0` for unlimited.

Timeout can be configured in the ENV variable `COMPOSER_PROCESS_TIMEOUT`:

```bash
export COMPOSER_PROCESS_TIMEOUT=600
```

Or by adding `--timeout=0` argument when running the script:

```bash
composer phpunit --timeout=3600
```

Or in `config` section of `composer.json`:

```json
"config": {
	"process-timeout": 0
}
```

## Tips for the Scripts:

1. You can use `composer run-script --list` to list custom scripts.

2. Be careful not to create a script with a name conflicting with the existing Composer command. Composer throws a warning on every run when such a script is present in `composer.json`.

3. You don't have to update `composer.lock` when adding or changing the scripts, because they are not included in `composer.lock` at all.

4. You can even [call PHP callbacks from scripts](https://getcomposer.org/doc/articles/scripts.md#defining-scripts) (Static methods in classes autoloadable by Composer). But I don't recommend using them for build scripts because potential migration to other build system would be hard.
 

## When should I switch to Phing?

Composer Scripts are great for simple build scripts. But it is important to recognize the moment when the build script is so complex, that a dedicated build tool would do better.

As a rule of thumb, you shouldn't do any files / directories manipulation in Composer scripts (as it would be hard to do it Linux/Windows compatible) and switch to Phing instead.


## Conclusion

Composer scripts are a lightweight tool to create build scripts. However, it is important to know when to switch to a dedicated tool such as Phing.

Do you like them?
