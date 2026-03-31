import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../src/translateJsonSchema.ts";
import { jsonSchemaDraft4Specification } from "../src/specifications/draft4.ts";
import { jsonSchemaDraft7Specification } from "../src/specifications/draft7.ts";
import { jsonSchemaDraft2020_12Specification } from "../src/specifications/draft2020_12.ts";
import { googleAiJsonSchemaSpecification } from "../src/specifications/google_ai.ts";
import { openApi3_0SchemaSpecification } from "../src/specifications/open_api_3_0_schema.ts";
import { type JsonSchemaSpecification } from "../src/types/JsonSchemaSpecification.ts";

// deno-lint-ignore no-explicit-any
type AnySchema = Record<string, any>;

// ============================================================
// Draft 4 → Draft 7
// ============================================================

Deno.test("Draft 4 → Draft 7: id becomes $id", () => {
  assertEquals(
    translateJsonSchema(
      { id: "http://example.com/schema", type: "string" },
      "draft4",
      "draft7",
    ),
    { $id: "http://example.com/schema", type: "string" },
  );
});

Deno.test("Draft 4 → Draft 7: boolean exclusiveMinimum becomes numeric", () => {
  const input: AnySchema = {
    type: "number",
    minimum: 5,
    exclusiveMinimum: true,
  };
  assertEquals(
    translateJsonSchema(
      input,
      jsonSchemaDraft4Specification as JsonSchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "number", exclusiveMinimum: 5 },
  );
});

Deno.test("Draft 4 → Draft 7: boolean exclusiveMaximum becomes numeric", () => {
  const input: AnySchema = {
    type: "number",
    maximum: 10,
    exclusiveMaximum: true,
  };
  assertEquals(
    translateJsonSchema(
      input,
      jsonSchemaDraft4Specification as JsonSchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "number", exclusiveMaximum: 10 },
  );
});

Deno.test("Draft 4 → Draft 7: non-exclusive min/max stays as-is", () => {
  assertEquals(
    translateJsonSchema(
      { type: "number", minimum: 0, maximum: 100 },
      "draft4",
      "draft7",
    ),
    { type: "number", minimum: 0, maximum: 100 },
  );
});

// ============================================================
// Draft 7 → Draft 2020-12
// ============================================================

Deno.test("Draft 7 → Draft 2020-12: $schema URI is translated", () => {
  assertEquals(
    translateJsonSchema(
      { $schema: "http://json-schema.org/draft-07/schema#", type: "string" },
      "draft7",
      "draft2020_12",
    ),
    {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "string",
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: definitions become $defs", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        definitions: {
          name: { type: "string" },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      $defs: {
        name: { type: "string" },
      },
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: tuple items become prefixItems", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
        additionalItems: false,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: false,
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: single items schema stays as items", () => {
  assertEquals(
    translateJsonSchema(
      { type: "array", items: { type: "string" } },
      "draft7",
      "draft2020_12",
    ),
    { type: "array", items: { type: "string" } },
  );
});

Deno.test("Draft 7 → Draft 2020-12: empty schema becomes boolean true", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          anything: {},
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      properties: {
        anything: true,
      },
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: {not: {}} becomes boolean false", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          never: { not: {} },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      properties: {
        never: false,
      },
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: if/then/else are preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        if: { type: "string" },
        then: { minLength: 1 },
        else: { type: "number" },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      if: { type: "string" },
      then: { minLength: 1 },
      else: { type: "number" },
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: dependencies become dependentRequired/dependentSchemas", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependencies: {
          bar: ["foo"],
          baz: { type: "object", properties: { qux: { type: "number" } } },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      dependentRequired: {
        bar: ["foo"],
      },
      dependentSchemas: {
        baz: { type: "object", properties: { qux: { type: "number" } } },
      },
    },
  );
});

Deno.test("Draft 7 → Draft 2020-12: annotations are preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "string",
        title: "Name",
        description: "A person's name",
        examples: ["Alice", "Bob"],
        readOnly: true,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "string",
      title: "Name",
      description: "A person's name",
      examples: ["Alice", "Bob"],
      readOnly: true,
    },
  );
});

// ============================================================
// Draft 2020-12 → Draft 7 (reverse)
// ============================================================

Deno.test("Draft 2020-12 → Draft 7: prefixItems become tuple items", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        prefixItems: [{ type: "string" }, { type: "number" }],
        items: false,
      },
      "draft2020_12",
      "draft7",
    ),
    {
      type: "array",
      items: [{ type: "string" }, { type: "number" }],
      additionalItems: false,
    },
  );
});

Deno.test("Draft 2020-12 → Draft 7: $defs become definitions", () => {
  assertEquals(
    translateJsonSchema(
      {
        $defs: { id: { type: "integer" } },
      },
      "draft2020_12",
      "draft7",
    ),
    {
      definitions: { id: { type: "integer" } },
    },
  );
});

Deno.test("Draft 2020-12 → Draft 7: boolean schema true becomes {}", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: { any: true },
      },
      jsonSchemaDraft2020_12Specification,
      jsonSchemaDraft7Specification,
    ),
    {
      type: "object",
      properties: { any: {} },
    },
  );
});

Deno.test("Draft 2020-12 → Draft 4: $schema URI is translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: "string",
      },
      "draft2020_12",
      "draft4",
    ),
    {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "string",
    },
  );
});

// ============================================================
// Draft 2020-12 → Draft 4
// ============================================================

Deno.test("Draft 2020-12 → Draft 4: dependentRequired becomes dependencies", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependentRequired: { bar: ["foo"] },
      },
      "draft2020_12",
      "draft4",
    ),
    {
      type: "object",
      dependencies: { bar: ["foo"] },
    },
  );
});

// ============================================================
// Draft 7 → Google AI
// ============================================================

Deno.test("Draft 7 → Google AI: nullable type becomes nullable keyword", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          name: { type: ["string", "null"] },
        },
      },
      jsonSchemaDraft7Specification,
      googleAiJsonSchemaSpecification,
    ),
    {
      type: "object",
      properties: {
        name: { type: "string", nullable: true },
      },
    },
  );
});

Deno.test("Draft 7 → Google AI: unsupported keywords are dropped", () => {
  const result = translateJsonSchema(
    {
      type: "object",
      if: { type: "string" },
      then: { minLength: 1 },
      properties: {
        x: { type: "string" },
      },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
  );

  assertEquals(result.type, "object");
  assertEquals("if" in result, false);
  assertEquals("then" in result, false);
});

Deno.test("Draft 7 → Google AI: oneOf is dropped (not supported)", () => {
  // Google AI does not support oneOf; it is not automatically converted to anyOf
  assertEquals(
    translateJsonSchema(
      {
        oneOf: [{ type: "string" }, { type: "number" }],
      },
      jsonSchemaDraft7Specification,
      googleAiJsonSchemaSpecification,
    ),
    {},
  );
});

// ============================================================
// Draft 7 → OpenAPI 3.0
// ============================================================

Deno.test("Draft 7 → OpenAPI 3.0: null type becomes nullable", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "null"] },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { type: "string", nullable: true },
  );
});

Deno.test("Draft 7 → OpenAPI 3.0: format values are filtered", () => {
  // "date" is supported in OpenAPI 3.0
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "date" },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { type: "string", format: "date" },
  );
});

Deno.test("Draft 7 → OpenAPI 3.0: unsupported format is dropped", () => {
  // "regex" is NOT supported in OpenAPI 3.0, but strictFormats is false
  // so it should still be copied
  const result = translateJsonSchema(
    { type: "string", format: "regex" },
    jsonSchemaDraft7Specification,
    openApi3_0SchemaSpecification,
  );

  assertEquals(result, { type: "string", format: "regex" });
});

// ============================================================
// OpenAPI 3.0 → Draft 7
// ============================================================

Deno.test("OpenAPI 3.0 → Draft 7: nullable becomes null type", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", nullable: true },
      openApi3_0SchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: ["string", "null"] },
  );
});

// ============================================================
// Draft 7 → OpenAI Structured Output
// ============================================================

Deno.test("Draft 7 → OpenAI: all properties become required with null type added", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
        },
      },
      "draft7",
      "openAiStructuredOutput",
    ),
    {
      type: "object",
      required: ["age", "name"],
      properties: {
        name: { type: "string" },
        age: { type: ["integer", "null"] },
      },
      additionalProperties: false,
    },
  );
});

// ============================================================
// Name-based translation (bundled spec names)
// ============================================================

Deno.test("Bundled name translation: draft4 → draft2020_12", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", minLength: 1 },
      "draft4",
      "draft2020_12",
    ),
    { type: "string", minLength: 1 },
  );
});

Deno.test("Bundled name translation: draft6 → draft7", () => {
  assertEquals(
    translateJsonSchema(
      { type: "object", const: "hello" },
      "draft6",
      "draft7",
    ),
    { type: "object", const: "hello" },
  );
});

// ============================================================
// Complex / edge case schemas
// ============================================================

Deno.test("Nested object properties are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        definitions: {
          address: {
            type: "object",
            properties: {
              street: { type: "string" },
            },
          },
        },
        properties: {
          home: {
            type: "object",
            properties: {
              address: {
                type: "object",
                properties: {
                  city: { type: "string" },
                },
              },
            },
          },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      $defs: {
        address: {
          type: "object",
          properties: {
            street: { type: "string" },
          },
        },
      },
      properties: {
        home: {
          type: "object",
          properties: {
            address: {
              type: "object",
              properties: {
                city: { type: "string" },
              },
            },
          },
        },
      },
    },
  );
});

Deno.test("Enum values are preserved across compatible specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", enum: ["red", "green", "blue"] },
      "draft4",
      "draft7",
    ),
    { type: "string", enum: ["red", "green", "blue"] },
  );
});

Deno.test("Const is converted to enum when target lacks const support", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", const: "only" },
      "draft7",
      "draft4",
    ),
    { type: "string", enum: ["only"] },
  );
});

Deno.test("Enum with single item becomes const when target lacks enum but has const", () => {
  assertEquals(
    translateJsonSchema(
      { enum: ["single"] },
      jsonSchemaDraft4Specification,
      {
        ...jsonSchemaDraft7Specification,
        enum: false,
        const: true,
        anyOf: true,
      },
    ),
    { const: "single" },
  );
});

Deno.test("Pattern, minLength, maxLength are preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "string",
        pattern: "^[a-z]+$",
        minLength: 1,
        maxLength: 100,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "string",
      pattern: "^[a-z]+$",
      minLength: 1,
      maxLength: 100,
    },
  );
});

Deno.test("allOf, anyOf, oneOf schemas are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        allOf: [
          { type: "object", properties: { a: {} } },
        ],
        anyOf: [
          { type: "string" },
          { type: "number" },
        ],
      },
      "draft7",
      "draft2020_12",
    ),
    {
      allOf: [
        { type: "object", properties: { a: true } },
      ],
      anyOf: [
        { type: "string" },
        { type: "number" },
      ],
    },
  );
});

Deno.test("$ref is preserved across specs", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          child: { $ref: "#/definitions/node" },
        },
        definitions: {
          node: { type: "object" },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      properties: {
        child: { $ref: "#/definitions/node" },
      },
      $defs: {
        node: { type: "object" },
      },
    },
  );
});

Deno.test("additionalProperties schema is translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        additionalProperties: { type: "string" },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      additionalProperties: { type: "string" },
    },
  );
});

Deno.test("additionalProperties false is preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: { x: { type: "string" } },
        additionalProperties: false,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      properties: { x: { type: "string" } },
      additionalProperties: false,
    },
  );
});

Deno.test("Arbitrary JSON properties are copied when both specs support it", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "string",
        "x-custom": "value",
        customNumber: 42,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "string",
      "x-custom": "value",
      customNumber: 42,
    },
  );
});

Deno.test("Arbitrary JSON properties are dropped when target disallows it", () => {
  const result = translateJsonSchema(
    {
      type: "string",
      "x-custom": "value",
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
  );

  assertEquals("x-custom" in result, false);
  assertEquals(result.type, "string");
});

Deno.test("Empty schema translates to empty/boolean schema", () => {
  // draft7 → draft7: empty → empty
  assertEquals(
    translateJsonSchema({}, "draft7", "draft7"),
    {},
  );

  // draft7 → 2020-12: empty → boolean true
  assertEquals(
    translateJsonSchema({}, "draft7", "draft2020_12"),
    true,
  );
});

Deno.test("multipleOf is preserved across compatible specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: "number", multipleOf: 0.5 },
      "draft7",
      "draft2020_12",
    ),
    { type: "number", multipleOf: 0.5 },
  );
});

Deno.test("contains, minContains, maxContains translation", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        contains: { type: "string" },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "array",
      contains: { type: "string" },
    },
  );
});

Deno.test("uniqueItems is preserved", () => {
  assertEquals(
    translateJsonSchema(
      { type: "array", items: { type: "string" }, uniqueItems: true },
      "draft7",
      "draft2020_12",
    ),
    { type: "array", items: { type: "string" }, uniqueItems: true },
  );
});

Deno.test("patternProperties are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        patternProperties: {
          "^S_": { type: "string" },
          "^N_": { type: "number" },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      patternProperties: {
        "^S_": { type: "string" },
        "^N_": { type: "number" },
      },
    },
  );
});

Deno.test("not schema is recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      { not: { type: "string", minLength: 0 } },
      "draft7",
      "draft2020_12",
    ),
    { not: { type: "string", minLength: 0 } },
  );
});

Deno.test("deprecated is preserved from 2020-12 to OpenAPI 3.0", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", deprecated: true },
      jsonSchemaDraft2020_12Specification,
      openApi3_0SchemaSpecification,
    ),
    { type: "string", deprecated: true },
  );
});

Deno.test("readOnly and writeOnly are preserved between compatible specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", readOnly: true },
      "draft7",
      "draft2020_12",
    ),
    { type: "string", readOnly: true },
  );

  assertEquals(
    translateJsonSchema(
      { type: "string", writeOnly: true },
      "draft7",
      "draft2020_12",
    ),
    { type: "string", writeOnly: true },
  );
});
