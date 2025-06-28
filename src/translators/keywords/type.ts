import { JsonSchemaType } from "../../JsonSchema.ts";
import { JsonSchemaSpecification } from "../../JsonSchemaSpecification.ts";
import { addUnionMembers, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateType: Mutator = (ctx) => {
  ctx.handledKeys.add("type");

  if (Array.isArray(ctx.from.schema.type)) {
    if (ctx.from.schema.type.length) {
      const results = ctx.from.schema.type.map((type) =>
        translateTypeValue(ctx, type),
      );

      const types = results
        .filter(
          //deduplicate
          ({ type }, index, arr) =>
            arr.findIndex((result) => result.type === type) === index,
        )
        .map(({ type }) => type);

      const numberOrIntegerResults = results.filter(
        (x) => x.type === "number" || x.type === "integer",
      );

      const multipleOf =
        numberOrIntegerResults.length === 1
          ? numberOrIntegerResults[0].multipleOf
          : undefined;

      const nullable = results.some((type) => type.nullable) || undefined;

      if (nullable) {
        match(
          ctx,
          { nullable: true },
          {
            into(ctx) {
              ctx.into.schema.nullable = nullable;
            },
          },
        );
      }

      if (multipleOf !== undefined) {
        match(
          ctx,
          { multipleOf: true },
          {
            into(ctx) {
              ctx.into.schema.multipleOf = multipleOf;
            },
          },
        );
      }

      match(
        ctx,
        { singleType: true },
        {
          into(ctx) {
            addUnionMembers(
              ctx,
              results.map(({ type }) => ({ type })),
            );
          },
          notInto(ctx) {
            ctx.into.schema.type = types as typeof ctx.into.schema.type;
          },
        },
      );
    } else if (ctx.from.schema.type !== undefined) {
      const { type, nullable, multipleOf } = translateTypeValue(
        ctx,
        // deno-lint-ignore no-explicit-any
        ctx.from.schema.type as any,
      );

      if (nullable !== undefined) {
        match(
          ctx,
          { nullable: true },
          {
            into(ctx) {
              ctx.into.schema.nullable = nullable;
            },
          },
        );
      }

      if (multipleOf !== undefined) {
        match(
          ctx,
          { multipleOf: true },
          {
            into(ctx) {
              ctx.into.schema.multipleOf = multipleOf;
            },
          },
        );
      }

      if (type !== undefined) {
        ctx.into.schema.type = type;
      }
    }
  }
};
const translateTypeValue = <
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
>(
  ctx: {
    from: {
      settings: FromSpecification;
    };
    into: {
      settings: IntoSpecification;
    };
  },
  type: JsonSchemaType<FromSpecification>,
): {
  type: JsonSchemaType<IntoSpecification> | undefined;
  nullable: boolean | undefined;
  multipleOf?: number;
} => {
  const nullable =
    type === "null" && ctx.into.settings.nullable ? true : undefined;

  if (type === "integer") {
    if (ctx.into.settings.type.includes("integer")) {
      return { type: "integer", nullable };
    } else if (ctx.into.settings.type.includes("number")) {
      if (ctx.into.settings.multipleOf) {
        return {
          type: "number",
          multipleOf: 1,
          nullable,
        };
      }

      return {
        type: "number",
        nullable,
      };
    } else {
      return { type: undefined, nullable };
    }
  }

  if (!ctx.into.settings.strictTypes || ctx.into.settings.type.includes(type)) {
    return { type, nullable };
  }

  return { type: undefined, nullable };
};
