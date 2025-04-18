import { data } from "@ampt/data";

export default class SecondTest {
  async up() {
    await data.set("FOO", "second");
  }

  async down() {
    await data.set("FOO", "first");
  }
}
