import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinContains: Mutator = (ctx) => {
  matchContext(
    ctx,
    { minContains: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minContains");
      },
      both(ctx) {
        if (ctx.from.schema.minContains !== undefined) {
          ctx.into.schema.minContains = ctx.from.schema.minContains;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.minContains !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "minContains"], { keyword: "minContains", value: ctx.from.schema.minContains });
        }
      },
    },
  );
};
