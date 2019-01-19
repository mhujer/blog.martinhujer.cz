---
title: HipHop for PHP
showPhpTrainingAd: true
---

**Update 1/2019:** HHVM už je dávno jinde než PHP, takže ho už nedává smysl používat. Zkuste radši [PHPStan](https://github.com/phpstan/phpstan).

----

Dalším zajímavým nástrojem, který by bylo možné zařadit do [kontinuální integrace](/bp/), je [HipHop for PHP](https://github.com/facebook/hhvm) vyvinutý společností Facebook Inc. Jeho primárním účelem je převod skriptů v jazyce PHP do jazyka C++, nicméně je možné ho využít pro statickou analýzu (umí odhalit chyby, které jiné nástroje neodhalí). A případně ho zařadit jako jeden z nástrojů kontinuální integrace.

Instalace nástroje
-----------------------------
Nástroj je nutné zkompilovat ze zdrojových kódů, nejsou k dispozici instalační balíčky. Zároveň je nutné nejdříve zkompilovat několik knihoven třetích stran. K dispozici jsou postupy na [wiki projektu na githubu](https://github.com/facebook/hhvm/wiki/_pages), zvolte ten odpovídající vaší linuxové distribuci.

Já jsem instaloval na [VirtualMasteru](https://www.virtualmaster.com/virtualmaster/referral/6yv98), takže jsem zvolil [návod pro Ubuntu 10.04](https://github.com/facebook/hhvm/wiki/Building-and-installing-on-Ubuntu-10.04-LTS)

Pokud si chcete HipHop jen vyzkoušet, tak je zbytečné trávit čas kompilací. Proto jsem na VirtualMasteru vytvořil [veřejnou šablonu s připraveným HipHop for PHP](https://www.virtualmaster.com/cs/images/2555)
 
Použití nástroje
----------------------
Poté, co máme nástroj nainstalovaný (buď podle postupu a nebo vytvořením serveru z image výše), nastavíme potřebné cesty:

~~~bash
cd /root/hiphop/
export HPHP_HOME=`/bin/pwd`
export HPHP_LIB=`/bin/pwd`/bin
~~~

A zkusíme spustit analýzu. Já jsem zkoušel Zend Framework 1.

~~~bash
cd /tmp
svn export http://framework.zend.com/svn/framework/standard/trunk/library zf1
cd zf1
/root/hiphop/hiphop-php/src/hphp/hphp -t analyze --input-dir ./Zend/ --include-path ./
~~~

Výstup je poté uložen v `/tmp/hphp_AFDvIh/CodeError.js` (resp. v podobně nazvaném adresáři).

Když jsem prošel výstup z kontroly ZF1, tak jsem postupně přidal 12 issues do ZF - od ZF-12225 do ZF-12236

Závěrem
---------
Pokud chcete ztratit iluze o svých zdrojácích, zkuste na ně spustit HipHop :)
