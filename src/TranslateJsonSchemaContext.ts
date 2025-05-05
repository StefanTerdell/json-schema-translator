import { JsonSchemaPath } from "./JsonSchema.ts";
import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { TranslateJsonSchemaOptions } from "./translateJsonSchema.ts";
import { UnhandledKeysMap } from "./UnhandledKeys.ts";

/** @internal */
export type TranslateJsonSchemaContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = TranslateJsonSchemaOptions & {
  unhandledKeys: UnhandledKeysMap;
  path: JsonSchemaPath;
  input: {
    settings: InputJsonSchemaSpecification;
  };
  output: {
    settings: OutputJsonSchemaSpecification;
  };
};
