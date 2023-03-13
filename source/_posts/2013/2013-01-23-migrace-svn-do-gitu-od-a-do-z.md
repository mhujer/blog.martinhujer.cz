---
title: Migrace SVN do GITu od A do Z
---

V nedávné době jsem migroval několik SVN repositářů do GITu a rád bych zaznamenal postup a pár tipů, protože věřím, že někdo budete řešit podobnou věc. Přechod na GIT se vyplatí, to tu není potřeba rozebírat :)

První věc, kterou je potřeba vědět je, že to trvá dlouho. Dlouho. DLOUHO. A čím více revizí, tím déle. Samozřejmě záleží na systému, HW atd., ale orientačně počítejte, že tisíc revizí v SVN může trvat zmigrovat tak dvě hodiny. Tohle samozřejmě měřím s lokálním SVN serverem. Před samotným řešením migrace je vhodné pročistit repositář.

## Pročištění SVN repositáře
Migrace do GITu bude snazší, pokud před tím pročistíte strukturu repositáře. Dobře funguje, když máte trunk/branches/tags, případně soubory přímo v kořenu repositáře, bez branchí a tagů. Nicméně pokud váš repositář obsahuje nestandardní strukturu (dva trunky, víceúrovňové branches), je vhodné to ještě před řešením migraci pročistit přímo v SVN.

## Rozjetí lokálního SVN serveru
Migraci je velmi vhodné dělat lokálně (rozjet si lokální SVN server). Zaprvé to je mnohem rychlejší a zadruhé se migrace nepřeruší při výpadku síťového spojení. Takže jak na to?

**1.** Pokud na práci s SVN používáte TortoiseSVN, tak je potřeba si nainstalovat ještě konzolové SVN například z http://www.sliksvn.com/en/download a přidat ho do systémové cesty. Zda je vše v pořádku ověříte pomocí následujícího příkazu:
~~~bash
> svn --version
svn, version 1.7.7-SlikSvn-1.7.7-X64 (SlikSvn/1.7.7) X64 
   compiled Oct  9 2012, 15:02:27
~~~

**2.** dalším krokem je zkopírování repositáře ze serveru - na serveru zabalit, u sebe rozbalit (třeba do `c:\svn2git\moje-repo`)

**3.** teď už máme repositář lokálně, tak spustíme server:
~~~bash
svnserve --daemon --root c:\svn2git\
~~~

**4.** a zkontrolujeme, že nám SVN server funguje - třeba pomocí repository browseru z TortoiseSVN se podíváme do `svn://localhost/moje-repo`


## Příprava authors.txt souboru
Vzhledem k tomu, že SVN identifikuje autory změn jen uživatelským jménem (např. `martin.hujer`) a GIT jménem a e-mailem, je potřeba mezi nimi vytvořit mapování.

**1.** Nejprve si vypíšeme všechny autory z SVN repositáře - z bashe spustíme:
~~~bash
$ svn log --quiet svn://localhost/moje-repo | grep -E "r[0-9]+ \| .+ \|" | awk '{print $3}' | sort | uniq
~~~

**2.** Vytvoříme soubor `authors.txt`, který bude obsahovat mapování uživatelských jmen. Všimněte si, že z historických důvodů (přesun SVN repositáře jinam) jsem tam commitoval pod dvěma různými uživatelskými jmény.
~~~
martinhujer = Martin Hujer <mhujer@gmail.com>
martin.hujer = Martin Hujer <mhujer@gmail.com>
~~~

**3.** Zkontrolujte, zda v souboru máte opravdu všechny autory, jinak se migrace přeruší, až narazí na revizi s autorem, který bude v mapování chybět.


## Jdeme migrovat!
Na migraci je vhodné použít nástroj [svn2git](https://github.com/nirvdrum/svn2git). Ten na migraci použije `git-svn` a po migraci repositář dočistí (z tagů v SVN udělá GITové tagy, správně namapuje branche a další).

**1.** svn2git je vytvořený v Ruby, začneme tedy instalací Ruby interpreteru. Doporučuji použít [JRuby](http://jruby.org/). Poté nainstalujeme svn2git:

`gem install svn2git`

> **ProTip:** Pokud budete potřebovat něco, co svn2git v základu neumí (třeba pokračování v přerušeném importu, nebo možnost specifikovat více adresářů s branches), tak si určitě projděte PullRequesty na [jeho GitHubu](https://github.com/nirvdrum/svn2git/pulls), některé užitečné věci už tam jsou vyřešené, ale ještě nejsou zahrnuté v oficiální distribuci nástroje.

**2.** Že je svn2git správně nainstalovaný ověříme pomocí zadání `svn2git -h` do konzole. Měla by se zobrazit nápověda k použití nástroje.

**3.** Vytvoříme adresář, kam budeme migrovat. Například `C:\svn2git\moje-repo-git\`. A otevřeme příkazový řádek v tomto adresáři.

**4.** Spustíme migraci pomocí následujícího příkazu (nezapomeňte upravit cesty)

`svn2git svn://localhost/moje-repo PARAMETRY --authors c:\svn2git\authors.txt`

takže například:

`svn2git svn://localhost/moje-repo --rootistrunk --authors c:\svn2git\authors.txt`

Jako parametry můžeme použít tyto kombinace:

- `-v` - verbose - detailní výpis průběhu, určitě doporučuji použít
- `--rootistrunk` - všechny soubory v repositáři jsou uložený v kořenovém adresáři, nepoužíváme trunk/tags/branches
- `--trunk hlavni --tags tagy --branches vetve` - adresáře, které obsahují trunk/tags/branches. Pokud `branches` nebo `tags` nepoužíváte, tak přepínač nahraďte `--notags` nebo `--nobranches`. Pokud využíváte standardní layout SVN repositáře (trunk/tags/branches), tak je možné tyto parametry vynechat a nastaví se automaticky
- `--no-minimize-url` - chceme z repositáře zmigrovat jen podadresář (takže by příkaz vypadal např. `svn2git svn://localhost/moje-repo/podadresar --no-minimize-url --authors c:\svn2git\authors.txt`)
- `--exclude` - měl by fungovat příkaz exclude na vynechání některých adresářů, které jste někdy omylem do SVN vložili, nicméně mně nefungoval - migraci se s ním ani nepodařilo spustit, ale jde to pak vyřešit v gitu (viz dále)

**5.** Migrace poběží dlouho (jak jsem psal výše, záleží na velikosti repositáře a počtu branchí). Na konci pak svn2git udělá výše zmíněnou magii, aby repositář po migraci dočistil.


## Vyčištění repositáře
Po migraci do GITu se naskýtá jedinečná příležitost pročistit historii projektu a zbavit se například velkých, kdysi omylem přidaných a pak zase smazaných adresářů, knihoven atd.
Sice by to mělo jít pomocí přepínače `--exclude` zadat hned při migraci, ale mě to nefungovalo a řešil jsem to až poté v gitu (a podle mého transparentněji) - pomocí `filter-branch`. Ten postupně projde všechny revize a v každé může provést nějakou změnu. Než budete `filter-branch` zkoušet, tak si zmigrovaný repositář zazálohujte, abyste v případě, kdy se něco nepodaří, nemuseli znovu čekat, než se zmigruje.

Následující kód projde celou historii repositáře a smaže adresář `build`:

`git filter-branch --index-filter 'git rm -rf --cached --ignore-unmatch build/' --prune-empty --tag-name-filter cat -- --all`

Můžeme jich spustit více za sebou (pro eliminaci více adresářů), ale ty další musí začínat `git filter-branch -f`

`git filter-branch -f --index-filter 'git rm -rf --cached --ignore-unmatch tmp/' --prune-empty --tag-name-filter cat -- --all`

A poté pročistíme dočasné soubory a cache repositáře:

~~~bash
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now
git gc --aggressive --prune=now

git checkout master
~~~

Více o pročištění historie najdete na [Githubu](https://help.github.com/articles/remove-sensitive-data/) nebo [git-scm.com](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

## Kontrola migrace
Po migraci je vhodné ověřit, že se nám nic nepoztrácelo a zmigrovaný GIT repositář obsahuje stejné soubory jako migrovaný SVN repositář.

Vytvořil jsem tedy [jednoduchý skript](https://gist.github.com/mhujer/4512118), který vyexportuje GIT repositář do struktury jakou má SVN repositář (tedy trunk/tags/branches).

Podobně si uděláme SVN export a pak obě složky porovnáme třeba pomocí Total Commanderu (Commands -> Synchronize Dirs).


## Závěrem
V článku jsem se snažil ukázat, jak je možné stávající SVN repositář co nejsnadněji zmigrovat do GITu.

Pokud máte opravdu velký SVN repositář a svn2git vám nestačí (mě fungoval i pro migraci 12000 revizí se spoustou branchí), tak můžete vyzkoušet nástroj, který se jmenuje shodně [svn2git](https://techbase.kde.org/Projects/MoveToGit/UsingSvn2Git), nicméně jde o úplně něco jiného. Tento si vyvinuji vývojáři KDE, když připravovali přechod na GIT. Jim by původní svn2git na zmigrování [více než milionu revizí](https://dot.kde.org/2009/07/20/kde-reaches-1000000-commits-its-subversion-repository) asi nestačil :)

Pokud se budete snažit zmigrovat svůj SVN repositář a narazíte na nějakou komplikaci, tak se určitě zeptejte v komentářích, pokusím se vám poradit. Jestli už migraci do GITu máte za sebou, tak uvítám vaše postřehy či tipy.
