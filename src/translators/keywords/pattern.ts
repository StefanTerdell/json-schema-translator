import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translatePattern: Mutator = (ctx) => {
  match(
    ctx,
    { pattern: true },
    {
      from(ctx) {
        ctx.handledKeys.add("pattern");
      },
      both(ctx) {
        if (ctx.from.schema.pattern !== undefined) {
          ctx.into.schema.pattern = ctx.from.schema.pattern;
        }
      },
    },
  );
};
