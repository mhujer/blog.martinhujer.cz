---
title: Návrh REST API se Symfony Rest- a ApiDoc bundle
---

V poslední době se hodně mluví o správném návrhu API a o jeho dokumentaci. V souvislosti s tím se často skloňuje český startup [apiary](http://apiary.io/), který se přesně na to zaměřuje. Apiary slouží jak k dokumentaci API, tak k jeho testování. Zároveň umí vytvořit "mock API", kdy už na základě té dokumentace jde API trochu "používat". Takže je možné například vyvíjet mobilní aplikace bez toho, aby serverová část vůbec existovala. Když jsem vymýšlel API pro mobilní aplikace [ZmapujTo.cz](http://www.zmapujto.cz/), tak jsem nejdřív apiary zkoušel, ale nebylo to tak sluníčkové, jak jsem čekal. (Ale možná jsem ho používal špatně). (*EDIT: Testoval jsem ho na podzim 2013, takže dnes už je dál a třeba by to sluníčkové už bylo*)

V tomhle článku bych chtěl ukázat, jak to jde dělat jinak a možná v dané situaci efektivněji. Předpokladem, aby popisovaný postup byl efektivnější, je, že nepotřebujete jazykovou nezávislost. Apiary má dokumentaci API v upraveném Markdown, a samotné API pak můžete implementovat v čem chcete. Tady jste víceméně dopředu rozhodnutí, že API budete implementovat v Symfony.


Jako příklad ukážu zdokumentování [Github API pro gisty](https://developer.github.com/v3/gists/), které má Apiary [jako ukázku](http://apiary.io/blueprint). Článek dále předpokládá znalost Symfony (případně hledání jinde), nebudu zde popisovat vytvoření Symfony aplikace ani základní věci.

Ukázkový kód si můžete po commitech prohlédnout [na githubu](https://github.com/mhujer/apidocdemo/commits/master)

Základní kostra ([Commit na Githubu](https://github.com/mhujer/apidocdemo/commit/253f072283f648b3e3184aaf6352d0ade0fbf16a))
-----------------------
První krokem je vytvoření běžné Symfony aplikace a nějakého Bundlu, pro API. Potom si nainstalujeme [FOSRestBundle](https://github.com/FriendsOfSymfony/FOSRestBundle), který nám pomůže s vytvářením API.

Aby se nám na `/gists` zobrazil JSON s výpisem pak už stačí vytvořit `GistsController.php` s tímto obsahem:
~~~php
<?php

namespace Mhujer\ApiDemoBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\JsonResponse;

class GistsController extends FOSRestController
{
    public function getGistsAction()
    {
        return new JsonResponse(['list' => 'foo']);
    }
}
~~~

`getGistsAction()` je nutné pojmenování, díky němu pak FOSRestBundle už rovnou ví, že na ní má routovat GET požadavek. Detailní popis, jak pojmenovávat metody je [k dispozici v dokumentaci](https://github.com/FriendsOfSymfony/FOSRestBundle/blob/master/Resources/doc/5-automatic-route-generation_single-restful-controller.md#define-resource-actions).



Zdokumentování API ([Commit na Githubu](https://github.com/mhujer/apidocdemo/commit/2426d35754eb240abefd468cca4cb47eb15e0349))
-----------------------------
Určitě jste si všimli, že zatím vlastně spíš vytváříme API a nic nedokumentujeme. Hned to napravíme. Nainstalujeme si a nastavíme [NelmioApiDocBundle](https://github.com/nelmio/NelmioApiDocBundle/) (nebudu rozepisovat detaily, jsou vidět [v dokumentaci](https://github.com/nelmio/NelmioApiDocBundle/blob/master/Resources/doc/index.md) a případně [commitu na githubu](https://github.com/mhujer/apidocdemo/commit/2426d35754eb240abefd468cca4cb47eb15e0349))

Dalším krokem je doplnění anotace `@ApiDoc` k metodě `getGistsAction()`. V článku ještě ukážu další možnosti `@ApiDoc` anotace, ale zase je nejlepší se podívat rovnou [do dokumentace](https://github.com/nelmio/NelmioApiDocBundle/blob/master/Resources/doc/index.md) na kompletní přehled možností.

~~~php
/**
 * List the authenticated user’s gists or if called anonymously, this will return all public gists:
 *
 * @ApiDoc(
 *      parameters={
 *          {
 *              "name"="since",
 *              "dataType"="string",
 *              "required"=false,
 *              "description"="A timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Only gists updated at or after this time are returned."
 *          }
 *      }
 * )
 */
~~~

Z takto rozšířeného dokumentační komentáře nám pak NelmioApiDocBundle v prohlížeči vygeneruje krásnou interaktivní API dokumentaci:

![](/data/2014/2014-06-08-navrh-rest-api-se-symfony-rest-a-apidoc-bundle/2014-06-08-apidoc01.png)

A kromě dokumentace je tam k dispozici i možnost si přímo API volání vyzkoušet
![](/data/2014/2014-06-08-navrh-rest-api-se-symfony-rest-a-apidoc-bundle/2014-06-08-apidoc02.png)

Podobně můžeme popsat i složitější metody:
~~~php
/**
 * Create a gist
 *
 * Files parameter example:
 * ```
 * {
 *   "description": "the description for this gist",
 *   "public": true,
 *   "files": {
 *     "file1.txt": {
 *       "content": "String file contents"
 *     }
 *   }
 * }
 * ```
 *
 * @ApiDoc(
 *      requirements={
 *          {
 *              "name"="files",
 *              "dataType"="hash",
 *              "description"="The keys in the files hash are the string filename, and the value is another hash with a key of content, and a value of the file contents."
 *          }
 *      },
 *      parameters={
 *          {
 *              "name"="description",
 *              "dataType"="string",
 *              "required"=false,
 *              "description"="A description of the gist."
 *          },
 *          {
 *              "name"="public",
 *              "dataType"="boolean",
 *              "required"=false,
 *              "description"="Indicates whether the gist is public. Default: false"
 *          }
 *      }
 * )
 */
public function postGistAction()
{
	return new JsonResponse(
		json_decode(file_get_contents(__DIR__ . '/../Data/Gists/postGist.json')),
		201,
		[
			'Location' => 'https://api.github.com/gists/1',
			'X-RateLimit-Limit' => 5000,
			'X-RateLimit-Remaining' => 4999,
		]
	);
}
~~~

Výsledek?
---------------
Na výsledný kód controlleru se můžete [podívat na github](https://github.com/mhujer/apidocdemo/blob/master/src/Mhujer/ApiDemoBundle/Controller/GistsController.php), případně si projít [jednotlivé commity](https://github.com/mhujer/apidocdemo/commits/master).

Výsledná dokumentace vypadá takto:
![](/data/2014/2014-06-08-navrh-rest-api-se-symfony-rest-a-apidoc-bundle/2014-06-08-apidoc03.png)

A případně ji jde vygenerovat i jako statické HTML ([prohlédnout](/data/2014/2014-06-08-navrh-rest-api-se-symfony-rest-a-apidoc-bundle/2014-06-08-apidoc.html)) nebo Markdown ([prohlédnout](https://github.com/mhujer/apidocdemo/blob/master/apidoc.md)).
~~~bash
php app\console api:doc:dump --no-sandbox --format html > apidoc.html
php app\console api:doc:dump --no-sandbox --format markdown > apidoc.md
~~~


Závěrem
-------------
V článku jsem se snažil ukázat jiný postup k návrhu a dokumentaci API. Velkou výhodou tohoto přístupu je, že si v rámci návrhu a testování API můžete v kódu už vytvořit nějaké podmínky, které by se ve statickém Markdown zapisovaly těžko. Zároveň API můžete postupně začít implementovat bez toho, aby bylo nutné udělat jedno velké přepnutí z mock implementace na reálnou.

**Jak navrhujete a dokumentujete API vy? Používáte apiary? Nebo jiný postup?**
