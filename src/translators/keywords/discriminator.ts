import { copy } from "../../misc/copy.ts";
import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateDiscriminator: Mutator = (ctx) => {
  matchContext(
    ctx,
    { discriminator: true },
    {
      from(ctx) {
        ctx.handledKeys.add("discriminator");
      },
      both(ctx) {
        if (ctx.from.schema.discriminator) {
          ctx.into.schema.discriminator = copy(
            ctx.copyJson,
            ctx.from.schema.discriminator,
          );
        }
      },
    },
  );
};
