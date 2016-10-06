---
title: ZmapujTo aneb Co vlastně děláš jako diplomku?
---

Už od podzimu pracuju (programuju) na diplomce, ale ještě na ni ani nemám založený dokument. Takže když jsem v březnu zjistil, že jsou dva měsíce na napsání a ještě jsem neměl ani doprogramováno, tak jsem se rozhodl radši studovat o semestr déle, než to zbytečně odfláknout.

A co teda vlastně děláš?
-----------------------------------
To, že docela rád běhám, jste už určitě zaznamenali. S tím souvisí to, že když běhám po lesích, tak dost často potkám nějakou černou skládku. 

![](/data/2014/2014-05-26-zmapujto-aneb-co-vlastne-delas-jako-diplomku/2014-05-26-Zmapujto-a.jpg)


![](/data/2014/2014-05-26-zmapujto-aneb-co-vlastne-delas-jako-diplomku/2014-05-26-Zmapujto-b.jpg)

A to mně docela vadilo, takže jsem řešil, co s nimi. I ukázalo se, že je jde nahlásit na městský úřad na odbor životního prostředí a oni je budou řešit a buď je v dohledné době uklidí nebo vyzvou vlastníka pozemku, aby je uklidil. Postupně jsem podobně zkoušel nahlásit ještě pár věcí (třeba ulomenou značku nebo strom přes cestu) a všechno se celkem rychle vyřešilo. Ale posílat jednotlivá hlášení takhle ručně je docela hodně práce (je potřeba místo najít na mapě, vyznačit a udělat krátký odkaz, stáhnout fotku z telefonu, najít kontakt na správného člověk na webu úřadu).

Vzhledem k tomu, že jsem zrovna v té době v práci dělal na mobilní aplikaci, tak mě napadlo, že by bylo fajn mít aplikaci, kterou nějaký takový problém vyfotím, zaměřím jeho polohu a odešlu úřadu k řešení. (A zároveň jsem si říkal, že bych to mohl mít jako diplomku, u které se neúprosně blížil čas volby tématu).

Při zběžném zkoumání jsem zjistil, že taková aplikace už bohužel existuje (i když jen na mapování černých skládek). Takže jsem z toho byl nějakou dobu smutný, ale pak jsem se jim ozval, jestli to neplánují rozšířit i na mapování dalších věcí. A ono jo, takže jsme se domluvili na spolupráci. No a to je [ZmapujTo](http://www.zmapujto.cz/)


[![](/data/2014/2014-05-26-zmapujto-aneb-co-vlastne-delas-jako-diplomku/2014-05-26-Zmapujto-logo.png)](http://www.zmapujto.cz/)

ZmapujTo jsou [mobilní aplikace](http://www.zmapujto.cz/) (iOS, Android, WP8) na hlášení problémů (černé skládky, zlomené značky, rozbité lavičky, ...) ve městech. Aplikace umí problém zaměřit, vyfotit a odeslat na web. Tam si hlášení buď zapojené obce řeší přímo samy a těm ostatním se to pošle e-mailem (a jejich odpovědi se zobrazí jako komentáře).

A co jsi na tom dělal?
-----------------------
Já jsem dělal ty tři mobilní aplikace, serverové API, kam se hlášení odesílají a mailing (posílání notifikačních e-mailů jednotlivým obcím). Web dělal [Mirek Kubásek](https://www.linkedin.com/in/kubasek), který vytvářel původní ZmapujTo.

Jak a na čem to funguje?
---------------------------
- mobilní aplikace jsou postaveny na [Sencha Touch a Apache Cordova](http://www.zdrojak.cz/clanky/cordova-sencha-touch-mobilni-aplikace/)
- API je postavené na PHP: Symfony + Doctrine ODM + MongoDB
- na Mailing používáme Mandrill
- web je vytvořený v AngularJS a na backendu Node.js


Zapojte se!!
----------------
1. [Nainstalujte si mobilní aplikaci](http://www.zmapujto.cz/)
2. (dejte vědět, jestli vám funguje správně)
3. Hlaste problémy ve svém okolí, ať ten svět máme hezčí :-)
