import { assertEquals } from "@std/assert";
import { jsonSchemaDraft4Specification } from "../../src/index.ts";
import {
  JsonSchemaDraft6,
  jsonSchemaDraft6Specification,
} from "../../src/specifications/draft6.ts";
import { translateMultipleOf } from "../../src/translators/keywords/multipleOf.ts";

Deno.test("MultipleOf keyword", () => {
  const schema: JsonSchemaDraft6 = {};

  translateMultipleOf({
    from: {
      schema: {
        multipleOf: 3,
      },
      specification: jsonSchemaDraft4Specification,
    },
    into: {
      schema,
      specification: jsonSchemaDraft6Specification,
    },
    unhandledKeys: new Map(),
    copyJson: "shallow",
    path: [],
    seen: new Map(),
    handledKeys: new Set(),
    unionLocations: new Map(),
  });

  assertEquals(schema, {
    multipleOf: 3,
  });
});
