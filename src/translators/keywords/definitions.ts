import { JsonObject } from "../../Json.ts";
import { JsonSchema } from "../../JsonSchema.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateDefinitionsKeyword: Mutator = (ctx) => {
  type OutputSpecification = typeof ctx.into.settings;
  type InputSpecification = typeof ctx.from.settings;

  if (typeof ctx.from.settings.$defs === "string") {
    const inputDefs = (ctx.from.schema as JsonObject)[
      ctx.from.settings.$defs
    ] as Record<string, JsonSchema<InputSpecification>> | undefined;

    if (
      inputDefs !== undefined &&
      typeof ctx.into.settings.$defs === "string"
    ) {
      const outputDefs = Object.keys(inputDefs).reduce(
        (outputDefs: Record<string, JsonSchema<OutputSpecification>>, key) => {
          outputDefs[key] = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: inputDefs[key],
            },
            forceAllowBooleanSchema: false,
          });

          return outputDefs;
        },
        {},
      );

      // @ts-expect-error ISSUE: Narrowing breaks down across generics
      ctx.into.schema[ctx.into.settings.$defs] = outputDefs;
    }

    ctx.handledKeys.add(ctx.from.settings.$defs);
  }
};
