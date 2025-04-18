# Ampt Migrate

This is a migration library to migrate Ampt data in an organized way using `ampt run`.

## Installation

```bash
# NPM
npm i ampt-migrate --dev

# Yarn
yarn add ampt-migrate --save-dev
```

## Setup

We recommend adding the following script to your `package.json`:

```
{
    ...,
    "scripts": {
        ...,
        "migrate": "ampt run node_modules/ampt-migrate"
    }
}
```

This will allow you to run the scripts more naturally with `yarn migrate` and `yarn migrate down`, etc...

All of your migrations will go in the `/migrations` directory at the root of your project. Migrations should begin some sort of value indicating the date and time of the migration. This will help to ensure that the migrations are run in order.

## Generate a migration

We recommend generating your migration files with our `generate` command. This will ensure that your migrations are run in order and that you have given it a proper name.

```bash
yarn migrate generate the-name-of-my-migration
```

This command will generate a file that exports a class with an `up()` and `down()` method. It is best practice to use both methods so you can roll back changes if there is an issue. The generator will create a file similar to this:

```typescript
import { data } from "@ampt/data";

export default class TheNameOfMyMigration {
  async up() {}
  async down() {}
}
```

It will live in the `/migrations` directory with a filename like `1744948295184-the-name-of-my-migration.ts`.

## Running all migrations

To run all of the migrations, run:

```bash
yarn migrate
```

Note that if you want to target a specific Ampt environment, you can do so like this:

```bash
yarn migrate --env production
```

By default it will run on your developer box.

## Migrating up

To migrate up a single step, run:

```bash
yarn migrate up
```

## Migrating down

To migrate down a single step, run:

```bash
yarn migrate down
```

## Notes

This is an independently maintained repo from your friends at [Vestaboard](https://vestaboard.com). It is not owned or operated by [Ampt](https://getampt.com) in any way.
