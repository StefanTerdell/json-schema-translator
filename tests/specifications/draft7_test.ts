import { Ajv } from "ajv";
import {
  JsonSchemaDraft7,
  jsonSchemaDraft7Specification,
} from "../../src/index.ts";

Deno.test("Draft 7 Ajv compatibility", () => {
  const ajv = new Ajv();

  const schema: JsonSchemaDraft7 = {
    $schema: jsonSchemaDraft7Specification.$schema,
    type: "string",
  };

  const instance = ajv.compile(schema);

  instance("hello");
});
