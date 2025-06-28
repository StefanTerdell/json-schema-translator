import {
  type JsonSchemaKeywordsObject,
  type JsonSchemaKeywordsOnlyObject,
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
    schema: JsonSchemaKeywordsOnlyObject<InputJsonSchemaSpecification>;
  };
  into: {
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };
};
