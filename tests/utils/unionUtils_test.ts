import { assertEquals } from "@std/assert/equals";
import {
  addConstant,
  addType,
  createUnionContext,
} from "../../src/utils/unionUtils.ts";

Deno.test("Adding types if schema supports multiple", () => {
  const ctx = createUnionContext(
    {},
    {
      singleType: false,
      stringConstantsOnly: false,
      anyOf: false,
      oneOf: false,
      allOf: false,
      enum: false,
      const: false,
    },
  );

  addType(ctx, "string");

  assertEquals(ctx.schema, { type: "string" });

  addType(ctx, "number");

  assertEquals(ctx.schema, { type: ["string", "number"] });

  addType(ctx, "boolean");

  assertEquals(ctx.schema, { type: ["string", "number", "boolean"] });
});

Deno.test(
  "Adding types if schema doesnt support multiple or oneOf, but supports anyOf",
  () => {
    const ctx = createUnionContext(
      {},
      {
        singleType: true,
        stringConstantsOnly: false,
        anyOf: true,
        oneOf: false,
        allOf: false,
        enum: false,
        const: false,
      },
    );

    addType(ctx, "string");

    assertEquals(ctx.schema, { type: "string" });

    addType(ctx, "number");

    assertEquals(ctx.schema, {
      anyOf: [{ type: "string" }, { type: "number" }],
    });

    addType(ctx, "boolean");

    assertEquals(ctx.schema, {
      anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
    });
  },
);

Deno.test(
  "Adding types if schema doesnt support multiple or anyOf, but supports oneOf",
  () => {
    const ctx = createUnionContext(
      {},
      {
        singleType: true,
        stringConstantsOnly: false,
        anyOf: false,
        oneOf: true,
        allOf: false,
        enum: false,
        const: false,
      },
    );

    addType(ctx, "string");

    assertEquals(ctx.schema, { type: "string" });

    addType(ctx, "number");

    assertEquals(ctx.schema, {
      oneOf: [{ type: "string" }, { type: "number" }],
    });

    addType(ctx, "boolean");

    assertEquals(ctx.schema, {
      oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
    });
  },
);

Deno.test(
  "Adding types if schema doesnt support multiple, but supports anyOf, but there is already an anyOf union",
  () => {
    const ctx = createUnionContext(
      {
        anyOf: [
          {
            const: "foo",
          },
          { const: "bar" },
        ],
      },
      {
        singleType: true,
        stringConstantsOnly: false,
        anyOf: true,
        oneOf: false,
        allOf: true,
        enum: false,
        const: true,
      },
    );

    addType(ctx, "string");

    assertEquals(ctx.schema, {
      type: "string",
      anyOf: [{ const: "foo" }, { const: "bar" }],
    });

    addType(ctx, "number");

    assertEquals(ctx.schema, {
      allOf: [
        {
          anyOf: [
            {
              const: "foo",
            },
            {
              const: "bar",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
      ],
    });

    addType(ctx, "boolean");

    assertEquals(ctx.schema, {
      allOf: [
        {
          anyOf: [
            {
              const: "foo",
            },
            {
              const: "bar",
            },
          ],
        },
        {
          anyOf: [
            {
              type: "string",
            },
            {
              type: "number",
            },
            {
              type: "boolean",
            },
          ],
        },
      ],
    });
  },
);

Deno.test("Adding constants when only enum is supported", () => {
  const ctx = createUnionContext(
    {},
    {
      singleType: false,
      stringConstantsOnly: false,
      anyOf: false,
      oneOf: false,
      allOf: false,
      enum: true,
      const: false,
    },
  );

  addConstant(ctx, "hello");

  assertEquals(ctx.schema, { enum: ["hello"] });

  addConstant(ctx, "world");

  assertEquals(ctx.schema, { enum: ["hello", "world"] });
});

Deno.test("Adding constants when const and anyOf is supported", () => {
  const ctx = createUnionContext(
    {},
    {
      singleType: false,
      stringConstantsOnly: false,
      anyOf: true,
      oneOf: false,
      allOf: false,
      enum: false,
      const: true,
    },
  );

  addConstant(ctx, "foo");

  assertEquals(ctx.schema, { const: "foo" });

  addConstant(ctx, "bar");

  assertEquals(ctx.schema, { anyOf: [{ const: "foo" }, { const: "bar" }] });

  addConstant(ctx, "baz");

  assertEquals(ctx.schema, {
    anyOf: [{ const: "foo" }, { const: "bar" }, { const: "baz" }],
  });
});

Deno.test(
  "Adding constants when const and anyOf is supported but there is already an anyOf",
  () => {
    const ctx = createUnionContext(
      { anyOf: [{ type: "string" }, { type: "number" }] },
      {
        singleType: false,
        stringConstantsOnly: false,
        anyOf: true,
        oneOf: false,
        allOf: true,
        enum: false,
        const: true,
      },
    );

    addConstant(ctx, "foo");

    assertEquals(ctx.schema, {
      anyOf: [{ type: "string" }, { type: "number" }],
      const: "foo",
    });

    addConstant(ctx, "bar");

    assertEquals(ctx.schema, {
      allOf: [
        { anyOf: [{ type: "string" }, { type: "number" }] },
        { anyOf: [{ const: "foo" }, { const: "bar" }] },
      ],
    });

    addConstant(ctx, "baz");

    assertEquals(ctx.schema, {
      allOf: [
        { anyOf: [{ type: "string" }, { type: "number" }] },
        { anyOf: [{ const: "foo" }, { const: "bar" }, { const: "baz" }] },
      ],
    });
  },
);
