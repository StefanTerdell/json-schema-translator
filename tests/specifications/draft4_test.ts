import { Ajv } from "ajv";
import {
  JsonSchemaDraft4,
  jsonSchemaDraft4Specification,
} from "../../src/index.ts";
import metaSchema from "./draft4.json" with { type: "json" };

Deno.test.ignore(
  "Draft 4 Ajv compatibility - Ignored because the meta-schema uses 'id' rather than '$id' which Ajv doesn't support",
  () => {
    const ajv = new Ajv();

    ajv.addMetaSchema(metaSchema, jsonSchemaDraft4Specification.$schema);

    const schema: JsonSchemaDraft4 = {
      $schema: jsonSchemaDraft4Specification.$schema,
      type: "string",
    };

    const instance = ajv.compile(schema);

    instance("hello");
  },
);
