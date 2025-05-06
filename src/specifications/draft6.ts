import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const jsonSchemaDraft6Specification = {
  // Shared
  nullable: false,
  arbitraryJson: true,
  booleanSchemas: false,

  // Annotations
  $schema: "http://json-schema.org/draft-06/schema#" as const,
  $comment: false,
  deprecated: false,
  examples: true,
  $vocabulary: false,
  readOnly: false,
  writeOnly: false,

  // Extensions
  errorMessage: false,
  propertyOrdering: false,

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
  contains: true,
  minContains: false,
  maxContains: false,

  // Format
  format: [
    "date-time",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "json-pointer",
    "uri",
    "uri-reference",
    "uri-template",
  ] as const,
  strictFormats: true,

  // Numbers
  multipleOf: true,
  minimum: true,
  exclusiveMinimum: true,
  maximum: true,
  exclusiveMaximum: true,

  // Strings
  minLength: true,
  maxLength: true,
  pattern: true,
  media: true,
  contentMediaType: false,
  contentEncoding: false,
  contentSchema: false,

  // Constants
  const: true,
  enum: true,
  nonEmptyEnum: false,

  // Structuring
  $id: "$id" as const,
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
  propertyNames: true,
  minProperties: true,
  maxProperties: true,
  nonEmptyRequired: true,
  allPropertiesRequired: false,
  additionalProperties: true,
  forceAdditionalProperties: undefined,
  dependencies: true,
  dependentRequired: false,
  dependentSchemas: false,
  nonEmptyDependencies: false,
  addNullTypeToOptionalProperties: false,
  treatPropertiesWithNullTypeAsOptional: false,
  setOptionalPropertiesToNullable: false,
  treatNullablePropertiesAsOptional: false,
} satisfies JsonSchemaSpecification;

export type JsonSchemaDraft6Specification =
  typeof jsonSchemaDraft6Specification;
export type JsonSchemaDraft6 = JsonSchema<JsonSchemaDraft6Specification>;
