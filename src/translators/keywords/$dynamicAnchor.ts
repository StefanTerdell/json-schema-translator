import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$dynamicAnchor: Mutator = (ctx) => {
  match(
    ctx,
    { $dynamicAnchor: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$dynamicAnchor");
      },
      both(ctx) {
        if (ctx.from.schema.$dynamicAnchor !== undefined) {
          ctx.into.schema.$dynamicAnchor = ctx.from.schema.$dynamicAnchor;
        }
      },
    },
  );
};
