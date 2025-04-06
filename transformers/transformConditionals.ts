import { translateSchema } from "./schema.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformConditionals: TransformerFunction = (input, output) => {
  if (input.schema.if !== undefined) {
    output.schema.if = translateSchema(
      {
        schema: input.schema.if,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (input.schema.then !== undefined) {
    output.schema.then = translateSchema(
      {
        schema: input.schema.then,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (input.schema.else !== undefined) {
    output.schema.else = translateSchema(
      {
        schema: input.schema.else,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (input.schema.not !== undefined) {
    output.schema.not = translateSchema(
      {
        schema: input.schema.not,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }
};
