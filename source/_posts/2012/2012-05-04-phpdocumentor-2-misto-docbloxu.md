---
title: phpDocumentor 2 místo DocBloxu
---

V [bakalářce](/bp/) jsem popisoval rozhodování mezi různými nástroji na generování PHP API dokumentace v rámci kontinuální integrace. Teď se výběr zjednodušil, proto z nástroje DocBlox se [stal se phpDocumentor 2](http://www.docblox-project.org/2012/03/docblox-is-unmasked-it-is-really-phpdocumentor-2/). Sice se v článku mluví o [merge", ale ve skutečnosti jde o "přejmenování](https://github.com/phpDocumentor/phpDocumentor2/commit/4d2dd3a36c4df21eaf2f254b0ca2ef281995e254) s tím, že původní phpDocumentor se přestane vyvíjet.

Nainstalovat ho můžeme pomocí:
~~~bash
pear channel-discover pear.phpdoc.org
pear install phpdoc/phpDocumentor-alpha
~~~

Kromě výchozí šablony jsou k dispozici i nějaké další, ale [nešly mi doinstalovat starým postupem](https://github.com/phpDocumentor/phpDocumentor2/issues/452) tak jako u DocBloxu, ale musel jsem přes PEAR:

~~~bash
pear install phpdoc/phpDocumentor_Template_checkstyle
pear install phpdoc/phpDocumentor_Template_zend
~~~

Přehled všech dostupných šablon najdete na [webu](https://pear.phpdoc.org/)

Generování funguje pořád stejně, jen je potřeba vyměnit `docblox` za `phpdoc`:
~~~bash
phpdoc -f phpdoc01.php
phpdoc -f phpdoc01.php --template checkstyle
~~~

Na výchozí šabloně mě překvapilo, že v detailu třídy [nikde není vypsané](https://github.com/phpDocumentor/phpDocumentor2/issues/453) její jméno. Holt je to ještě alpha.

Až bude phpDocumentor 2 stabilní, tak určitě bude dobré znovu zvážit výběr nástroje na generování API dokumentace. Přechod z DocBloxu je jasný, ale pokud se objeví i šablona podobná té v ApiGenu, tak bych kvůli cachování analyzovaných souborů (zrychlení oceníte hlavně u větších projektů) zvážil přechod na phpDocumentor.

Čím generujte API dokumentaci v PHP vy?
