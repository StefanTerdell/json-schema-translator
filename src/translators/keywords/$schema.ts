import { Mutator } from "../Mutator.ts";

export const translate$schema: Mutator = (ctx) => {
  if (ctx.from.specification.$schema !== undefined) {
    if (
      ctx.into.specification.$schema !== undefined &&
      ctx.from.schema.$schema === ctx.from.specification.$schema
    ) {
      ctx.into.schema.$schema = ctx.into.specification.$schema;
    }

    ctx.handledKeys.add("$schema");
  }
};
