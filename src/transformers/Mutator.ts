import {
  JsonSchemaKeyword,
  JsonSchemaKeywordsObject,
  JsonSchemaPath,
} from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { UnhandledKeysMap } from "../UnhandledKeys.ts";
import { LooseStringLiteral } from "../utils.ts";

export type Mutator = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
>(
  input: {
    settings: InputJsonSchemaSettings;
    schema: JsonSchemaKeywordsObject<InputJsonSchemaSettings>;
    handledKeys: Set<LooseStringLiteral<JsonSchemaKeyword>>;
    path: JsonSchemaPath;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSettings>;
    unhandledKeys: UnhandledKeysMap;
  },
) => void;
