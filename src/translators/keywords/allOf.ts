import { addAllOfMembers, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAllOf: Mutator = (ctx) => {
  match(
    ctx,
    { allOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("allOf");
      },
      both(ctx) {
        if (ctx.from.schema.allOf?.length) {
          const members: Exclude<typeof ctx.into.schema.allOf, undefined> =
            ctx.from.schema.allOf.map((schema, index) =>
              translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema,
                },
                path: [...ctx.path, "allOf", index],
                forceAllowBooleanSchema: false,
              }),
            );

          addAllOfMembers(ctx, members);
        }
      },
    },
  );
};
