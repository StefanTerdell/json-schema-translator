import { assertEquals } from "@std/assert";
import {
  JsonSchemaDraft2020_12,
  jsonSchemaDraft2020_12Settings,
} from "../../src/versions/draft2020_12.ts";
import {
  JsonSchemaDraft4,
  jsonSchemaDraft4Settings,
} from "../../src/versions/draft4.ts";
import { generateSchema } from "../../src/transformers/schema.ts";

Deno.test("Hello", () => {
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

  const output: JsonSchemaDraft4 = {
    $schema: "https://json-schema.org/draft-04/schema",
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

  const result = generateSchema(
    {
      settings: jsonSchemaDraft2020_12Settings,
      schema: input,
      path: [],
    },
    {
      settings: jsonSchemaDraft4Settings,
      forceAllowBooleanSchema: false,
      unhandledKeys: new Map(),
    },
  );

  assertEquals(output, result);
});
