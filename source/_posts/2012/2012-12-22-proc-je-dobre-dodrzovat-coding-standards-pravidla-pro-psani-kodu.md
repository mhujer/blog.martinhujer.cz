---
title: Proč je dobré dodržovat Coding Standards (Pravidla pro psaní kódu)?
---

Nečekal jsem, že ještě někdy budu muset někoho přesvědčovat, že je fajn dodržovat Coding Standards (CS). Ale v rámci školního předmětu 4IT445 (ten je mimochodem super!) jsem musel, takže jsem se rozhodl ty důvody sepsat (abych měl příště jen kam odkazovat)

Co těmi coding standards myslím?
--------------------------------
- formátování souboru (kódování, znaky pro konce řádek, odsazování - taby vs. mezery)
- pojmenování proměnných, metod, tříd atd.
- styl psaní kódu (jaké používat a nepoužívat konstrukce, kde dělat mezery, kam dávat závorky)
- standard pro dokumentaci

Proč je důležité je dodržovat
--------------------------------
Pokud píšete projekt sami pro sebe, a s **jistotou** víte, že ho nikdy nebude upravovat nikdo jiný, ten si můžete psát, jak chcete. Ale většinou, i když píšete sami, ale na zakázku, tak je pravděpodobné, že v té aplikaci bude někdy někdo jiný potřebovat něco upravit a určitě ocení, pokud budete coding standards dodržovat. Dodržování coding standards je samozřejmostí, pokud na projektu pracuje více vývojářů.

Jedním z často používaných principů je [Colective code ownership](http://www.extremeprogramming.org/rules/collective.html), kdy jakýkoliv kód v aplikaci může upravovat kdokoliv. Nehraje se na to, že tohle je Petrům kód a tohle Karlův a ten si budou upravovat oni. A jinému členovi týmu by se v kódu, který není psaný podle coding standards, hůře orientovalo.

Kód se mnohem častěji čte, než píše, takže pokud strávíte o něco více času psaním kódu, tak se vám to bohatě vrátí na ušetřeném čase při jeho čtení.

Pokud bude kód psaný podle coding standards, tak se snižuje riziko nějakého přehlédnutí z důvodu jinde umístěné závorky, jinak odsazovaného kódu atd., což může ušetřit spoustu dalšího času při řešení bugu tímto způsobeného.

Jedním z argumentů proti CS je "*vždyť to funguje stejně*". Na to odpovím jedním citátem:
> "Napsat kód, kterému rozumí počítač, umí napsat každý blbec. Dobří programátoři píší kód tak, aby mu rozuměli lidí."

> *-- přeloženo z Martin Fowler, "Refactoring: Improving the Design of Existing Code"*

Další důležitou věcí je rozumné pojmenovávání proměnných. Dobré pojmenovávání není [žádná legrace](http://martinfowler.com/bliki/TwoHardThings.html), ale můžeme se o dobré a předvídatelné pojmenovávání alespoň snažit. Nestojí za to, ušetřit pár znaků při psaní názvu proměnné (vždyť máme autocomplete), pokud to zbude znamenat, že při každém čtení budete muset zkoumat, co v té proměnné vlastně je.

To, že se tým dohodne na Coding Standards a bude je dodržovat (a vynucovat!) je prvním krokem ke kvalitnějšímu kódu (poté má smysl řešit dobrý OOP návrh, automatizované testování atd.). Ale pokud se tým nezvládne ani řídit CS, tak těžko zvládne automatizované testování.

Jak na coding standards?
--------------------------------
Vůbec jsem nezmiňoval, jaký coding standard dodržovat. Ono na tom tolik nezáleží, jen je potřeba, aby všichni v týmu dodržovali ten stejný. Samozřejmě je vhodné zvolit nějaký ověřený, detailně popsaný, používaný mnoha lidmi, kde výhodou je jeho podpora nástrojích (viz dále) a to, že už ho spoustu lidí zná. Pro aplikace na Zend Frameworku je jasnou volbou [Zend Framework Coding Standard](http://framework.zend.com/manual/1.12/en/coding-standard.overview.html) (věnujte čas jeho přečtení a pochopení, vyplatí se to).

Výhodou dodržování osvědčeného standardu je jeho podpora v nástrojích, které umějí jeho dodržování kontrolovat. Jedním z takových nástrojů je [PHP_CodeSniffer](http://pear.php.net/package/PHP_CodeSniffer/), který umí reportovat, kde se váš kód odchyluje např. od Zend Coding Standards. Samozřejmě je nejlepší kontrolu coding standards automatizovaně provádět po každém commitu pomocí nějakého integračního serveru - pokud vás toto zajímá, tak doporučuji svou [bakalářku](/bp/), kde kontinuální integraci pro PHP detailně rozebírám (nejen kontrolu coding standards).

Další, lehce se coding standards dotýkající věc, jsou výstižné commit messages. Opět platí, že alespoň nějaké jsou lepší než žádné, ale [vynikající jsou nejlepší :)](https://arialdomartini.wordpress.com/2012/09/03/pre-emptive-commit-comments/)


tl;dr
--------------------------------
- prostudujte si [Zend Framework Coding Standard](https://framework.zend.com/manual/1.12/en/coding-standard.overview.html)
- dodržujte ho
