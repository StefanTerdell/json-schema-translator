import { JsonSchemaKeywordsObject, JsonSchemaType } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformType: TransformerFunction = (input, output) => {
  if (input.schema.type !== undefined) {
    if (Array.isArray(input.schema.type)) {
      const skipIntegerFallback = input.schema.type.includes("number");

      output.schema.type = input.schema.type
        .map((type) =>
          transformSingleType(
            {
              type,
              settings: input.settings,
            },
            output,
            skipIntegerFallback,
          ),
        )
        .filter((type) => type !== undefined);
    } else {
      output.schema.type = transformSingleType(
        {
          type: input.schema.type,
          settings: input.settings,
        },
        output,
        false,
      );
    }
  }
};

const transformSingleType = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
>(
  input: {
    type: JsonSchemaType<InputJsonSchemaSettings>;
    settings: InputJsonSchemaSettings;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSettings>;
  },
  skipIntegerFallback: boolean,
): JsonSchemaType<OutputJsonSchemaSettings> | undefined => {
  if (input.settings.nullType && input.type === "null") {
    if (output.settings.nullable) {
      output.schema.nullable = true;
    }

    if (output.settings.nullType) {
      return "null";
    } else {
      return undefined;
    }
  }

  if (input.settings.integerType && input.type === "integer") {
    if (output.settings.integerType) {
      return "integer";
    } else if (!skipIntegerFallback) {
      output.schema.multipleOf = 1;
      return "number";
    } else {
      return undefined;
    }
  }

  return input.type;
};
