import type { JsonSchema } from "../types/JsonSchema.ts";
import type { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import type { BaseContext } from "./BaseContext.ts";

/** @internal */

export type TranslatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
> = BaseContext<InputJsonSchemaSpecification, OutputJsonSchemaSpecification> & {
  from: {
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
  };
  forceAllowBooleanSchema: ForceAllowBooleanSchema;
};
