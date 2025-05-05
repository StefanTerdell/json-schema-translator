import { type Json } from "./Json.ts";
import { type JsonSchema } from "./JsonSchema.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { type UnhandledKeysMap } from "./UnhandledKeys.ts";
import { translateJsonSchemaInternal } from "./translateJsonSchemaInternal.ts";

export type CopyFn = <T = Json>(value: T) => T;

export type TranslateJsonSchemaOptions = {
  unhandledKeys:
    | "ignore"
    | "warn"
    | "throw"
    | UnhandledKeysMap
    | ((unhandledKeys: UnhandledKeysMap) => void);
  copyJson: "shallow" | "stringifyAndParse" | CopyFn;
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

  const outputSchema = translateJsonSchemaInternal({
    input: {
      schema: inputSchema,
      settings: inputSpecification,
    },
    output: {
      settings: outputSpecification,
    },
    path: [],
    forceAllowBooleanSchema: false,
    unhandledKeys: unhandledKeys,
    copyJson: options.copyJson,
    seen: new Map(),
  });

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
