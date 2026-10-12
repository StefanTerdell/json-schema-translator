import { JsonSchemaKeywordsObject } from "../types/JsonSchema.ts";
import { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";

export type Pair<Spec extends JsonSchemaSpecification> = {
  specification: Spec;
  schema: JsonSchemaKeywordsObject<Spec>;
};

export type UnstrictPair<Spec extends JsonSchemaSpecification> = {
  specification: Spec;
  schema: JsonSchemaKeywordsObject<Spec> | boolean | string;
};

export const isStrictPair = <Spec extends JsonSchemaSpecification>(
  pair: UnstrictPair<Spec>,
): pair is Pair<Spec> => {
  return typeof pair.schema !== "boolean";
};
