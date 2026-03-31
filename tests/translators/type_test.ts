import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { jsonSchemaDraft2020_12Specification } from "../../src/specifications/draft2020_12.ts";
import { googleAiJsonSchemaSpecification } from "../../src/specifications/google_ai.ts";
import { openApi3_0SchemaSpecification } from "../../src/specifications/open_api_3_0_schema.ts";
import { JsonSchemaSpecification } from "../../src/types/JsonSchemaSpecification.ts";

Deno.test("Single type is preserved", () => {
  assertEquals(
    translateJsonSchema({ type: "string" }, "draft7", "draft2020_12"),
    { type: "string" },
  );
});

Deno.test("Array of types is preserved between compatible specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "number"] },
      "draft7",
      "draft2020_12",
    ),
    { type: ["string", "number"] },
  );
});

Deno.test("null type becomes nullable when target supports it", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "null"] },
      jsonSchemaDraft7Specification,
      googleAiJsonSchemaSpecification,
    ),
    { type: "string", nullable: true },
  );
});

Deno.test("null type becomes nullable for singleType specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "null"] },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { type: "string", nullable: true },
  );
});

Deno.test("Multiple types become anyOf when target requires singleType", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "number"] },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { anyOf: [{ type: "string" }, { type: "number" }] },
  );
});

Deno.test("integer type becomes number with multipleOf:1 when target lacks integer", () => {
  const noIntegerSpec = {
    ...jsonSchemaDraft7Specification,
    type: ["string", "number", "boolean", "object", "array", "null"] as const,
    multipleOf: true,
  } satisfies JsonSchemaSpecification;

  assertEquals(
    translateJsonSchema(
      { type: "integer" },
      jsonSchemaDraft7Specification,
      noIntegerSpec,
    ),
    { type: "number", multipleOf: 1 },
  );
});

Deno.test("strictTypes drops unsupported types", () => {
  const strictSpec = {
    ...jsonSchemaDraft7Specification,
    type: ["string", "number"] as const,
    strictTypes: true,
    arbitraryJson: false,
  } satisfies JsonSchemaSpecification;

  // boolean is not in strictSpec's type array
  const result = translateJsonSchema(
    { type: "boolean" },
    jsonSchemaDraft7Specification,
    strictSpec,
  );

  assertEquals("type" in result, false);
});

Deno.test("Schema without type is translated correctly", () => {
  assertEquals(
    translateJsonSchema(
      { minLength: 5 },
      "draft7",
      "draft2020_12",
    ),
    { minLength: 5 },
  );
});
