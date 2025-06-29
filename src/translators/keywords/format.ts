import { Mutator } from "../Mutator.ts";

export const translateFormat: Mutator = (ctx) => {
  if (ctx.from.settings.format) {
    if (ctx.into.settings.format && ctx.from.schema.format !== undefined) {
      if (
        ctx.into.settings.strictFormats &&
        Array.isArray(ctx.into.settings.format)
      ) {
        if (
          ctx.into.settings.format.includes(ctx.from.schema.format as string)
        ) {
          ctx.into.schema.format = ctx.from.schema.format;
        }
      } else {
        ctx.into.schema.format = ctx.from.schema.format;
      }
    }

    ctx.handledKeys.add("format");
  }
};
