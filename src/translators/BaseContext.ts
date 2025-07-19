import { type JsonSchema, type JsonSchemaPath } from "../types/JsonSchema.ts";
import { type JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { type UnhandledKeysMap } from "../misc/UnhandledKeys.ts";
import { type JsonSchemaTranslationOptionsBase } from "../types/JsonSchemaTranslationOptions.ts";

/** @internal */
export type BaseContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = JsonSchemaTranslationOptionsBase & {
  unhandledKeys: UnhandledKeysMap;
  path: JsonSchemaPath;
  from: {
    specification: InputJsonSchemaSpecification;
  };
  into: {
    specification: OutputJsonSchemaSpecification;
  };
  seen: Map<
    JsonSchema<InputJsonSchemaSpecification>,
    JsonSchema<OutputJsonSchemaSpecification>
  >;
};
