import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$recursiveAnchor: Mutator = (ctx) => {
  matchContext(
    ctx,
    { $recursiveAnchor: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$recursiveAnchor");
      },
      both(ctx) {
        if (ctx.from.schema.$recursiveAnchor !== undefined) {
          ctx.into.schema.$recursiveAnchor = ctx.from.schema.$recursiveAnchor;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.$recursiveAnchor !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "$recursiveAnchor"], "$recursiveAnchor");
        }
      },
    },
  );
};
