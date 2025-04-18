import * as fs from "fs";

import { KeyValue, data } from "@ampt/data";

import { kebabToPascalCase } from "./kebabToPascalCase";
import path from "path";

export type MigrationType = "up" | "down" | "all" | "generate";

interface IMigrate {
  migrationsPath: string;
  type: MigrationType;
  migration?: string | null;
}

interface IMigrationTypeInput {
  currentMigrationState?: KeyValue<string> | string | null;
  migrationFiles: string[];
  migrationsPath: string;
}

export const MIGRATION_STATE_KEY = `__MIGRATION_STATE`;

const migrateAll = async ({
  currentMigrationState,
  migrationFiles,
  migrationsPath,
}: IMigrationTypeInput) => {
  for (const file of migrationFiles) {
    const Migration = (await import(`${migrationsPath}/${file}`)).default;
    const migrationInstance = new Migration();

    if (currentMigrationState && currentMigrationState[file]) {
      continue;
    }

    await migrationInstance.up();
    await data.set(MIGRATION_STATE_KEY, file);
    console.info(`Migrated up to ${file} ⬆️`);
  }
  console.info(`Migration complete 🚀`);
};

const up = async ({
  currentMigrationState,
  migrationFiles,
  migrationsPath,
}: IMigrationTypeInput) => {
  const migration = migrationFiles.find((file) => {
    return !currentMigrationState || currentMigrationState !== file;
  });

  if (!migration) {
    return;
  }

  const Migration = (await import(`${migrationsPath}/${migration}`)).default;
  const migrationInstance = new Migration();

  await migrationInstance.up();
  await data.set(MIGRATION_STATE_KEY, migration);
  console.info(`Migrated up to ${migration} ⬆️`);
  console.info(`Migration complete 🚀`);
};

const down = async ({
  currentMigrationState,
  migrationFiles,
  migrationsPath,
}: IMigrationTypeInput) => {
  const migration = migrationFiles.find((file) => {
    return currentMigrationState && currentMigrationState === file;
  });
  const previousMigration =
    migrationFiles[migrationFiles.indexOf(migration) - 1];

  if (!migration) {
    await data.remove(MIGRATION_STATE_KEY);
    return;
  }

  const Migration = (await import(`${migrationsPath}/${migration}`)).default;
  const migrationInstance = new Migration();

  await migrationInstance.down();

  if (previousMigration) {
    console.info(`Migrated down to ${previousMigration} ⬇️`);
    await data.set(MIGRATION_STATE_KEY, previousMigration);
  } else {
    console.info(`Migrated down to the beginning of your migrations ⬇️`);
    await data.remove(MIGRATION_STATE_KEY);
  }
  console.info(`Migration complete 🚀`);
};

export const migrate = async (input: IMigrate) => {
  const { migrationsPath, type, migration } = input;

  if (!fs.existsSync(migrationsPath)) {
    fs.mkdirSync(migrationsPath);
  }

  if (type === "generate") {
    if (!migration) {
      console.error("Please provide a migration name");
      process.exit(1);
    }

    const className = kebabToPascalCase(migration);
    fs.writeFileSync(
      path.join(migrationsPath, `${Date.now()}-${migration}.ts`),
      `import { data } from "@ampt/data";

export default class ${className} {
  async up() {}
  async down() {}
}`
    );
    console.info(`We generated your migration. 🚀`);
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsPath);

  const currentMigrationState = await data.get<string>(MIGRATION_STATE_KEY);

  const migrateInput = {
    currentMigrationState,
    migrationFiles,
    migrationsPath,
  };

  switch (type) {
    case "all":
      return migrateAll(migrateInput);
    case "up":
      return up(migrateInput);
    case "down":
      return down(migrateInput);
  }
};
