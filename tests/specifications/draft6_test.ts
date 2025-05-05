import { Ajv } from "ajv";
import {
  JsonSchemaDraft6,
  jsonSchemaDraft6Specification,
} from "../../src/index.ts";
import metaSchema from "./draft6.json" with { type: "json" };

Deno.test("Draft 6 Ajv compatibility", () => {
  const ajv = new Ajv();

  ajv.addMetaSchema(metaSchema, jsonSchemaDraft6Specification.$schema);

  const schema: JsonSchemaDraft6 = {
    $schema: jsonSchemaDraft6Specification.$schema,
    type: "string",
  };

  const instance = ajv.compile(schema);

  instance("hello");
});
