import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const jsonSchemaDraft7Specification = {
  // Shared
  nullable: false,
  arbitraryJson: true,
  booleanSchemas: false,

  // Annotations
  $schema: "http://json-schema.org/draft-07/schema#" as const,
  $comment: false,
  deprecated: false,
  examples: true,
  $vocabulary: false,
  readOnly: true,
  writeOnly: true,

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
    "date",
    "date-time",
    "email",
    "hostname",
    "idn-email",
    "idn-hostname",
    "ipv4",
    "ipv6",
    "iri",
    "iri-reference",
    "json-pointer",
    "regex",
    "relative-json-pointer",
    "time",
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
  media: false,
  contentMediaType: true,
  contentEncoding: true,
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
  if: true,
  then: true,
  else: true,

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

export type JsonSchemaDraft7Specification =
  typeof jsonSchemaDraft7Specification;
export type JsonSchemaDraft7 = JsonSchema<JsonSchemaDraft7Specification>;
