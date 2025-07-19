import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$recursiveRef: Mutator = (ctx) => {
  matchContext(
    ctx,
    { $recursiveRef: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$recursiveRef");
      },
      both(ctx) {
        if (ctx.from.schema.$recursiveRef !== undefined) {
          ctx.into.schema.$recursiveRef = ctx.from.schema.$recursiveRef;
        }
      },
    },
  );
};
