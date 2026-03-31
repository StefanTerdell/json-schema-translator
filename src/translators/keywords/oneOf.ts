import { matchContext } from "../../utils/contextUtils.ts";
import { addExclusiveOneOf } from "../../utils/unionUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateOneOf: Mutator = (ctx) => {
  matchContext(
    ctx,
    { oneOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("oneOf");
      },
      both(ctx) {
        if (ctx.from.schema.oneOf?.length) {
          const members = ctx.from.schema.oneOf.map((schema, index) =>
            translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema,
              },
              path: [...ctx.path, "oneOf", index],
              forceAllowBooleanSchema: false,
            }),
          );

          addExclusiveOneOf(ctx, members);
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.oneOf !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "oneOf"], { keyword: "oneOf", value: ctx.from.schema.oneOf });
        }
      },
    },
  );
};
