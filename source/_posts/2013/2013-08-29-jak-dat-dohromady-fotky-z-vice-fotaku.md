---
title: Jak dát dohromady fotky z více foťáků?
---

Určitě už jste na nějaké dovolené fotili na více foťáků, takže jste po návratu měli něco jako `Fotky Morava Kuba`, `Fotky Morava Tomáš` a `Fotky Martin mobil`. Teď je chcete spojit dohromady, protože na nějaký výlet se třeba bral jen jeden foťák, fotky z večera jsou zas na druhém atd.

Fotky typicky bývají pojmenované jako `DSCN0123.jpg`, `100_9123.jpg` nebo podobně, takže pokud je dáte do jedné složky, tak samozřejmě budou v pořadí nejdříve jedny, pak druhé, takže si moc nepomůžeme. Bylo by vhodné je přejmenovat do něčeho jako `YYYY-MM-DD_HH-MM-SS` (`rok-měsíc-den_hodina-minuta-sekunda`), aby byly v pořadí podle vyfocení a ne podle toho, jak je foťák pojmenovává.

**DŮLEŽITÉ: Před prvním focením si zkontrolujte, že na všech foťácích a telefonech je nastavené správné datum a čas! Dávat to pak dohromady je mnohem těžší.**


Prvním způsobem, který popíši, je přejmenování podle data a času souboru. To funguje, pokud se na fotky nešahalo - neladily barvy, neotáčely - jak to řešit ukážu dále.

Přejmenování fotek podle data souboru
-------------------------------------------------------
1. Máš Total Commander? Pokud ne, tak [stáhnout](http://ghisler.com/amazons3.php) (64-bit+32-bit combined), nainstalovat (ideálně do `C:/Users/%uživatel%/totalcmd/` - kdy %uživatel% je uživatelské jméno).
2. Udělat zálohu fotek - aby byla jedna složka s těmi, které se budou přejmenovávat a někde jinde kopie, kdyby se tohle nezadařilo.
3. Jdi do složky s fotkama, vyber všechny, dej CTRL+M (nebo Files -> MultiRename tool) - spustí se hromadné přejmenování
4. Do prvního pole vlevo nahoře zadat `[Y]-[M]-[D]_[h]-[m]-[s]_[N]` - před název souboru poskládáme datum souboru. Pod tím bude seznam souborů s náhledem, jak bude název vypadat po přejmenování. V druhém sloupečku zkontrolujte, že ty názvy dávají smysl.

![](/data/2013/2013-08-29-jak-dat-dohromady-fotky-z-vice-fotaku/2013-08-28-photo-rename-01-tc-rename.png)

5. Vpravo dole kliknout na *Start!*
6. To stejné zopakovat pro fotky z dalších foťáků a pak je přesunou do jedné složky a seřadit podle názvu -> Hotovo :-)


Problém nastane ve chvíli, kdy se na ty fotky šahalo a změnilo se jejich datum čas. Případně, pokud jsou stahované z telefonu - tam je také většinou datum vytvoření souboru a ne vyfocení. Naštěstí foťáky a telefony ukládají k fotkám tzv. [EXIF informace](http://en.wikipedia.org/wiki/Exchangeable_image_file_format) - zjednodušeně řečeno jde o metadata snímku, která obsahují informace o foťáku, expozici, GPS souřadnice, a hlavně i datum a čas pořízení snímku.

Přejmenování fotek podle data z EXIF
--------------------------------------------------
*Většina kroků je stejná s předchozím postupem, jen některé se liší.*

- 1a) [Stáhnout](http://ghisler.fileburst.com/content/wdx_exif.zip) plugin pro EXIF a otevřít ho v Total Commanderu - mělo by se nabídnout, že se chce do TC nainstalovat<br>
![](/data/2013/2013-08-29-jak-dat-dohromady-fotky-z-vice-fotaku/2013-08-28-photo-rename-02-tc-install.png)

Pokud se to nezdaří (například máte Total Commander nainstalovaný v Program Files a běžící TC tam nemá oprávnění zapisovat), tak tam je potřeba plugin nakopírovat ručně. Takže pokud je nainstalovaný v `C:/Program Files/totalcmd`, tak do `C:/Program Files/totalcmd/Plugins/wdx/wdx_exif/` nakopírujte soubory z `wdx_exif.zip`, který jste si stáhli.

- 4a) Že jste plugin dobře nainstalovali můžete ověřit kliknutím na tlačítko *[=?] Plugin* v okně pro přejmenování. Mělo by se tam objevit *tc* a *exif*. Teď už je možné jako masku pro přejmenování použít i data z EXIF. V našem případě to bude: `[=exif.DateOriginal.Y-M-D]_[=exif.TimeOriginal.h]-[=exif.TimeOriginal.m]-[=exif.TimeOriginal.s]_[N]`. Opět ověřte, že názvy souborů dávají smysl a můžete přejmenovávat.


A co v případě, že jste měli špatně nastavené datum na foťácích? Já to řešil [PHP skriptem](https://gist.github.com/mhujer/6078439), ale to asi není pro každého...



Doufám, že se vám postup bude hodit, pokud narazíte na nějakou nefunkčnost, tak napište do komentářů a pokusím se poradit.
