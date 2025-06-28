import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateReadOnly: Mutator = (ctx) => {
  match(
    ctx,
    { readOnly: true },
    {
      from(ctx) {
        ctx.handledKeys.add("readOnly");
      },
      both(ctx) {
        if (ctx.into.schema.readOnly !== undefined) {
          ctx.into.schema.readOnly = ctx.from.schema.readOnly;
        }
      },
    },
  );
};
