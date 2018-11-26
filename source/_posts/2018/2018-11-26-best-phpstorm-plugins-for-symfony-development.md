---
title: Best PhpStorm plugins for Symfony development
short: List of my favourite PhpStorm plugins for developing Symfony applications and two usefull tips for Symfony plugin configuration. 
---

I've been using PhpStorm for quite a while and I'm still surprised now and then when it suggests an auto-completion for something I thought that's not possible. 

But there are still many things - usually framework- or library-specific - that PhpStorm cannot do on its own. But there are plugins that can step in place and do the magic for specific framework or library.

## PHP Annotations
[PHP Annotations plugin](https://plugins.jetbrains.com/plugin/7320-php-annotations) analyses the classes which can be used as annotations and provides code-completing when writing annotations - e.g. Doctrine ORM mappings.

![PHP Annotations plugin](/data/2018/2018-11-26-best-phpstorm-plugins-for-symfony/php-annotations.gif)

## PHP Toolbox
[PHP Toolbox plugin](https://plugins.jetbrains.com/plugin/8133-php-toolbox) was extracted from Symfony plugin and provides better auto-completion for several libraries (PHPUnit, Behat, Doctrine, Twig etc.) 

## Symfony Plugin
Both PHP Annotations and PHP Toolbox are best used together with the [Symfony Plugin](https://plugins.jetbrains.com/plugin/7219-symfony-plugin). This plugin provides auto-completion for anything in Symfony you can imagine. It analyses the DI container code, so it can suggest the services when you call `$container->get()`. It provides various auto-completions in the YAML config files. Apart from that, it can handle lots of Form, Twig and Routing auto-completions. You can click through from controller to template, from the name of the route to the controller where it is defined. It analyses translation files and provides the completion for the translations when calling the translate function or using `trans` filter in Twig.

### How to use custom template directory with the Symfony plugin?
If you have templates in a custom namespace and directory - e.g. configured in `config/packages/twig.yaml`, the auto-completion in controllers or other templates won't work for those, because the Symfony plugin can't detect them.

```yaml
twig:
    paths:
        '%kernel.project_dir%/src/App/Resources/templates': App
        '%kernel.project_dir%/src/Admin/Resources/templates': Admin
``` 

 You can fix it by manually adding them in PhpStorm Settings (PHP -> Symfony -> Twig/Template). But each of the developers must do it himself. Unless you put in into `ide-twig.json` in a project root:

```json
{
    "namespaces": [
        {
            "namespace": "App",
            "path": "src/App/Resources/templates"
        },
        {
            "namespace": "Admin",
            "path": "src/Admin/Resources/templates"
        }
    ]
}
``` 

This file is loaded by Symfony plugin and the namespaces and paths will be configured automatically (you can check it in the Settings).

### Enable translation keys auto-completion for custom translation methods
When you create a custom method that accepts translation key, the PhpStorm won't do the auto-completion for it, because it does not know that the parameter is a translation key. Luckily, the Symfony plugin provides an easy way to let it know of the type of the parameter. Have a look at the following example:

```php
<?php
class TitleManager
{
    /**
     * @param string $label #TranslationKey
     */
    public function addItem(string $label): void
    {
    	// ...
    }
}

$titleManager = new TitleManager();
$titleManager->addItem('app.products.name'); // the translation key auto-completion will work here 
```

You can see that I added `#TranslationKey` to the method parameter PHPDoc. It is something they call [Hash Tags](https://symfony2-plugin.espend.de/extension/method_parameter.html#hash-tags) in Symfony plugin. It allows you to define the _type_ of the parameter, so the plugin can provide the auto-completion. Apart from `TranslationKey`, you can also use `Entity`, `Service`, `FormType`, `Template`, `Route`, `Class`, `TranslationDomain`, `FormOption` or `Interface` (don't forget to prefix them with `#`).

## PHPUnit Enhancement
[PHPUnit Enhancement plugin](https://plugins.jetbrains.com/plugin/9674-phpunit-enhancement) provides smart autocomplete for mock creation. It also handles refactoring - if you rename a method which is mocked, it is correctly renamed in the string in tests.

![PHPUnit Enhancement plugin](/data/2018/2018-11-26-best-phpstorm-plugins-for-symfony/phpunit-enhancement.gif)

## PHP composer.json support
[PHP composer.json support plugin](https://plugins.jetbrains.com/plugin/7631-php-composer-json-support) adds `composer.json` auto-complete and validation. It also displays which version of each packages is installed (from the data in `composer.lock`)  

## Php Inspections (EA Extended)
[Php Inspections (EA Extended)](https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-) is a plugin that adds a lot of inspections for statically analyzing the PHP code you are writing and suggesting fixes and improvements.

## Twig Support
[Twig Support](https://plugins.jetbrains.com/plugin/7303-twig-support) is an official plugin from Jetbrains bundled with PhpStorm, so just enable it in the settings and you are done.

## .env files support
Symfony 4 uses `.env` files for configuration parameters (instead of `parameters.yml`) and [.env files support plugin](https://plugins.jetbrains.com/plugin/9525--env-files-support) provides syntax highlighting for the `.env` file.

## .ignore
[.ignore plugin](https://plugins.jetbrains.com/plugin/7495--ignore) provides syntax highlighting and path auto-completion for `.gitignore` (and other ignore files). It also automatically changes the color of the ignored files in the Project File Tree to gray.


## Conclusion
I can't imagine using PhpStorm for Symfony development without those plugins. They save me time and prevent mistakes by providing the magic auto-completion. 
 
Do you use some other useful plugins? Please let me know in the comments.  
