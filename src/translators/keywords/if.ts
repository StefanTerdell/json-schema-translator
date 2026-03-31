import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateIf: Mutator = (ctx) => {
  matchContext(
    ctx,
    { if: true },
    {
      from(ctx) {
        ctx.handledKeys.add("if");
      },
      both(ctx) {
        if (ctx.from.schema.if !== undefined) {
          ctx.into.schema.if = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.if,
            },
            path: [...ctx.path, "if"],
            forceAllowBooleanSchema: false,
          });
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.if !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "if"], { keyword: "if", value: ctx.from.schema.if });
        }
      },
    },
  );
};
