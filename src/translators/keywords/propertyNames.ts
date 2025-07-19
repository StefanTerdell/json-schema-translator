import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translatePropertyNames: Mutator = (ctx) => {
  matchContext(
    ctx,
    { propertyNames: true },
    {
      from(ctx) {
        ctx.handledKeys.add("propertyNames");
      },
      both(ctx) {
        if (ctx.from.specification.propertyNames) {
          if (
            ctx.into.specification.propertyNames &&
            ctx.from.schema.propertyNames != undefined
          ) {
            const propertyNames = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema: ctx.from.schema.propertyNames,
              },
              path: [...ctx.path, "propertyNames"],
              forceAllowBooleanSchema: true,
            });

            if (typeof propertyNames === "object" && "type" in propertyNames) {
              delete propertyNames.type;
            }

            ctx.into.schema.propertyNames = propertyNames;
          }

          ctx.handledKeys.add("propertyNames");
        }
      },
    },
  );
};
