---
title: Šifrování dat v notebooku je nutnost!
---

Už jsem psal o tom, jak je důležité data [zálohovat](/zalohujete-meli-byste/). Ale pokud vám někdo ukradne notebook, tak snadno získá přístup i k vašim datům (to že máte nastavené heslo do Windows je k ničemu - jde ho vyresetovat během chvilky).

Zkuste se zamyslet, jaká data máte v počítači uložená a co by se stalo, kdyby k nim někdo získal přístup...

- uložená hesla v prohlížeči
- pracovní dokumenty
- zdrojové kódy aplikací
- e-maily
- fotky
- SSH klíče
- účetnictví

Nevím jak vy, ale já bych byl docela nerad, kdyby má data získal někdo cizí.

Nebo jiná situace - [Michal](https://twitter.com/Mrkvoslav) má ultrabook od Asusu a jednoho dne mu přestal fungovat pevný disk. NBD záruka to sice kryla, jenže na disku (i když se hlásil jako nefunkční) měl data, která nemohla ven z firmy. A vzhledem k tomu, že Asus je posílá zpět a případně opravuje (na rozdíl od HP/Dell, kteří nefunkční disky likvidují), nakonec musel ten nefunkční disk odkoupit.

Všechno tohle řeší šifrování.
------------------------------
Šifrovat data lze buď pomocí BitLockeru (součást Win7 Ultimate, nebo Win8 Pro), nebo pomocí open-source [TrueCryptu](http://www.truecrypt.org/). Funguje to tak, že ve vybraném nástroji vytvoříte silné heslo (třeba 20 znaků) a nástroj pak zašifruje celý systémový disk.
Po spuštění šifrovaného počítače se nejdříve zobrazí výzva k zadání hesla a teprve poté začne startovat systém.


Závěrem
------------
Šifrování je (spolu se zálohováním) snadná cesta jak můžete ochránit svá data v případě ztráty notebooku. Určitě se vyplatí o něm popřemýšlet - zvážit, jaké negativní důsledky by mohlo přinést, pokud by někdo získal vaše data.

Data mám aktuálně zálohovaná do SkyDrive, takže teoreticky by k nim někdo mohl získat přístup, pokud by prolomil můj Live účet. Případně by se k nim mohl dostat provozovatel úložiště. Nicméně taková varianta je výrazně méně pravděpodobná, než že mi někdo ukradne notebook.

Samotnou kapitolou je správa hesel - na ta spokojeně používám KeePass a možná o tom někdy napíšu samostatný článek.

A co vy, máte notebook šifrovaný? Nebo se svými (a cizími) daty hazardujete?
