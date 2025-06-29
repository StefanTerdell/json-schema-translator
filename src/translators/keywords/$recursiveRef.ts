import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$recursiveRef: Mutator = (ctx) => {
  match(
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
