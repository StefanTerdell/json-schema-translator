import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateUniqueItems: Mutator = (ctx) => {
  match(
    ctx,
    { uniqueItems: true },
    {
      from(ctx) {
        ctx.handledKeys.add("uniqueItems");
      },
      both(ctx) {
        if (ctx.from.schema.uniqueItems !== undefined) {
          ctx.into.schema.uniqueItems = ctx.from.schema.uniqueItems;
        }
      },
    },
  );
};
