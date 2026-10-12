import { assertEquals } from "@std/assert/equals";
import { jsonSchemaTranslator } from "../src/jsonSchemaTranslator.ts";
import { JsonSchemaDraft7 } from "../src/specifications/draft7.ts";
import {
  JsonSchemaDraft2020_12,
  jsonSchemaDraft2020_12Specification,
  JsonSchemaSpecification,
  translateJsonSchema,
} from "@stefan/json-schema-translator";

Deno.test(
  "Draft 7 → Draft 2020-12: tuple items become prefixItems via jsonSchemaTranslator",
  () => {
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
  },
);

Deno.test(
  "Draft 2020-12 → 2020-12 with type schemas enabled → Draft 7: simple type schemas become strings and back to objects again",
  () => {
    const enabledSpec = {
      ...jsonSchemaDraft2020_12Specification,
      typeSchemas: true,
    } satisfies JsonSchemaSpecification;

    const draft2020_12ToKarta26_10 = jsonSchemaTranslator(
      "draft2020_12",
      enabledSpec,
    );

    const string = draft2020_12ToKarta26_10({
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "string",
    });

    assertEquals(string, "string");

    const draft7 = translateJsonSchema(string, enabledSpec, "draft7");

    assertEquals(draft7, {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "string",
    });
  },
);
