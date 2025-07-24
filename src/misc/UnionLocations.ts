import { JsonSchemaKeywordsObject, JsonSchemaSpecification } from "../index.ts";

export type UnionLocations<Specification extends JsonSchemaSpecification> = {
  type?: JsonSchemaKeywordsObject<Specification>[];
  anyOf?: JsonSchemaKeywordsObject<Specification>[];
  oneOf?: JsonSchemaKeywordsObject<Specification>[];
  allOf?: JsonSchemaKeywordsObject<Specification>[];
  const?: JsonSchemaKeywordsObject<Specification>[];
};

export type UnionLocationsMap<Specification extends JsonSchemaSpecification> =
  Map<JsonSchemaKeywordsObject<Specification>, UnionLocations<Specification>>;
