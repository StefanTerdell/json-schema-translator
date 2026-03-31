import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai_structured_output.ts";
import { JsonSchemaSpecification } from "../../src/types/JsonSchemaSpecification.ts";

Deno.test("Properties are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          age: { type: "integer", minimum: 0 },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1 },
        age: { type: "integer", minimum: 0 },
      },
    },
  );
});

Deno.test("excludeNeverProperties removes impossible properties", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        required: ["name", "impossible"],
        properties: {
          name: { type: "string" },
          impossible: { not: {} },
        },
      },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
      },
      additionalProperties: false,
    },
  );
});

Deno.test("allPropertiesRequired makes all properties required", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "number" },
        },
      },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    {
      type: "object",
      required: ["a", "b"],
      properties: {
        a: { type: ["string", "null"] },
        b: { type: ["number", "null"] },
      },
      additionalProperties: false,
    },
  );
});

Deno.test("addNullTypeToOptionalProperties adds null to originally-optional properties", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        required: ["req"],
        properties: {
          req: { type: "string" },
          opt: { type: "number" },
        },
      },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    {
      type: "object",
      required: ["opt", "req"],
      properties: {
        req: { type: "string" },
        opt: { type: ["number", "null"] },
      },
      additionalProperties: false,
    },
  );
});

Deno.test("forceAdditionalProperties adds additionalProperties to all objects", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          x: { type: "string" },
        },
      },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    {
      type: "object",
      required: ["x"],
      properties: {
        x: { type: ["string", "null"] },
      },
      additionalProperties: false,
    },
  );
});

Deno.test("treatPropertiesWithNullTypeAsOptional removes null-typed from required", () => {
  const targetSpec = {
    ...jsonSchemaDraft7Specification,
    treatPropertiesWithNullTypeAsOptional: true,
    arbitraryJson: false,
  } satisfies JsonSchemaSpecification;

  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        required: ["name", "nullable"],
        properties: {
          name: { type: "string" },
          nullable: { type: ["string", "null"] },
        },
      },
      jsonSchemaDraft7Specification,
      targetSpec,
    ),
    {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" },
        nullable: { type: ["string", "null"] },
      },
    },
  );
});

Deno.test("Required is sorted alphabetically", () => {
  const result = translateJsonSchema(
    {
      type: "object",
      required: ["z", "a", "m"],
      properties: {
        z: { type: "string" },
        a: { type: "string" },
        m: { type: "string" },
      },
    },
    "draft7",
    "draft2020_12",
  );

  assertEquals(
    typeof result === "object" && result !== null && "required" in result
      ? result.required
      : undefined,
    ["a", "m", "z"],
  );
});
