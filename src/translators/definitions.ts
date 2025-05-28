import { type JsonObject } from "../Json.ts";
import { type JsonSchema } from "../JsonSchema.ts";
import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateDefinitionsKeyword: Mutator = (ctx) => {
  type OutputSpecification = typeof ctx.output.settings;
  type InputSpecification = typeof ctx.input.settings;

  if (typeof ctx.input.settings.$defs === "string") {
    const inputDefs = (ctx.input.schema as JsonObject)[
      ctx.input.settings.$defs
    ] as Record<string, JsonSchema<InputSpecification>> | undefined;

    if (
      inputDefs !== undefined &&
      typeof ctx.output.settings.$defs === "string"
    ) {
      const outputDefs = Object.keys(inputDefs).reduce(
        (outputDefs: Record<string, JsonSchema<OutputSpecification>>, key) => {
          outputDefs[key] = translateSchema({
            ...ctx,
            input: {
              ...ctx.input,
              schema: inputDefs[key],
            },
            forceAllowBooleanSchema: false,
          });

          return outputDefs;
        },
        {},
      );

      // @ts-expect-error ISSUE: Narrowing breaks down across generics
      ctx.output.schema[ctx.output.settings.$defs] = outputDefs;
    }

    ctx.handledKeys.add(ctx.input.settings.$defs);
  }
};
