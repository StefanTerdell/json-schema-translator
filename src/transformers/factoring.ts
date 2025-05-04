import { generateSchema } from "./schema.ts";
import { Mutator } from "./Mutator.ts";

export const translateFactoringKeywords: Mutator = (input, output) => {
  if (input.schema.anyOf !== undefined) {
    output.schema.anyOf = input.schema.anyOf.map((schema, index) =>
      generateSchema(
        {
          schema,
          settings: input.settings,
          path: [...input.path, "anyOf", index],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
      ),
    );
  }

  input.handledKeys.add("anyOf");

  if (input.schema.allOf !== undefined) {
    output.schema.allOf = input.schema.allOf.map((schema, index) =>
      generateSchema(
        {
          schema,
          settings: input.settings,
          path: [...input.path, "allOf", index],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
      ),
    );
  }

  input.handledKeys.add("allOf");

  if (input.schema.oneOf !== undefined) {
    output.schema.oneOf = input.schema.oneOf.map((schema, index) =>
      generateSchema(
        {
          schema,
          settings: input.settings,
          path: [...input.path, "oneOf", index],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
      ),
    );
  }

  input.handledKeys.add("oneOf");
};
