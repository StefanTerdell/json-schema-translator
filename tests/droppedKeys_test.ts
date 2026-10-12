import { assertEquals } from "@std/assert";
import { assertThrows } from "@std/assert/throws";
import { translateJsonSchema } from "../src/translateJsonSchema.ts";
import { jsonSchemaTranslator } from "../src/jsonSchemaTranslator.ts";
import { jsonSchemaDraft7Specification } from "../src/specifications/draft7.ts";
import { jsonSchemaDraft4Specification } from "../src/specifications/draft4.ts";
import { googleAiJsonSchemaSpecification } from "../src/specifications/google_ai.ts";
import { openAiStructuredOutputSchemaSpecification } from "../src/specifications/open_ai_structured_output.ts";
import { type DroppedKeysMap } from "../src/misc/DroppedKeys.ts";

function droppedKeywords(map: DroppedKeysMap): string[] {
  return [...map.values()].map((e) => e.keyword);
}

// ============================================================
// Keywords reported as dropped
// ============================================================

Deno.test("if/then/else reported as dropped going Draft 7 → Draft 4", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      if: { properties: { kind: { const: "text" } } },
      then: { properties: { value: { type: "string" } } },
      else: { properties: { value: { type: "number" } } },
    },
    "draft7",
    "draft4",
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("if"), true);
  assertEquals(kw.includes("then"), true);
  assertEquals(kw.includes("else"), true);
});

Deno.test("if/then/else reported as dropped going Draft 7 → Google AI", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      if: { type: "string" },
      then: { minLength: 1 },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("if"), true);
  assertEquals(kw.includes("then"), true);
});

Deno.test("allOf, oneOf, not reported as dropped for Google AI", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      allOf: [{ type: "string" }],
      oneOf: [{ type: "string" }, { type: "number" }],
      not: { type: "null" },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("allOf"), true);
  assertEquals(kw.includes("oneOf"), true);
  assertEquals(kw.includes("not"), true);
});

Deno.test("format reported as dropped when target has format: false", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { type: "string", format: "email" },
    jsonSchemaDraft7Specification,
    openAiStructuredOutputSchemaSpecification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("format"), true);
});

Deno.test("format reported as dropped when strictFormats rejects it", () => {
  const dropped: DroppedKeysMap = new Map();

  // "date" is in draft7 but NOT in draft4's strict format list
  translateJsonSchema(
    { type: "string", format: "date" },
    jsonSchemaDraft7Specification,
    jsonSchemaDraft4Specification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("format"), true);
});

Deno.test("minimum/exclusiveMinimum reported as dropped when target lacks them", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { type: "number", exclusiveMinimum: 5 },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("exclusiveMinimum"), true);
});

Deno.test("patternProperties reported as dropped for Google AI", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      patternProperties: { "^S_": { type: "string" } },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("patternProperties"), true);
});

Deno.test("$comment reported as dropped for non-supporting specs", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { type: "string", $comment: "this is a comment" },
    "draft2020_12",
    "draft4",
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("$comment"), true);
});

// ============================================================
// Dropped entries include the actual value
// ============================================================

Deno.test("Dropped entry includes the keyword value", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { type: "string", format: "email" },
    jsonSchemaDraft7Specification,
    openAiStructuredOutputSchemaSpecification,
    { droppedKeys: dropped },
  );

  const entry = [...dropped.values()].find((e) => e.keyword === "format");
  assertEquals(entry?.value, "email");
});

Deno.test("Dropped entry includes complex value", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      patternProperties: { "^S_": { type: "string" } },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  const entry = [...dropped.values()].find(
    (e) => e.keyword === "patternProperties",
  );
  assertEquals(entry?.value, { "^S_": { type: "string" } });
});

// ============================================================
// Keywords NOT reported as dropped (conversions)
// ============================================================

Deno.test("nullable NOT reported as dropped (converted to type null)", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { type: "string", nullable: true },
    googleAiJsonSchemaSpecification,
    jsonSchemaDraft7Specification,
    { droppedKeys: dropped },
  );

  assertEquals(dropped.size, 0);
});

Deno.test("dependencies NOT reported as dropped (converted to dependentRequired/dependentSchemas)", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      dependencies: {
        bar: ["foo"],
        baz: { type: "object" },
      },
    },
    "draft7",
    "draft2020_12",
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("dependencies"), false);
});

Deno.test("definitions NOT reported as dropped (converted to $defs)", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    { definitions: { x: { type: "string" } } },
    "draft7",
    "draft2020_12",
    { droppedKeys: dropped },
  );

  assertEquals(dropped.size, 0);
});

Deno.test("No drops reported for compatible specs", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      properties: {
        name: { type: "string", minLength: 1, maxLength: 100 },
        age: { type: "integer", minimum: 0 },
      },
      required: ["name"],
      additionalProperties: false,
    },
    "draft7",
    "draft2020_12",
    { droppedKeys: dropped },
  );

  assertEquals(dropped.size, 0);
});

// ============================================================
// Nested schema paths
// ============================================================

Deno.test("Dropped keys include correct paths for nested schemas", () => {
  const dropped: DroppedKeysMap = new Map();

  translateJsonSchema(
    {
      type: "object",
      properties: {
        child: {
          type: "number",
          multipleOf: 5,
        },
      },
    },
    jsonSchemaDraft7Specification,
    googleAiJsonSchemaSpecification,
    { droppedKeys: dropped },
  );

  // multipleOf should be reported dropped at the nested path
  const paths = [...dropped.keys()];
  const multipleOfPath = paths.find((p) =>
    p.length === 3 &&
    p[0] === "properties" &&
    p[1] === "child" &&
    p[2] === "multipleOf"
  );
  assertEquals(multipleOfPath !== undefined, true);

  // And the value should be included
  const entry = dropped.get(multipleOfPath!);
  assertEquals(entry?.keyword, "multipleOf");
  assertEquals(entry?.value, 5);
});

// ============================================================
// Option modes: warn, throw, callback
// ============================================================

Deno.test("droppedKeys 'throw' throws on drops", () => {
  assertThrows(
    () =>
      translateJsonSchema(
        { if: { type: "string" }, then: { minLength: 1 } },
        "draft7",
        "draft4",
        { droppedKeys: "throw" },
      ),
    Error,
    "Dropped keys",
  );
});

Deno.test("droppedKeys callback receives the map", () => {
  let received: DroppedKeysMap | undefined;

  translateJsonSchema(
    { if: { type: "string" } },
    "draft7",
    "draft4",
    {
      droppedKeys: (map) => {
        received = map;
      },
    },
  );

  assertEquals(received !== undefined, true);
  assertEquals(received!.size > 0, true);
});

Deno.test("droppedKeys 'ignore' does not throw", () => {
  // Should not throw
  translateJsonSchema(
    { if: { type: "string" } },
    "draft7",
    "draft4",
    { droppedKeys: "ignore" },
  );
});

// ============================================================
// Works with jsonSchemaTranslator too
// ============================================================

Deno.test("droppedKeys works with jsonSchemaTranslator", () => {
  const dropped: DroppedKeysMap = new Map();
  const translator = jsonSchemaTranslator("draft7", "draft4");

  translator(
    { if: { type: "string" }, then: { minLength: 1 } },
    { droppedKeys: dropped },
  );

  const kw = droppedKeywords(dropped);
  assertEquals(kw.includes("if"), true);
  assertEquals(kw.includes("then"), true);
});
