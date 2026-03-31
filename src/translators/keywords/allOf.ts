import { matchContext } from "../../utils/contextUtils.ts";
import { addExclusiveAllOf } from "../../utils/unionUtils.ts";
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

          addExclusiveAllOf(ctx, members);
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.allOf !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "allOf"], { keyword: "allOf", value: ctx.from.schema.allOf });
        }
      },
    },
  );
};
