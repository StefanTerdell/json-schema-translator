import {
  type JsonSchemaKeywordsObject,
  type JsonSchema,
} from "./JsonSchema.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { isAnySchema, isNeverSchema } from "./utils/schemaUtils.ts";

export const collapseIntoBooleanSchema = <
  Specification extends JsonSchemaSpecification,
  ForceAllowBooleanSchemas extends boolean,
>(
  output: {
    schema: JsonSchemaKeywordsObject<Specification>;
    settings: Specification;
  },
  forceAllowBooleanSchemas: ForceAllowBooleanSchemas,
): JsonSchema<Specification> => {
  if (output.settings.booleanSchemas) {
    if (isAnySchema(output.schema, output.settings)) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = true;

      return schema;
    }

    if (isNeverSchema(output.schema, output.settings)) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = false;

      return schema;
    }
  }

  if (forceAllowBooleanSchemas) {
    if (isAnySchema(output.schema, output.settings)) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        true;

      return schema;
    }

    if (isNeverSchema(output.schema, output.settings)) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        false;

      return schema;
    }
  }

  return output.schema as JsonSchema<Specification>;
};
