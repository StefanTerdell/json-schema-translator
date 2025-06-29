import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMinProperties: Mutator = (ctx) => {
  match(
    ctx,
    { minProperties: true },
    {
      from(ctx) {
        ctx.handledKeys.add("minProperties");
      },
      both(ctx) {
        if (ctx.from.schema.minProperties !== undefined) {
          ctx.into.schema.minProperties = ctx.from.schema.minProperties;
        }
      },
    },
  );
};
