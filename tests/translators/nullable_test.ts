import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { googleAiJsonSchemaSpecification } from "../../src/specifications/google_ai.ts";
import { openApi3_0SchemaSpecification } from "../../src/specifications/open_api_3_0_schema.ts";

Deno.test("nullable:true becomes null in type array", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", nullable: true },
      openApi3_0SchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: ["string", "null"] },
  );
});

Deno.test("nullable:false is not propagated", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", nullable: false },
      openApi3_0SchemaSpecification,
      jsonSchemaDraft7Specification,
    ),
    { type: "string" },
  );
});

Deno.test("nullable is preserved between nullable-supporting specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", nullable: true },
      openApi3_0SchemaSpecification,
      googleAiJsonSchemaSpecification,
    ),
    { type: "string", nullable: true },
  );
});

Deno.test("Type array with null becomes nullable when targeting nullable spec", () => {
  assertEquals(
    translateJsonSchema(
      { type: ["string", "null"] },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { type: "string", nullable: true },
  );
});

Deno.test("Type array with only null", () => {
  assertEquals(
    translateJsonSchema(
      { type: "null" },
      jsonSchemaDraft7Specification,
      openApi3_0SchemaSpecification,
    ),
    { nullable: true },
  );
});

Deno.test("Google AI nullable to Draft 2020-12 uses null type", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", nullable: true },
      googleAiJsonSchemaSpecification,
      "draft2020_12",
    ),
    { type: ["string", "null"] },
  );
});
