import { JsonSchema } from "./JsonSchema.ts";
import { JsonSchemaSettings } from "./JsonSchemaSettings.ts";
import { JsonSchemaSettingsError } from "./JsonSchemaSettingsError.ts";

export const jsonSchemaDraft4Settings = {
  $defsPath: "definitions",
  booleanExclusiveMinimumAndMaximum: true,
  $idPath: "id",
  $schema: "https://json-schema.org/draft-04/schema",
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
  ],
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
} satisfies JsonSchemaSettings;

export type JsonSchemaDraft4Settings = typeof jsonSchemaDraft4Settings;
export type JsonSchemaDraft4 = JsonSchema<JsonSchemaDraft4Settings>;

const _jsonSchemaDraft4SettingsError: JsonSchemaSettingsError<JsonSchemaDraft4Settings> =
  null;
