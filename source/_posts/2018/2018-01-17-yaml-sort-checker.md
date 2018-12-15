---
title: Keep your YAML files sorted with YAML sort checker
showPhpTrainingAd: true
---

Last year I've created a PHP tool [YAML file sort checker](https://github.com/mhujer/yaml-sort-checker) that checks that YAML files in project are sorted alphabetically.

## Why should you sort everything alphabetically?

You can prevent unnecessary merge conflicts if you keep everything sorted. You should sort not only YAML files, but also `composer.json` (`require`, `require-dev` and `scripts` sections), `use` in PHP classes and any PHP array where order is not significant.

Typical situation is when two developers register a new service in `services.yml`. If they both add it to the end, it will inevitably lead to a merge conflict. However, when the services are alphabetically sorted, the probability of merge conflict is much lower, because the services will be probably added to different places and therefore won't clash.

(This specific example got better with new DI improvements in recent Symfony versions, where you don't need to register that many services manually)

**Tip:** You can use AlphabeticallySortedUses sniff from [Slevomat Coding Standard](https://github.com/slevomat/coding-standard#slevomatcodingstandardnamespacesalphabeticallysorteduses-) to check that `use` in PHP class are sorted.


## Installation

YAML file sort checker is installed through Composer: 

```bash
composer require --dev mhujer/yaml-sort-checker
```

## Configuration

You have to create a configuration file `yaml-sort-checker.yml` in the project root directory. Then list all files that should be checked in it.

The initial config may look like this:

```yaml
files:
    app/config/services.yml:
        depth: 2

    yaml-sort-checker.yml:
```

It checks `services.yml` and itself. The `services.yml` will be validated only two levels deep.

Sometimes you may want to exclude some keys from validation. It can be accomplished by using `excludedKeys` option. You can see how the exclusion works in the example bellow: 

```yaml
files:
    app/config/config_prod.yml:
        excludedKeys:
            monolog:
                handlers:
                    main:
                        - type
                    nested:
                        - type

    app/config/config_test.yml:
        excludedKeys:
            0: imports
```


## Run the checker
After you have created a configuration file, you can run the checker:

```bash
vendor/bin/yaml-sort-checker
```

## PHPStorm integration
It is possible to integrate YAML sort checker with PHPStorm using File Watchers. It is described in the [project README on github](https://github.com/mhujer/yaml-sort-checker#phpstorm-integration) so I won't duplicated it here.

## Conclusion
It is a good practice to keep most of the things sorted alphabetically to prevent merge conflicts. However, it can be a tedious task to do manually. Luckilly the YAML files can be automatically checked with [YAML file sort checker](https://github.com/mhujer/yaml-sort-checker).
