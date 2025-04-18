// import-sort-ignore

import { data, reset } from "ampt-data-mock";

jest.mock("@ampt/data", () => ({
  data,
}));

import { migrate, MIGRATION_STATE_KEY } from "../migrate";
import path from "path";

describe("Migrate", () => {
  afterEach(reset);

  describe("All", () => {
    it("Should migrate all", async () => {
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "all",
      });

      const dataChanged = await data.get("FOO");
      const migrationState = await data.get(MIGRATION_STATE_KEY);

      expect(dataChanged).toBe("second");
      expect(migrationState).toEqual("2-second-test.ts");
    });
  });

  describe("Up", () => {
    it("Should migrate up", async () => {
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "up",
      });

      const dataChanged = await data.get("FOO");
      const migrationState = await data.get(MIGRATION_STATE_KEY);

      expect(dataChanged).toBe("first");
      expect(migrationState).toEqual("1-first-test.ts");
    });

    it("Should migrate up twice", async () => {
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "up",
      });
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "up",
      });
      const dataChanged = await data.get("FOO");
      const migrationState = await data.get(MIGRATION_STATE_KEY);
      expect(dataChanged).toBe("second");
      expect(migrationState).toEqual("2-second-test.ts");
    });
  });

  describe("Down", () => {
    it("Should migrate down", async () => {
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "up",
      });
      await migrate({
        migrationsPath: path.resolve(__dirname, "../migrations"),
        type: "down",
      });
      const dataChanged = await data.get("FOO");
      const migrationState = await data.get(MIGRATION_STATE_KEY);

      expect(dataChanged).toBeUndefined();
      expect(migrationState).toBeUndefined();
    });
  });

  it("Should migrate down from the top", async () => {
    await migrate({
      migrationsPath: path.resolve(__dirname, "../migrations"),
      type: "all",
    });
    await migrate({
      migrationsPath: path.resolve(__dirname, "../migrations"),
      type: "down",
    });
    const dataChanged = await data.get("FOO");
    const migrationState = await data.get(MIGRATION_STATE_KEY);
    expect(dataChanged).toEqual("first");
    expect(migrationState).toEqual("1-first-test.ts");
  });

  it("Should do nothing if there is no more migrations to go down from", async () => {
    await migrate({
      migrationsPath: path.resolve(__dirname, "../migrations"),
      type: "down",
    });
    const dataChanged = await data.get("FOO");
    const migrationState = await data.get(MIGRATION_STATE_KEY);

    expect(dataChanged).toBeUndefined();
    expect(migrationState).toBeUndefined();
  });
});
