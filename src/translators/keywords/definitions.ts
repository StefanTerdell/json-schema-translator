import { JsonObject } from "../../Json.ts";
import { JsonSchema } from "../../JsonSchema.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateDefinitions: Mutator = (ctx) => {
  type OutputSpecification = typeof ctx.into.specification;
  type InputSpecification = typeof ctx.from.specification;

  if (typeof ctx.from.specification.$defs === "string") {
    const inputDefs = (ctx.from.schema as JsonObject)[
      ctx.from.specification.$defs
    ] as Record<string, JsonSchema<InputSpecification>> | undefined;

    if (
      inputDefs !== undefined &&
      Object.keys(inputDefs).length &&
      typeof ctx.into.specification.$defs === "string"
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
      ctx.into.schema[ctx.into.specification.$defs] = outputDefs;
    }

    ctx.handledKeys.add(ctx.from.specification.$defs);
  }
};
