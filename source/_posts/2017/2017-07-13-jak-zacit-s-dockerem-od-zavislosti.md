---
title: Jak začít s Dockerem? Od závislostí.
---

V [Drivetu](https://www.driveto.cz/) jsme začali používat Docker, ale tak trochu netradičně. Používáme ho totiž (zatím) jen na externí závislosti (Rabbit, Elastic, Cerebro, Kibana) a PHP + MariaDB máme stále nainstalované standardně.

Výhodou je, že takhle si Docker vyzkoušíme relativně bez rizika. Zjistíme, jak se chová, jestli všem funguje a podobně. Zároveň už nám bude rovnou přinášet hodnotu tím, že budeme mít všichni stejné verze a konfiguraci závislostí.

Bylo by cool mít v Dockeru všechno, ale tipuji, že zatím by nám to práci spíš přidělávalo, než šetřilo. Už třeba kvůli pomalému filesystému sdílených složek [z Windows](https://github.com/docker/for-win/issues/188) nebo [z Macu](https://github.com/docker/for-mac/issues/77). Každopádně uvidíme v budoucnu - mít celé prostředí připravené bez nutnosti instalace a konfigurace čehokoliv je lákavá představa. 

## Instalace Dockeru (na Windows)
- Musíte mít Windows 10 Pro (v Home není Hyper-V)
- V _Turn Windows features on or off_ povolte Hyper-V
- [Stáhněte si Docker](https://store.docker.com/editions/community/docker-ce-desktop-windows)
- Nainstalujte
- pomocí `docker version` ověřte, že máte nainstalováno správně

## Nastavení RabbitMQ v Dockeru
Pro nastavení používám Docker Compose, který umožňuje v jednom konfiguračním souboru definovat více služeb, které lze potom najednou spustit.

V rootu projektu vytvoříme soubor `docker-compose.yml` s následujícím obsahem (vysvětlím níže): 

```yaml
version: '3'
services:
    rabbitmq:
        image: rabbitmq:3.6.10-management
        hostname: driveto-rabbit
        ports:
            - 5672:5672
            - 15672:15672
```

- `version: '3'` na začátku souboru je verze konfiguračního souboru pro `docker-compose`.

- v `services` jsem definoval službu pojmenovanou `rabbitmq`

- použije se pro ni image `rabbitmq` z [Docker Hubu](https://hub.docker.com/_/rabbitmq/) ve verzi `3.6.10-management`. Verzi by šlo podobně jako v Composeru definovat volněji, třeba jen `3.6` (nebo dokonce `latest`). Jenže tím se připravíme o výhodu toho, že všichni používají stejné prostředí, takže se doporučuji držet co nejpřesnější specifikace verze. `-management` v určení verze znamená, že jde o image, který obsahuje předinstalovaný [Management plugin](https://www.rabbitmq.com/management.html) - webové rozhraní pro monitoring a konfiguraci RabbitMQ.

- `hostname` je důležité nastavit, protože ho RabbitMQ používá jako identifikátor při ukládání dat (je to popsané v dokumentaci na [Docker Hubu](https://hub.docker.com/_/rabbitmq/) v sekci _How to use this image_)

- `ports` definují mapování portů - `HOST:CONTAINER` - první je port na hostitelským systému, druhý je port kontejneru. V ukázce mám přesměrované dva porty: `5672` pro komunikaci s RabbitMQ a `15672` pro webové rozhraní.

## Spuštění RabbitMQ
1. v adresáři, kde je `docker-compose.yml` zavoláme `docker-compose up`
2. ten stáhne potřebné image a nastartuje kontejner s Rabbitem
3. RabbitMQ má vytvořeného uživatele `guest` s heslem `guest` a výchozí vhost `/`
4. Webové rozhraní je přístupné na `http://localhost:15672`

`docker-compose up` můžete spouštět v detached režimu přepínačem `-d`. Poběží pak na pozadí a nebude nutné nechat otevřenou konzoli. Logy z kontejnerů pak zobrazíte pomocí `docker-compose logs`. Na Windows používám jako konzoli [cmder](http://cmder.net/), kde si `docker-compose` nechávám běžet v jednom tabu na popředí, abych logy viděl průběžně.

## Závěrem
V článku ukázal, že začít s Dockerem není vůbec složité a zároveň že jde začít i jinak než zdockerizováním celé aplikace. Používáte Docker? Pro celou aplikaci nebo jen podobně jako my?

Pokud si budete Docker podle článku nastavovat a něco vám nebude fungovat, tak mi napište do komentářů nebo do kanálu `#docker` na [Slacku Pehapkaři.cz](https://pehapkari.cz/#slack).
