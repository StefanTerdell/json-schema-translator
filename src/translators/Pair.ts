import { JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export type Pair<Spec extends JsonSchemaSpecification> = {
  specification: Spec;
  schema: JsonSchemaKeywordsObject<Spec>;
};
