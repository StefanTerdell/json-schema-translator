import { matchContext } from "../../utils/contextUtils.ts";
import { addAllOfMembersToPair } from "../../utils/pairUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAllOf: Mutator = (ctx) => {
  matchContext(
    ctx,
    { allOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("allOf");
      },
      both(ctx) {
        if (ctx.from.schema.allOf?.length) {
          const members = ctx.from.schema.allOf.map((schema, index) =>
            translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema,
              },
              path: [...ctx.path, "allOf", index],
              forceAllowBooleanSchema: false,
            }),
          );

          addAllOfMembersToPair(ctx.into, members);
        }
      },
    },
  );
};
