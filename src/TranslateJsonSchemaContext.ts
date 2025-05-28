import { type JsonSchema, type JsonSchemaPath } from "./JsonSchema.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { type UnhandledKeysMap } from "./UnhandledKeys.ts";
import { type JsonSchemaTranslationOptionsBase } from "./JsonSchemaTranslationOptions.ts";

/** @internal */
export type TranslateJsonSchemaContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = JsonSchemaTranslationOptionsBase & {
  unhandledKeys: UnhandledKeysMap;
  path: JsonSchemaPath;
  input: {
    settings: InputJsonSchemaSpecification;
  };
  output: {
    settings: OutputJsonSchemaSpecification;
  };
  seen: Map<
    JsonSchema<InputJsonSchemaSpecification>,
    JsonSchema<OutputJsonSchemaSpecification>
  >;
};
