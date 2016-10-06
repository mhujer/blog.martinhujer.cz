---
title: Jak jsem si chtěl psát gramatiku
---

Na jaře jsem se začal učit španělsky (o tom se rozepíšu později) a postupně jsem zjišťoval, že papírový sešit není optimální řešení. Především proto, že jsem ho ne vždy měl u sebe, zapomínal jsem si ho vzít na hodinu a na opakování v tramvaji také nebyl ideální. Potřeboval jsem to tedy mít elektronicky, snadno prohlížitelné i na mobilu offline a s možností tisku (protože nejlíp se stejně učí z papíru).

<img src="/data/2015/2015-10-11-jak-jsem-si-chtel-psat-gramatiku/espanol-gramatika-0.jpg" width="600">

Varianty Word nebo OneNote jsem zavrhl jako první - Word by se těžko synchronizoval a ani jedno není příjemné na čtení na mobilu.

Další variantou, kterou jsem zvažoval, byl Markdown. Tam mě překvapilo, že vytváření tabulek není standardizované a každý dialekt Markdownu to má jinak. Vzhledem k tomu, že gramatika jsou samé tabulky, jsem Markdown také vynechal.

Jak tedy nakonec?
===================
Nakonec jsem použil <strong>HTML + Twitter Bootstrap + HTML5 AppCache + Github Pages.</strong>

- Bootstrap jsem použil, abych nemusel řešit typografii a stylování tabulek.
- AppCache mi umožní používat stránku offline na mobilu
- Github pages se mi starají o hostování (tím, že to je celé jen statické HTML)

Přegenerovávání AppCache
==========================
AppCache funguje tak, že si stáhne soubor <code>cache.manifest</code> a věci v něm nacachuje. A pokud se soubor nezměnil, tak nic nestahuje. Takže nepozná, že se změnil nějaký soubor tam uvedený. Nakonec jsem skončil u [jednoduchého skriptu](https://github.com/mhujer/espanol/blob/gh-pages/touch-cache-manifest.php), který mám nastavený jako `pre-commit` hook a do `cache.manifest` mi do komentáře vloží md5 hash HTML souboru a manifest nastaguje do gitu.

Stejný skript jsem si přidal jako FileWatcher v PHPStormu, abych mohl kontrolovat, že se vše zobrazuje správně i bez commitování.

Další drobnosti
=====================
Na většinu věcí používám standardní classy z Bootstrapu, přidal jsem si dvě vychytávky:

Koncovky sloves si obaluju do `<strong class="vs">`, kdy class `vs`, kromě nastavení pozadí, vloží před koncovku spojovník:

~~~css
.vs:before {
	content: '-';
}
~~~

A ten se ignoruje, pokud pak ve stránce hledám celé sloveso *trabajaron*

<img src="/data/2015/2015-10-11-jak-jsem-si-chtel-psat-gramatiku/espanol-gramatika-1.png" width="700">

Protože si dokument chci i tisknout, přidal jsem si dvě drobnosti:
~~~css
table {
	page-break-inside: avoid;
}
.break {
	page-break-before: always;
}
~~~

Zaprvé jsem nastavil, aby se tabulky vždy nechaly na jednom listu. A druhá věc je class, kterou si můžu dorovnat některá špatně udělaná zalomení před tím, než si uložím PDF.


**Celou tu nádheru najdete na [espanol.martinhujer.cz](https://espanol.martinhujer.cz/)** (a na [githubu](https://github.com/mhujer/espanol))

**Co vy, také pro jednoduché věcí používáte komplikovaná hi-tech řešení? ;-)**
