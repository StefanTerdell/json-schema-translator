import { matchContext } from "../../utils/contextUtils.ts";
import { addExclusiveAnyOf } from "../../utils/unionUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAnyOf: Mutator = (ctx) => {
  matchContext(
    ctx,
    { anyOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("anyOf");
      },
      both(ctx) {
        if (ctx.from.schema.anyOf?.length) {
          const members = ctx.from.schema.anyOf.map((schema, index) =>
            translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema,
              },
              path: [...ctx.path, "anyOf", index],
              forceAllowBooleanSchema: false,
            }),
          );

          addExclusiveAnyOf(ctx, members);
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.anyOf !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "anyOf"], { keyword: "anyOf", value: ctx.from.schema.anyOf });
        }
      },
    },
  );
};
