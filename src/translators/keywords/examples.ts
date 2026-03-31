import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateExamples: Mutator = (ctx) => {
  matchContext(
    ctx,
    { examples: true },
    {
      from(ctx) {
        ctx.handledKeys.add("examples");
      },
      both(ctx) {
        if (ctx.from.schema.examples !== undefined) {
          ctx.into.schema.examples = ctx.from.schema.examples;
        }
      },
    },
  );
};
