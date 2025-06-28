import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$vocabulary: Mutator = (ctx) => {
  match(
    ctx,
    { $vocabulary: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$vocabulary");
      },
      both(ctx) {
        if (ctx.into.schema.$vocabulary !== undefined) {
          ctx.into.schema.$vocabulary = ctx.from.schema.$vocabulary;
        }
      },
    },
  );
};
