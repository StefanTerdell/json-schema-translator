import { Mutator } from "../Mutator.ts";

export const translate$ref: Mutator = (ctx) => {
  if (ctx.from.schema.$ref !== undefined) {
    ctx.into.schema.$ref = ctx.from.schema.$ref;
  }

  ctx.handledKeys.add("$ref");
};
