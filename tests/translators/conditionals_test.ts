import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";

Deno.test("if/then/else preserved between supporting specs", () => {
  assertEquals(
    translateJsonSchema(
      {
        if: { properties: { kind: { const: "text" } } },
        then: { properties: { value: { type: "string" } } },
        else: { properties: { value: { type: "number" } } },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      if: { properties: { kind: { const: "text" } } },
      then: { properties: { value: { type: "string" } } },
      else: { properties: { value: { type: "number" } } },
    },
  );
});

Deno.test("if/then/else dropped when target doesn't support them", () => {
  const result = translateJsonSchema(
    {
      type: "object",
      if: { properties: { kind: { const: "text" } } },
      then: { properties: { value: { type: "string" } } },
    },
    jsonSchemaDraft7Specification,
    jsonSchemaDraft4Specification,
  );

  assertEquals("if" in result, false);
  assertEquals("then" in result, false);
  assertEquals(result.type, "object");
});

Deno.test("if/then without else", () => {
  assertEquals(
    translateJsonSchema(
      {
        if: { type: "string" },
        then: { minLength: 1 },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      if: { type: "string" },
      then: { minLength: 1 },
    },
  );
});

Deno.test("Nested schemas within if/then/else are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        if: {
          type: "object",
          properties: { flag: {} },
        },
        then: {
          properties: { data: {} },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      if: {
        type: "object",
        properties: { flag: true },
      },
      then: {
        properties: { data: true },
      },
    },
  );
});
