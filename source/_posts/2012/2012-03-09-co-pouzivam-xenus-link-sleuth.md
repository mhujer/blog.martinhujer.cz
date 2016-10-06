---
title: Co používám? Xenu's Link Sleuth
---

Občas používám docela užitečný program na kontrolu odkazů na webech, [Xenu's Link Sleuth](http://home.snafu.de/tilman/xenulink.html). Funguje tak, že mu zadáte výchozí adresu (typicky třeba hlavní stránku), on si ji stáhne, najde na ní všechny odkazy (a to jak na další stránky, tak i na obrázky, skripty a CSSka) a ty ověří. Z dalších stránek, na které první stránka odkazuje, si zase najde všechny odkazy a ty ověří...

A k čemu to?
--------------
Xenu nám pomůže odhalit chyby, které by při procházení našeho webu měli jak uživatelé, tak i vyhledávače. Můžeme nalézt dva druhy možných chyb.

- **uživatelské** (obsahové)
- **programátorské**

Uživatelské (obsahové) chyby
------------------
Může se stát, že se uživatel překlepne a vloží do stránky odkaz, který vede na neexistující stránku. Případně může přestat existovat stránka, na kterou odkázal v minulosti.

Programátorské chyby
---------------------
Programátor může třeba špatně naprogramovat vypisování odkazů v menu nebo něco takového. Horší jsou chyby, které vytvářejí nekonečné množství stránek. Typickým příkladem je kalendář akcí, který lze po měsících procházet do hluboké minulosti nebo daleké budoucnosti. Jednou jsem spouštěl Xenu na web a divil jsem se, že kontrola trvá tak dlouho. Nakonec jsem zjistil, že už kontroluje jen kalendář akcí a je u roku 1700 a zároveň u roku 2300 na druhé straně. Googlu by se to nemuselo líbit a mohl by nás podezřívat z nějakého spamování indexu.

Takže jak na to?
-------------
Spustíme Xenu a zadáme URL webu, který chceme kontrolovat. Pod tlačítkem "More options" se skrývají další nastavení, ale ta teď nejsou důležitá, můžete si je prohlédnout později.

![](/data/2012/2012-03-09-co-pouzivam-xenus-link-sleuth/2012-03-06-xenu01-new-project.png)

Spustíme kontrolu a po doběhnutí se nám červeně zobrazí chybné odkazy. Pravým tlačítkem a volbou URL properties můžeme získat detailní informace o chybné URL. Samozřejmě ne vše jsou opravdu chyby, na následujícím obrázku jsem vybral ty, které nás zajímají:

![](/data/2012/2012-03-09-co-pouzivam-xenus-link-sleuth/2012-03-06-xenu01-report.png)

- **[obsahová chyba]** e-shop *nejlevnejsitablet.cz* skončil
- **[obsahová chyba]** nová adresa FB stránky už je jen *h\*tps://www.facebook.com/shopio*
- **[obsahová chyba]** Dobrý Web změnil odkazy na školení - toto možná není chyba, protože DW si u sebe staré odkazy přesměrovává - ale stejně je lepší odkazovat na aktuální URL
- **[programátorská chyba]** *h\*tp://twitter.com/Shopio/status/1.64261064014E+17/* vzniklo asi tak, že se s číslem statusu na Twitteru pracovalo jako s celým číslem a ne jako s řetězcem. Když číslo statusu přeteklo rozsah typu integer, tak se začalo brát jako desetinné číslo a to není do odkazu úplně optimální...
- **[OK]** *h\*tp://t.co/tmyN7sM8* naopak problém není - je to Twitterový zkracovač odkazů, takže je správně, že přesměrovává


Závěrem
-----------
Kontrolujete odkazy na svém webu? Zkuste si na něj schválně pustit Xenu a podělte se o výsledky v komentářích!
