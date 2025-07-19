import { addType, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateNullable: Mutator = (ctx) => {
  match(
    ctx,
    { nullable: true },
    {
      from(ctx) {
        ctx.handledKeys.add("nullable");
      },
      both(ctx) {
        if (ctx.from.schema.nullable !== undefined) {
          ctx.into.schema.nullable = ctx.from.schema.nullable;
        }
      },
      onlyFrom(ctx) {
        if (ctx.from.schema.nullable === true) {
          addType(ctx, "null");
        }
      },
    },
  );
};
