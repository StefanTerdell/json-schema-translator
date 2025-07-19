import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$comment: Mutator = (ctx) => {
  matchContext(
    ctx,
    { $comment: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$comment");
      },
      both(ctx) {
        if (ctx.into.schema.$comment !== undefined) {
          ctx.into.schema.$comment = ctx.from.schema.$comment;
        }
      },
    },
  );
};
