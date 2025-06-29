import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$anchor: Mutator = (ctx) => {
  match(
    ctx,
    { $anchor: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$anchor");
      },
      both(ctx) {
        if (ctx.from.schema.$anchor !== undefined) {
          ctx.into.schema.$anchor = ctx.from.schema.$anchor;
        }
      },
    },
  );
};
