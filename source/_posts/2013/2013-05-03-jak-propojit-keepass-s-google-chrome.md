---
title: Jak propojit KeePass s Google Chrome?
---

**Pokud si z článku nepřečtete nic dalšího, tak si prosím alespoň u e-mailu nastavte heslo, které nebudete používat nikde jinde!**

Používáte všude stejné heslo? Víte, že když pak někdo prolomí nějakou špatně zabezpečenou službu (např. [LinkedIn](http://mashable.com/2012/06/06/linkedin-passwords-hacked-confirmation/)), tak získá vaše heslo, které pravděpodobně využíváte na spoustě dalších míst.

Určitě je mnohem lepší mít alespoň k e-mailu jiné heslo než k webům (službám, e-shopům) kam zadáváte svůj e-mail. Protože pokud by někdo získal heslo k vašemu e-mailu, tak si snadno může nechat zaslat *zapomenuté heslo* z jakékoliv další služby.

A úplně nejlepší je mít unikátní heslo pro každý web, kam se přihlašujete. A ideálně pokud je trochu složitější :)

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Sorry, but your password must contain an uppercase letter, a number, a punctuation mark, a gang sign, an extinct mammal and a hieroglyph.</p>&mdash; Stephanie Wright (@StephBWright) <a href="https://twitter.com/StephBWright/status/256029401546895360">October 10, 2012</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Samozřejmě nemá smysl si pamatovat tolik hesel. Můžete si je psát na papír, nechat ukládat v prohlížeči, nebo využít nějaký specializovaný program jako je KeePass nebo LastPass. Já používám [KeePass](http://keepass.info/) a zjistil jsem, že spoustu lidí neví, že ho jde snadno propojit s Google Chrome a nechat si hesla doplňovat automaticky. Takže jak na to?

Nastavení KeePassu
-----------------------------
- [Stáhněte si KeePass](http://keepass.info/download.html) - doporučuji *Portable KeePass 2.22 (ZIP Package)* a rozbalte ho (ideálně do Skydrive nebo Dropboxu)
- [Stáhněte si plugin](https://github.com/pfn/keepasshttp/raw/master/KeePassHttp.plgx) na propojení s prohlížečem a umístěte ho do adresáře KeePassu (tam kde je KeePass.exe)
- Nastavení KeePassu tady nemá cenu rozepisovat, pěkně to [popsali na CNews](http://www.cnews.cz/keepass-sikovna-sprava-hesel-pro-windows-i-mobilni-zarizeni)
- Jediná věc, kterou zdůrazním - u uložených hesel je potřeba mít vyplněnou URL

![](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-01-keepass-url.png)


Nastavení Chrome
---------------------------
1. Do Chrome je potřeba nainstalovat rozšíření [chromeIPass](https://chrome.google.com/webstore/detail/chromeipass/ompiailgknfdndiefoaoiligalphfdae)

2. Klikněte na ikonu vedle adresního řádku a zvolte **Connect** <br>
![](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-02-chrome-connect.png)

3. Přepněte se do KeePassu - tam uvidíte následující okno - potřebuje si uložit klíč pro šifrování komunikací - nějak ho pojmenujte <br>
![](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-03-keepass-key.png)

4. Pokud pak přejdete na stránku, jejíž adresu máte v KeePassu vyplněnou u nějakého hesla, zobrazí se okno, kde se KeePass ptá, jestli dovolíte přístup daného webu k záznamu v KeePassu. Zkontrolujte, že vše sedí a zatrhněte "Remember this decision", abyste to nemuseli potvrzovat pokaždé. <br>
![](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-04-keepass-confirm-access.png)

5. Čárymáryfuk a jméno s heslem jsou předvyplněné. <br>
![](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-05-chrome-filled.png)

Pro Tips:
----------
- Existuje obdobné rozšíření pro Firefox - [PassIFox](https://github.com/pfn/passifox)
- rozšíření vás umí automaticky přihlásit do webů, které mají HTTP autentizaci
![Chrome HTTP authorization](/data/2013/2013-05-03-jak-propojit-keepass-s-google-chrome/2013-05-03-keepass-chrome-06-chrome-httpauth.png)

Jak pracujete s hesly vy? Pochlubte se v komentářích!

Nedaří se vám to nastavit? Zeptejte se!
