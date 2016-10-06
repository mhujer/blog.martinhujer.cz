---
title: Integrating JavaScript files with JSHint, Phing and Jenkins [EN]
---

I wrote an article about [integrating JavaScript Node.js projects with Jenkins](/integrating-javascript-nodejs-jenkins/) more than year ago. Recently I wanted to solve a bit different issue. I wanted to add [JSHint](http://jshint.com/) validation as a part of a Phing build (our project is PHP/Zend Framework based with some JS files).

It can be done it a few steps (I will go through them in more detail later):

1. Install Node.js
2. Install JSHint
3. Add JSHint task to a buildfile
4. Set up reporting in Jenkins


1) Installing Node.js
------------------------------------------------------------
Node.js can be installed via [MSI installer on Windows](http://nodejs.org/download/), via [package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) in most Linux distros (except for Debian stable which we are using). So I had to compile it myself (Ubuntu PPA packages does not work because of unmet dependencies). As long as we use Node.js just for JSHint validation, there is no need to upgrade it to latest versions, and therefore I put the package in our salt repository and it can be installed automatically next time (we have whole Jenkins server [salted](http://saltstack.org/)).

2) Installing JSHint
------------------------------------------------------------
If you have the Node.js running, installing JSHint is pretty easy. You just run
~~~
npm install jshint -g
~~~
To verify that it is installed correctly, run `jshint -v` which should print the jshint version.


3) Adding JSHint task to a buildfile
------------------------------------------------------------
This is the hardest step in the whole process. There was no JsHintTask in the standard Phing distribution, so I had to write it myself. I have [issued a PullRequest](https://github.com/phingofficial/phing/pull/237), so it may be part of some future version of Phing.

The first step is to download the task and put it somewhere, where Phing can access it. Next code snippet assumes, that it is a part of the project and it is located in the `support/phing/JsHintTask.php` file.

Second step is to link the file from the buildfile:

~~~xml
<path id="project.class.path">
	<pathelement dir="${project.basedir}/support/phing/"/>
</path>

<taskdef name="jshint" classname="JsHintTask">
	<classpath refid="project.class.path"/>
</taskdef>
~~~

Last step is to create a `jshint` target (you can check the detailed description of the parameters in the [docs](https://github.com/phingofficial/phing/pull/237/files#L2L3723)). Most important is the `checkstyleReportPath` attribute, which defines where the checkstyle report will be saved and the `fileset` element, which defines which files should be checked.

~~~xml
<target name="jshint" description="Javascript Lint">
	<mkdir dir="${project.basedir}/build/checkstyle-jshint"/>
	<jshint
			haltOnError="false"
			haltOnWarning="false"
			checkstyleReportPath="${project.basedir}/build/checkstyle-jshint/checkstyle-jshint.xml"
		>
		<fileset dir="${project.basedir}/public_html/www/js">
			<include name="**/**.js"/>
			<exclude name="js-cache/**"/>
			<exclude name="jquery-1.*.min.js"/>
			<exclude name="bootstrap/bootstrap.js"/>
		</fileset>
	</jshint>
</target>
~~~

JSHint supports config file, where you can set which issues you want to get reported. It is easy - you just create `.jshintrc` file in the project root directory and JSHint will load it automatically. File should contain a JSON object with configuration options. See the [docs](http://jshint.com/docs/config/). And you can check the `.jshintrc` file we are using:
~~~javascript
{
	"maxerr"	:	1000,
	"camelcase"	:	true,
	"immed" 	:	true,
	"latedef"	:	true,
	"newcap"	:	true,
	"quotmark"	:	"single",
	"trailing"	:	true,
	"jquery"	:	true,
	"white"		:	true,
	"globals"	:	{}
}
~~~


4) Setting up the reporting in Jenkins
------------------------------------------------------------
Just add a Post-build action - Report Violations and put the path in there.
![](/data/2013/2013-09-15-integrating-javascript-files-with-jshint-phing-and-jenkins/2013-09-15-jshint-01-violations.png)

After the build finishes, you can check the errors in the Violations section of the build report.



Conclusion
-------------
It is really easy to set-up JavaScript files validation in a PHP project, so why not have it? If you have any trouble setting it up, just ask in the comments and I'll try to help you. I would be also happy, if you share your way of validating JS files.
