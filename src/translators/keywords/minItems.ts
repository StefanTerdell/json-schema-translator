import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinItems: Mutator = (ctx) => {
  match(
    ctx,
    { minItems: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minItems");
      },
      both(ctx) {
        if (ctx.from.schema.minItems !== undefined) {
          ctx.into.schema.minItems = ctx.from.schema.minItems;
        }
      },
    },
  );
};
