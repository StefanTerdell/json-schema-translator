import { Mutator } from "../Mutator.ts";

export const translateFormat: Mutator = (ctx) => {
  if (ctx.from.specification.format) {
    if (ctx.into.specification.format && ctx.from.schema.format !== undefined) {
      if (
        ctx.into.specification.strictFormats &&
        Array.isArray(ctx.into.specification.format)
      ) {
        if (
          ctx.into.specification.format.includes(
            ctx.from.schema.format as string,
          )
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
