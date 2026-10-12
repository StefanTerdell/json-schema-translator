import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";
import { jsonSchemaDraft7Specification } from "../../src/specifications/draft7.ts";
import { jsonSchemaDraft2020_12Specification } from "../../src/specifications/draft2020_12.ts";
import { openAiStructuredOutputSchemaSpecification } from "../../src/specifications/open_ai_structured_output.ts";

const draft7SingleItems = {
  ...jsonSchemaDraft7Specification,
  singleItems: true,
} as const;

const draft2020_12SingleItems = {
  ...jsonSchemaDraft2020_12Specification,
  prefixItems: false,
  singleItems: true,
} as const;

Deno.test("singleItems: tuple items collapse into a union", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  );
});

Deno.test("singleItems: single-member tuple becomes the member itself", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }],
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { type: "string" },
    },
  );
});

Deno.test("singleItems: identical tuple members are deduplicated", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }, { type: "string" }],
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { type: "string" },
    },
  );
});

Deno.test("singleItems: additionalItems joins the union", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }],
        additionalItems: { type: "number" },
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  );
});

Deno.test("singleItems: additionalItems false does not widen the union", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }, { type: "number" }],
        additionalItems: false,
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  );
});

Deno.test("singleItems: prefixItems and items collapse into a union", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        prefixItems: [{ type: "string" }],
        items: { type: "number" },
      },
      jsonSchemaDraft2020_12Specification,
      draft2020_12SingleItems,
    ),
    {
      type: "array",
      items: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  );
});

Deno.test("singleItems: non-tuple items are preserved", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: { type: "string" },
      },
      jsonSchemaDraft7Specification,
      draft7SingleItems,
    ),
    {
      type: "array",
      items: { type: "string" },
    },
  );
});

Deno.test("OpenAI structured output never receives tuple-style items", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "array",
        items: [{ type: "string" }, { type: "integer" }],
      },
      jsonSchemaDraft7Specification,
      openAiStructuredOutputSchemaSpecification,
    ),
    {
      type: "array",
      items: { anyOf: [{ type: "string" }, { type: "integer" }] },
    },
  );
});
