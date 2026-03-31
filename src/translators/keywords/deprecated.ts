import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateDeprecated: Mutator = (ctx) => {
  matchContext(
    ctx,
    { deprecated: true },
    {
      from(ctx) {
        ctx.handledKeys.add("deprecated");
      },
      both(ctx) {
        if (ctx.from.schema.deprecated !== undefined) {
          ctx.into.schema.deprecated = ctx.from.schema.deprecated;
        }
      },
    },
  );
};
