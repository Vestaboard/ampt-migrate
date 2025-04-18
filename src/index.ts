import { MigrationType, migrate } from "./migrate";

import path from "path";

const migrationsPath = path.resolve(process.cwd(), "migrations");

const validTypes = ["up", "down", "all", "generate"] as MigrationType[];

const getType = () => {
  const directionArg = process.argv[2];

  if (validTypes.includes(directionArg as MigrationType)) {
    return directionArg as MigrationType;
  }

  return "all" as MigrationType;
};

const getMigration = () => {
  const migrationArg = process.argv[3];

  if (!migrationArg) {
    return null;
  }

  return migrationArg;
};

migrate({
  migrationsPath,
  type: getType(),
  migration: getMigration(),
});
