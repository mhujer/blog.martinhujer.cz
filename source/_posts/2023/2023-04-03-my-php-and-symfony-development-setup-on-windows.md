---
title: My PHP and Symfony Development Setup on Windows
---

I've been using the same setup for a local PHP and Symfony development since 2017 and now and then I still see someone is using a less efficient setup, so I decided it deserves a write-up.

## PHP Setup
Let's start with PHP itself. There are several options for running PHP locally. You can use XAMPP, WAMP, Docker or install PHP directly. Each of them has its pros and cons and my setup uses just plain PHP from windows.php.net.

All you need to do is to download the most recent PHP from [windows.php.net](https://windows.php.net/download/)  (use the ZIP version _VS16 x64 Non Thread Safe_) and unpack it somewhere. In my case I use `C:/dev/php` to make the path short.

Next step is adding it to the system PATH so you can run it from anywhere with just `php`. (Google a guide on how to add a directory to system PATH if you are not sure how to do it.)

Now you can run `php -v` from a command line and it should print the PHP version (btw. I use [cmder](https://cmder.app/) as my command line tool and it's awesome!).

## Using multiple PHP versions
Things usually get tricky, when you need to maintain more applications where each requires a different version of PHP.

What works great for me is to version the PHP installation directory using git. I create a separate branch for each version (`php81`, `php82` etc.) and checkout them when I need to work on some older stuff. I recommend using [orphan branches](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---orphanltnew-branchgt) as it makes the git history cleaner.

When upgrading to a newer patch version (e.g., 8.2.3 &rarr; 8.2.4), I delete almost everything in the directory and unpack a newer version there. I keep the `php.ini` and some other files (see the next parts of the post).

I push the repo to GitLab which allows me to maintain the same PHP configuration across multiple devices.

Another advantage of this approach is that you can easily test upcoming PHP versions when they are in the beta phase to help discover potential bugs in PHP or incompatibilities in your app.

## Composer Setup
To install Composer I recommend [downloading](https://getcomposer.org/download/) `composer.phar` file (lower on the page, in _"Manual Download"_ section) and placing it in the php directory (so it is versioned in git with the rest of the PHP setup - it was quite useful during transition from Composer v1 to v2 when usually the projects running on newer PHP versions used Composer v2 and older ones on older PHPs used v1).

To be able to run Composer with `composer` command from anywhere, create a `composer.cmd` file in the php directory with the following content:
```cmd
php c:\dev\php\composer.phar %*
```

It runs `composer.phar` with `php` and passes all the parameters you provided.

Just don't forget to keep the `composer.phar` and `composer.cmd` files when upgrading the PHP as described above.

## Webserver
The best way to run a Symfony application during development is to use the [Symfony CLI](https://symfony.com/download). But instead of using Scoop as they suggest I just download the zip linked bellow the _"Binaries"_ heading and unzip it so the `symfony.exe` is in `C:/dev/php/symfony.exe`.

As we already have the `C:/dev/php` directory in the system PATH, we should be able to run `symfony` from command line anywhere.

To start the webserver, navigate to Symfony project directory and run `symfony server:start`. If you are using it for the first time, it will prompt you to install a newly generated root certificate so it can provide `https://` for locally running application.

After starting, it will display something like this, and you should be able to access the URL in the browser.
```
[OK] Web server listening
      The Web server is using PHP CGI 8.2.4
      https://127.0.0.1:8000
```

## Database, RabbitMQ, etc. in Docker
I prefer to [run everything else besides the webserver in Docker](/jak-zacit-s-dockerem-od-zavislosti/) (I mean MySQL, RabbitMQ, some mail catcher etc.). There are two main advantages:
1. it allows you to easily switch versions either when upgrading the project or when working on multiple projects
2. it is easy to run Linux-first tools even if you use Windows for development

You can do it by adding a `docker-composer.yml` file to you project and running `docker-compose up` from the CLI:

```yaml
version: '3'
services:
    database:
        image: mariadb:10.3.18
        environment:
            - MYSQL_ROOT_PASSWORD=pass
        command:
            - --character-set-server=utf8mb4
            - --collation-server=utf8mb4_unicode_ci
        ports:
            - "9101:3306"

    mailer:
        image: maildev/maildev
        ports:
            - "1080:1080"
            - "1025:1025"

    rabbitmq:
        image: rabbitmq:3.11.11-management
        ports:
            - 5672:5672
            - 15672:15672
```

Symfony CLI [supports Docker](https://symfony.com/doc/current/setup/symfony_server.html#docker-integration) therefore if you use standard ports in `docker-compose.yaml`, it will recognize the services and will automatically configure the ENV variables such as `DATABASE_URL` accordingly.

To utilize this automatic ENV variables setup for CLI, you have run the Symfony Commands with `symfony console`, instead of `php bin\console`:
```cmd
symfony console doctrine:migrations:migrate
```

For accessing the database outside the application, I use [HeidiSQL](https://www.heidisql.com/) which is Windows application for managing the database (I like it more than web tools such as Adminer or PhpMyAdmin).

## Being efficient with aliases
I like using [Composer Scripts](https://blog.martinhujer.cz/have-you-tried-composer-scripts/) to run dev tools included in the project such as PHPStan or PHP_CodeSniffer, but I hate typing long commands, so I have created an alias script in `C:/dev/php/x.cmd`:
```cmd
php c:\dev\php\composer.phar %*
```

With that I can run `cs` script with `x cs` instead of `composer cs`. Similarly, for `composer install`, I just run `x inst`.

For running the Symfony Commands, I use another alias: `c.cmd`:
```cmd
symfony console %*
```

Which allows me to run Symfony commands this way: `c doctrine:migrations:migrate`

There is a cool feature in Symfony Command component which allows you to shorten the commands as long they are still unique. It means that `c d:m:m` will run `doctrine:migrations:migrate` if there isn't another command with same starting letters. And because Composer uses Symfony Command under the hood, the same applies to any Composer commands.

## Conclusion

What setup do you use for local development? Let me know in the comments! I would be delighted to learn how to optimize my setup even further.

