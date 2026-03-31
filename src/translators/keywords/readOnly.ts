import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateReadOnly: Mutator = (ctx) => {
  matchContext(
    ctx,
    { readOnly: true },
    {
      from(ctx) {
        ctx.handledKeys.add("readOnly");
      },
      both(ctx) {
        if (ctx.from.schema.readOnly !== undefined) {
          ctx.into.schema.readOnly = ctx.from.schema.readOnly;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.readOnly !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "readOnly"], { keyword: "readOnly", value: ctx.from.schema.readOnly });
        }
      },
    },
  );
};
