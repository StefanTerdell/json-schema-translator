import { addAnyOfMembers, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAnyOf: Mutator = (ctx) => {
  match(
    ctx,
    { anyOf: true },
    {
      from(ctx) {
        ctx.handledKeys.add("anyOf");
      },
      both(ctx) {
        if (ctx.from.schema.anyOf?.length) {
          const members: Exclude<typeof ctx.into.schema.anyOf, undefined> =
            ctx.from.schema.anyOf.map((schema, index) =>
              translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema,
                },
                path: [...ctx.path, "anyOf", index],
                forceAllowBooleanSchema: false,
              }),
            );

          addAnyOfMembers(ctx, members);
        }
      },
    },
  );
};
