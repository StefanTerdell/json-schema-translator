import { assertEquals } from "@std/assert/equals";
import {
  jsonSchemaDraft4Specification,
  jsonSchemaDraft7Specification,
  translateJsonSchema,
} from "../index.ts";

Deno.test(() => {
  assertEquals(
    translateJsonSchema(
      {
        type: "object",
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      jsonSchemaDraft4Specification,
      jsonSchemaDraft7Specification,
    ),
    {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
      },
    },
  );
});
