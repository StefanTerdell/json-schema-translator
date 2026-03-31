import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { googleAiJsonSchemaSpecification } from "../../src/specifications/google_ai.ts";
import { type JsonSchemaSpecification } from "../../src/types/JsonSchemaSpecification.ts";

// deno-lint-ignore no-explicit-any
type AnySchema = Record<string, any>;

// ============================================================
// Draft 4 boolean exclusive → Draft 7 numeric exclusive
// ============================================================

Deno.test("Draft 4 → Draft 7: minimum with exclusiveMinimum:true", () => {
  const input: AnySchema = {
    type: "number",
    minimum: 0,
    exclusiveMinimum: true,
  };
  assertEquals(
    translateJsonSchema(
      input,
      jsonSchemaDraft4Specification as JsonSchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "number", exclusiveMinimum: 0 },
  );
});

Deno.test("Draft 4 → Draft 7: maximum with exclusiveMaximum:true", () => {
  const input: AnySchema = {
    type: "number",
    maximum: 100,
    exclusiveMaximum: true,
  };
  assertEquals(
    translateJsonSchema(
      input,
      jsonSchemaDraft4Specification as JsonSchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "number", exclusiveMaximum: 100 },
  );
});

Deno.test("Draft 4 → Draft 7: minimum with exclusiveMinimum:false", () => {
  const input: AnySchema = {
    type: "number",
    minimum: 0,
    exclusiveMinimum: false,
  };
  assertEquals(
    translateJsonSchema(
      input,
      jsonSchemaDraft4Specification as JsonSchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "number", minimum: 0 },
  );
});

// ============================================================
// Draft 7 numeric exclusive → Draft 4 boolean exclusive
// ============================================================

Deno.test("Draft 7 → Draft 4: numeric exclusiveMinimum becomes boolean", () => {
  const result = translateJsonSchema(
    { type: "number", exclusiveMinimum: 5 },
    jsonSchemaDraft7Specification,
    jsonSchemaDraft4Specification as JsonSchemaSpecification,
  );
  assertEquals(result, { type: "number", minimum: 5, exclusiveMinimum: true });
});

Deno.test("Draft 7 → Draft 4: numeric exclusiveMaximum becomes boolean", () => {
  const result = translateJsonSchema(
    { type: "number", exclusiveMaximum: 10 },
    jsonSchemaDraft7Specification,
    jsonSchemaDraft4Specification as JsonSchemaSpecification,
  );
  assertEquals(result, { type: "number", maximum: 10, exclusiveMaximum: true });
});

Deno.test("Draft 7 → Draft 4: both minimum and exclusiveMinimum uses most restrictive", () => {
  const result = translateJsonSchema(
    { type: "number", minimum: 3, exclusiveMinimum: 5 },
    jsonSchemaDraft7Specification,
    jsonSchemaDraft4Specification as JsonSchemaSpecification,
  );
  assertEquals(result, { type: "number", minimum: 5, exclusiveMinimum: true });
});

// ============================================================
// Between specs that both use numeric exclusive
// ============================================================

Deno.test("Draft 7 → Draft 2020-12: numeric exclusive values preserved", () => {
  assertEquals(
    translateJsonSchema(
      { type: "number", minimum: 0, exclusiveMaximum: 100 },
      "draft7",
      "draft2020_12",
    ),
    { type: "number", minimum: 0, exclusiveMaximum: 100 },
  );
});

Deno.test("Draft 7 → Draft 2020-12: all four limits preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "number",
        minimum: 0,
        maximum: 100,
        exclusiveMinimum: -1,
        exclusiveMaximum: 101,
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "number",
      minimum: 0,
      maximum: 100,
      exclusiveMinimum: -1,
      exclusiveMaximum: 101,
    },
  );
});

// ============================================================
// To specs that drop exclusive limits
// ============================================================

Deno.test("Draft 7 → Google AI: exclusive limits are dropped, regular limits preserved", () => {
  assertEquals(
    translateJsonSchema(
      { type: "number", minimum: 0, maximum: 100, exclusiveMinimum: -1 },
      jsonSchemaDraft7Specification,
      googleAiJsonSchemaSpecification,
    ),
    { type: "number", minimum: 0, maximum: 100 },
  );
});

Deno.test("Draft 7 → Google AI: only exclusive limits result in loss", () => {
  assertEquals(
    translateJsonSchema(
      { type: "number", exclusiveMinimum: 5 },
      jsonSchemaDraft7Specification,
      googleAiJsonSchemaSpecification,
    ),
    { type: "number" },
  );
});
