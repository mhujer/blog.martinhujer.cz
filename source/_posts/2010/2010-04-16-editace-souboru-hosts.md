---
title: Editace souboru hosts
---

Je možné si nastavit, aby ještě před dotazem na DNS server byla vrácena nějaká námi předdefinovaná IP adresa. V systému Windows se toto provádí editací souboru `hosts`:

Ve Windows XP/Vista/7 je soubor hosts umístěn v `C:\Windows\system32\drivers\etc\`
Defaultně je skrytý a pro editaci jsou potřeba práva administrátora.

Systaxe souboru je následující:
~~~
%IP_ADRESA% %DOMÉNA1% %DOMÉNA2%
~~~

Takže například pro přesměrování `hujer.test` na `localhost` zapíšeme:
~~~
127.0.0.1 hujer.test www.hujer.test
~~~
a soubor uložíme.
