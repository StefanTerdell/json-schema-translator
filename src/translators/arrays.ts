import { JsonSchema } from "../JsonSchema.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchema.ts";
import { Mutator } from "./Mutator.ts";

export const translateArrayKeywords: Mutator = (input, output, options) => {
  if (input.settings.prefixItems) {
    const prefixItems = (
      input.schema.prefixItems as
        | JsonSchema<typeof input.settings>[]
        | undefined
    )?.map((schema, index) =>
      translateJsonSchemaInternal(
        {
          schema,
          settings: input.settings,
          path: [...input.path, "prefixItems", index],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
        options,
      ),
    );

    const items =
      input.schema.items !== undefined
        ? translateJsonSchemaInternal(
            {
              schema: input.schema.items as JsonSchema<typeof input.settings>,
              settings: input.settings,
              path: [...input.path, "items"],
            },
            {
              settings: output.settings,
              forceAllowBooleanSchema: false,
              unhandledKeys: output.unhandledKeys,
            },
            options,
          )
        : undefined;

    if (output.settings.prefixItems) {
      if (prefixItems !== undefined) {
        output.schema.prefixItems = prefixItems;
      }

      if (items !== undefined) {
        output.schema.items = items;
      }
    } else {
      if (prefixItems !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.items = prefixItems;
      }

      if (items !== undefined) {
        output.schema.additionalItems = items;
      }
    }

    input.handledKeys.add("prefixItems");
    input.handledKeys.add("items");
  } else {
    const [items, additionalItems] = Array.isArray(input.schema.items)
      ? [
          input.schema.items.map((schema, index) =>
            translateJsonSchemaInternal(
              {
                schema,
                settings: input.settings,
                path: [...input.path, "items", index],
              },
              {
                settings: output.settings,
                forceAllowBooleanSchema: false,
                unhandledKeys: output.unhandledKeys,
              },
              options,
            ),
          ),
          input.schema.additionalItems !== undefined
            ? translateJsonSchemaInternal(
                {
                  schema: input.schema.additionalItems,
                  settings: input.settings,
                  path: [...input.path, "additionalItems"],
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: false,
                  unhandledKeys: output.unhandledKeys,
                },
                options,
              )
            : undefined,
        ]
      : [
          input.schema.items !== undefined
            ? translateJsonSchemaInternal(
                {
                  schema: input.schema.items as JsonSchema<
                    typeof input.settings
                  >,
                  settings: input.settings,
                  path: [...input.path, "items"],
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: false,
                  unhandledKeys: output.unhandledKeys,
                },
                options,
              )
            : undefined,
          input.schema.additionalItems !== undefined
            ? translateJsonSchemaInternal(
                {
                  schema: input.schema.additionalItems,
                  settings: input.settings,
                  path: [...input.path, "additionalItems"],
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: true,
                  unhandledKeys: output.unhandledKeys,
                },
                options,
              )
            : undefined,
        ];

    if (output.settings.prefixItems && Array.isArray(items)) {
      if (items !== undefined) {
        output.schema.prefixItems = items;
      }

      if (additionalItems !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.items = additionalItems;
      }
    } else {
      if (items !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.items = items;
      }

      if (additionalItems !== undefined) {
        output.schema.additionalItems = additionalItems;
      }
    }

    input.handledKeys.add("items");
    input.handledKeys.add("additionalItems");
  }

  if (input.settings.unevaluatedItems) {
    if (
      output.settings.unevaluatedItems &&
      input.schema.unevaluatedItems !== undefined
    ) {
      output.schema.unevaluatedItems = translateJsonSchemaInternal(
        {
          // @ts-expect-error ISSUE: Narrowing :p
          schema: input.schema.unevaluatedItems,
          settings: input.settings,
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
        },
        options,
      );
    }

    input.handledKeys.add("unevaluatedItems");
  }

  if (input.settings.contains) {
    if (output.settings.contains && input.schema.contains !== undefined) {
      output.schema.contains = translateJsonSchemaInternal(
        {
          // @ts-expect-error ISSUE: Narrowing :p
          schema: input.schema.contains,
          settings: input.settings,
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
        },
        options,
      );
    }

    input.handledKeys.add("contains");
  }

  if (input.settings.minAndMaxContains && output.settings.minAndMaxContains) {
    if (input.schema.maxContains !== undefined) {
      output.schema.maxContains = input.schema.maxContains;
    }

    input.handledKeys.add("maxContains");

    if (input.schema.minContains !== undefined) {
      output.schema.minContains = input.schema.minContains;
    }

    input.handledKeys.add("minContains");
  }

  if (output.schema.minItems !== undefined) {
    output.schema.minItems = input.schema.minItems;
  }

  input.handledKeys.add("minItems");

  if (output.schema.maxItems !== undefined) {
    output.schema.maxItems = input.schema.maxItems;
  }

  input.handledKeys.add("maxItems");

  if (output.schema.uniqueItems !== undefined) {
    output.schema.uniqueItems = input.schema.uniqueItems;
  }

  input.handledKeys.add("uniqueItems");
};
