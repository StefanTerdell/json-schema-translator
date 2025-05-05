import { Ajv } from "ajv";
import {
  JsonSchemaDraft2020_12,
  jsonSchemaDraft2020_12Specification,
} from "../../src/index.ts";
import metaSchema from "./draft2020_12.json" with { type: "json" };

Deno.test.ignore(
  "2020_12 Ajv compatibility - Ignored because the meta-schema uses '$dynamicAnchor' which Ajv doesn't support",
  () => {
    const ajv = new Ajv();

    ajv.addMetaSchema(metaSchema, jsonSchemaDraft2020_12Specification.$schema);

    const schema: JsonSchemaDraft2020_12 = {
      $schema: jsonSchemaDraft2020_12Specification.$schema,
      type: "string",
    };

    const instance = ajv.compile(schema);

    instance("hello");
  },
);
