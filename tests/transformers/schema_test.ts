import { assertEquals } from "@std/assert";
import {
  JsonSchemaDraft2020_12,
  jsonSchemaDraft2020_12Specification,
} from "../../src/specifications/draft2020_12.ts";
import {
  JsonSchemaDraft4,
  jsonSchemaDraft4Specification,
} from "../../src/specifications/draft4.ts";
import {
  translateJsonSchemaInternal,
  defaultTranslateJsonSchemaOptions,
} from "../../src/translateJsonSchema.ts";

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

  const result = translateJsonSchemaInternal(
    {
      settings: jsonSchemaDraft2020_12Specification,
      schema: input,
      path: [],
    },
    {
      settings: jsonSchemaDraft4Specification,
      forceAllowBooleanSchema: false,
      unhandledKeys: new Map(),
    },
    defaultTranslateJsonSchemaOptions,
  );

  assertEquals(output, result);
});
