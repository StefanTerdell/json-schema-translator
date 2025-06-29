import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinContains: Mutator = (ctx) => {
  match(
    ctx,
    { minContains: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minContains");
      },
      both(ctx) {
        if (ctx.from.schema.minContains !== undefined) {
          ctx.into.schema.minContains = ctx.from.schema.minContains;
        }
      },
    },
  );
};
