import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMultipleOf: Mutator = (ctx) => {
  matchContext(
    ctx,
    { multipleOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("multipleOf");
      },
      both(ctx) {
        if (ctx.from.schema.multipleOf !== undefined) {
          ctx.into.schema.multipleOf = ctx.from.schema.multipleOf;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.multipleOf !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "multipleOf"], "multipleOf");
        }
      },
    },
  );
};
