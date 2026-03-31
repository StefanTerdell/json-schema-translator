import { JsonSchemaType } from "../../types/JsonSchema.ts";
import { JsonSchemaSpecification } from "../../types/JsonSchemaSpecification.ts";
import { matchContext } from "../../utils/contextUtils.ts";
import { addConstant, addType, hasConstants } from "../../utils/unionUtils.ts";
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
    matchContext(
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
    matchContext(
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
    .forEach((type) => {
      const added = addType(ctx, type);

      if (added && type === "null" && hasConstants(ctx)) {
        addConstant(ctx, null);
      }
    });
};

const translateTypeValue = <
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
>(
  ctx: {
    from: {
      specification: FromSpecification;
    };
    into: {
      specification: IntoSpecification;
    };
  },
  type: JsonSchemaType<FromSpecification>,
): {
  type: JsonSchemaType<IntoSpecification> | undefined;
  nullable: boolean | undefined;
  multipleOf?: number;
} => {
  if (type === "null" && ctx.into.specification.nullable) {
    return { type: undefined, nullable: true };
  }

  const nullable = undefined;

  if (type === "integer") {
    if (ctx.into.specification.type.includes("integer")) {
      return { type: "integer", nullable };
    } else if (ctx.into.specification.type.includes("number")) {
      if (ctx.into.specification.multipleOf) {
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

  if (
    !ctx.into.specification.strictTypes ||
    ctx.into.specification.type.includes(type)
  ) {
    return { type, nullable };
  }

  return { type: undefined, nullable };
};
