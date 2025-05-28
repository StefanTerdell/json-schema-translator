import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateFactoringKeywords: Mutator = (ctx) => {
  if (ctx.input.settings.anyOf) {
    if (ctx.output.settings.anyOf && ctx.input.schema.anyOf !== undefined) {
      ctx.output.schema.anyOf = ctx.input.schema.anyOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema,
          },
          path: [...ctx.path, "anyOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("anyOf");
  }

  if (ctx.input.settings.oneOf) {
    if (ctx.output.settings.oneOf && ctx.input.schema.oneOf !== undefined) {
      ctx.output.schema.oneOf = ctx.input.schema.oneOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema,
          },
          path: [...ctx.path, "oneOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("oneOf");
  }

  if (ctx.input.settings.allOf) {
    if (ctx.output.settings.allOf && ctx.input.schema.allOf !== undefined) {
      ctx.output.schema.allOf = ctx.input.schema.allOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema,
          },
          path: [...ctx.path, "allOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("allOf");
  }
};
