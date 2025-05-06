import { type JsonSchema } from "../JsonSchema.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { type Mutator } from "./Mutator.ts";

export const translateArrayKeywords: Mutator = (ctx) => {
  translateBasicArrayKeywords(ctx);
  translateItemKeywords(ctx);
};

const translateBasicArrayKeywords: Mutator = ({
  input,
  output,
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
  if (ctx.input.settings.prefixItems) {
    const prefixItems = (
      ctx.input.schema.prefixItems as
        | JsonSchema<typeof ctx.input.settings>[]
        | undefined
    )?.map((schema, index) =>
      translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema,
        },
        path: [...ctx.path, "prefixItems", index],
        forceAllowBooleanSchema: false,
      }),
    );

    const items =
      ctx.input.schema.items !== undefined
        ? translateJsonSchemaInternal({
            ...ctx,
            input: {
              ...ctx.input,
              schema: ctx.input.schema.items as JsonSchema<
                typeof ctx.input.settings
              >,
            },
            path: [...ctx.path, "items"],
            forceAllowBooleanSchema: false,
          })
        : undefined;

    if (ctx.output.settings.prefixItems) {
      if (prefixItems !== undefined) {
        ctx.output.schema.prefixItems = prefixItems;
      }

      if (items !== undefined) {
        ctx.output.schema.items = items;
      }
    } else {
      if (prefixItems != undefined) {
        // @ts-expect-error narrowing
        ctx.output.schema.items = prefixItems;
      }

      if (items !== undefined) {
        ctx.output.schema.additionalItems = items;
      }
    }

    ctx.handledKeys.add("prefixItems");
    ctx.handledKeys.add("items");
  } else {
    const [items, additionalItems] = Array.isArray(ctx.input.schema.items)
      ? [
          ctx.input.schema.items.map((schema, index) =>
            translateJsonSchemaInternal({
              ...ctx,
              input: {
                ...ctx.input,
                schema,
              },
              path: [...ctx.path, "items", index],
              forceAllowBooleanSchema: false,
            }),
          ),
          ctx.input.settings.additionalItems &&
          ctx.input.schema.additionalItems !== undefined
            ? translateJsonSchemaInternal({
                ...ctx,
                input: {
                  ...ctx.input,
                  // @ts-expect-error narrowing
                  schema: ctx.input.schema.additionalItems,
                },
                path: [...ctx.path, "additionalItems"],
                forceAllowBooleanSchema: true,
              })
            : undefined,
        ]
      : [
          ctx.input.schema.items !== undefined
            ? translateJsonSchemaInternal({
                ...ctx,
                input: {
                  ...ctx.input,
                  schema: ctx.input.schema.items as JsonSchema<
                    typeof ctx.input.settings
                  >,
                },
                path: [...ctx.path, "items"],
                forceAllowBooleanSchema: false,
              })
            : undefined,
          ctx.input.settings.additionalItems &&
          ctx.input.schema.additionalItems !== undefined
            ? translateJsonSchemaInternal({
                ...ctx,
                input: {
                  ...ctx.input,
                  // @ts-expect-error narrowing
                  schema: ctx.input.schema.additionalItems,
                },
                path: [...ctx.path, "additionalItems"],
                forceAllowBooleanSchema: true,
              })
            : undefined,
        ];

    if (ctx.output.settings.prefixItems && Array.isArray(items)) {
      if (items !== undefined) {
        ctx.output.schema.prefixItems = items;
      }

      if (additionalItems != undefined) {
        // @ts-expect-error narrowing
        ctx.output.schema.items = additionalItems;
      }
    } else {
      if (items != undefined) {
        // @ts-expect-error narrowing
        ctx.output.schema.items = items;
      }

      if (additionalItems !== undefined) {
        ctx.output.schema.additionalItems = additionalItems;
      }
    }

    ctx.handledKeys.add("items");
    ctx.handledKeys.add("additionalItems");
  }

  if (ctx.input.settings.unevaluatedItems) {
    if (
      ctx.output.settings.unevaluatedItems &&
      ctx.input.schema.unevaluatedItems != undefined
    ) {
      ctx.output.schema.unevaluatedItems = translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.unevaluatedItems,
        },
        path: [...ctx.path, "unevaluatedItems"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("unevaluatedItems");
  }

  if (ctx.input.settings.contains) {
    if (
      ctx.output.settings.contains &&
      ctx.input.schema.contains != undefined
    ) {
      ctx.output.schema.contains = translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.contains,
        },
        path: [...ctx.path, "contains"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("contains");
  }
};
