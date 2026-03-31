import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateWriteOnly: Mutator = (ctx) => {
  matchContext(
    ctx,
    { writeOnly: true },
    {
      from(ctx) {
        ctx.handledKeys.add("writeOnly");
      },
      both(ctx) {
        if (ctx.from.schema.writeOnly !== undefined) {
          ctx.into.schema.writeOnly = ctx.from.schema.writeOnly;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.writeOnly !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "writeOnly"], "writeOnly");
        }
      },
    },
  );
};
