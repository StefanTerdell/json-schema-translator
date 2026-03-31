import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translatePatternProperties: Mutator = (ctx) => {
  matchContext(
    ctx,
    { patternProperties: true },
    {
      from(ctx) {
        ctx.handledKeys.add("patternProperties");
      },
      both(ctx) {
        if (
          ctx.from.schema.patternProperties !== undefined &&
          Object.keys(ctx.from.schema.patternProperties).length
        ) {
          ctx.into.schema.patternProperties = {};

          for (const key in ctx.from.schema.patternProperties) {
            ctx.into.schema.patternProperties[key] = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema: ctx.from.schema.patternProperties[key],
              },
              path: [...ctx.path, "patternProperties", key],
              forceAllowBooleanSchema: false,
            });
          }
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.patternProperties !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "patternProperties"], { keyword: "patternProperties", value: ctx.from.schema.patternProperties });
        }
      },
    },
  );
};
