---
title: Citace ČSN ISO 690 ve Wordu
---

Pokud teď píšete bakalářku nebo diplomku, tak jste si možná všimli, že Word umí docela pěkně pracovat s citacemi (jak na ně najdete třeba [tady](https://support.office.com/cs-cz/article/Vytvoření-bibliografie-3403c027-96c8-40d3-a386-bfd5c413ddbb)). Problém může nastat s formátem citací.

Jaký formát citací?
---------------
Na [KIT FIS](https://kit.vse.cz) máme zpracované instrukce na psaní BP/DP, kde je jako ukázka citace v dokumentu uvedeno *[Novotný, 2011, str. 56]* (všimněte si hranatých závorek). Jenže o kousek níž je odkaz na [interpretace normy na citace.com](http://www.citace.com/download/CSN-ISO-690.pdf), kde jsou citace v textu doporučovány jako *Holá (2006)* nebo *(McQuail, 2002, s. 29)* (tedy v kulatých závorkách, a pokud je to součástí textu, tak je v závorkách jen rok). V formátu přehledu biografie jsem zatím odlišnosti nenašel.

Co s tím?
----------
Zřejmě se budu držet hranatého formátu, který je v požadavcích, ale přehled zdrojů udělám podle ČSN ISO 690.

Problémem je, že Word tento formát neumí. Jednou z možností je použít rozšíření [ČSN ISO 690 pro MS Word](http://iso690.codeplex.com/), ale to není úplně optimální, pokud už ve Wordu máte nějaká zdroje zadané. Tohle rozšíření totiž upravuje, která pole jsou pro který typ zdroje povinná, takže se vám to může pobláznit.

Mnohem lepší je, si balíček rozbalit třeba 7zipem a potřebný soubor `CSN_ISO_690Harvard.XSL` si od adresáře `c:\Program Files (x86)\Microsoft Office\Office14\Bibliography\Style\` nahrát ručně.

Protože se rozšíření drží normy a ne pravidel na KITu, tak používá kulaté závorky. Zároveň jsem narazil na problém s výpisem elektronických zdrojů (zřejmě souvisí s tím, že jsem si jen změnil výpis a ne i formát zadávání citací). Pro svoje potřeby jsem si tedy XSL upravil a pokud chcete, tak ho mám na [Githubu](https://github.com/mhujer/iso690). (Používejte na vlastní nebezpečí.)
