import {
  type JsonSchemaKeywordsObject,
  type JsonSchemaStaticKeywordsObject,
} from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { type BaseContext } from "./BaseContext.ts";
import { type HandledKeysSet } from "../UnhandledKeys.ts";

/** @internal */
export type MutatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = BaseContext<InputJsonSchemaSpecification, OutputJsonSchemaSpecification> & {
  handledKeys: HandledKeysSet;
  from: {
    schema: JsonSchemaStaticKeywordsObject<InputJsonSchemaSpecification>;
  };
  into: {
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };
};
