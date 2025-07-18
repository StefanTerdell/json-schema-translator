import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateDependentSchemas: Mutator = (ctx) => {
  match(
    ctx,
    {
      dependentSchemas: true,
    },
    {
      from(ctx) {
        ctx.handledKeys.add("dependentSchemas");
      },
      both(ctx) {
        if (ctx.from.schema.dependentSchemas !== undefined) {
          for (const key in ctx.from.schema.dependentSchemas) {
            if (ctx.into.schema.dependentSchemas === undefined) {
              ctx.into.schema.dependentSchemas = {};
            }

            ctx.into.schema.dependentSchemas[key] = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema: ctx.from.schema.dependentSchemas[key],
              },
              path: [...ctx.path, "dependentSchemas", key],
              forceAllowBooleanSchema: false,
            });
          }
        }
      },
      onlyFrom(ctx) {
        match(
          ctx,
          { dependencies: true },
          {
            into(ctx) {
              if (ctx.from.schema.dependentSchemas !== undefined) {
                for (const key in ctx.from.schema.dependentSchemas) {
                  if (ctx.into.schema.dependencies === undefined) {
                    ctx.into.schema.dependencies = {};
                  }

                  ctx.into.schema.dependencies[key] = translateSchema({
                    ...ctx,
                    from: {
                      ...ctx.from,
                      schema: ctx.from.schema.dependentSchemas[key],
                    },
                    path: [...ctx.path, "dependentSchemas", key],
                    forceAllowBooleanSchema: false,
                  });
                }
              }
            },
          },
        );
      },
    },
  );
};
