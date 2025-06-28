import { Mutator } from "../Mutator.ts";

export const translateTitle: Mutator = (ctx) => {
  if (ctx.from.schema.title !== undefined) {
    ctx.into.schema.title = ctx.from.schema.title;
  }

  ctx.handledKeys.add("title");
};
