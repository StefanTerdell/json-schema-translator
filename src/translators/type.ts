import {
  type JsonSchemaKeywordsOnlyObject,
  type JsonSchemaType,
} from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { type Mutator } from "./Mutator.ts";

/** @internal */
export const translateTypeKeyword: Mutator = ({
  from: input,
  into: output,
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
        .filter((type) => type !== undefined) as typeof output.schema.type;
    } else {
      const type = translateType(
        {
          // @ts-ignore-error :p
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
    schema: JsonSchemaKeywordsOnlyObject<OutputJsonSchemaSpecification>;
  },
  skipIntegerFallback: boolean,
): JsonSchemaType<OutputJsonSchemaSpecification> | undefined => {
  if (input.settings.type.includes("null") && input.type === "null") {
    if (output.settings.nullable) {
      output.schema.nullable = true;
    }

    if (output.settings.type.includes("null")) {
      return "null" as JsonSchemaType<
        OutputJsonSchemaSpecification & { null: true }
      >;
    } else {
      return undefined;
    }
  }

  if (input.settings.type.includes("integer") && input.type === "integer") {
    if (output.settings.type.includes("integer")) {
      return "integer" as JsonSchemaType<
        OutputJsonSchemaSpecification & { integer: true }
      >;
    } else if (!skipIntegerFallback) {
      if (output.settings.multipleOf) {
        output.schema.multipleOf = 1;
      }
      return "number";
    } else {
      return undefined;
    }
  }

  return input.type as unknown as JsonSchemaType<OutputJsonSchemaSpecification>;
};
