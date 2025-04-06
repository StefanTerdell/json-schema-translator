import { JsonSchema, JsonSchemaObject } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { transformAnnotations } from "./annotations.ts";
import { transformNullable } from "./nullable.ts";
import { transformConstants } from "./constants.ts";
import { transformType } from "./type.ts";
import { transformConditionals } from "./transformConditionals.ts";
import { transformFactoring } from "./factoring.ts";
import { transformStructuring } from "./structuring.ts";
import { transformId } from "./id.ts";
import { transformDefinitions } from "./definitions.ts";
import { transformStrings } from "./strings.ts";
import { isAnySchema, isNeverSchema } from "../utils.ts";
import { transformNumbers } from "./numbers.ts";
import { transformArrays } from "./arrays.ts";
import { transformObjects } from "./objects.ts";

export const translateSchema = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
  ForceAllowBooleanSchema extends boolean,
>(
  input: {
    settings: InputJsonSchemaSettings;
    schema: JsonSchema<InputJsonSchemaSettings, ForceAllowBooleanSchema>;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    forceAllowBooleanSchema: ForceAllowBooleanSchema;
  },
): JsonSchema<OutputJsonSchemaSettings, ForceAllowBooleanSchema> => {
  if (typeof input.schema === "boolean") {
    if (output.settings.booleanSchemas || output.forceAllowBooleanSchema) {
      return input.schema;
    } else {
      // @ts-expect-error ISSUE: Non-strict keywords mess with the type here.
      return input.schema ? {} : { not: {} };
    }
  } else {
    const newOutput = {
      schema: {},
      settings: output.settings,
    };

    const newInput = {
      schema: input.schema as JsonSchemaObject<InputJsonSchemaSettings>,
      settings: input.settings,
    };

    transformId(newInput, newOutput);
    transformDefinitions(newInput, newOutput);

    transformType(newInput, newOutput);
    transformNullable(newInput, newOutput);
    transformFactoring(newInput, newOutput);
    transformConditionals(newInput, newOutput);
    transformAnnotations(newInput, newOutput);
    transformConstants(newInput, newOutput);
    transformStructuring(newInput, newOutput);
    transformStrings(newInput, newOutput);
    transformNumbers(newInput, newOutput);
    transformArrays(newInput, newOutput);
    transformObjects(newInput, newOutput);

    return output.settings.booleanSchemas || output.forceAllowBooleanSchema
      ? isAnySchema(newOutput.schema)
        ? true
        : isNeverSchema(newOutput.schema)
          ? false
          : newOutput.schema
      : newOutput.schema;
  }
};
