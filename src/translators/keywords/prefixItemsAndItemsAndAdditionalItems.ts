import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translatePrefixItemsAndItemsAndAdditionalItems: Mutator = (
  ctx,
) => {
  match(
    ctx,
    {
      prefixItems: true,
    },
    {
      both(ctx) {
        ctx.handledKeys.add("prefixItems");
        ctx.handledKeys.add("items");

        if (ctx.from.schema.prefixItems !== undefined) {
          ctx.into.schema.prefixItems = ctx.from.schema.prefixItems.map(
            (schema, index) =>
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
        }

        if (ctx.from.schema.items !== undefined) {
          ctx.into.schema.items = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.items,
            },
            path: [...ctx.path, "items"],
            forceAllowBooleanSchema: false,
          });
        }
      },
      none(ctx) {
        ctx.handledKeys.add("items");
        ctx.handledKeys.add("additionalItems");

        if (ctx.from.schema.items !== undefined) {
          if (Array.isArray(ctx.from.schema.items)) {
            ctx.into.schema.items = ctx.from.schema.items.map((schema, index) =>
              translateSchema({
                ...ctx,
                from: {
                  ...ctx.from,
                  schema,
                },
                path: [...ctx.path, "items", index],
                forceAllowBooleanSchema: false,
              }),
            );

            match(
              ctx,
              { additionalItems: true },
              {
                from(ctx) {
                  if (ctx.from.schema.additionalItems !== undefined) {
                    ctx.into.schema.additionalItems = translateSchema({
                      ...ctx,
                      from: {
                        ...ctx.from,
                        schema: ctx.from.schema.additionalItems,
                      },
                      path: [...ctx.path, "additionalItems"],
                      forceAllowBooleanSchema: true,
                    });
                  }
                },
              },
            );
          } else {
            ctx.into.schema.items = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema: ctx.from.schema.items,
              },
              path: [...ctx.path, "items"],
              forceAllowBooleanSchema: false,
            });
          }
        }
      },
      onlyFrom(ctx) {
        ctx.handledKeys.add("prefixItems");
        ctx.handledKeys.add("items");

        if (ctx.from.schema.prefixItems !== undefined) {
          ctx.into.schema.items = ctx.from.schema.prefixItems.map(
            (schema, index) =>
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
        }

        match(
          ctx,
          { additionalItems: true },
          {
            into(ctx) {
              if (ctx.from.schema.items !== undefined) {
                ctx.into.schema.additionalItems = translateSchema({
                  ...ctx,
                  from: {
                    ...ctx.from,
                    schema: ctx.from.schema.items,
                  },
                  path: [...ctx.path, "items"],
                  forceAllowBooleanSchema: true,
                });
              }
            },
          },
        );
      },
      onlyInto(ctx) {
        ctx.handledKeys.add("items");
        ctx.handledKeys.add("additionalItems");

        if (ctx.from.schema.items !== undefined) {
          if (Array.isArray(ctx.from.schema.items)) {
            ctx.into.schema.prefixItems = ctx.from.schema.items.map(
              (schema, index) =>
                translateSchema({
                  ...ctx,
                  from: {
                    ...ctx.from,
                    schema,
                  },
                  path: [...ctx.path, "items", index],
                  forceAllowBooleanSchema: false,
                }),
            );

            match(
              ctx,
              { additionalItems: true },
              {
                from(ctx) {
                  if (ctx.from.schema.additionalItems !== undefined) {
                    ctx.into.schema.items = translateSchema({
                      ...ctx,
                      from: {
                        ...ctx.from,
                        schema: ctx.from.schema.additionalItems,
                      },
                      path: [...ctx.path, "items"],
                      forceAllowBooleanSchema: true,
                    });
                  }
                },
              },
            );
          } else {
            ctx.into.schema.items = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
                schema: ctx.from.schema.items,
              },
              path: [...ctx.path, "items"],
              forceAllowBooleanSchema: false,
            });
          }
        }
      },
    },
  );
};
