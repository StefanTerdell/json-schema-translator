import { assertEquals } from "@std/assert/equals";
import { addConstant, addType } from "../../src/utils/unionUtils.ts";
import {
  jsonSchemaDraft7Specification,
  JsonSchemaDraft7Specification,
  JsonSchemaKeywordsObject,
  jsonSchemaSpecification,
  JsonSchemaSpecification,
} from "../../src/index.ts";
import { MutatorContext } from "../../src/translators/MutatorContext.ts";
import { getCopyFn } from "../../src/misc/copy.ts";

function createUnionContext<const Into extends JsonSchemaSpecification>(
  specification: Into,
  schema: JsonSchemaKeywordsObject<Into>,
): MutatorContext<JsonSchemaDraft7Specification, Into> {
  return {
    copyJson: getCopyFn("stringifyAndParse"),
    from: {
      specification: jsonSchemaDraft7Specification,
      schema: {},
    },
    into: {
      schema,
      specification,
    },
    unhandledKeys: new Map(),
    handledKeys: new Set(),
    path: [],
    seen: new Map(),
    unionLocations: new Map(),
  };
}

Deno.test("Adding types if schema supports multiple", () => {
  const ctx = createUnionContext(
    {
      ...jsonSchemaSpecification,
      singleType: false,
      stringConstants: false,
      anyOf: false,
      oneOf: false,
      allOf: false,
      enum: false,
      const: false,
    },
    {},
  );

  addType(ctx, "string");

  assertEquals(ctx.into.schema, { type: "string" });

  addType(ctx, "number");

  assertEquals(ctx.into.schema, { type: ["string", "number"] });

  addType(ctx, "boolean");

  assertEquals(ctx.into.schema, { type: ["string", "number", "boolean"] });
});

Deno.test(
  "Adding types if schema doesnt support multiple or oneOf, but supports anyOf",
  () => {
    const ctx = createUnionContext(
      {
        ...jsonSchemaSpecification,
        singleType: true,
        stringConstants: false,
        anyOf: true,
        oneOf: false,
        allOf: false,
        enum: false,
        const: false,
      },
      {},
    );

    addType(ctx, "string");

    assertEquals(ctx.into.schema, { type: "string" });

    addType(ctx, "number");

    assertEquals(ctx.into.schema, {
      anyOf: [{ type: "string" }, { type: "number" }],
    });

    addType(ctx, "boolean");

    assertEquals(ctx.into.schema, {
      anyOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
    });
  },
);

Deno.test(
  "Adding types if schema doesnt support multiple or anyOf, but supports oneOf",
  () => {
    const ctx = createUnionContext(
      {
        ...jsonSchemaSpecification,
        singleType: true,
        stringConstants: false,
        anyOf: false,
        oneOf: true,
        allOf: false,
        enum: false,
        const: false,
      },
      {},
    );

    addType(ctx, "string");

    assertEquals(ctx.into.schema, { type: "string" });

    addType(ctx, "number");

    assertEquals(ctx.into.schema, {
      oneOf: [{ type: "string" }, { type: "number" }],
    });

    addType(ctx, "boolean");

    assertEquals(ctx.into.schema, {
      oneOf: [{ type: "string" }, { type: "number" }, { type: "boolean" }],
    });
  },
);

Deno.test(
  "Adding types if schema doesnt support multiple, but supports anyOf, but there is already an anyOf union",
  () => {
    const ctx = createUnionContext(
      {
        ...jsonSchemaSpecification,
        singleType: true,
        stringConstants: false,
        anyOf: true,
        oneOf: false,
        allOf: true,
        enum: false,
        const: true,
      },
      {
        anyOf: [
          {
            const: "foo",
          },
          { const: "bar" },
        ],
      },
    );

    addType(ctx, "string");

    assertEquals(ctx.into.schema, {
      type: "string",
      anyOf: [{ const: "foo" }, { const: "bar" }],
    });

    addType(ctx, "number");

    assertEquals(ctx.into.schema, {
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

    assertEquals(ctx.into.schema, {
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
    {
      ...jsonSchemaSpecification,
      singleType: false,
      stringConstants: false,
      anyOf: false,
      oneOf: false,
      allOf: false,
      enum: true,
      const: false,
    },
    {},
  );

  addConstant(ctx, "hello");

  assertEquals(ctx.into.schema, { enum: ["hello"] });

  addConstant(ctx, "world");

  assertEquals(ctx.into.schema, { enum: ["hello", "world"] });
});

Deno.test("Adding constants when const and anyOf is supported", () => {
  const ctx = createUnionContext(
    {
      ...jsonSchemaSpecification,
      singleType: false,
      stringConstants: false,
      anyOf: true,
      oneOf: false,
      allOf: false,
      enum: false,
      const: true,
    },
    {},
  );

  addConstant(ctx, "foo");

  assertEquals(ctx.into.schema, { const: "foo" });

  addConstant(ctx, "bar");

  assertEquals(ctx.into.schema, {
    anyOf: [{ const: "foo" }, { const: "bar" }],
  });

  addConstant(ctx, "baz");

  assertEquals(ctx.into.schema, {
    anyOf: [{ const: "foo" }, { const: "bar" }, { const: "baz" }],
  });
});

Deno.test(
  "Adding constants when const and anyOf is supported but there is already an anyOf",
  () => {
    const ctx = createUnionContext(
      {
        ...jsonSchemaSpecification,
        singleType: false,
        stringConstants: false,
        anyOf: true,
        oneOf: false,
        allOf: true,
        enum: false,
        const: true,
      },
      { anyOf: [{ type: "string" }, { type: "number" }] },
    );

    addConstant(ctx, "foo");

    assertEquals(ctx.into.schema, {
      anyOf: [{ type: "string" }, { type: "number" }],
      const: "foo",
    });

    addConstant(ctx, "bar");

    assertEquals(ctx.into.schema, {
      allOf: [
        { anyOf: [{ type: "string" }, { type: "number" }] },
        { anyOf: [{ const: "foo" }, { const: "bar" }] },
      ],
    });

    addConstant(ctx, "baz");

    assertEquals(ctx.into.schema, {
      allOf: [
        { anyOf: [{ type: "string" }, { type: "number" }] },
        { anyOf: [{ const: "foo" }, { const: "bar" }, { const: "baz" }] },
      ],
    });
  },
);
