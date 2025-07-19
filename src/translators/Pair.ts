import { JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export type Pair<Spec extends JsonSchemaSpecification> = {
  specification: Spec;
  schema: JsonSchemaKeywordsObject<Spec>;
};

export type UnstrictPair<Spec extends JsonSchemaSpecification> = {
  specification: Spec;
  schema: JsonSchemaKeywordsObject<Spec> | boolean;
};

export const isStrictPair = <Spec extends JsonSchemaSpecification>(
  pair: UnstrictPair<Spec>,
): pair is Pair<Spec> => {
  return typeof pair.schema !== "boolean";
};
