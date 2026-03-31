import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";

Deno.test("definitions → $defs (Draft 7 → Draft 2020-12)", () => {
  assertEquals(
    translateJsonSchema(
      {
        definitions: {
          name: { type: "string" },
          age: { type: "integer" },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      $defs: {
        name: { type: "string" },
        age: { type: "integer" },
      },
    },
  );
});

Deno.test("$defs → definitions (Draft 2020-12 → Draft 7)", () => {
  assertEquals(
    translateJsonSchema(
      {
        $defs: {
          color: { type: "string", enum: ["red", "blue"] },
        },
      },
      "draft2020_12",
      "draft7",
    ),
    {
      definitions: {
        color: { type: "string", enum: ["red", "blue"] },
      },
    },
  );
});

Deno.test("$defs → $defs (Draft 2019-09 → Draft 2020-12)", () => {
  assertEquals(
    translateJsonSchema(
      {
        $defs: {
          item: { type: "object" },
        },
      },
      "draft2019_09",
      "draft2020_12",
    ),
    {
      $defs: {
        item: { type: "object" },
      },
    },
  );
});

Deno.test("definitions → definitions (Draft 4 → Draft 7)", () => {
  assertEquals(
    translateJsonSchema(
      {
        definitions: {
          point: { type: "object" },
        },
      },
      "draft4",
      "draft7",
    ),
    {
      definitions: {
        point: { type: "object" },
      },
    },
  );
});

Deno.test("Nested schemas within definitions are recursively translated", () => {
  assertEquals(
    translateJsonSchema(
      {
        definitions: {
          wrapper: {
            type: "object",
            properties: {
              any: {},
              never: { not: {} },
            },
          },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      $defs: {
        wrapper: {
          type: "object",
          properties: {
            any: true,
            never: false,
          },
        },
      },
    },
  );
});

Deno.test("Empty definitions object is not copied", () => {
  const result = translateJsonSchema(
    { type: "object", definitions: {} },
    "draft7",
    "draft2020_12",
  );

  assertEquals(typeof result === "object" && result !== null && "$defs" in result, false);
});
