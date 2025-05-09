import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const jsonSchemaDraft4Specification = {
  // Shared
  nullable: false,
  arbitraryJson: true,
  booleanSchemas: false,

  // Annotations
  $schema: "http://json-schema.org/draft-04/schema#" as const,
  $comment: false,
  deprecated: false,
  examples: false,
  $vocabulary: false,
  readOnly: false,
  writeOnly: false,

  // Extensions
  errorMessage: false,
  propertyOrdering: false,
  markdownDescription: false,

  // Types
  integer: true,
  null: true,
  strictTypes: false,

  // Arrays
  prefixItems: false,
  additionalItems: true,
  maxItems: true,
  minItems: true,
  unevaluatedItems: false,
  uniqueItems: true,
  contains: false,
  minContains: false,
  maxContains: false,

  // Format
  format: ["date-time", "email", "hostname", "ipv4", "ipv6", "uri"] as const,
  strictFormats: true,

  // Numbers
  multipleOf: true,
  minimum: true,
  exclusiveMinimum: "boolean",
  maximum: true,
  exclusiveMaximum: "boolean",

  // Strings
  minLength: true,
  maxLength: true,
  pattern: true,
  media: false,
  contentMediaType: false,
  contentEncoding: false,
  contentSchema: false,

  // Constants
  const: false,
  enum: true,
  nonEmptyEnum: true,

  // Structuring
  $id: "id" as const,
  $defs: "definitions" as const,
  $anchor: false,
  $dynamicRef: false,
  $dynamicAnchor: false,
  $recursiveRef: false,
  $recursiveAnchor: false,

  // Conditionals
  if: false,
  then: false,
  else: false,

  // Factoring
  anyOf: true,
  oneOf: true,
  allOf: true,

  // Objects and properties
  unevaluatedProperties: false,
  patternProperties: true,
  propertyNames: false,
  minProperties: true,
  maxProperties: true,
  nonEmptyRequired: true,
  allPropertiesRequired: false,
  additionalProperties: true,
  forceAdditionalProperties: undefined,
  dependencies: true,
  dependentRequired: false,
  dependentSchemas: false,
  nonEmptyDependencies: true,
  addNullTypeToOptionalProperties: false,
  treatPropertiesWithNullTypeAsOptional: false,
  setOptionalPropertiesToNullable: false,
  treatNullablePropertiesAsOptional: false,
} satisfies JsonSchemaSpecification;

export type JsonSchemaDraft4Specification =
  typeof jsonSchemaDraft4Specification;
export type JsonSchemaDraft4 = JsonSchema<JsonSchemaDraft4Specification>;
