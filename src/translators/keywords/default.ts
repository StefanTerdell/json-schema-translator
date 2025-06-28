import { Mutator } from "../Mutator.ts";

export const translateDefault: Mutator = (ctx) => {
  if (ctx.from.schema.default !== undefined) {
    ctx.into.schema.default = ctx.from.schema.default;
  }

  ctx.handledKeys.add("default");
};
