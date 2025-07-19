import { JsonSchemaType } from "../../JsonSchema.ts";
import { JsonSchemaSpecification } from "../../JsonSchemaSpecification.ts";
import { addType, match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateType: Mutator = (ctx) => {
  ctx.handledKeys.add("type");

  const types = Array.isArray(ctx.from.schema.type)
    ? ctx.from.schema.type
    : ctx.from.schema.type !== undefined
      ? [ctx.from.schema.type]
      : [];

  const results = types.map((type) => translateTypeValue(ctx, type));

  // Add nullable

  if (results.some((type) => type.nullable)) {
    match(
      ctx,
      { nullable: true },
      {
        into(ctx) {
          ctx.into.schema.nullable = true;
        },
      },
    );
  }

  // Add multiple

  const numberOrIntegerResults = results.filter(
    (x) => x.type === "number" || x.type === "integer",
  );

  const multipleOf =
    numberOrIntegerResults.length === 1
      ? numberOrIntegerResults[0].multipleOf
      : undefined;

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

  // Add type(s)

  results
    .filter(
      ({ type }, index, arr) =>
        arr.findIndex((result) => result.type === type) === index,
    )
    .map(({ type }) => type)
    .filter((type) => type !== undefined)
    .forEach((type) => addType(ctx, type, false));
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
