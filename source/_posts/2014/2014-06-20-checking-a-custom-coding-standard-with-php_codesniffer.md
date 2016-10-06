---
title: Checking a custom coding standard with PHP_CodeSniffer
---

[PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer) is a tool for checking source code compliance with a defined coding standard. There are some predefined standards (PEAR, Zend, PSR1, PSR2, etc.), but the true power of PHP_CodeSniffer lies in the possibility of defining custom standards.

We've been using PHPCS on [Shopio](http://www.shopio.cz/) for a long time, but we've utilized just the Zend coding standard provided within the PHPCS distribution.  I recently found some time to dig deeper into PHPCS and I played a lot with custom standards.

How can I define a custom PHPCS standard?
-----------------------------------------------------
A custom standard is just an XML file (usually located in the project directory) which imports rules that already exist in PHPCS. It's usually better to import an existing standard and customize it with additional rules. And if there are some rules that you don't like, you can disable them (or reconfigure their parameters). The following example shows a custom ruleset that just imports the Zend coding standard:
~~~xml
<?xml version="1.0"?>
<ruleset name="My Custom Standard">
    <rule ref="Zend" />
</ruleset>
~~~

Using the custom ruleset is also simple, as you just need to pass the path to the XML file with the custom standard: `phpcs --standard=ruleset.xml file.php`.

As I've already mentioned, you can reconfigure the way that some of the rules behave. The first one I tried was the line length. We all use fullHD screens for development, so there is no need to limit the line length to 80 characters. With the following snippet, you can get errors and warnings only for extremely long lines (which usually indicates code-smell):
~~~xml
<rule ref="Generic.Files.LineLength">
	<properties>
		<property name="lineLimit" value="250" />
		<property name="absoluteLineLimit" value="300" />
	</properties>
</rule>
~~~

Other often-discovered issues are mixed indentation (tabs and spaces), and mixed newlines (you should always use Unix EOLs). It can be a tedious task to fix them manually, but I've got good news for you: there is a tool called [SFK](http://sourceforge.net/projects/swissfileknife/) (Swiss File Knife) which can easily handle such changes in a second.

If you are still getting hundreds of coding standards violations, I would suggest that you disable some rules by setting their severity to 0 and fix the remaining errors. When you have more time for codebase cleaning, enable some of previously disabled rules and repeat the process until you get 0 errors with all 'sniffs' (rules) enabled.
~~~xml
<rule ref="Generic.Files.LineLength">
	<severity>0</severity>
</rule>
~~~

Ignoring some of the errors
---------------------------------
You can exclude specific parts of the source code from being scanned by PHPCS by wrapping the problematic part with `//@codingStandardsIgnoreStart` and `//@codingStandardsIgnoreEnd` comments.
You should reach for those as a last resort, such as when the piece of the code cannot be refactored or rewritten. It is also good to include a reason for exclusion in the comment.


Adding more rules to the ruleset
--------------------------------------------
When you (and the whole team) are comfortable with writing code according to specified coding standard and the PHPCS is run regularly (typically as a part of a Jenkins CI build), you can be more strict and add more rules to the ruleset. It can be easily done by checking [some](https://github.com/squizlabs/PHP_CodeSniffer/blob/master/CodeSniffer/Standards/PSR1/ruleset.xml) [already](https://github.com/squizlabs/PHP_CodeSniffer/blob/master/CodeSniffer/Standards/PSR2/ruleset.xml) [existing](https://github.com/squizlabs/PHP_CodeSniffer/blob/master/CodeSniffer/Standards/Squiz/ruleset.xml) [standards](https://github.com/squizlabs/PHP_CodeSniffer/tree/master/CodeSniffer/Standards) and choosing some rules from them. You can do it incrementally - choose one rule that looks good, add it to your ruleset and see what happens after you run PHPCS.

You can check out [the coding standard we use for Shopio.cz](https://gist.github.com/mhujer/1e93face4a9d13648c91) to see everything that can be checked by PHPCS.


Enable realtime PHP_CodeSniffer checking in PHPStorm
-------------------------------------------------
[PHPStorm](http://www.jetbrains.com/phpstorm/) (great IDE btw.) has integrated support for PHP_CodeSniffer. It can work easily with standards predefined in PHP_CodeSniffer. But it can also check the code with your custom standard. The only thing you need to do is to select the "Custom" standard, which allows you to select the directory where the standard definition file is located. You can select your project directory (you have to have your custom standard file called `ruleset.xml`) and it will load the standard automatically!

See the detailed guide, [Using PHP Code Sniffer Tool](http://www.jetbrains.com/phpstorm/webhelp/using-php-code-sniffer-tool.html)


Conclusion
--------------
Are you using PHP_CodeSniffer for your projects? Do you want to show off your ruleset file? Or if you are not using PHP_CodeSniffer, I would be happy to hear why.
