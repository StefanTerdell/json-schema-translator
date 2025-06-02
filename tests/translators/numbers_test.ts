import { assertEquals } from "@std/assert";
import { jsonSchemaDraft4Specification } from "../../src/index.ts";
import {
  JsonSchemaDraft6,
  jsonSchemaDraft6Specification,
} from "../../src/specifications/draft6.ts";
import { translateNumberKeywords } from "../../src/translators/numbers.ts";

Deno.test("MultipleOf keyword", () => {
  const schema: JsonSchemaDraft6 = {};

  translateNumberKeywords({
    input: {
      schema: {
        multipleOf: 3,
      },
      settings: jsonSchemaDraft4Specification,
    },
    output: {
      schema,
      settings: jsonSchemaDraft6Specification,
    },
    unhandledKeys: new Map(),
    copyJson: "shallow",
    path: [],
    seen: new Map(),
    handledKeys: new Set(),
  });

  assertEquals(schema, {
    multipleOf: 3,
  });
});
