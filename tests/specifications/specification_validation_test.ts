import { assertEquals, assertNotEquals } from "@std/assert";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { jsonSchemaDraft6Specification } from "../../src/specifications/draft6.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { jsonSchemaDraft2019_09Specification } from "../../src/specifications/draft2019_09.ts";
import { jsonSchemaDraft2020_12Specification } from "../../src/specifications/draft2020_12.ts";
import { googleAiJsonSchemaSpecification } from "../../src/specifications/google_ai.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai_structured_output.ts";
import { openApi3_0SchemaSpecification } from "../../src/specifications/open_api_3_0_schema.ts";

const allSpecs = {
  draft4: jsonSchemaDraft4Specification,
  draft6: jsonSchemaDraft6Specification,
  draft7: jsonSchemaDraft7Specification,
  draft2019_09: jsonSchemaDraft2019_09Specification,
  draft2020_12: jsonSchemaDraft2020_12Specification,
  googleAi: googleAiJsonSchemaSpecification,
  openAiStructuredOutput: openAiStructuredOutputSchemaSpecification,
  openApi3_0: openApi3_0SchemaSpecification,
};

// Validate $schema URIs match expected values for standard drafts
Deno.test("Draft 4 $schema URI is correct", () => {
  assertEquals(
    jsonSchemaDraft4Specification.$schema,
    "http://json-schema.org/draft-04/schema#",
  );
});

Deno.test("Draft 6 $schema URI is correct", () => {
  assertEquals(
    jsonSchemaDraft6Specification.$schema,
    "http://json-schema.org/draft-06/schema#",
  );
});

Deno.test("Draft 7 $schema URI is correct", () => {
  assertEquals(
    jsonSchemaDraft7Specification.$schema,
    "http://json-schema.org/draft-07/schema#",
  );
});

Deno.test("Draft 2019-09 $schema URI is correct", () => {
  assertEquals(
    jsonSchemaDraft2019_09Specification.$schema,
    "https://json-schema.org/draft/2019-09/schema",
  );
});

Deno.test("Draft 2020-12 $schema URI is correct", () => {
  assertEquals(
    jsonSchemaDraft2020_12Specification.$schema,
    "https://json-schema.org/draft/2020-12/schema",
  );
});

// Validate $id and $defs paths per draft
Deno.test("Draft 4 uses 'id' for $id and 'definitions' for $defs", () => {
  assertEquals(jsonSchemaDraft4Specification.$id, "id");
  assertEquals(jsonSchemaDraft4Specification.$defs, "definitions");
});

Deno.test("Draft 6 uses '$id' for $id and 'definitions' for $defs", () => {
  assertEquals(jsonSchemaDraft6Specification.$id, "$id");
  assertEquals(jsonSchemaDraft6Specification.$defs, "definitions");
});

Deno.test("Draft 7 uses '$id' for $id and 'definitions' for $defs", () => {
  assertEquals(jsonSchemaDraft7Specification.$id, "$id");
  assertEquals(jsonSchemaDraft7Specification.$defs, "definitions");
});

Deno.test("Draft 2019-09 uses '$id' and '$defs'", () => {
  assertEquals(jsonSchemaDraft2019_09Specification.$id, "$id");
  assertEquals(jsonSchemaDraft2019_09Specification.$defs, "$defs");
});

Deno.test("Draft 2020-12 uses '$id' and '$defs'", () => {
  assertEquals(jsonSchemaDraft2020_12Specification.$id, "$id");
  assertEquals(jsonSchemaDraft2020_12Specification.$defs, "$defs");
});

// Validate Draft 4 uses boolean exclusiveMinimum/Maximum
Deno.test("Draft 4 uses boolean exclusiveMinimum/Maximum", () => {
  assertEquals(jsonSchemaDraft4Specification.booleanExclusiveMinimum, true);
  assertEquals(jsonSchemaDraft4Specification.booleanExclusiveMaximum, true);
});

// Validate later drafts don't use boolean exclusiveMinimum/Maximum
Deno.test("Draft 6+ do not use boolean exclusiveMinimum/Maximum", () => {
  for (const [name, spec] of Object.entries(allSpecs)) {
    if (name === "draft4" || name === "openApi3_0") continue;
    assertEquals(
      "booleanExclusiveMinimum" in spec,
      false,
      `${name} should not have booleanExclusiveMinimum`,
    );
  }
});

// Validate if/then/else consistency
Deno.test("if/then/else keywords are consistently enabled or disabled", () => {
  for (const [name, spec] of Object.entries(allSpecs)) {
    if (spec.if) {
      assertEquals(spec.then, true, `${name}: if enabled but then disabled`);
      assertEquals(spec.else, true, `${name}: if enabled but else disabled`);
    }
  }
});

// Validate prefixItems is only in 2020-12
Deno.test("Only Draft 2020-12 supports prefixItems", () => {
  assertEquals(jsonSchemaDraft4Specification.prefixItems, false);
  assertEquals(jsonSchemaDraft6Specification.prefixItems, false);
  assertEquals(jsonSchemaDraft7Specification.prefixItems, false);
  assertEquals(jsonSchemaDraft2019_09Specification.prefixItems, false);
  assertEquals(jsonSchemaDraft2020_12Specification.prefixItems, true);
});

// Validate booleanSchemas is only in 2019-09+
Deno.test("Boolean schemas only supported in Draft 2019-09 and 2020-12", () => {
  assertEquals(jsonSchemaDraft4Specification.booleanSchemas, false);
  assertEquals(jsonSchemaDraft6Specification.booleanSchemas, false);
  assertEquals(jsonSchemaDraft7Specification.booleanSchemas, false);
  assertEquals(jsonSchemaDraft2019_09Specification.booleanSchemas, true);
  assertEquals(jsonSchemaDraft2020_12Specification.booleanSchemas, true);
});

// Validate that dependencies was replaced by dependentRequired/dependentSchemas
Deno.test("Dependencies keyword evolution across drafts", () => {
  // Draft 4-7 use dependencies
  assertEquals(jsonSchemaDraft4Specification.dependencies, true);
  assertEquals(jsonSchemaDraft6Specification.dependencies, true);
  assertEquals(jsonSchemaDraft7Specification.dependencies, true);
  assertEquals(jsonSchemaDraft4Specification.dependentRequired, false);
  assertEquals(jsonSchemaDraft4Specification.dependentSchemas, false);

  // Draft 2019-09+ use dependentRequired/dependentSchemas
  assertEquals(jsonSchemaDraft2019_09Specification.dependencies, false);
  assertEquals(jsonSchemaDraft2019_09Specification.dependentRequired, true);
  assertEquals(jsonSchemaDraft2019_09Specification.dependentSchemas, true);
  assertEquals(jsonSchemaDraft2020_12Specification.dependencies, false);
  assertEquals(jsonSchemaDraft2020_12Specification.dependentRequired, true);
  assertEquals(jsonSchemaDraft2020_12Specification.dependentSchemas, true);
});

// Validate all specs have a type array
Deno.test("All specifications define a type array", () => {
  for (const [name, spec] of Object.entries(allSpecs)) {
    assertEquals(
      Array.isArray(spec.type),
      true,
      `${name} should have an array type`,
    );
    assertNotEquals(spec.type.length, 0, `${name} type array should not be empty`);
  }
});

// Validate nullable specs
Deno.test("Only Google AI and OpenAPI 3.0 support nullable keyword", () => {
  assertEquals(jsonSchemaDraft4Specification.nullable, false);
  assertEquals(jsonSchemaDraft6Specification.nullable, false);
  assertEquals(jsonSchemaDraft7Specification.nullable, false);
  assertEquals(jsonSchemaDraft2019_09Specification.nullable, false);
  assertEquals(jsonSchemaDraft2020_12Specification.nullable, false);
  assertEquals(googleAiJsonSchemaSpecification.nullable, true);
  assertEquals(openAiStructuredOutputSchemaSpecification.nullable, false);
  assertEquals(openApi3_0SchemaSpecification.nullable, true);
});

// Validate OpenAPI 3.0 excludes null from types (uses nullable instead)
Deno.test("OpenAPI 3.0 type array does not include null", () => {
  assertEquals(
    openApi3_0SchemaSpecification.type.includes("null" as never),
    false,
  );
  assertEquals(openApi3_0SchemaSpecification.singleType, true);
});

// Validate OpenAI structured output has strict settings
Deno.test("OpenAI structured output has strict object requirements", () => {
  assertEquals(
    openAiStructuredOutputSchemaSpecification.allPropertiesRequired,
    true,
  );
  assertEquals(
    openAiStructuredOutputSchemaSpecification.forceAdditionalProperties,
    false,
  );
  assertEquals(
    openAiStructuredOutputSchemaSpecification.addNullTypeToOptionalProperties,
    true,
  );
  assertEquals(
    openAiStructuredOutputSchemaSpecification.excludeNeverProperties,
    true,
  );
});

// Validate format arrays don't contain duplicates
Deno.test("Format arrays should not contain duplicate entries", () => {
  for (const [name, spec] of Object.entries(allSpecs)) {
    if (Array.isArray(spec.format)) {
      const unique = new Set(spec.format);
      assertEquals(
        unique.size,
        spec.format.length,
        `${name} format array contains duplicates: ${spec.format.join(", ")}`,
      );
    }
  }
});
