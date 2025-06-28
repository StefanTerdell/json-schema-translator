import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateExamples: Mutator = (ctx) => {
  match(
    ctx,
    { examples: true },
    {
      from(ctx) {
        ctx.handledKeys.add("examples");
      },
      both(ctx) {
        if (ctx.into.schema.examples !== undefined) {
          ctx.into.schema.examples = ctx.from.schema.examples;
        }
      },
    },
  );
};
