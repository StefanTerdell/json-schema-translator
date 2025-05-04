import { JsonSchema } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";

export const jsonSchemaDraft4Settings = {
  $defsPath: "definitions" as const,
  booleanExclusiveMinimumAndMaximum: true,
  $idPath: "id" as const,
  $schema: "https://json-schema.org/draft-04/schema" as const,
  nonEmptyEnum: false,
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
} satisfies JsonSchemaSettings;

export type JsonSchemaDraft4Settings = typeof jsonSchemaDraft4Settings;
export type JsonSchemaDraft4 = JsonSchema<JsonSchemaDraft4Settings>;
