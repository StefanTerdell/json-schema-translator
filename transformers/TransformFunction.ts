import { JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";

export type TransformerFunction = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
>(
  input: {
    settings: InputJsonSchemaSettings;
    schema: JsonSchemaKeywordsObject<InputJsonSchemaSettings>;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSettings>;
  },
) => void;
