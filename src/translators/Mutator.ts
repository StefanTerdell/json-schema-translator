import {
  JsonSchemaKeyword,
  JsonSchemaKeywordsObject,
  JsonSchemaPath,
} from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { TranslateJsonSchemaOptions } from "../translateJsonSchema.ts";
import { UnhandledKeysMap } from "../UnhandledKeys.ts";
import { LooseStringLiteral } from "../utils.ts";

export type Mutator = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  input: {
    settings: InputJsonSchemaSpecification;
    schema: JsonSchemaKeywordsObject<InputJsonSchemaSpecification>;
    handledKeys: Set<LooseStringLiteral<JsonSchemaKeyword>>;
    path: JsonSchemaPath;
  },
  output: {
    settings: OutputJsonSchemaSpecification;
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
    unhandledKeys: UnhandledKeysMap;
  },
  options: TranslateJsonSchemaOptions,
) => void;
