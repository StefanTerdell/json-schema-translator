import { copy } from "../../copy.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateFactoringKeywords: Mutator = (ctx) => {
  if (ctx.from.settings.anyOf) {
    if (ctx.into.settings.anyOf && ctx.from.schema.anyOf !== undefined) {
      ctx.into.schema.anyOf = ctx.from.schema.anyOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema,
          },
          path: [...ctx.path, "anyOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("anyOf");
  }

  if (ctx.from.settings.oneOf) {
    if (ctx.into.settings.oneOf && ctx.from.schema.oneOf !== undefined) {
      ctx.into.schema.oneOf = ctx.from.schema.oneOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema,
          },
          path: [...ctx.path, "oneOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("oneOf");
  }

  if (ctx.from.settings.allOf) {
    if (ctx.into.settings.allOf && ctx.from.schema.allOf !== undefined) {
      ctx.into.schema.allOf = ctx.from.schema.allOf.map((schema, index) =>
        translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema,
          },
          path: [...ctx.path, "allOf", index],
          forceAllowBooleanSchema: false,
        }),
      );
    }

    ctx.handledKeys.add("allOf");
  }

  if (ctx.from.settings.discriminator) {
    if (ctx.into.settings.discriminator && ctx.from.schema.discriminator) {
      ctx.into.schema.discriminator = copy(
        ctx.copyJson,
        ctx.from.schema.discriminator,
      );
    }

    ctx.handledKeys.add("discriminator");
  }
};
