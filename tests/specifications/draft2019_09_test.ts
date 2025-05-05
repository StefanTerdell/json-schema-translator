import { Ajv } from "ajv";
import {
  JsonSchemaDraft2019_09,
  jsonSchemaDraft2019_09Specification,
} from "../../src/index.ts";
import metaSchema from "./draft2019_09.json" with { type: "json" };

Deno.test.ignore(
  "2019_09 Ajv compatibility - Ignored because the meta-schema uses '$recursiveAnchor' which Ajv doesn't support",
  () => {
    const ajv = new Ajv();

    ajv.addMetaSchema(metaSchema, jsonSchemaDraft2019_09Specification.$schema);

    const schema: JsonSchemaDraft2019_09 = {
      $schema: jsonSchemaDraft2019_09Specification.$schema,
      type: "string",
    };

    const instance = ajv.compile(schema);

    instance("hello");
  },
);
