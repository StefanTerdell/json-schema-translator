import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinLength: Mutator = (ctx) => {
  matchContext(
    ctx,
    { minLength: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minLength");
      },
      both(ctx) {
        if (ctx.from.schema.minLength !== undefined) {
          ctx.into.schema.minLength = ctx.from.schema.minLength;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.minLength !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "minLength"], "minLength");
        }
      },
    },
  );
};
