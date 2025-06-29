import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxContains: Mutator = (ctx) => {
  match(
    ctx,
    { maxContains: true },
    {
      from(ctx) {
        ctx.handledKeys.add("maxContains");
      },
      both(ctx) {
        if (ctx.from.schema.maxContains !== undefined) {
          ctx.into.schema.maxContains = ctx.from.schema.maxContains;
        }
      },
    },
  );
};
