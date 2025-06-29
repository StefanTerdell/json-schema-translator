import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxLength: Mutator = (ctx) => {
  match(
    ctx,
    { maxLength: true },
    {
      from(ctx) {
        ctx.handledKeys.add("maxLength");
      },
      both(ctx) {
        if (ctx.from.schema.maxLength !== undefined) {
          ctx.into.schema.maxLength = ctx.from.schema.maxLength;
        }
      },
    },
  );
};
