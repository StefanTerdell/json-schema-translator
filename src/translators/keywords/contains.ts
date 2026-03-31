import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateContains: Mutator = (ctx) => {
  matchContext(
    ctx,
    { contains: true },
    {
      from(ctx) {
        ctx.handledKeys.add("contains");
      },
      both(ctx) {
        if (ctx.from.schema.contains !== undefined) {
          ctx.into.schema.contains = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.contains,
            },
            path: [...ctx.path, "contains"],
            forceAllowBooleanSchema: false,
          });
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.contains !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "contains"], { keyword: "contains", value: ctx.from.schema.contains });
        }
      },
    },
  );
};
