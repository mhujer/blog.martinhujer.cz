---
title: Integrating JavaScript/Node.js projects with JSHint, Mocha and Jenkins [EN]
---

> **Update 15. 9. 2013**: See how I set up [CI for JS files inside a PHP project](/integrating-javascript-files-with-jshint-phing-and-jenkins/) (using Phing)

I've set up the Continuous Integration for PHP projects on Jenkins recently. It went quite well, but the fact that CI tools for PHP are not as mature as those for Java was obvious. (Most of the PHP CI tools are ports of their Java originals.)

Apart from PHP projects, my colleague just started working on a new project, using JavaScript and Node.js, so I thought it would be nice to add it to Jenkins too.

After some experiments, I came to this:

- Java: It is normal to use CI in Java world.
- PHP: QA and CI are being adapted in PHP world.
- JavaScript: Very few people are using CI. Lots of WTF.

However, I was able to create a basic setup with Mocha for unit testing and JSHint for static analysis. Here is how I did it:

JavaScript environment
------------------------
First, I wanted to add JS environment to the server we use for PHP integration. But then I realized that Node.js is available only in Debian unstable and it has more dependencies (from unstable) then the Jenkins and Java altogether. I didn't want to break anything on this server, so I used Jenkins' [Slave feature](https://wiki.jenkins-ci.org/display/JENKINS/Distributed+builds) and connected to server used for JS development (so all the JS stuff is already running there).

Setting up Mocha
-----------------
[Mocha](http://visionmedia.github.com/mocha/) is a JavaScript test framework. It worked fine on the server:
![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-01-mocha-rspec.png)

So I just needed to find out, if it has some output usable for CI. Surprisingly, it has and it works fine despite the fact, it is [poorly documented](http://visionmedia.github.com/mocha/#xunit-reporter) :-)
![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-03-mocha-shell-xunit.png)


Setting up JSHint
------------------
JSHint can be installed via npm:
~~~bash
npm install jshint -g
~~~

It checks JS like this:
~~~bash
jshint myfile.js
~~~

And yes, it can produce XML report:
~~~bash
jshint ./app --jslint-reporter > jshint.xml
~~~

Making it all work
-------------------
You need [Copy To Slave](https://wiki.jenkins-ci.org/display/JENKINS/Copy+To+Slave+Plugin), [xUnit](https://wiki.jenkins-ci.org/display/JENKINS/xUnit+Plugin) and [Violations](https://wiki.jenkins-ci.org/display/JENKINS/Violations) plugins in Jenkins.

We will need two Jenkins jobs. First will run all the stuff, gather the XMLs with results and trigger the reporting job. The second job will just process results and display them. This is necessary, because I realized that Violations plugin runs earlier that the Copy to Slave, and therefore, it had no data.

In the first job, we bind it to our Node.js slave and add a build step (Execute shell):
~~~bash
cd /var/jenkins/workspace/nodejs && mocha -R xunit > xunit.xml && jshint ./app ./public/javascripts/app/ --config .jshintrc --jslint-reporter > jshint.xml || exit 0
~~~

Then we need to gather the results from slave node via Copy to Slave plugin:
![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-04-copy-to-slave.png)

Second job
------------
Second job has no build steps, it only processes the results. The test results worked for me, when I set them as PHPUnit ones:

![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-05-phpunit.png)

The JSHint results can be processed via Violations plugin:
![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-06-violations.png)

However, there is an issue when using Violations plugin for JS files. It is not possible to browse the errors in files, as it is possible for other reports. But I'm not only one [who experiences this issue](https://groups.google.com/forum/?fromgroups#!topic/jenkinsci-users/cUfZimHHXqs).

Conclusion:
-----------
We have basic continuous integration for JS code up and running.
![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-07-jslint.png)

![](/data/2012/2012-04-18-integrating-javascript-nodejs-jenkins/2012-04-14-JS-CI-08-tests.png)

JavaScript community is growing strong, so I hope that there will soon be loads of different CI tools for JS. I'm only afraid of their fragmentation (There are many new JS frameworks built every day).
