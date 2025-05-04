import { generateSchema } from "./schema.ts";
import { Mutator } from "./Mutator.ts";

export const translateConditionalKeywords: Mutator = (input, output) => {
  if (input.schema.if !== undefined) {
    output.schema.if = generateSchema(
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
    );
  }

  input.handledKeys.add("if");

  if (input.schema.then !== undefined) {
    output.schema.then = generateSchema(
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
    );
  }

  input.handledKeys.add("then");

  if (input.schema.else !== undefined) {
    output.schema.else = generateSchema(
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
    );
  }

  input.handledKeys.add("else");

  if (input.schema.not !== undefined) {
    output.schema.not = generateSchema(
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
    );
  }

  input.handledKeys.add("not");
};
