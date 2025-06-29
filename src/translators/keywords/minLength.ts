import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinLength: Mutator = (ctx) => {
  match(
    ctx,
    { minLength: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minLength");
      },
      both(ctx) {
        if (ctx.from.schema.minLength !== undefined) {
          ctx.into.schema.minLength = ctx.from.schema.minLength;
        }
      },
    },
  );
};
