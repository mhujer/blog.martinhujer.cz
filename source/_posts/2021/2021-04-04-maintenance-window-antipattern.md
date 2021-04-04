---
title: Deploying only during maintenance windows is an antipattern
short:
---

In this article I argue that deploying the new web application versions only during a maintenance window is an antipattern, and you should strive to have Zero-Downtime deployments.

It has long been a common practice to take a website or a web application down regularly and deploy a new version during that downtime. It is easy: You just schedule a 3-hour maintenance window between midnight and 3AM, make the application return _"We are performing maintenance"_ page with an HTTP 503 code and do the upgrade or whatever during that time. And try to get some sleep afterwards.

Apart from the obvious advantages - nobody is messing with the application when you are releasing a new version, there are many reasons why it is not such a good idea:

1. There is no natural maintenance window
2. It's better to sleep at night
3. The computers never sleep
4. Business won't wait for your maintenance window
5. Small changes are safer

## 1. There is no natural maintenance window

There are natural maintenance windows only for a small part of the web applications - e.g., when you are working on a B2B application which is used only by business only during their business hours, and they are all in one time-zone.

When you are making a B2C application - ecommerce website or something like that, there is always going to be someone using your application. There are people working shifts, so they may be bored during a night shift and want to browse your website.

Or you go global and suddenly there is always someone's afternoon somewhere.

If you schedule maintenance window to the time when someone needs to use the application, you will annoy your existing users and lose any potential new customers who will visit the application during downtime.

And there are some questions which needs answering: What happens when someone filled a form a minute before the maintenance window and tries to submit it during the maintenance window? Will it fail? How? What about the data they entered?

Note: At least don't forget to send [proper HTTP 503 status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503) or your temporary page may be indexed by search engines.

## 2. It's better to sleep at night

I'm a morning person (usually getting up at 7 AM, back at bed at 11 PM) so staying awake beyond midnight is really hard, and I guess I won't be very good at debugging a thorny production issue at 3 AM.

The more important is that messing up your sleep rhythm is bad for your health. If I stayed up until 3 AM, I would be useless the next day even after sleeping in. And my sleep rhythm will be disturbed for a few days at least. So, it is not worth it health- and productivity-wise.

## 3. The computers never sleep

The computers never sleep, so even if there is a natural maintenance window, there may still be API calls coming to your application, webhooks may be called, etc. And depending on the 3rd party error handling, those may or may not be retried later.

## 4. Business won't wait for your maintenance window

If you can deploy new features only once every two weeks, the businesspeople in your company won't be happy having to wait up two weeks for a small change to go live. If they worked somewhere else where Zero-Downtime deployments where common, they would see you as incompetent.

Don't forget that if there is a competition moving faster than you, you risk losing customers to them.

## 5. Small changes are safer

Imagine there are 20 different changes in the release, and something breaks, or the load suddenly increases after the deployment. How will you debug it? It can be any of those 20 changes. If you did deploy only one change it would be both easier to debug the problem or rollback the change completely.

How do you rollback a big release with many database changes? And what if you discover the issue the day after the release? You cannot just revert to the older backup. You are out of luck.

## So, what should we do instead?

- Automate the deployment process
- Deploy each change separately
- Be careful about database migrations (I will write a separate post about database migrations without downtime)
- Even if it may seem that the change warrants a maintenance window, try to think hard how to decompose it into several steps which may be deployed gradually without downtime.

## Conclusion

When you consider the downsides discussed above, it does not seem that bad to spend some time on making your deployment process Zero-Downtime, right?

Please note that there are rare occasions when it is dramatically easier to schedule the maintenance window instead of doing it gradually (e.g., migrating the database to a new server). But those should be rare once-a-year special occasions, not part of your regular deployment process.
