import { assertEquals } from "@std/assert/equals";
import {
  jsonSchemaDraft2020_12Specification,
  jsonSchemaDraft4Specification,
  translateJsonSchema,
} from "../src/index.ts";

Deno.test("should transfer dynamic path keywords properly", () => {
  assertEquals(
    translateJsonSchema(
      {
        id: "hello",
        $id: {
          herpderp: null,
        },
        definitions: {
          foo: {
            type: "object",
            properties: {
              foo: {
                type: "string",
              },
            },
          },
        },
      },
      jsonSchemaDraft4Specification,
      jsonSchemaDraft2020_12Specification,
    ),
    {
      $id: "hello",
      $defs: {
        foo: {
          type: "object",
          properties: {
            foo: {
              type: "string",
            },
          },
        },
      },
    },
  );
});
