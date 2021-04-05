---
title: How to add a non-nullable column without downtime
short: Database migrations are hard for many reasons. In this article I explain how to add a non-nullable column to an application when you are using Zero-Downtime deployments.
---

Database migrations are hard for many reasons. In this article I explain how to add a non-nullable column to an application when you are using Zero-Downtime deployments.

*If you are using maintenance windows for releasing new versions, please read my article on why [Deploying only during maintenance windows is an antipattern](https://blog.martinhujer.cz/maintenance-window-antipattern/).*

## What is the problem?

Even if your deployment process is automated, there may be a delay between when the database migration runs, and the new version of the application is deployed. It may be a minute or two if you have just one application server but longer if you have a fleet of servers, and you are deploying gradually.

When you add a new non-nullable column to a table, inserts on this table will fail, until the new version of the application is deployed to all nodes, because it will try to insert NULL into a non-nullable column.

You can think *"Whatever...my deploy is fast. Nobody will notice."*, but please keep in mind that the deployment may fail at any phase - it may fail after the database migration was run but before the new code is deployed. Your production environment will be down until you can either roll back the database change or fix your deployment (npmjs down?).

Consider this example: you have simple todo-list app, and you want to allow users to decide whether the task is `simple` or `complex`. So in the new application version you add a `type` column and start inserting either `simple` or `complex` in that column.

```sql
ALTER TABLE `tasks`	ADD COLUMN `type` VARCHAR(50) NOT NULL;
```

What happens? After you run the migration and before the application deployment will finish, no tasks can be added to the application because of the error:

```sql
SQL Error (1364): Field 'type' doesn't have a default value
```

What can be done about it?

## It's all about backwards compatibility

The solution is simple - **the database changes must be backwards compatible.**

The changes performed on the database must be also compatible with the currently deployed application version.

## Step 1: add a nullable column

Instead of adding a non-nullable column, you add a nullable column first:

```sql
ALTER TABLE `tasks` ADD COLUMN `type` VARCHAR(50) NULL;
```

Even after the change, the database is still compatible with the current application version.

## Step 2: fill the column in the application

If you are using an ORM or just prefer to keep all the logic in the application (because of testability), now it's time to update the entity to always set `type` column to value `simple`. This ensures that all new records will have a proper value set.

I usually do this in the same commit as Step 1 - I add the database field and update the entity to set a new field value. When deploying, the database is updated first, which is OK as the change is backwards compatible, and the code is deployed afterwards.

Note: We are not adding any complex logic yet!

## Step 3: make the column non-nullable

Before the column can be made non-nullable, we must fill the values for the existing records. As we have only one task type now, we can do it like this:

```sql
UPDATE tasks SET `type` = 'simple' WHERE `type` IS NULL;
```

At this point, there shouldn't be any NULL values left, so we can change the column to `NOT NULL`:

```sql
ALTER TABLE `tasks` CHANGE COLUMN `type` `type` VARCHAR(50) NOT NULL;
```

## Step 4:  Start using the column

Finally, you can change the application to allow choosing task type and deploy this version without any additional database changes.

If something goes wrong with the new application changes, you can easily revert to the previous application version without any changes to database structure.

## How to remove the non-nullable column?

Removing column is quite similar but backwards:

1. Make the column nullable in the database.
2. Stop using the column in the application and deploy it.
3. Remove the column from the database.

## How to rename a column in a database?

Renaming a column with zero downtime is hard (you need to add a new column and remove the old afterwards), so do it only when really necessary.

1. Add a new nullable column to database.
2. Change the application, so it fills both columns with the same value (and deploy it).
3. Copy the values from the old column to the new column using SQL.
4. Make the new column non-nullable.
5. Change the application, so it always reads the new value (and deploy it).
6. Make the old column nullable.
7. Stop filling in the old column in the application (and deploy it).
8. Remove the old column from the database.

## Conclusion

Adding a new non-nullable column to the database without downtime is more work that just running an `ALTER TABLE`, but it is worth it because it allows you to deploy changes anytime without waiting for a maintenance window.
