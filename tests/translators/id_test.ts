import { assertEquals } from "@std/assert/equals";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import { JsonSchema, JsonSchemaSpecification } from "../../src/index.ts";
import { translateId } from "../../src/translators/keywords/id.ts";

Deno.test("id should be copied from and to the specified path", () => {
  const inputSettings = {
    ...jsonSchemaDraft4Specification,
    $id: "blah" as const,
  } satisfies JsonSchemaSpecification;

  const outputSettings = {
    ...jsonSchemaDraft4Specification,
    $id: "bleh" as const,
  } satisfies JsonSchemaSpecification;

  const inputSchema: JsonSchema<typeof inputSettings> = {
    blah: "hello",
  };

  const outputSchema: JsonSchema<typeof outputSettings> = {};

  translateId({
    from: {
      schema: inputSchema,
      specification: inputSettings,
    },
    path: [],
    handledKeys: new Set(),
    into: {
      schema: outputSchema,
      specification: outputSettings,
    },
    unhandledKeys: new Map(),
    droppedKeys: new Map(),
    copyJson: "stringifyAndParse",
    seen: new Map(),
    unionLocations: new Map(),
  });

  assertEquals(outputSchema, { bleh: "hello" });
});
