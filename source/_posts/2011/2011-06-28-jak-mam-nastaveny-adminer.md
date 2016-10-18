---
title: Jak mám nastavený Adminer?
---

Pro práci s MySQL databází používám [Adminer](https://www.adminer.org/) a abych se nemusel pokaždé přihlašovat, využívám možnost napsat si [vlastní minirozšíření](https://www.adminer.org/cs/extension/). Mým cílem bylo mít Adminer o nejsnáze přístupný pro lokální databáze.

Do souboru hosts jsem si proto [přidal](/editace-souboru-hosts/) doménu `m`:
~~~
127.0.0.1 m
~~~

V `htdocs` mám složku `adminer`, kam mám nasměrovaný virtualhost:
~~~
<VirtualHost *:80>
    ServerName m
    DocumentRoot /xampplite/htdocs/adminer/
</VirtualHost>
~~~

A ve složce mám soubory `adminer-3.2.2.php`, `adminer.css` a `index.php`, který obsahuje rozšíření:
~~~php
<?php
//v adrese musí být ?username= aby bylo možné přihlášení bez zadávání hesla
if ($_SERVER['REQUEST_URI'] == '/') {
    header('Location: http://m/?username=');
}   

function adminer_object() {
    class AdminerLocalhost extends Adminer {
        function credentials() {
            //výchozí přihlašovací údaje pro lokální databátzi
            return array('localhost', 'root', '');
        }
    }
    return new AdminerLocalhost;
}

include './adminer-3.2.2.php';
~~~

Díky tomu stačí v prohlížeči zadat `m` a hned vidím výpis databází.


**Update 2015-06-14**: Teď používám nadstavbu od dg, s [autologinem v mém forku](https://github.com/mhujer/adminer-custom).
