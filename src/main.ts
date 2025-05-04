import { generateSchema } from "./transformers/schema.ts";
import { JsonSchema } from "./JsonSchema.ts";
import { JsonSchemaSettings } from "./JsonSchemaSettings.ts";
import { UnhandledKeysMap } from "./UnhandledKeys.ts";

type TransformJSONSchemaOptions = {
  unhandledKeys: "ignore" | "warn" | "throw" | UnhandledKeysMap;
};

export function transformJSONSchema<
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
>(
  inputSchema: JsonSchema<InputJsonSchemaSettings>,
  inputSettings: InputJsonSchemaSettings,
  outputSettings: OutputJsonSchemaSettings,
  options?: TransformJSONSchemaOptions,
): JsonSchema<OutputJsonSchemaSettings> {
  const unhandledKeys: UnhandledKeysMap =
    typeof options?.unhandledKeys === "object"
      ? options.unhandledKeys
      : new Map();

  const outputSchema = generateSchema(
    {
      schema: inputSchema,
      settings: inputSettings,
      path: [],
    },
    {
      settings: outputSettings,
      forceAllowBooleanSchema: false,
      unhandledKeys,
    },
  );

  if (unhandledKeys.size) {
    if (options?.unhandledKeys === "throw") {
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
    }

    if (options?.unhandledKeys === "warn") {
      console.warn("Unhandled keys:", unhandledKeys);
    }
  }

  return outputSchema;
}
