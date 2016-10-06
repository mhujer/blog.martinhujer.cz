---
title: PHP_CodeBrowser 1.0.3 a změna PEAR kanálu
---

Pro reportování chyb z PHP_CodeSniffer, PHPCPD a PMD jsem [při nasazení kontinuální integrace](/bp/) použil [PHP_CodeBrowser](https://github.com/Mayflower/PHP_CodeBrowser/). Nicméně, nelíbilo se mi, že jsou v reportu vypsané i soubory, které žádné chyby neobsahují - pak se hůře hledají ty, ve kterých chyby jsou.

[Doprogramoval](https://github.com/Mayflower/PHP_CodeBrowser/pull/12) jsem tedy možnost takové soubory skrýt.

~~~bash
--excludeOK    Exclude files with no issues from the report
~~~

Před pár dny [vyšla verze 1.0.3](https://twitter.com/s_bergmann/status/194700069214228480), která už vylepšení obsahuje. Zároveň došlo ke změně PEAR kanálu pro instalaci balíčku.

Pro upgrade je tedy potřeba starou verzi nejdříve odinstalovat:
~~~bash
pear uninstall phpunit/PHP_CodeBrowser
~~~

Pak přidat nový kanál a nainstalovat PHP_CodeBrowser z něj:
~~~bash
pear channel-discover pear.phpqatools.org
pear install phpqatools/PHP_CodeBrowser
~~~

A do build skriptu stačí přidat přepínač `--excludeOK`, takže příkaz pro generování pomocí phpcb bude vypadat takto:
~~~bash
phpcb --log ${project.basedir}/build --source ${project.basedir} --output ${project.basedir}/build/code-browser --excludeOK
~~~

Používáte také PHP_CodeBrowser nebo si v Jenkinsu vystačíte s Violations?
