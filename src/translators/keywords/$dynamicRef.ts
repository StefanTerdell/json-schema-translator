import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$dynamicRef: Mutator = (ctx) => {
  matchContext(
    ctx,
    { $dynamicRef: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$dynamicRef");
      },
      both(ctx) {
        if (ctx.from.schema.$dynamicRef !== undefined) {
          ctx.into.schema.$dynamicRef = ctx.from.schema.$dynamicRef;
        }
      },
    },
  );
};
