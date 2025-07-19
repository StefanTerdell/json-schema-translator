import { assertEquals } from "@std/assert/equals";
import { jsonSchemaDraft7Specification } from "../../src/index.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai_structured_output.ts";
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
            never: { not: {} },
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
                  format: "date",
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
                format: "uri",
              },
            },
            tuple: {
              type: "array",
              items: [{}, { not: {} }],
            },
          },
        },
        jsonSchemaDraft7Specification,
        openAiStructuredOutputSchemaSpecification,
      ),
      {
        type: "object",
        required: ["array", "bar", "foo", "record", "tuple"],
        properties: {
          foo: {
            type: "integer",
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
          tuple: {
            type: ["array", "null"],
            items: [
              openAiStructuredOutputSchemaSpecification.forceAnySchema,
              {
                not: openAiStructuredOutputSchemaSpecification.forceAnySchema,
              },
            ],
          },
        },
        additionalProperties: false,
      },
    );
  },
);
