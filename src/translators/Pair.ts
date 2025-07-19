import { JsonSchema, JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export type Pair<
  Spec extends JsonSchemaSpecification,
  KeywordsObject extends boolean = true,
> = {
  specification: Spec;
  schema: KeywordsObject extends true
    ? JsonSchemaKeywordsObject<Spec>
    : JsonSchema<Spec>;
};
