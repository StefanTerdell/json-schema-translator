import {
  type JsonSchemaStaticKeywordsObject,
  type JsonSchemaType,
} from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { type Mutator } from "./Mutator.ts";

export const translateTypeKeyword: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.schema.type !== undefined) {
    if (Array.isArray(input.schema.type)) {
      const skipIntegerFallback = input.schema.type.includes("number");

      output.schema.type = input.schema.type
        .map((type) =>
          translateType(
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
      const type = translateType(
        {
          type: input.schema.type,
          settings: input.settings,
        },
        output,
        false,
      );

      if (type !== undefined) {
        output.schema.type = type;
      }
    }
  }

  handledKeys.add("type");
};

const translateType = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  input: {
    type: JsonSchemaType<InputJsonSchemaSpecification>;
    settings: InputJsonSchemaSpecification;
  },
  output: {
    settings: OutputJsonSchemaSpecification;
    schema: JsonSchemaStaticKeywordsObject<OutputJsonSchemaSpecification>;
  },
  skipIntegerFallback: boolean,
): JsonSchemaType<OutputJsonSchemaSpecification> | undefined => {
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
