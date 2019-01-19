---
title: V čem psát bakalářskou práci?
---

Mám teď rozepsanou [bakalářku](https://isis.vse.cz/student/zobraz_zp.pl?verejny=1;studium=103424) ve Wordu a přemýšlím, v čem udělat finální verzi. (Zbývá mi ještě čas do odevzdání, tak nad tím můžu koumat.) Na Wordu se mi totiž nelíbí několik věcí:

- nemá dokonalou typografii
- dokumenty se špatně verzují v GITu - není vidět jednotlivé změny, soubor je uložený binárně
- občas se chová nečekaně, takže se bojím, že bych v závěrečné fázi někde něco upravil a celý dokument by se mohl divně přeskládat

Uvažoval jsem o DocBooku (naučil jsem se v 4IZ238) nebo TeXu (učím se teď v 4IZ552).

Docbook:
-------
- \+ sémantický formát
- \+ s [Oxygenem](http://www.oxygenxml.com/) jde pěkně editovat i WYSIWYG
- \+ je "textový" - půjde dobře verzovat
- \+ lze z něj generovat i třeba HTML nebo ePUB
- \- nemá dokonalou typografii


TeX 
----
<img src="/data/2012/2012-03-12-v-cem-psat-bakalarskou-praci/TeX.png" style="float:right;"/>

- \+ dokonalá typografie!
- \+ "textový" - půjde dobře verzovat
- \- píše se v něm hůře než v DocBooku


Řešení?
--------
Tak co to napsat v DocBooku a vysázet v TeXu? Ano, to je asi cesta, kterou se vydám. Z 4IZ238 umím XSLT, takže nebude problém si napsat transformaci, která z DocBooku udělá `.tex` soubor. Vím, že už existují konvertory z Docbooku do TeXu, ale pokud si ji napíšu sám, tak:

- budu vědět jak funguje (a případně si budu moct něco snadno doladit)
- prosvištím si XSLT (asi už jsem toho dost zapomněl)
- a budu moct (část) BP mít jako semestrálku do 4IZ552

Funkční prototyp (umí kapitoly, odstavce a obrázky s popisky), který z DocBookového XMLka udělá skrz TeX PDFko, jsme s [Tomášem](https://www.tomasfejfar.cz/) dali dohromady za hodinku...

Nevýhodou DocBooku a TeXu je chybějící kontrola pravopisu. Ale z DocBooku jde vygenerovat i HTML a to otevřít ve Wordu, takže to nějaký zásadní problém není.


**A co vy, v čem píšete (v čem jste napsali) BP/DP?**
