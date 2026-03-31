import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateElse: Mutator = (ctx) => {
  matchContext(
    ctx,
    { else: true },
    {
      from(ctx) {
        ctx.handledKeys.add("else");
      },
      both(ctx) {
        if (ctx.from.schema.else !== undefined) {
          ctx.into.schema.else = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.else,
            },
            path: [...ctx.path, "else"],
            forceAllowBooleanSchema: false,
          });
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.else !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "else"], "else");
        }
      },
    },
  );
};
