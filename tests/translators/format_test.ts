import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { jsonSchemaDraft2020_12Specification } from "../../src/specifications/draft2020_12.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai_structured_output.ts";

Deno.test("Format is preserved between compatible specs", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "email" },
      "draft7",
      "draft2020_12",
    ),
    { type: "string", format: "email" },
  );
});

Deno.test("Format is dropped when target does not support format", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "email" },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    { type: "string" },
  );
});

Deno.test("Strict format filters to allowed values", () => {
  // Draft 4 has strictFormats:true and only supports date-time, email, hostname, ipv4, ipv6, uri
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "date-time" },
      "draft7",
      "draft4",
    ),
    { type: "string", format: "date-time" },
  );
});

Deno.test("Format unsupported by strict target is dropped", () => {
  // "date" is in draft7 but NOT in draft4's format array (with strictFormats)
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "date" },
      jsonSchemaDraft7Specification,
      jsonSchemaDraft4Specification,
    ),
    { type: "string" },
  );
});

Deno.test("Non-strict format target accepts any format", () => {
  // Draft 2020-12 has strictFormats: false
  assertEquals(
    translateJsonSchema(
      { type: "string", format: "date-time" },
      "draft4",
      "draft2020_12",
    ),
    { type: "string", format: "date-time" },
  );
});

Deno.test("Format from non-format source is ignored", () => {
  // If source spec doesn't have format support, nothing to copy
  const noFormatSpec = {
    ...jsonSchemaDraft7Specification,
    format: false as const,
  };

  assertEquals(
    translateJsonSchema(
      { type: "string" },
      noFormatSpec,
      jsonSchemaDraft7Specification,
    ),
    { type: "string" },
  );
});
