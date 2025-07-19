import { matchContext } from "../../utils/contextUtils.ts";
import { addTypeToPair } from "../../utils/pairUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateNullable: Mutator = (ctx) => {
  matchContext(
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
          addTypeToPair(ctx.into, "null");
        }
      },
    },
  );
};
