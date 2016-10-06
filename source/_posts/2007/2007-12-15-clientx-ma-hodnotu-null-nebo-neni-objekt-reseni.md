---
title: clientX má hodnotu null nebo není objekt - řešení
---

Dnes jsem dělal něco v javascriptu a IE mi furt vyhazoval chyby, i když to fungovalo správně.

Šlo tam o hýbání myší a ukládání polohy do proměnný:
~~~javascript
event.clientX
~~~

Ve Firefoxu to fungovalo na 100%, ale IE7 mi házel clientX má hodnotu null nebo není objekt (ale ukládala se správná hodnota), ty varování IMHO způsobuje že jak se posílá ta poloha té fci, tak mezitím je myš zas o kousek jinde a ten objekt se zruší??

Celé jsem to obalil do
~~~javascript
try { kód s chybou } catch (e) { /* prázdné*/ }
~~~

A už to funguje perfektně.
