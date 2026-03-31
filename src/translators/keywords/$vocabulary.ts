import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translate$vocabulary: Mutator = (ctx) => {
  matchContext(
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
      onlyFrom(ctx) {
        if (ctx.from.schema.$vocabulary !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "$vocabulary"], { keyword: "$vocabulary", value: ctx.from.schema.$vocabulary });
        }
      },
    },
  );
};
