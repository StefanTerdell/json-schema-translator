import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateThen: Mutator = (ctx) => {
  matchContext(
    ctx,
    { then: true },
    {
      from(ctx) {
        ctx.handledKeys.add("then");
      },
      both(ctx) {
        if (ctx.from.schema.then !== undefined) {
          ctx.into.schema.then = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.then,
            },
            path: [...ctx.path, "then"],
            forceAllowBooleanSchema: false,
          });
        }
      },
    },
  );
};
