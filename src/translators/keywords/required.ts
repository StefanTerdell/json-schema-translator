import { match } from "../../utils/contextUtils.ts";
import {
  hasType,
  isNeverSchema,
  isNullableSchema,
} from "../../utils/schemaUtils.ts";
import { NonEmptyArray } from "../../utils/UtilityTypes.ts";
import { Mutator } from "../Mutator.ts";

export const translateRequired: Mutator = (ctx) => {
  const required = new Set(ctx.from.schema.required);

  if (ctx.into.specification.allPropertiesRequired) {
    for (const key in ctx.from.schema.properties) {
      required.add(key);
    }
  }

  if (ctx.from.schema.properties) {
    for (const key in ctx.from.schema.properties) {
      if (
        !ctx.into.specification.allPropertiesRequired &&
        ctx.into.specification.treatNullablePropertiesAsOptional &&
        isNullableSchema(ctx.from.schema.properties[key], true)
      ) {
        required.delete(key);
      }

      if (
        !ctx.into.specification.allPropertiesRequired &&
        ctx.into.specification.treatPropertiesWithNullTypeAsOptional &&
        hasType(ctx.from.schema.properties[key], "null", true)
      ) {
        required.delete(key);
      }

      if (
        ctx.into.specification.excludeNeverProperties &&
        isNeverSchema(ctx.from.schema.properties[key], ctx.from.specification)
      ) {
        required.delete(key);
      }
    }
  }

  if (required.size) {
    ctx.into.schema.required = Array.from(
      required,
    ).toSorted() as NonEmptyArray<string>;
  } else if (ctx.from.schema.required) {
    match(
      ctx,
      { nonEmptyRequired: false },
      {
        into(ctx) {
          ctx.into.schema.required = [];
        },
      },
    );
  }

  ctx.handledKeys.add("required");
};
