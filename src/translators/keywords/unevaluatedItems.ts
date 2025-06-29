import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateUnevaluatedItems: Mutator = (ctx) => {
  match(
    ctx,
    { unevaluatedItems: true },
    {
      from(ctx) {
        ctx.handledKeys.add("unevaluatedItems");
      },
      both(ctx) {
        if (ctx.from.schema.unevaluatedItems !== undefined) {
          ctx.into.schema.unevaluatedItems = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.unevaluatedItems,
            },
            path: [...ctx.path, "unevaluatedItems"],
            forceAllowBooleanSchema: false,
          });
        }
      },
    },
  );
};
