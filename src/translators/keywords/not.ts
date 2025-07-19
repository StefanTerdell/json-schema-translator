import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateNot: Mutator = (ctx) => {
  matchContext(
    ctx,
    { not: true },
    {
      from(ctx) {
        ctx.handledKeys.add("not");
      },
      both(ctx) {
        if (ctx.from.schema.not !== undefined) {
          ctx.into.schema.not = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.not,
            },
            path: [...ctx.path, "not"],
            forceAllowBooleanSchema: false,
          });
        }
      },
    },
  );
};
