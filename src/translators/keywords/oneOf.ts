import { addOneOfMembers, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateOneOf: Mutator = (ctx) => {
  match(
    ctx,
    { oneOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("oneOf");
      },
      both(ctx) {
        if (ctx.from.schema.oneOf?.length) {
          const members: Exclude<typeof ctx.into.schema.oneOf, undefined> =
            ctx.from.schema.oneOf.map((schema, index) =>
              translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema,
                },
                path: [...ctx.path, "oneOf", index],
                forceAllowBooleanSchema: false,
              }),
            );

          addOneOfMembers(ctx, members);
        }
      },
    },
  );
};
