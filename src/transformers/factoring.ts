import { translateSchema } from "./schema.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformFactoring: TransformerFunction = (input, output) => {
  output.schema.anyOf = input.schema.anyOf?.map((schema) =>
    translateSchema(
      {
        schema,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    ),
  );

  output.schema.allOf = input.schema.allOf?.map((schema) =>
    translateSchema(
      {
        schema,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    ),
  );

  output.schema.oneOf = input.schema.oneOf?.map((schema) =>
    translateSchema(
      {
        schema,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    ),
  );
};
