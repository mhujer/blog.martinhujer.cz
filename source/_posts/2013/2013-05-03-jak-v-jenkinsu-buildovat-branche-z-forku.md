---
title: Jak v Jenkinsu buildovat branche z forků?
---

V [bakalářce](/bp/) jsem psal o tom, jak nastavit a používat Jenkins pro statickou analýzu PHP projektů. V té době jsme ještě na Shopiu používali Subversion, takže build byl nastavený pro trunk a všechno bylo krásné a sluníčkové.

Po přechodu na git (a Github) jsme začali používat koncept *forků* a PullRequestů (každý vývojář má svoji kopii - fork - hlavního repositáře, jednotlivé změny dělá v branchích a ty pak odešle jako PullRequest a jiný vývojář je zkontroluje a mergne).

Problémem bylo, že přestože většinou spouštíme testy lokálně před vytvořením PullRequestu, tak občas po mergnutí build na Jenkinsu spadnul na neprocházejících testech. Jenkins běží na Linuxu, vyvíjíme na Windows, takže občas šlo o problém s konci řádků, ale většinou o nějaký problém s pořadím testů (na Linuxu je jiné, a ano, vím že je velmi špatně mít testy závislé na stavu prostředí, ale lepší mít takové než žádné). A občas šlo samozřejmě o chybu a nespuštěné testy na localhostu (*"Tohle přece žádný test rozbít nemůže!"*). Takže by bylo super testy spouštět automaticky pro každou změnu v jakékoliv branchi ve forku každého vývojáře.

V Jenkinsu to nakonec šlo nastavit velmi snadno - vytvořit jsem pro každý fork samostatný projekt a nastavil cesty k jednotlivým Githubovým repositářům.
Pak je důležité nastavit, aby se v rámci buildu forku spouštěl jen phpunit a nic jiného - chceme co nejdříve vědět, že testy neprocházejí a nějaké porušení coding standards nás v tu chvíli tolik netrápí.

Druhou věcí, co je potřeba nastavit jsou branche pro buildování:
![](/data/2013/2013-05-03-jak-v-jenkinsu-buildovat-branche-z-forku/2013-05-03-ci-build-forks-01-jenkins-branches.png)

A samozřejmě nastavit, aby v případě failu přišel mail danému vývojáři:
![](/data/2013/2013-05-03-jak-v-jenkinsu-buildovat-branche-z-forku/2013-05-03-ci-build-forks-02-jenkins-notification.png)

Ještě jedna věc - je dobré, pokud mají tyhle rychlé buildy přidělené svoje vlákno, aby nečekaly dobu ve frontě, než doběhne jiný projekt (tohle zatím nastavené nemáme, ale budeme mít brzy).

Pro opensource projekty existuje super věc - [TravisCI](https://travis-ci.org/), který dělá přibližně to samé - builduje všechny vaše branche a na Githubu se dokonce stav branche ukazuje u PullRequestu

![](/data/2013/2013-05-03-jak-v-jenkinsu-buildovat-branche-z-forku/2013-05-03-ci-build-forks-03-travis-pr.png)
