import {
  JsonSchemaKeywordsObject,
  JsonSchemaStaticKeywordsObject,
} from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { TranslateJsonSchemaContext } from "../TranslateJsonSchemaContext.ts";
import { HandledKeysSet } from "../UnhandledKeys.ts";

export type MutatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = TranslateJsonSchemaContext<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> & {
  handledKeys: HandledKeysSet;
  input: {
    schema: JsonSchemaStaticKeywordsObject<InputJsonSchemaSpecification>;
  };
  output: {
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };
};

export type Mutator = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification
  >,
) => void;
