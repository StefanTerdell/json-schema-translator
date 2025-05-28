import { assertEquals } from "@std/assert/equals";
import { jsonSchemaTranslator } from "../src/jsonSchemaTranslator.ts";
import { JsonSchemaDraft7 } from "../src/specifications/draft7.ts";

Deno.test("asd", () => {
  const draft7ToDraft2020_12 = jsonSchemaTranslator("draft7", "draft2020_12");

  const input: JsonSchemaDraft7 = {
    $schema: "http://json-schema.org/draft-07/schema#",
    items: [
      {
        type: "string",
      },
    ],
  };

  const output = draft7ToDraft2020_12(input);

  assertEquals(output, {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    prefixItems: [
      {
        type: "string",
      },
    ],
  });
});
