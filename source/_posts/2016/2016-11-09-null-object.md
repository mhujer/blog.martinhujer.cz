---
title: Návrhový vzor Null Object
short: V článku předvedu, jak pomocí návrhového vzoru Null Object můžeme zjednodušit kód
showPhpTrainingAd: true
---

V článku předvedu, jak pomocí návrhového vzoru Null Object můžeme zjednodušit kód. Budu se snažit ukázat maximum příkladů a jen minimum teorie (na tu vás odkážu jinam).

Prvním příkladem je *volitelná* závislost. V následující ukázce to je `$logger`. Buď ho máme nastavený a v tom případě logujeme nebo nemáme a nelogujeme.

```php
class DataProcessor
{
	/** @var LoggerInterface */
	private $logger;

	public function setLogger(LoggerInterface $logger)
	{
		$this->logger = $logger;
	}

	public function processData($data)
	{
		if ($this->logger !== null) {
			$this->logger->log('Processing started!');
		}

		// some work...

		if ($this->logger !== null) {
			$this->logger->log('Processing finished!');
		}
	}
}

interface LoggerInterface
{
	public function log($message);
}

class StdoutLogger implements LoggerInterface
{
	public function log($message)
	{
		echo $message;
	}
}
```

Použití třídy pak může vypadat takto

```php
$processor = new DataProcessor();
$processor->setLogger(new StdoutLogger());
$processor->processData([]); // máme a logujeme

$processorWithoutLogging = new DataProcessor();
$processorWithoutLogging->processData([]); // nemáme a nelogujeme
```

Kromě toho, že dependency injection pomocí setteru je špatně (existuje instance v nekonzistentním stavu), tak kontroly `null` zbytečně zesložiťují metodu `processData()`.

Tady přichází ke slovu návrhový vzor Null Object. Místo, abychom se rozhodovali, jestli logger nastavíme nebo ne, tak ho nastavíme vždy. Ideálně pomocí contructor injection. Díky tomu můžeme odebrat podmínky v metodě `processData()`:

```php
class DataProcessor
{
	/** @var LoggerInterface */
	private $logger;

	public function __construct(LoggerInterface $logger)
	{
		$this->logger = $logger;
	}

	public function processData($data)
	{
		$this->logger->log('Processing started!');

		// some work...

		$this->logger->log('Processing finished!');
	}

}
```

Protože bez instance loggeru nemůžeme vytvořit `DataProcessor`, vytvoříme třídu `NullLogger`, která implementuje rozhraní `LoggerInterface`, ale nikam neloguje.

```php
class NullLogger implements LoggerInterface
{
	public function log($message)
	{
		// intentionally does nothing
	}
}

$processor = new DataProcessor(new StdoutLogger());
$processor->processData([]); // máme a logujeme

$processorWithoutLogging = new DataProcessor(new NullLogger());
$processorWithoutLogging->processData([]); // máme, ALE NELOGUJEME
```

Odsunuli jsme starost o `null` mimo třídu, čímž jsme elegantně zjednodušili kód `DataProcessor`. Jde vlastně o příklad použití polymorfismu - místo speciálního chování podle typu delegujeme řešení na tu samotnou třídu.


## Co situace, kdy to potřebuji rozlišit?

Samozřejmě ne vždy to půjde takhle snadno jako v tomto případě. Cílem návrhového vzoru je zjednodušit většinu použití, ale zároveň umožnit rozlišení tam, kde to je nezbytné.

Jako první možnost odlišení vás asi napadne:
```php
if ($this->logger instanceof NullLogger) {
```
Ale to by znamenalo porušení Dependency Inversion Principle a zároveň bychom nemohli použít několik různých Null objektů. Fowler (2012) na to navrhuje dvě řešení:

1. V interface vytvořit metodu `public function isNull(): bool;`, která v konkrétních implementacích bude buď vracet `true` nebo `false`.
2. Pokud nemůžeme měnit rozhraní a ostatní třídy, můžeme vytvořit `interface Null { }` a implementovat ho v našich Null třídách.

Použití  pak může vypadat takto:

1. speciální metoda:
```php
if ($this->logger->isNull()) {
    // chování pro null
}
```
2. implementované rozhraní: 
```php 
if ($this->logger instanceof Null) {
    // chování pro null
}
```


## Jak refaktorovat stávající kód?

Fowler ukazoval Null Object v knize *Refactoring - Improving the Design of Existing Code* (Fowler, 2012, p260) a mně se hodně líbilo, jak to refaktoroval po malých "baby-steps" (co nejmenší bezpečné kroky, čím se minimalizuje riziko, že něco rozbijeme). Zjednodušeně je tu popíšu na od něj vypůjčeném a upraveném příkladu.

Máme zákazníka, který má přiřazenou úroveň slev:
```php
class DiscountLevel
{
	const NONE = 'none';
	const PREMIUM = 'premium';
}

class Customer
{
	public function getDiscountLevel() { ... }
}
```

A použití zákazníka vypadá takto:
```php
if ($customer === null) {
	$discountLevel = DiscountLevel::NONE;
} else {
	$discountLevel = $customer->getDiscountLevel();
}

// případně takto
if ($customer !== null) {
	$entityManager->persist($customer);
}
```

Prvním krokem refaktoringu je přidání metody `isNull()` a vytvoření `NullCustomer` jako potomka `Customer` (jen se změněným chováním metody `isNull()`). Zároveň v tomto kroku musíme změnit **všechna** porovnání s `null` na volání `->isNull()` (`$customer` už nikdy nebude `null`, takže by to jinak rozbilo stávající kód)

```php
class Customer
{
	public function getDiscountLevel() { ... }

	public function isNull()
	{
		return false;
	}
}

class NullCustomer extends Customer
{
	public function isNull()
	{
		return true;
	}
}

if ($customer->isNull()) {
	$discountLevel = DiscountLevel::NONE;
} else {
	$discountLevel = $customer->getDiscountLevel();
}

if (!$customer->isNull()) {
	$entityManager->persist($customer);
}
```

Následně budeme procházet jednotlivá použití a zkoumat, zda je pomocí Null Objectu můžeme zjednodušit.

Nejdříve se podíváme na `getDiscountLevel()`. Stačí, pokud tu metodu v `NullCustomer` překryjeme, aby vždy vracela `DiscountLevel::NONE` a můžeme podmínku úplně zrušit.

```php
// Customer se nemění

class NullCustomer extends Customer
{
	public function isNull() {...};

	public function getDiscountLevel()
	{
		return DiscountLevel::NONE;
	}
}

// tady jsme zrušili složitý if
$discountLevel = $customer->getDiscountLevel();
```

V druhé situaci, při persistování do databáze, se podmínky nezbavíme. Šlo by to vyřešit úpravou persistování, aby kontrolovalo, jestli nepředáváme objekt implementující `Null` interface a to důsledně implementovat u všech Null objektů. Ale to by spíš vedlo ke znepřehlednění než zpřehlednění.

```php
// tady if zůstal
if (!$customer->isNull()) {
	$entityManager->persist($customer);
}
```

Na složitějším příkladu jsme si ukázali, jak můžeme zjednodušit existující kód zavedením Null Objectu a že ne ve všech situacích to je možné.

## Pár stručnách poznámek

- Null Object se často používá při implementaci návrhového vzoru Strategy (jako nejjednodušší strategie, kterou můžeme vytvořit)
- Klidně je možné vytvořit více různých Null objektů pro jeden reálný typ
- Null objekt by se nikdy neměl změnit v reálný objekt (pokud to potřebujeme, tak by to od začátku měl být reálný objekt, který se jen dočasně chová jako Null objekt)


## Shrnutí

Návrhový vzor Null Object se snaží řešit opakovaný kód pro kontrolu, zda máme k dispozici instanci třídy. Místo porovnávání s `null` vytvoříme třídu se strejným rozhraním, ale s prázdným nebo defaultním chováním. Tím odsunujeme problém z kódu, který třídu používá o úroveň výše.

**Slyšeli jste o tomto návrhovém vzoru už dříve? Používáte ho ve své aplikaci? Budu rád, pokud se podělíte o další příklady v komentářích.**

## Zdroje

- FOWLER, Martin, Kent BECK, John BRANT, William OPDYKE a Don ROBERTS. *Refactoring: Improving the Design of Existing Code.* Addison-Wesley, 2012. ISBN 9780133065268.
- <https://www.tutorialspoint.com/design_pattern/null_object_pattern.htm>
- <https://sourcemaking.com/design_patterns/null_object>
- <https://www.cs.oberlin.edu/~jwalker/nullObjPattern/>
