---
title: Sencha Touch je mrtvá. Zabil ji Ext JS 6
---

Ještě před krátkou dobou jsem jako docela dobrý způsob tvorby mobilních aplikací doporučoval vytvoření webové aplikace pomocí Sencha Touch a její následné zabalení jako nativní pomocí Apache Cordova. Nicméně vzhledem k novinkám už to za dobrý způsob nepovažuju. Konkrétně kvůli Senche.

Sencha Touch vyvíjela společnost Sencha Inc a byla k dispozici zdarma i pro komerční použití. Samozřejmě bylo možné si od nich dokoupit komerční podporu. Kromě Sencha Touch prodávali jako hlavní produkt framework Ext JS (na kterém byla Sencha Touch částečně postavena).

Na podzim Sencha změnila licenční model Ext JS a místo jednovývojářské licence začala nabízet nejméně bundle pro pět vývojářů ([za necelých $5000 ročně](https://www.sencha.com/store/extjs/) - překlikněte si *QTY*). Na fóru je k tomu více než [stostránková diskuze](https://www.sencha.com/forum/showthread.php?292734-Is-Sencha-********-single-developers) Když se někdo ptal sales oddělení, co má dělat, pokud ve firmě vyvíjí v Ext JS sám nebo ve dvou a nepotřebují licenci pro pět vývojářů. Prý jim nezbývá nic jiného než si koupit licenci pro pět vývojářů, že se jim bude hodit až budou růst. Sencha se zřejmě chce více zaměřit na velké firmy a malé firmy a jednotlivce trochu hází přes palubu.

Dokud byla Sencha Touch k dispozici zdarma i pro komerční použití, tak mi to jako problém nepřišlo. V létě vyšel Ext JS 6, který jako jednu z hlavních novinek přinesl zaintegrování Sencha Touch, takže je na jednom frameworku možné snadno vytvářet jak desktopové, tak mobilní aplikace. Zní to sice dobře, ale problém je, že to znamená konec vývoje Sencha Touch, která byla k dispozici zdarma. A Ext JS jde koupit jen v tom epicky drahém bundlu pro pět vývojářů.

Výsledkem je, že pokud jste samostatný vývojář nebo mobilní aplikace vytváříte jen občas, tak nedává smysl Sencha Touch, resp. Ext JS používat.

Jako rozumná náhrada Sencha Touch se zdá [Ionic Framework](http://ionicframework.com/), který je postavený na Angularu a vývoj se posouvá hodně rychle dopředu. Případně je možné opustit Cordovu a pro vývoj zvolit [Xamarin](https://www.xamarin.com/), který umožňuje vytvářet nativní aplikace pro více platform z jednoho (C#) kódu a jen různých UI.

Další dva rozlobené články v angličtině:

  - [Does EXT JS 6 Mean the End of Sencha Touch for Single Developers?](http://www.joshmorony.com/does-ext-js-6-mean-the-end-of-sencha-touch-for-single-developers/)
  - [Sencha Roadshow London: ExtJS 6.X Thoughts](http://senchatouchdev.com/wordpress/2015/05/21/sencha-roadshow-london-extjs-6-x-thoughts/)
