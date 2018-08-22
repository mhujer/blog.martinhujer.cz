---
title: "VŠE: Zkoušky z ISISu do kalendáře"
---

Aktualizoval jsem svoje [rozšíření pro Google Chrome](https://chrome.google.com/webstore/detail/isis-icalgcal-export/hhkoekkpnogggelmhefickjpfiediigi), které do ISISu přidá tlačítka pro uložení zkouškového termínu do iCal formátu (pro Outlook) a pro přidání do Google Calendar.

[![](/data/2013/2013-10-02-isis-export-do-kalendare/tile.png)](https://chrome.google.com/webstore/detail/isis-icalgcal-export/hhkoekkpnogggelmhefickjpfiediigi)

Teď to zajímavé: [zdrojáky](https://github.com/mhujer/isis-calendar-export) jsou k dispozici na [Githubu](https://github.com/mhujer/isis-calendar-export). Chtěl jsem si hlavně vyzkoušet Typescript a TDD v JavaScriptu - a není to špatné. Když už se PHP nástroje konečně naučily code-completion a refactoring, tak by se mi nechtělo do jazyka, kde to rozumně nejde.

Co jsem se zajímavého naučil?

- vytvářet rozšíření pro Google Chrome je docela fajn

- Z JavaScriptu jde stáhnout soubor pomocí data-URI (`location.href = data:…`), ale ten nejde pojmenovat. [Lepší finta](https://github.com/mhujer/isis-calendar-export/commit/dedc6f202c2cc07d591f873efccd186f18ea8b16#diff-1d0fa53a96805078466905fd19af7793L83) je vytvořit si `a` element, použít download atribut a pak na něj "kliknout":
~~~javascript
var link = document.createElement('a');
link.download = 'zk-' + ident + '.ics';
link.href = data;
link.click();
~~~

- iCal soubor pro Outlook jde generovat docela snadno.

- Přidání události do Google Calendar je ještě snazší - parametry se jen předají v URL.
