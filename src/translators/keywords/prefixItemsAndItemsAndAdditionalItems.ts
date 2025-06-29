import { JsonSchema } from "../../JsonSchema.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

// @TODO: Migrate to match
export const translatePrefixItemsAndItemsAndAdditionalItems: Mutator = (
  ctx,
) => {
  if (ctx.from.settings.prefixItems) {
    const prefixItems = (
      ctx.from.schema.prefixItems as
        | JsonSchema<typeof ctx.from.settings>[]
        | undefined
    )?.map((schema, index) =>
      translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema,
        },
        path: [...ctx.path, "prefixItems", index],
        forceAllowBooleanSchema: false,
      }),
    );

    const items =
      ctx.from.schema.items !== undefined
        ? translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.items as JsonSchema<
                typeof ctx.from.settings
              >,
            },
            path: [...ctx.path, "items"],
            forceAllowBooleanSchema: false,
          })
        : undefined;

    if (ctx.into.settings.prefixItems) {
      if (prefixItems !== undefined) {
        ctx.into.schema.prefixItems = prefixItems;
      }

      if (items !== undefined) {
        ctx.into.schema.items = items;
      }
    } else {
      if (prefixItems != undefined) {
        // @ts-expect-error narrowing
        ctx.into.schema.items = prefixItems;
      }

      if (items !== undefined) {
        ctx.into.schema.additionalItems = items;
      }
    }

    ctx.handledKeys.add("prefixItems");
    ctx.handledKeys.add("items");
  } else {
    const [items, additionalItems] = Array.isArray(ctx.from.schema.items)
      ? [
          ctx.from.schema.items.map((schema, index) =>
            translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema,
              },
              path: [...ctx.path, "items", index],
              forceAllowBooleanSchema: false,
            }),
          ),
          ctx.from.settings.additionalItems &&
          ctx.from.schema.additionalItems !== undefined
            ? translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  // @ts-expect-error narrowing
                  schema: ctx.from.schema.additionalItems,
                },
                path: [...ctx.path, "additionalItems"],
                forceAllowBooleanSchema: true,
              })
            : undefined,
        ]
      : [
          ctx.from.schema.items !== undefined
            ? translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema: ctx.from.schema.items as JsonSchema<
                    typeof ctx.from.settings
                  >,
                },
                path: [...ctx.path, "items"],
                forceAllowBooleanSchema: false,
              })
            : undefined,
          ctx.from.settings.additionalItems &&
          ctx.from.schema.additionalItems !== undefined
            ? translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  // @ts-expect-error narrowing
                  schema: ctx.from.schema.additionalItems,
                },
                path: [...ctx.path, "additionalItems"],
                forceAllowBooleanSchema: true,
              })
            : undefined,
        ];

    if (ctx.into.settings.prefixItems && Array.isArray(items)) {
      if (items !== undefined) {
        ctx.into.schema.prefixItems = items;
      }

      if (additionalItems != undefined) {
        // @ts-expect-error narrowing
        ctx.into.schema.items = additionalItems;
      }
    } else {
      if (items != undefined) {
        // @ts-expect-error narrowing
        ctx.into.schema.items = items;
      }

      if (additionalItems !== undefined) {
        ctx.into.schema.additionalItems = additionalItems;
      }
    }

    ctx.handledKeys.add("items");
    ctx.handledKeys.add("additionalItems");
  }
};
