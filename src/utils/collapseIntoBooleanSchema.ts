import type { JsonSchema } from "../types/JsonSchema.ts";
import type { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import type { Pair } from "../translators/Pair.ts";
import { isAnySchema, isNeverSchema } from "../utils/schemaUtils.ts";

export const collapseIntoBooleanSchema = <
  Specification extends JsonSchemaSpecification,
  ForceAllowBooleanSchemas extends boolean,
>(
  pair: Pair<Specification>,
  forceAllowBooleanSchemas: ForceAllowBooleanSchemas,
): JsonSchema<Specification> => {
  let isAny: boolean | undefined = undefined;
  let isNever: boolean | undefined = undefined;

  if (forceAllowBooleanSchemas) {
    isAny ??= isAnySchema(pair);

    if (isAny) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        true;

      return schema;
    }

    isNever ??= isNeverSchema(pair);

    if (isNever) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        false;

      return schema;
    }
  }

  if (pair.specification.forceAnySchema !== undefined) {
    isAny ??= isAnySchema(pair);

    if (isAny) {
      return pair.specification.forceAnySchema as JsonSchema<Specification>;
    }
  }

  if (pair.specification.booleanSchemas) {
    isAny ??= isAnySchema(pair);

    if (isAny) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = true;

      return schema;
    }

    isNever ??= isNeverSchema(pair);

    if (isNever) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = false;

      return schema;
    }
  }

  return pair.schema as JsonSchema<Specification>;
};
