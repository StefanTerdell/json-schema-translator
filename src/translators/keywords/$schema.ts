import { Mutator } from "../Mutator.ts";

export const translate$schema: Mutator = (ctx) => {
  if (ctx.from.settings.$schema !== undefined) {
    if (
      ctx.into.settings.$schema !== undefined &&
      ctx.from.schema.$schema === ctx.from.settings.$schema
    ) {
      ctx.into.schema.$schema = ctx.into.settings.$schema;
    }

    ctx.handledKeys.add("$schema");
  }
};
