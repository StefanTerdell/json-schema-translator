import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$anchor: Mutator = (ctx) => {
  matchContext(
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
      onlyFrom(ctx) {
        if (ctx.from.schema.$anchor !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "$anchor"], { keyword: "$anchor", value: ctx.from.schema.$anchor });
        }
      },
    },
  );
};
