import { collapseIntoBooleanSchema } from "../../utils/collapseIntoBooleanSchema.ts";
import { matchContext } from "../../utils/contextUtils.ts";
import { addTypeToPair } from "../../utils/pairUtils.ts";
import { isNeverSchema } from "../../utils/schemaUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateProperties: Mutator = (ctx) => {
  const fromRequired = new Set(ctx.from.schema.required);

  if (ctx.from.schema.properties !== undefined) {
    for (const key in ctx.from.schema.properties) {
      if (
        ctx.into.specification.excludeNeverProperties &&
        isNeverSchema({ ...ctx.from, schema: ctx.from.schema.properties[key] })
      ) {
        continue;
      }

      if (!ctx.into.schema.properties) {
        ctx.into.schema.properties = {};
      }

      const schema = translateSchema(
        {
          ...ctx,
          from: {
            ...ctx.from,
            schema: ctx.from.schema.properties[key],
          },
          path: [...ctx.path, "properties", key],
          forceAllowBooleanSchema: false,
        },
        true, // Defer collapse
      );

      if (typeof schema !== "object") {
        throw new Error("deferring collapse should ensure object schema");
      }

      if (!fromRequired.has(key)) {
        matchContext(
          ctx,
          { nullable: true, setOptionalPropertiesToNullable: true },
          {
            into(ctx) {
              if (typeof ctx.into.schema.properties?.[key] === "object") {
                ctx.into.schema.properties[key].nullable = true;
              }
            },
          },
        );

        if (ctx.into.specification.addNullTypeToOptionalProperties) {
          const added = addTypeToPair(
            {
              specification: ctx.into.specification,
              schema,
            },
            "null",
          );

          if (
            added &&
            !ctx.into.specification.stringConstants &&
            ctx.into.specification.enum
          ) {
            if (schema.enum && !schema.enum.includes(null)) {
              schema.enum.push(null);
            } else if (schema.const !== undefined) {
              schema.enum = [schema.const, null];
            }
          }
        }
      }

      ctx.into.schema.properties[key] = collapseIntoBooleanSchema(
        {
          schema,
          specification: ctx.into.specification,
        },
        false,
      );
    }
  }

  ctx.handledKeys.add("properties");
};
