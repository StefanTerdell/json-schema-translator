import { assertEquals } from "@std/assert";
import { translateJsonSchema } from "../../src/translateJsonSchema.ts";

Deno.test("dependencies with array values → dependentRequired", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependencies: {
          credit_card: ["billing_address"],
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      dependentRequired: {
        credit_card: ["billing_address"],
      },
    },
  );
});

Deno.test("dependencies with schema values → dependentSchemas", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependencies: {
          credit_card: {
            type: "object",
            properties: {
              billing_address: { type: "string" },
            },
          },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      dependentSchemas: {
        credit_card: {
          type: "object",
          properties: {
            billing_address: { type: "string" },
          },
        },
      },
    },
  );
});

Deno.test("Mixed dependencies split into dependentRequired and dependentSchemas", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependencies: {
          name: ["age"],
          address: { properties: { city: { type: "string" } } },
        },
      },
      "draft7",
      "draft2020_12",
    ),
    {
      type: "object",
      dependentRequired: {
        name: ["age"],
      },
      dependentSchemas: {
        address: { properties: { city: { type: "string" } } },
      },
    },
  );
});

Deno.test("dependentRequired → dependencies", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependentRequired: {
          a: ["b", "c"],
        },
      },
      "draft2020_12",
      "draft7",
    ),
    {
      type: "object",
      dependencies: {
        a: ["b", "c"],
      },
    },
  );
});

Deno.test("dependentSchemas → dependencies", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependentSchemas: {
          x: { properties: { y: { type: "string" } } },
        },
      },
      "draft2020_12",
      "draft7",
    ),
    {
      type: "object",
      dependencies: {
        x: { properties: { y: { type: "string" } } },
      },
    },
  );
});

Deno.test("dependencies preserved between Draft 4 and Draft 7", () => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        dependencies: {
          foo: ["bar"],
        },
      },
      "draft4",
      "draft7",
    ),
    {
      type: "object",
      dependencies: {
        foo: ["bar"],
      },
    },
  );
});
