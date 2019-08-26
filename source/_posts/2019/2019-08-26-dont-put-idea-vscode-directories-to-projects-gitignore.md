---
title: Don't put .idea and .vscode directories to project's .gitignore
short: You should configure a global .gitignore for your machine instead.
---

> **tl;dr:** Don't put `.idea` and `.vscode` directories to project's `.gitignore`. You should configure a global `.gitignore` for your machine instead.

When you are using git (or any other version control), there are some temporary files in the directory structure, which should not be included in the repository. Usually they are listed in the `.gitignore` file in the project root directory.

**What if I told you that there are other ways to exclude temporary files from the project? There are three.**

## 1. .gitignore file in the project's root
`.gitignore` in the project is the most important one. In it you should list any files or directories which are created by the application itself. Best examples are cache files, logs, local configs etc.

In the Symfony application your `.gitignore` may look like this (I included an explanation on each line):

```.gitignore
/.env.local   <-- local config
/.env.*.local   <-- local config
/var/   <-- cache and logs
/vendor/   <-- dependencies installed through Composer

# PHPUnit
/phpunit.xml   <-- local PHPUnit config used for overriding the default phpunit.xml.dist
.phpunit.result.cache   <-- PHPUnit cache files

# PHPCS
/phpcs.xml   <-- local PHPCS config used for overriding the default phpcs.xml.dist
.php_cs.cache   <-- PHPCS cache file
```

The important thing is that those files are created by the application itself by either building it, running it or doing some work on it.

## 2. Global .gitignore for your machine

Some files or directories present in the application directory are not created by the application itself, but by the operating system or other applications. Those shouldn't be excluded using the project's `.gitignore`, because they may differ from developer to developer.

Common examples are `.idea` (PhpStorm), `.vscode` (VS Code), `Thumbs.db` (Windows thumbnails cache), `.DS_Store` (some macOS cache).

There is a perfect place for them - the global `.gitignore` file for the machine. When you add something there, it is ignored in any repository, so you don't have to exclude those files in every project you happen to be working on.

You configure the path to the global `.gitignore` in the `.gitconfig` file which usually resides in your home directory:

```
# add this to ~/.gitconfig:

[core]
    excludesfile = ~/.gitignore
```

And create the `.gitignore` file in your home directory:

```.gitignore
# create ~/.gitignore

# PhpStorm
.idea

# VSCode
.vscode
```

From now on, those will be ignored in any git repository on your machine.

Quite often I see people adding those anyway. From a quick Github search you can see that there are almost 200k results for commits which mention some commonly ignored directory:

* `.vscode` [27K results](https://github.com/search?q=gitignore+.vscode&type=Commits)
* `.DS Store` [68K results](https://github.com/search?q=gitignore+.DS_Store&type=Commits)
* `.idea` [100K results](https://github.com/search?q=gitignore+.idea&type=Commits)

There is no point in adding those for the internally developed applications, as you can nudge each developer to properly configure his workstation. But if you are managing an open-source application or library, you may want to make it easier for newcomers to submit patches - even though you know it is not a clean solution. On the other hand, do you expect to receive high-quality contributions from developers who don't bother to properly configure their workstations?

## 3. `.git\info\exclude`
For the sake of completeness, I must mention the third option. You can use `.git\info\exclude` file to exclude files for a single repository. But those exclusions are not versioned, so the others won't benefit from them.

I can't remember using it, but you may find it useful in some situations.

## Conclusion

Imagine that there is a new editor called Extra Textedit with an advanced AI which really helps with coding. As it becomes more popular, there will be a flood of commits and Pull Requests with `add .eedit directory to .gitconfig`.

**Please use the global .gitignore and don't make the people on the internet spend hundreds or thousands of hours on this.**

Btw. I recommend reading the [gitignore documentation](https://git-scm.com/docs/gitignore) to learn more about the patterns you can use to exclude files.

