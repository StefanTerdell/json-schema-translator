import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const jsonSchemaDraft4Specification = {
  $defsPath: "definitions" as const,
  booleanExclusiveMinimumAndMaximum: true,
  $idPath: "id" as const,
  $schema: "http://json-schema.org/draft-04/schema#" as const,
  nonEmptyEnum: true,
  nonEmptyRequired: true,
  nonEmptyDependencies: true,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: false,
  $anchor: false,
  booleanSchemas: false,
  const: false,
  contains: false,
  contentMediaTypeAndEncoding: false,
  contentSchema: false,
  deprecated: false,
  $dynamicAnchorAndRef: false,
  examples: false,
  format: [
    "date-time",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    //
  ] as const,
  ifThenElse: false,
  integerType: true,
  media: false,
  minAndMaxContains: false,
  nullType: true,
  nullable: false,
  prefixItems: false,
  propertyNames: false,
  readAndWriteOnly: false,
  $recursiveAnchorAndRef: false,
  dependentRequiredAndSchemas: false,
  unevaluatedItems: false,
  unevaluatedProperties: false,
  $vocabulary: false,
  allowJson: true,
  errorMessages: false,
} satisfies JsonSchemaSpecification;

export type JsonSchemaDraft4Specification =
  typeof jsonSchemaDraft4Specification;
export type JsonSchemaDraft4 = JsonSchema<JsonSchemaDraft4Specification>;
