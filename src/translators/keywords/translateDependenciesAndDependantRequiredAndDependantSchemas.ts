import { JsonSchema } from "../../JsonSchema.ts";
import { NonEmptyArray } from "../../utils/UtilityTypes.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateDependenciesAndDependantRequiredAndDependantSchemas: Mutator =
  (ctx) => {
    const dependentRequired = ctx.from.settings.dependentRequired
      ? (ctx.from.schema.dependentRequired ?? {})
      : Object.keys(
          (ctx.from.settings.dependencies && ctx.from.schema.dependencies) ||
            {},
        ).reduce((acc: Record<string, NonEmptyArray<string>>, key) => {
          // @ts-expect-error Narrowing :p
          const required = ctx.from.schema.dependencies?.[key];

          if (
            Array.isArray(required) &&
            (required.length || !ctx.into.settings.nonEmptyDependencies)
          ) {
            acc[key] = required as NonEmptyArray<string>;
          }

          return acc;
        }, {});

    const dependentSchemas = ctx.from.settings.dependentSchemas
      ? Object.keys(ctx.from.schema.dependentSchemas ?? {}).reduce(
          (acc: Record<string, JsonSchema<typeof ctx.into.settings>>, key) => {
            // @ts-expect-error: god damnit
            const schema = ctx.from.schema.dependentSchemas[key] as JsonSchema<
              typeof ctx.from.settings
            >;

            acc[key] = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema,
              },
              path: [...ctx.path, "dependentSchemas", Number(key)],
              forceAllowBooleanSchema: false,
            });

            return acc;
          },
          {},
        )
      : Object.keys(
          (ctx.from.settings.dependencies && ctx.from.schema.dependencies) ||
            {},
        ).reduce(
          (acc: Record<string, JsonSchema<typeof ctx.into.settings>>, key) => {
            // @ts-expect-error Narrowing :p
            const schema = ctx.from.schema.dependencies[key];

            if (!Array.isArray(schema)) {
              acc[key] = translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema,
                },
                path: [...ctx.path, "dependencies", Number(key)],
                forceAllowBooleanSchema: false,
              });
            }

            return acc;
          },
          {},
        );

    if (Object.keys(dependentRequired).length) {
      if (ctx.into.settings.dependentRequired) {
        ctx.into.schema.dependentRequired = dependentRequired;
      } else if (ctx.into.settings.dependencies) {
        if (typeof ctx.into.schema.dependencies === "object") {
          ctx.into.schema.dependencies = {
            ...ctx.into.schema.dependencies,
            ...dependentRequired,
          };
        } else {
          ctx.into.schema.dependencies = dependentRequired;
        }
      }
    }

    if (Object.keys(dependentSchemas).length) {
      if (ctx.into.settings.dependentSchemas) {
        ctx.into.schema.dependentSchemas = dependentSchemas;
      } else if (ctx.into.settings.dependencies) {
        if (typeof ctx.into.schema.dependencies === "object") {
          ctx.into.schema.dependencies = {
            ...ctx.into.schema.dependencies,
            ...dependentSchemas,
          };
        } else {
          ctx.into.schema.dependencies = dependentSchemas;
        }
      }
    }

    if (ctx.from.settings.dependentRequired) {
      ctx.handledKeys.add("dependentRequired");
    } else if (ctx.from.settings.dependencies) {
      ctx.handledKeys.add("dependencies");
    }

    if (ctx.from.settings.dependentSchemas) {
      ctx.handledKeys.add("dependentSchemas");
    } else if (ctx.from.settings.dependencies) {
      ctx.handledKeys.add("dependencies");
    }
  };
