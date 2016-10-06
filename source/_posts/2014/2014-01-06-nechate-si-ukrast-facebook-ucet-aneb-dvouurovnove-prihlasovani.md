---
title: Necháte si ukrást Facebook účet? aneb Dvouúrovňové přihlašování
---

> Dnešní článek je spíše pro neIT čtenáře. Počítám (doufám!), že pro všechny, kdo se kolem IT pohybují více, nebude dvoustupňové přihlašování ničím novým.

Než má smysl se začít bavit o dvouúrovňovém přihlašování, tak bych si rád ověřil jednu věc:

**Používáte pro e-mailovou schránku heslo, které nepoužíváte nikde jinde?**

Pokud jste heslo pro e-mail použili i někde jinde, tak si ho změňte. Jde o to, že občas nějakým firmám uteče špatně zabezpečená databáze hesel uživatelů (stalo se to třeba i LinkedIn nebo Adobe). A pokud máte stejné heslo i pro e-mail, tak případný útočník získá přístup nejen k vašim e-mailům, ale také ke všem službám, ve kterých jste se registrovali daným e-mailem - pomocí *Obnovení zapomenutého hesla* v těch službách.

----
Tak, pokud máte pro e-mail už nastavené unikátní heslo, tak se můžeme pustit do dalšího zabezpečování.

Předpokládám, že všichni používáte elektronické bankovnictví, takže jste si určitě všimli, že při potvrzování transakcí (a u ČSOB i při přihlášení), vám pomocí SMS přijde kód, kterým transakci autorizujete. Když jde o peníze, tak banka chce mít jistotu, že to jste opravdu vy - a to nejen tím, že *něco víte* (přihlašovací údaje), ale také tím, že *něco máte* (mobilní telefon s číslem nastaveným při zřizování účtu).

Teď je na čase se zamyslet, jestli by byl větší problém, kdyby se vám někdo dostal k bankovnímu účtu (kde jsou peníze přeci jen dobře vysledovatelné) nebo k Gmailu, Facebooku, Githubu, Live účtu, Dropboxu,… (kde by podle mě mohl napáchat mnohem větší škody).

A právě všechny tyto služby nabízejí obdobu toho, co elektronické bankovnictví - a to nutnost potvrzení přihlášení pomocí kódu, který vám zadarmo zašlou SMSkou. Tedy za cenu toho, že při přihlašování budete muset opsat kód z SMS, získáte mnohem větší jistotu, že váš účet jen tak někdo nezneužije. Počítač, ze kterého se přihlašujete často, si většinou můžete nastavit jako "důvěryhodný", takže tam nebude muset opisovat kód z SMS.


Jak nastavit dvouúrovňové přihlašování na Gmailu?
----------------
Můžete jít buď přímo [přes odkaz](https://accounts.google.com/b/0/SmsAuthSettings) a nebo si to proklikat sami:

1. V GMailu klikněte vpravo nahoře na svůj obrázek
2. Vyberte "Account" (mám GMail anglicky, takže případně hledejte CZ alternativu)
3. Nahoře klikněte na záložku "Security"
4. V sekci "Password" hledejte "2-step verification"

Poté už to je jednoduché. Zvolíte, že chcete aktivovat *"2-Step Verification"*, zadáte své telefonní číslo, přijde vám ověřovací kód a dvouúrovňové přihlašování bude zapnuté. Případně se mrkněte na [Návod od Google](https://support.google.com/accounts/answer/185839?hl=en&ref_topic=1099588).

Místo SMS je možné používat mobilní aplikaci, kam vložíte vstupní kód (případně vyfotíte QR kód) a ta už vám bude ověřovací kódy generovat. Já osobně její použití nedoporučuji - sice jsem si sám používal, ale když jsem poté smartphone poslal na reklamaci, tak jsem stejně všude musel měnit na potvrzení pomocí SMS.

Další věcí, kterou je potřeba vyřešit, je mít jistotu, že v případě ztráty telefonu, můžete snadno získat novou SIM se stejným číslem. Také dejte pozor na převody čísel mezi operátory - tam se může stát, že vaše číslo prostě nějakou dobu nebude fungovat.

Většina služeb umožňuje předgenerování  kódů, které můžete použít v případě, že nebudete mít přístup ke svému telefonu (ty opravdu doporučuju vytisknout a někam bezpečně uložit). GMail navíc umožňujte přidání druhého záložního telefonního čísla.

Aplikace musí dvouúrovňové přihlašování podporovat
-------------------------------------------------------
Aplikace, do které se přihlašujete, musí dvouúrovňové přihlášení podporovat. Většina oficiálních ho podporuje, ale třeba zabudované e-mailové programy ve smartphonech většinou ne. Pro ně je nutné vygenerovat tzv. *App-specific password* - jednorázové heslo, které se použije jen pro tu aplikaci.


Závěrem
-----------
Za cenu drobného nepohodlí si můžete mnohem lépe zabezepečit služby, které jsou pro vás důležité. A to se vyplatí, ne?

Nastavte si dvouúrovňové přihlašování i na další služby:

- [Facebook](https://www.facebook.com/settings?tab=security) (jmenuje se to *"Login Approvals"*)
- [Live.com účet](https://account.live.com/proofs/Manage)
- [Dropbox](https://www.dropbox.com/account#newsecurity)
- [Github](https://github.com/settings/admin)
- podívejte se, jestli i nějaké další služby, které používáte, náhodou dvoustupňové přihlašování neumějí


Dejte mi v komentářích vědět, jestli už jste dvouúrovňové přihlašování používali dříve? Uvažujete teď o jeho nastavení? Nebo ho používat nebudete - proč?
