---
title: Jaký byl Rockaway AWS Hackaton 2015?

---

V pátek a v sobotu jsem se zúčastnil [Rockaway AWS Hackatonu](http://hackathon.rockaway.cz/) v [Impact Hubu](http://www.hubpraha.cz/) v Praze. Akce měla ukázat vývojářům, kolik práce s nasazováním a škálováním aplikace je možné ušetřit použitím AWS (Amazon Web Services) technologií.

Na výběr byla hromada témat, nicméně nakonec jsme se dali do týmu s [Tomášem](http://www.tomasfejfar.cz/) a zvolili si vlastní téma. Témata na výběr byla totiž hodně programovací, takže bychom velkou část hackatonu strávili vývojem aplikace a jen malou část zkoumáním AWS. Místo toho jsme využili hackaton k tomu, že jsme v AWS rozjeli [Shopio](https://www.shopio.cz/) (e-shopové řešení, které vyvíjíme ve w3w).

<img src="/data/2015/2015-10-21-jaky-byl-rockaway-aws-hackaton-2015/selfie.jpg" width="600" alt="Selfie ze závěrečné prezentace">

_Selfie ze závěrečné prezentace_


Než se pustím do popisu technologií, které jsme vyzkoušeli, tak bych rád poděkoval:

 - [Rockaway](https://www.rockawaycapital.com/en/) za zorganizování akce
 - Mentorům za to, že i po probdělé noci byli ochotni vysvětlovat, jak co v AWS funguje
 - Hubu za servis

A teď už k samotným AWS technologiím, které jsme vyzkoušeli.

Jak si ukládat API klíče?
===========================
V případě použití AWS není potřeba mít API klíče v kódu aplikace. Stačí si v profilu vytvořit soubor `~/.aws/credentials` a do něj je vložit ve struktuře podobné INI souboru. Viz [dokumentace](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-config-files).

~~~ini
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
~~~

SDK je potom automaticky používá. Na serverech jsou poté přístupné prostřednictvím ENV proměnných (aspoň myslím, jen jsme serveru povolili přístup do S3 a nemuseli jsme nikde kopírovat API klíče).

AWS má dobře řešené nastavování oprávnění, takže konkrétní API klíče mohou sloužit jen pro zápis do S3. Nebo pro jinou jednoúčelovou věc. Nestane se vám potom (jako se to povedlo i jednomu týmu na hackatonu), že si klíče používané jen pro S3 nahrajete na github a robot s jejich pomocí spustí desítky EC2 instancí pro minování bitcoinů - protože tomu konkrétnímu klíči dáte oprávnění k čemukoliv ([článek z ledna na theregister.co.uk](http://www.theregister.co.uk/2015/01/06/dev_blunder_shows_github_crawling_with_keyslurping_bots/))

Soubory do S3
================
Aplikace v AWS (a koneckonců ani jinde), by neměla ukládat data přímo do své adresářové struktury na svůj server. V AWS je na to k dispozici neomezené úložiště S3, které je účtováno podle objemu uložených dat a datových přenosů.

Pro PHP je k dispozici [AWS SDK for PHP](https://aws.amazon.com/sdk-for-php/), které umí vytvořit tzv. [stream wrapper](https://docs.aws.amazon.com/aws-sdk-php/v3/guide/service/s3-stream-wrapper.html). Vytvoří virtuální souborový protokol a pak je možné pracovat se soubory pomocí standardních souborových funkcí, takto:
~~~php
file_put_contents('s3://bucket/jmeno-souboru.jpg', $data)
~~~

Integrace do Shopia byla jednoduchá, změnil jsem cestu, kam se ukládají soubory a bylo to.

Generování náhledů Lambdou
==========================
Na webu se samozřejmě nepoužívají obrázky nahrané uživateli, ale vygenerované zmenšené náhledy. Na to jsem využil [Lambdu](https://aws.amazon.com/lambda/) (novinka na re:invent 2014). Jde o obrovsky škálovatelnou platformu pro spouštění skriptů. Funguje to docela jednoduše - vytvoříte vlastní funkci (lambdu) v Node.js (Javě, Pythonu) a nastavíte ji, aby poslouchala na události PutObject v daném S3 bucketu. Takže se do jednoho bucketu uploadne obrázek, S3 pošle eventu Lambdě, ta si obrázek stáhne, vygeneruje náhledy a uloží je do druhého S3 bucketu. Hrozně super věc, umí totiž prostřednictvím ApiGateway (další kus AWS) fungovat jako běžné API. Mám o ní rozepsaný samostatný článek.

CDN CloudFront
=============
Obrázky a podobné statické soubory se uživatelům běžně neservírují z S3, ale prostřednictvím CDN. Amazon nabízí svou CDN pod názvem CloudFront a aktivace v AWS administraci zabrala jen chvilku. Poté je potřeba počkat, než se váš S3 bucket rozdistribuuje po světě a pak stačí na webu změnu URL, odkud se načítají obrázky. CloudFront standardně nabízí https na jejich doméně s jejich certifikátem, případně je možné použít vlastní (doménu i certifikát).

Databáze na RDS
==============
V AWS se na provoz relačních databází používá služba RDS. Je možné si vybrat MySQL, MariaDB, Oracle, SQL Server, PostgreSQL a nebo Auroru (MySQL kompatibilní cloudová DB od Amazonu). Výhodou je, že se nemusíte starat o server, kde DB běží, snadno si zapnete replikaci atd.

Web na EC2
===========
Samotný web jsme spustili na EC2 (víceméně běžné VPS) na nginxu a php-fpm. Výhodou AWS je snadno vytvořitelný image pro spouštění dalších takových serverů. Ale samozřejmě je nejlepší automatizovaná instalace (ve w3w používáme SaltStack, obdobou je Puppet nebo Chef). AWS pro orchestraci serverů nabízí OpsWorks (kompatibilní s Chefem). Během hackatonu na to nebyl čas, pro produkční nasazení by to bylo potřeba.

Super věc je [Elastic Load Balancing](https://aws.amazon.com/elasticloadbalancing/), který rozděluje zátěž mezi více EC2 instancí. Jde totiž propojit s AutoScalingem, kde jde nastavit automatické spouštění a vypínání dalších EC2 instancí podle zátěže. Takže v rámci hackatonu jsme nastavili pravidlo na load na 50% a spustili na web [siege](https://www.joedog.org/siege-home/) AWS postupně spouštělo další instance až do maximálního nastaveného počtu. A po vypnutí "útoku" (tedy po vykrytí nečekané návštěvnosti), je zase postupně povypínalo.

DNS v Route 53
===============
Pro testování jsme u jedné domény nastavili jako nameservery Route 53 z AWS. Výhoda správy DNS záznamů v AWS je, že je možné je nasměrovat na alias Elastic Load Balanceru, takže předpokládám, že v případě nějakých problémů si to samí přehodí, kam bude potřeba


A už to běží
=========
Tím jsme měli víceméně hotovo, a oproti stávajícím VPS to pěkně automaticky škálovalo. A byl tedy čas na vychytávky, které se v AWS dají udělat snadněji, než bez něj. Já jsem si hrál s SES a přijímáním e-mailů, Tomáš zkoušel SNS (messaging service).

SES pro příjem e-mailů
=====================
SES je primárně určený pro odesílání e-mailů (podobně jako Mandrill, Mailgun, Sendgrid). Ale kromě toho umí e-maily i přijímat a nějak s nimi naložit. Třeba je umí uložit do S3. A na S3 události může poslouchat lambda, která ho stáhne, naparsuje a vloží do databáze jako zprávu z kontaktního formuláře. Trvá to 5-10s od chvíle, co odešlu e-mail. I se zdrojákama to bude v tom článku o Lambdě, co mám rozdělaný.  Bez AWS by to bylo mnohem víc práce. Musel bych mít nějaký e-mail, ten bych cronem přes IMAP vybíral a zpracovával.

Shrnutí
=========
Hackaton byl super. Jsem rád, že jsem se zúčastnil. Rozhodnutí neprogramat novou věc a jen nasadit hotovou hodnotím pozitivně, protože jsme si toho z AWS vyzkoušeli hrozně moc. Pokud se ještě vejdete, tak se [přihlašte](http://hackathon.rockaway.cz/) na Hackaton v Brně nebo Ostravě.

**[Pár fotek z Hackatonu](https://www.facebook.com/media/set/?set=a.10208071550925750.1073741866.1208864474&type=1&l=e976a6c01e)**

A těšte se na článek o Lambdě, je to fakt supr věc :-)
