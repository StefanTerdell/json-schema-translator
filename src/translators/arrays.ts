import { type JsonSchema } from "../JsonSchema.ts";
import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateArrayKeywords: Mutator = (ctx) => {
  translateBasicArrayKeywords(ctx);
  translateItemKeywords(ctx);
};

const translateBasicArrayKeywords: Mutator = ({
  from: input,
  into: output,
  handledKeys,
}) => {
  if (input.settings.contains) {
    if (input.settings.minContains) {
      if (
        output.settings.minContains &&
        input.schema.minContains !== undefined
      ) {
        output.schema.minContains = input.schema.minContains;
      }

      handledKeys.add("minContains");
    }

    if (input.settings.maxContains) {
      if (
        output.settings.maxContains &&
        input.schema.maxContains !== undefined
      ) {
        output.schema.maxContains = input.schema.maxContains;
      }

      handledKeys.add("maxContains");
    }
  }

  if (input.settings.minItems) {
    if (output.settings.minItems && input.schema.minItems !== undefined) {
      output.schema.minItems = input.schema.minItems;
    }

    handledKeys.add("minItems");
  }

  if (input.settings.maxItems) {
    if (output.settings.maxItems && input.schema.maxItems !== undefined) {
      output.schema.maxItems = input.schema.maxItems;
    }

    handledKeys.add("maxItems");
  }

  if (input.settings.uniqueItems) {
    if (output.settings.uniqueItems && input.schema.uniqueItems !== undefined) {
      output.schema.uniqueItems = input.schema.uniqueItems;
    }

    handledKeys.add("uniqueItems");
  }
};

const translateItemKeywords: Mutator = (ctx) => {
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

  if (ctx.from.settings.unevaluatedItems) {
    if (
      ctx.into.settings.unevaluatedItems &&
      ctx.from.schema.unevaluatedItems != undefined
    ) {
      ctx.into.schema.unevaluatedItems = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema: ctx.from.schema.unevaluatedItems,
        },
        path: [...ctx.path, "unevaluatedItems"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("unevaluatedItems");
  }

  if (ctx.from.settings.contains) {
    if (ctx.into.settings.contains && ctx.from.schema.contains != undefined) {
      ctx.into.schema.contains = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema: ctx.from.schema.contains,
        },
        path: [...ctx.path, "contains"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("contains");
  }
};
