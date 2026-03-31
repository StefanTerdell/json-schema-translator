import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxLength: Mutator = (ctx) => {
  matchContext(
    ctx,
    { maxLength: true },
    {
      from(ctx) {
        ctx.handledKeys.add("maxLength");
      },
      both(ctx) {
        if (ctx.from.schema.maxLength !== undefined) {
          ctx.into.schema.maxLength = ctx.from.schema.maxLength;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.maxLength !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "maxLength"], { keyword: "maxLength", value: ctx.from.schema.maxLength });
        }
      },
    },
  );
};
