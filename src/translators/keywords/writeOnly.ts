import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateWriteOnly: Mutator = (ctx) => {
  match(
    ctx,
    { writeOnly: true },
    {
      from(ctx) {
        ctx.handledKeys.add("writeOnly");
      },
      both(ctx) {
        if (ctx.into.schema.writeOnly !== undefined) {
          ctx.into.schema.writeOnly = ctx.from.schema.writeOnly;
        }
      },
    },
  );
};
