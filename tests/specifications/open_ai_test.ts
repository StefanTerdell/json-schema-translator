import { assertEquals } from "@std/assert/equals";
import { jsonSchemaDraft7Specification } from "../../src/index.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai.ts";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";

Deno.test(
  "Can convert Draft 7 into an Open AI structured output schema",
  () => {
    assertEquals(
      translateJsonSchema(
        {
          type: "object",
          required: ["foo", "array"],
          properties: {
            foo: {
              type: "integer",
            },
            bar: {
              type: "string",
              const: "baz",
            },
            array: {
              type: "array",
              items: {
                type: "number",
              },
              unevaluatedItems: true,
              contains: {
                type: "string",
              },
              minContains: 1,
              maxContains: 2,
              minItems: 3,
              maxItems: 4,
              uniqueItems: true,
            },
            record: {
              type: "object",
              properties: {
                x: {
                  type: "string",
                  format: "derp",
                  pattern: "herp",
                  minLength: 2,
                  maxLength: 3,
                },
              },
              patternProperties: {
                alskdjalksjd: {},
              },
              maxProperties: 2,
              minProperties: 3,
              unevaluatedProperties: true,
              propertyNames: {
                format: "url",
              },
            },
          },
        },
        jsonSchemaDraft7Specification,
        openAiStructuredOutputSchemaSpecification,
      ),
      {
        type: "object",
        required: ["foo", "bar", "array", "record"],
        properties: {
          foo: {
            type: "number",
          },
          bar: {
            type: ["string", "null"],
            enum: ["baz", null],
          },
          array: {
            type: "array",
            items: {
              type: "number",
            },
          },
          record: {
            required: ["x"],
            type: ["object", "null"],
            properties: {
              x: {
                type: ["string", "null"],
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    );
  },
);
