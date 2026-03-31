import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { jsonSchemaDraft2020_12Specification } from "../../src/specifications/draft2020_12.ts";

Deno.test("Enum is preserved between specs that both support it", () => {
  assertEquals(
    translateJsonSchema(
      { enum: [1, 2, 3] },
      "draft4",
      "draft7",
    ),
    { enum: [1, 2, 3] },
  );
});

Deno.test("Const is preserved between specs that both support it", () => {
  assertEquals(
    translateJsonSchema(
      { const: "hello" },
      "draft7",
      "draft2020_12",
    ),
    { const: "hello" },
  );
});

Deno.test("Const becomes single-item enum when target lacks const", () => {
  // Draft 4 doesn't support const
  assertEquals(
    translateJsonSchema(
      { const: "only" },
      "draft7",
      "draft4",
    ),
    { enum: ["only"] },
  );
});

Deno.test("Single-item enum becomes const when target has const but no enum", () => {
  const constOnlySpec = {
    ...jsonSchemaDraft7Specification,
    enum: false as const,
    const: true as const,
    anyOf: true as const,
  };

  assertEquals(
    translateJsonSchema(
      { enum: ["value"] },
      jsonSchemaDraft4Specification,
      constOnlySpec,
    ),
    { const: "value" },
  );
});

Deno.test("Multi-item enum becomes anyOf of consts when target has const + anyOf but no enum", () => {
  const constOnlySpec = {
    ...jsonSchemaDraft7Specification,
    enum: false as const,
    const: true as const,
    anyOf: true as const,
  };

  assertEquals(
    translateJsonSchema(
      { enum: ["a", "b", "c"] },
      jsonSchemaDraft4Specification,
      constOnlySpec,
    ),
    {
      anyOf: [{ const: "a" }, { const: "b" }, { const: "c" }],
    },
  );
});

Deno.test("Enum with both enum and const in source", () => {
  assertEquals(
    translateJsonSchema(
      { enum: [1, 2], const: 1 },
      "draft7",
      "draft2020_12",
    ),
    { enum: [1, 2], const: 1 },
  );
});

Deno.test("nonEmptyEnum: empty enum is dropped when target requires nonEmptyEnum", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", enum: [] },
      jsonSchemaDraft7Specification,
      jsonSchemaDraft4Specification,
    ),
    { type: "string" },
  );
});

Deno.test("nonEmptyEnum: empty enum is preserved when target allows it", () => {
  assertEquals(
    translateJsonSchema(
      { type: "string", enum: [] },
      jsonSchemaDraft7Specification,
      jsonSchemaDraft2020_12Specification,
    ),
    { type: "string", enum: [] },
  );
});
