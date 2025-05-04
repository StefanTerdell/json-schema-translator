import { assertEquals } from "@std/assert/equals";
import { jsonSchemaDraft4Specification } from "../../src/specifications/draft4.ts";
import {
  defaultTranslateJsonSchemaOptions,
  JsonSchema,
  JsonSchemaSpecification,
} from "../../index.ts";
import { translateIdKeyword } from "../../src/translators/id.ts";

Deno.test("id should be copied from and to the specified path", () => {
  const inputSettings = {
    ...jsonSchemaDraft4Specification,
    $idPath: "blah" as const,
  } satisfies JsonSchemaSpecification;

  const outputSettings = {
    ...jsonSchemaDraft4Specification,
    $idPath: "bleh" as const,
  } satisfies JsonSchemaSpecification;

  const inputSchema: JsonSchema<typeof inputSettings> = {
    blah: "hello",
  };

  const outputSchema: JsonSchema<typeof outputSettings> = {};

  translateIdKeyword(
    {
      schema: inputSchema,
      settings: inputSettings,
      handledKeys: new Set(),
      path: [],
    },
    {
      schema: outputSchema,
      settings: outputSettings,
      unhandledKeys: new Map(),
    },
    defaultTranslateJsonSchemaOptions,
  );

  assertEquals(outputSchema, { bleh: "hello" });
});
