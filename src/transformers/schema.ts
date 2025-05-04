import {
  JsonSchema,
  JsonSchemaKeyword,
  JsonSchemaObject,
  JsonSchemaPath,
} from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { translateAnnotationKeywords } from "./annotations.ts";
import { translateNullableKeyword } from "./nullable.ts";
import { translateConstantKeywords } from "./constants.ts";
import { translateTypeKeyword } from "./type.ts";
import { translateConditionalKeywords } from "./conditionals.ts";
import { translateFactoringKeywords } from "./factoring.ts";
import { translateStructuringKeywords } from "./structuring.ts";
import { translateIdKeyword } from "./id.ts";
import { translateDefinitionsKeyword } from "./definitions.ts";
import { translateStringKeywords } from "./strings.ts";
import { isAnySchema, isNeverSchema, LooseStringLiteral } from "../utils.ts";
import { translateNumberKeywords } from "./numbers.ts";
import { translateArrayKeywords } from "./arrays.ts";
import { translateObjectKeywords } from "./objects.ts";
import { Mutator } from "./Mutator.ts";
import { UnhandledKeysMap } from "../UnhandledKeys.ts";

export const generateSchema = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
  ForceAllowBooleanSchema extends boolean,
>(
  input: {
    settings: InputJsonSchemaSettings;
    schema: JsonSchema<InputJsonSchemaSettings, ForceAllowBooleanSchema>;
    path: JsonSchemaPath;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    forceAllowBooleanSchema: ForceAllowBooleanSchema;
    unhandledKeys: UnhandledKeysMap;
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
      unhandledKeys: output.unhandledKeys,
    };

    const newInput = {
      schema: input.schema as JsonSchemaObject<InputJsonSchemaSettings>,
      settings: input.settings,
      handledKeys: new Set<LooseStringLiteral<JsonSchemaKeyword>>(),
      path: input.path,
    };

    translateIdKeyword(newInput, newOutput);
    translateDefinitionsKeyword(newInput, newOutput);

    translateTypeKeyword(newInput, newOutput);
    translateNullableKeyword(newInput, newOutput);
    translateFactoringKeywords(newInput, newOutput);
    translateConditionalKeywords(newInput, newOutput);
    translateAnnotationKeywords(newInput, newOutput);
    translateConstantKeywords(newInput, newOutput);
    translateStructuringKeywords(newInput, newOutput);
    translateStringKeywords(newInput, newOutput);
    translateNumberKeywords(newInput, newOutput);
    translateArrayKeywords(newInput, newOutput);
    translateObjectKeywords(newInput, newOutput);

    copyJson(newInput, newOutput);

    return output.settings.booleanSchemas || output.forceAllowBooleanSchema
      ? isAnySchema(newOutput.schema)
        ? true
        : isNeverSchema(newOutput.schema)
          ? false
          : newOutput.schema
      : newOutput.schema;
  }
};

const copyJson: Mutator = (input, output) => {
  if (input.settings.allowJson) {
    for (const key of Object.keys(input.schema).filter(
      (key) => !input.handledKeys.has(key),
    )) {
      if (output.settings.allowJson) {
        if (!(key in output.schema)) {
          // @ts-expect-error CBA
          output.schema[key] = input.schema[key];
        } else {
          output.unhandledKeys.set([...input.path, key], "conflict");
        }
      } else {
        output.unhandledKeys.set([...input.path, key], "disallowed");
      }

      input.handledKeys.add(key);
    }
  }
};
