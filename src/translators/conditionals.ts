import { translateJsonSchemaInternal } from "../translateJsonSchema.ts";
import { Mutator } from "./Mutator.ts";

export const translateConditionalKeywords: Mutator = (
  input,
  output,
  options,
) => {
  if (input.schema.if !== undefined) {
    output.schema.if = translateJsonSchemaInternal(
      {
        schema: input.schema.if,
        settings: input.settings,
        path: [...input.path, "if"],
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
        unhandledKeys: output.unhandledKeys,
      },
      options,
    );
  }

  input.handledKeys.add("if");

  if (input.schema.then !== undefined) {
    output.schema.then = translateJsonSchemaInternal(
      {
        schema: input.schema.then,
        settings: input.settings,
        path: [...input.path, "then"],
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
        unhandledKeys: output.unhandledKeys,
      },
      options,
    );
  }

  input.handledKeys.add("then");

  if (input.schema.else !== undefined) {
    output.schema.else = translateJsonSchemaInternal(
      {
        schema: input.schema.else,
        settings: input.settings,
        path: [...input.path, "else"],
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
        unhandledKeys: output.unhandledKeys,
      },
      options,
    );
  }

  input.handledKeys.add("else");

  if (input.schema.not !== undefined) {
    output.schema.not = translateJsonSchemaInternal(
      {
        schema: input.schema.not,
        settings: input.settings,
        path: [...input.path, "not"],
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
        unhandledKeys: output.unhandledKeys,
      },
      options,
    );
  }

  input.handledKeys.add("not");
};
