import { assertEquals } from "@std/assert";
import {
  JsonSchemaDraft2020_12,
  jsonSchemaDraft2020_12Specification,
} from "../../src/specifications/draft2020_12.ts";
import {
  JsonSchemaDraft4,
  jsonSchemaDraft4Specification,
} from "../../src/specifications/draft4.ts";
import { translateSchema } from "../../src/translators/translateSchema.ts";

Deno.test("Draft 2020-12 → Draft 4: object with nullable and arbitrary JSON properties", () => {
  const input: JsonSchemaDraft2020_12 = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "object",
    required: ["nullableString", "requiredString"],
    properties: {
      nullableString: {
        type: ["null", "string"],
      },
      requiredString: {
        type: "string",
      },
      optionalString: {
        type: "string",
      },
    },
    additionalProperties: true,

    arbitraryNumber: 123,
    arbitraryObject: {
      arbitraryBoolean: true,
    },
    arbitraryArray: ["arbitraryString", null],
  };

  const expected: JsonSchemaDraft4 = {
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    required: ["nullableString", "requiredString"],
    properties: {
      nullableString: {
        type: ["null", "string"],
      },
      requiredString: {
        type: "string",
      },
      optionalString: {
        type: "string",
      },
    },
    additionalProperties: true,

    arbitraryNumber: 123,
    arbitraryObject: {
      arbitraryBoolean: true,
    },
    arbitraryArray: ["arbitraryString", null],
  };

  const result = translateSchema({
    from: {
      specification: jsonSchemaDraft2020_12Specification,
      schema: input,
    },
    into: {
      specification: jsonSchemaDraft4Specification,
    },
    copyJson: "stringifyAndParse",
    path: [],
    forceAllowBooleanSchema: false,
    unhandledKeys: new Map(),
    droppedKeys: new Map(),
    seen: new Map(),
  });

  assertEquals(result, expected);
});
