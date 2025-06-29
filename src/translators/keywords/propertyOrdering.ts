import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translatePropertyOrdering: Mutator = (ctx) => {
  match(
    ctx,
    { propertyOrdering: true },
    {
      from(ctx) {
        ctx.handledKeys.add("propertyOrdering");
      },
      both(ctx) {
        if (ctx.from.schema.propertyOrdering !== undefined) {
          ctx.into.schema.propertyOrdering = ctx.from.schema.propertyOrdering;
        } else if (
          ctx.into.settings.derivePropertyOrderingFromKeys &&
          ctx.from.schema.properties !== undefined
        ) {
          ctx.into.schema.propertyOrdering = Object.keys(
            ctx.from.schema.properties,
          );
        }
      },
      onlyInto(ctx) {
        if (
          ctx.into.settings.derivePropertyOrderingFromKeys &&
          ctx.from.schema.properties !== undefined
        ) {
          ctx.into.schema.propertyOrdering = Object.keys(
            ctx.from.schema.properties,
          );
        }
      },
    },
  );
};
