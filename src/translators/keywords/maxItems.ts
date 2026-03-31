import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxItems: Mutator = (ctx) => {
  matchContext(
    ctx,
    { maxItems: true },
    {
      from(ctx) {
        ctx.handledKeys.add("maxItems");
      },
      both(ctx) {
        if (ctx.from.schema.maxItems !== undefined) {
          ctx.into.schema.maxItems = ctx.from.schema.maxItems;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.maxItems !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "maxItems"], { keyword: "maxItems", value: ctx.from.schema.maxItems });
        }
      },
    },
  );
};
