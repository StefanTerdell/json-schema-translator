import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateDependencies: Mutator = (ctx) => {
  match(
    ctx,
    {
      dependencies: true,
    },
    {
      from(ctx) {
        ctx.handledKeys.add("dependencies");
      },
      both(ctx) {
        if (
          ctx.from.schema.dependencies !== undefined &&
          (Object.keys(ctx.from.schema.dependencies).length ||
            !ctx.into.specification.nonEmptyDependencies)
        ) {
          if (ctx.into.schema.dependencies === undefined) {
            ctx.into.schema.dependencies = {};
          }

          for (const key in ctx.from.schema.dependencies) {
            const value = ctx.from.schema.dependencies[key];

            if (Array.isArray(value)) {
              ctx.into.schema.dependencies[key] = [...value];
            } else {
              ctx.into.schema.dependencies[key] = translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema: value,
                },
                path: [...ctx.path, "dependencies", key],
                forceAllowBooleanSchema: false,
              });
            }
          }
        }
      },
      onlyFrom(ctx) {
        match(
          ctx,
          {
            dependentSchemas: true,
          },
          {
            into(ctx) {
              if (ctx.from.schema.dependencies !== undefined) {
                for (const key in ctx.from.schema.dependencies) {
                  const value = ctx.from.schema.dependencies[key];

                  if (!Array.isArray(value)) {
                    if (ctx.into.schema.dependentSchemas === undefined) {
                      ctx.into.schema.dependentSchemas = {};
                    }

                    ctx.into.schema.dependentSchemas[key] = translateSchema({
                      ...ctx,
                      from: {
                        ...ctx.from,
                        schema: value,
                      },
                      path: [...ctx.path, "dependencies", key],
                      forceAllowBooleanSchema: false,
                    });
                  }
                }
              }
            },
          },
        );

        match(
          ctx,
          {
            dependentRequired: true,
          },
          {
            into(ctx) {
              if (ctx.from.schema.dependencies !== undefined) {
                for (const key in ctx.from.schema.dependencies) {
                  const value = ctx.from.schema.dependencies[key];

                  if (Array.isArray(value)) {
                    if (ctx.into.schema.dependentRequired === undefined) {
                      ctx.into.schema.dependentRequired = {};
                    }

                    ctx.into.schema.dependentRequired[key] = [...value];
                  }
                }
              }
            },
          },
        );
      },
    },
  );
};
