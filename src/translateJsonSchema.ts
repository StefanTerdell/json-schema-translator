import {
  AjvErrorMessages,
  JsonSchema,
  JsonSchemaKeyword,
  JsonSchemaObject,
  JsonSchemaPath,
} from "./JsonSchema.ts";
import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { translateAnnotationKeywords } from "./translators/annotations.ts";
import { translateNullableKeyword } from "./translators/nullable.ts";
import { translateConstantKeywords } from "./translators/constants.ts";
import { translateTypeKeyword } from "./translators/type.ts";
import { translateConditionalKeywords } from "./translators/conditionals.ts";
import { translateFactoringKeywords } from "./translators/factoring.ts";
import { translateStructuringKeywords } from "./translators/structuring.ts";
import { translateIdKeyword } from "./translators/id.ts";
import { translateDefinitionsKeyword } from "./translators/definitions.ts";
import { translateStringKeywords } from "./translators/strings.ts";
import { translateNumberKeywords } from "./translators/numbers.ts";
import { translateArrayKeywords } from "./translators/arrays.ts";
import { translateObjectKeywords } from "./translators/objects.ts";
import { Mutator } from "./translators/Mutator.ts";
import { UnhandledKeysMap } from "./UnhandledKeys.ts";
import { isAnySchema, isNeverSchema, LooseStringLiteral } from "./utils.ts";
import { Json } from "./Json.ts";

export type TranslateJsonSchemaOptions = {
  unhandledKeys:
    | "ignore"
    | "warn"
    | "throw"
    | UnhandledKeysMap
    | ((unhandledKeys: UnhandledKeysMap) => void);
  copyJson: "shallow" | "stringifyAndParse" | ((json: Json) => Json);
};

export const defaultTranslateJsonSchemaOptions: TranslateJsonSchemaOptions = {
  unhandledKeys: "ignore",
  copyJson: (json) => JSON.parse(JSON.stringify(json)),
};

export function translateJsonSchema<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  inputSchema: JsonSchema<InputJsonSchemaSpecification>,
  inputSpecification: InputJsonSchemaSpecification,
  outputSpecification: OutputJsonSchemaSpecification,
  options: TranslateJsonSchemaOptions = defaultTranslateJsonSchemaOptions,
): JsonSchema<OutputJsonSchemaSpecification> {
  const unhandledKeys: UnhandledKeysMap =
    typeof options.unhandledKeys === "object"
      ? options.unhandledKeys
      : new Map();

  const outputSchema = translateJsonSchemaInternal(
    {
      schema: inputSchema,
      settings: inputSpecification,
      path: [],
    },
    {
      settings: outputSpecification,
      forceAllowBooleanSchema: false,
      unhandledKeys,
    },
    options,
  );

  if (unhandledKeys.size) {
    if (options.unhandledKeys === "throw") {
      const pathsAndReasons = Array.from(
        unhandledKeys,
        ([path, reason]) =>
          `${path.reduce(
            (acc, curr) =>
              typeof curr === "number"
                ? `${acc}[${curr}]`
                : acc
                  ? `${acc}.${curr}`
                  : curr,
            "",
          )}: ${reason}`,
      ).join("\n");

      throw new Error(`Unhandled keys:\n${pathsAndReasons}`);
    } else if (options.unhandledKeys === "warn") {
      console.warn("Unhandled keys:", unhandledKeys);
    } else if (typeof options.unhandledKeys === "function") {
      options.unhandledKeys(unhandledKeys);
    } else if (options.unhandledKeys !== "ignore") {
      throw new Error(`Unknown unhandledKeys option: ${options.unhandledKeys}`);
    }
  }

  return outputSchema;
}

/** @internal */
export const translateJsonSchemaInternal = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
>(
  input: {
    settings: InputJsonSchemaSpecification;
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
    path: JsonSchemaPath;
  },
  output: {
    settings: OutputJsonSchemaSpecification;
    forceAllowBooleanSchema: ForceAllowBooleanSchema;
    unhandledKeys: UnhandledKeysMap;
  },
  options: TranslateJsonSchemaOptions,
): JsonSchema<OutputJsonSchemaSpecification, ForceAllowBooleanSchema> => {
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
      schema: input.schema as JsonSchemaObject<InputJsonSchemaSpecification>,
      settings: input.settings,
      handledKeys: new Set<LooseStringLiteral<JsonSchemaKeyword>>(),
      path: input.path,
    };

    translateIdKeyword(newInput, newOutput, options);
    translateDefinitionsKeyword(newInput, newOutput, options);

    translateTypeKeyword(newInput, newOutput, options);
    translateNullableKeyword(newInput, newOutput, options);
    translateFactoringKeywords(newInput, newOutput, options);
    translateConditionalKeywords(newInput, newOutput, options);
    translateAnnotationKeywords(newInput, newOutput, options);
    translateConstantKeywords(newInput, newOutput, options);
    translateStructuringKeywords(newInput, newOutput, options);
    translateStringKeywords(newInput, newOutput, options);
    translateNumberKeywords(newInput, newOutput, options);
    translateArrayKeywords(newInput, newOutput, options);
    translateObjectKeywords(newInput, newOutput, options);

    copyErrorMessages(newInput, newOutput, options);
    copyJson(newInput, newOutput, options);

    return output.settings.booleanSchemas || output.forceAllowBooleanSchema
      ? isAnySchema(newOutput.schema)
        ? // @ts-expect-error omg what is it now
          true
        : isNeverSchema(newOutput.schema)
          ? // @ts-expect-error omg what is it now
            false
          : newOutput.schema
      : newOutput.schema;
  }
};

const copyErrorMessages: Mutator = (input, output, options) => {
  if (input.settings.errorMessages === "ajv") {
    if (output.settings.errorMessages === "ajv") {
      const copyFn: ((json: AjvErrorMessages) => AjvErrorMessages) | undefined =
        typeof options.copyJson === "function"
          ? options.copyJson
          : options.copyJson === "shallow"
            ? (json) => json
            : options.copyJson === "stringifyAndParse"
              ? (json) => JSON.parse(JSON.stringify(json))
              : undefined;

      if (!copyFn) {
        throw new Error(`Unknown copyJson option: ${options.copyJson}`);
      }

      const validate = (obj: object): obj is AjvErrorMessages =>
        Object.values(obj).every(
          (value) =>
            typeof value === "string" ||
            (typeof value === "object" && value && validate(value)),
        );

      if (
        typeof input.schema.errorMessage === "object" &&
        input.schema.errorMessage &&
        validate(input.schema.errorMessage)
      ) {
        output.schema.errorMessage = copyFn(input.schema.errorMessage);

        input.handledKeys.add("errorMessage");
      }
    }
  }
};

const copyJson: Mutator = (input, output, options) => {
  const copyFn: ((json: Json) => Json) | undefined =
    typeof options.copyJson === "function"
      ? options.copyJson
      : options.copyJson === "shallow"
        ? (json) => json
        : options.copyJson === "stringifyAndParse"
          ? (json) => JSON.parse(JSON.stringify(json))
          : undefined;

  if (!copyFn) {
    throw new Error(`Unknown copyJson option: ${options.copyJson}`);
  }

  if (input.settings.allowJson) {
    for (const key of Object.keys(input.schema).filter(
      (key) => !input.handledKeys.has(key),
    )) {
      if (output.settings.allowJson) {
        if (!(key in output.schema)) {
          // @ts-expect-error CBA
          output.schema[key] = copyFn(input.schema[key]);
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
