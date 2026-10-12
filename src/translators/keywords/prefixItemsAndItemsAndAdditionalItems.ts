import { matchContext } from "../../utils/contextUtils.ts";
import { matchDeep } from "../../utils/matchDeep.ts";
import { isAnySchema, isNeverSchema } from "../../utils/schemaUtils.ts";
import { collapseIntoBooleanSchema } from "../../utils/collapseIntoBooleanSchema.ts";
import { addExclusiveAnyOfOrOneOf } from "../../utils/unionUtils.ts";
import type {
  JsonSchema,
  JsonSchemaKeywordsObject,
  JsonSchemaObject,
} from "../../types/JsonSchema.ts";
import type { JsonSchemaSpecification } from "../../types/JsonSchemaSpecification.ts";
import type { MutatorContext } from "../MutatorContext.ts";
import type { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

/** The `items` keyword of a specification without `prefixItems`, widened so
 * that it can be narrowed with `Array.isArray` regardless of whether the
 * `singleItems` option is known at the type level. */
type ItemsSchema<Spec extends JsonSchemaSpecification> =
  | JsonSchema<Spec>
  | JsonSchema<Spec>[]
  | undefined;

/** Translates each member of a tuple-style `items` or `prefixItems` array */
function translateTupleItems<
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<From, Into>,
  keyword: "items" | "prefixItems",
  schemas: JsonSchema<From>[],
): JsonSchema<Into>[] {
  return schemas.map((schema, index) =>
    translateSchema({
      ...ctx,
      from: {
        ...ctx.from,
        schema,
      },
      path: [...ctx.path, keyword, index],
      forceAllowBooleanSchema: false,
    })
  );
}

/** Collapses the schemas of a tuple (and its rest schema, if any) into the
 * single schema expected by specifications with the `singleItems` option:
 * - Any member permitting any value makes the result permit any value
 * - Members permitting no value are dropped
 * - Duplicate members are deduplicated
 * - A single remaining member is used as is
 * - Multiple remaining members are joined with `anyOf` (or `oneOf`)
 *
 * Returns `undefined` if no member permits any value at all.
 */
function collapseItems<
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<From, Into>,
  schemas: JsonSchema<Into, true>[],
): JsonSchema<Into> | undefined {
  const pair = (schema: JsonSchema<Into, true>) => ({
    specification: ctx.into.specification,
    schema,
  });

  if (schemas.some((schema) => isAnySchema(pair(schema)))) {
    return collapseIntoBooleanSchema(
      {
        specification: ctx.into.specification,
        schema: {} as JsonSchemaKeywordsObject<Into>,
      },
      false,
    );
  }

  const members = schemas
    .filter((schema): schema is JsonSchemaObject<Into> =>
      typeof schema === "object" && !isNeverSchema(pair(schema))
    )
    .filter((schema, index, all) =>
      all.findIndex((other) =>
        matchDeep(schema, other) && matchDeep(other, schema)
      ) === index
    );

  if (members.length === 0) {
    return undefined;
  }

  if (members.length === 1) {
    return members[0];
  }

  const wrapper = {} as JsonSchemaKeywordsObject<Into>;

  addExclusiveAnyOfOrOneOf(
    {
      ...ctx,
      into: { ...ctx.into, schema: wrapper },
    },
    members,
  );

  return wrapper as JsonSchema<Into>;
}

export const translatePrefixItemsAndItemsAndAdditionalItems: Mutator = (
  ctx,
) => {
  matchContext(
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

        const items: ItemsSchema<typeof ctx.from.specification> =
          ctx.from.schema.items;

        if (items === undefined) {
          return;
        }

        if (!Array.isArray(items)) {
          ctx.into.schema.items = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: items,
            },
            path: [...ctx.path, "items"],
            forceAllowBooleanSchema: false,
          });

          return;
        }

        matchContext(
          ctx,
          { singleItems: true },
          {
            into(ctx) {
              const members: JsonSchema<typeof ctx.into.specification, true>[] =
                translateTupleItems(ctx, "items", items);

              matchContext(
                ctx,
                { additionalItems: true },
                {
                  from(ctx) {
                    if (ctx.from.schema.additionalItems !== undefined) {
                      members.push(
                        translateSchema({
                          ...ctx,
                          from: {
                            ...ctx.from,
                            schema: ctx.from.schema.additionalItems,
                          },
                          path: [...ctx.path, "additionalItems"],
                          forceAllowBooleanSchema: true,
                        }),
                      );
                    }
                  },
                },
              );

              ctx.into.schema.items = collapseItems(ctx, members);
            },
            notInto(ctx) {
              ctx.into.schema.items = translateTupleItems(ctx, "items", items);

              matchContext(
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
            },
          },
        );
      },
      onlyFrom(ctx) {
        ctx.handledKeys.add("prefixItems");
        ctx.handledKeys.add("items");

        const prefixItems = ctx.from.schema.prefixItems;

        matchContext(
          ctx,
          { singleItems: true },
          {
            into(ctx) {
              const members: JsonSchema<typeof ctx.into.specification, true>[] =
                prefixItems === undefined
                  ? []
                  : translateTupleItems(ctx, "prefixItems", prefixItems);

              if (ctx.from.schema.items !== undefined) {
                members.push(
                  translateSchema({
                    ...ctx,
                    from: {
                      ...ctx.from,
                      schema: ctx.from.schema.items,
                    },
                    path: [...ctx.path, "items"],
                    forceAllowBooleanSchema: true,
                  }),
                );
              }

              if (members.length > 0) {
                ctx.into.schema.items = collapseItems(ctx, members);
              }
            },
            notInto(ctx) {
              if (prefixItems !== undefined) {
                ctx.into.schema.items = translateTupleItems(
                  ctx,
                  "prefixItems",
                  prefixItems,
                );
              }

              matchContext(
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
          },
        );
      },
      onlyInto(ctx) {
        ctx.handledKeys.add("items");
        ctx.handledKeys.add("additionalItems");

        const items: ItemsSchema<typeof ctx.from.specification> =
          ctx.from.schema.items;

        if (items === undefined) {
          return;
        }

        if (Array.isArray(items)) {
          ctx.into.schema.prefixItems = translateTupleItems(
            ctx,
            "items",
            items,
          );

          matchContext(
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
              schema: items,
            },
            path: [...ctx.path, "items"],
            forceAllowBooleanSchema: false,
          });
        }
      },
    },
  );
};
