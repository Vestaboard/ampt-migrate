import { data } from "@ampt/data";

export default class FirstTest {
  async up() {
    await data.set("FOO", "first");
  }

  async down() {
    await data.remove("FOO");
  }
}
