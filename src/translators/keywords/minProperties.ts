import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinProperties: Mutator = (ctx) => {
  matchContext(
    ctx,
    { minProperties: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minProperties");
      },
      both(ctx) {
        if (ctx.from.schema.minProperties !== undefined) {
          ctx.into.schema.minProperties = ctx.from.schema.minProperties;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.minProperties !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "minProperties"], "minProperties");
        }
      },
    },
  );
};
