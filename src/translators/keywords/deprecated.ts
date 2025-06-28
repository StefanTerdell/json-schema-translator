import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateDeprecated: Mutator = (ctx) => {
  match(
    ctx,
    { deprecated: true },
    {
      from(ctx) {
        ctx.handledKeys.add("deprecated");
      },
      both(ctx) {
        if (ctx.into.schema.deprecated !== undefined) {
          ctx.into.schema.deprecated = ctx.from.schema.deprecated;
        }
      },
    },
  );
};
