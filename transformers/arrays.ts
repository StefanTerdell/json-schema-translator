import { JsonSchema } from "../JsonSchema.ts";
import { translateSchema } from "./schema.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformArrays: TransformerFunction = (input, output) => {
  if (input.settings.prefixItems) {
    const prefixItems = (
      input.schema.prefixItems as
        | JsonSchema<typeof input.settings>[]
        | undefined
    )?.map((schema) =>
      translateSchema(
        {
          schema,
          settings: input.settings,
        },
        { settings: output.settings, forceAllowBooleanSchema: false },
      ),
    );

    const items =
      input.schema.items !== undefined
        ? translateSchema(
            {
              schema: input.schema.items as JsonSchema<typeof input.settings>,
              settings: input.settings,
            },
            { settings: output.settings, forceAllowBooleanSchema: false },
          )
        : undefined;

    if (output.settings.prefixItems) {
      output.schema.prefixItems = prefixItems;
      output.schema.items = items;
    } else {
      // @ts-expect-error ISSUE: Narrowing :p
      output.schema.items = prefixItems;
      output.schema.additionalItems = items;
    }
  } else {
    const [items, additionalItems] = Array.isArray(input.schema.items)
      ? [
          input.schema.items.map((schema) =>
            translateSchema(
              {
                schema,
                settings: input.settings,
              },
              {
                settings: output.settings,
                forceAllowBooleanSchema: false,
              },
            ),
          ),
          input.schema.additionalItems !== undefined
            ? translateSchema(
                {
                  schema: input.schema.additionalItems,
                  settings: input.settings,
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: false,
                },
              )
            : undefined,
        ]
      : [
          input.schema.items !== undefined
            ? translateSchema(
                {
                  schema: input.schema.items as JsonSchema<
                    typeof input.settings
                  >,
                  settings: input.settings,
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: false,
                },
              )
            : undefined,
          input.schema.additionalItems !== undefined
            ? translateSchema(
                {
                  schema: input.schema.additionalItems,
                  settings: input.settings,
                },
                {
                  settings: output.settings,
                  forceAllowBooleanSchema: true,
                },
              )
            : undefined,
        ];

    if (output.settings.prefixItems && Array.isArray(items)) {
      output.schema.prefixItems = items;
      // @ts-expect-error ISSUE: Narrowing :p
      output.schema.items = additionalItems;
    } else {
      // @ts-expect-error ISSUE: Narrowing :p
      output.schema.items = items;
      output.schema.additionalItems = additionalItems;
    }
  }

  if (
    input.settings.unevaluatedItems &&
    output.settings.unevaluatedItems &&
    input.schema.unevaluatedItems !== undefined
  ) {
    output.schema.unevaluatedItems = translateSchema(
      {
        // @ts-expect-error ISSUE: Narrowing :p
        schema: input.schema.unevaluatedItems,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (
    input.settings.contains &&
    output.settings.contains &&
    input.schema.contains !== undefined
  ) {
    output.schema.contains = translateSchema(
      {
        // @ts-expect-error ISSUE: Narrowing :p
        schema: input.schema.contains,
        settings: input.settings,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (input.settings.minAndMaxContains && output.settings.minAndMaxContains) {
    output.schema.maxContains = input.schema.maxContains;
    output.schema.minContains = input.schema.minContains;
  }

  output.schema.minItems = input.schema.minItems;
  output.schema.maxItems = input.schema.maxItems;
  output.schema.uniqueItems = input.schema.uniqueItems;
};
