import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const jsonSchemaDraft2020_12Specification = {
  // Shared
  nullable: false,
  arbitraryJson: true,
  booleanSchemas: true,

  // Annotations
  $schema: "https://json-schema.org/draft/2020-12/schema" as const,
  $comment: true,
  deprecated: true,
  examples: true,
  $vocabulary: true,
  readOnly: true,
  writeOnly: true,

  // Extensions
  errorMessage: false,
  propertyOrdering: false,
  markdownDescription: false,

  // Types
  type: [
    "string",
    "number",
    "integer",
    "boolean",
    "object",
    "array",
    "null",
  ] as const,
  strictTypes: false,

  // Arrays
  prefixItems: true,
  additionalItems: true,
  maxItems: true,
  minItems: true,
  unevaluatedItems: true,
  uniqueItems: true,
  contains: true,
  minContains: true,
  maxContains: true,

  // Format
  format: true,
  stringFormats: [
    "date",
    "date-time",
    "duration",
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
    "uuid",
  ] as const,
  strictFormats: false,

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
  contentSchema: true,

  // Constants
  const: true,
  enum: true,
  nonEmptyEnum: false,

  // Structuring
  $id: "$id" as const,
  $defs: "$defs" as const,
  $anchor: true,
  $dynamicRef: true,
  $dynamicAnchor: true,
  $recursiveRef: true,
  $recursiveAnchor: true,

  // Conditionals
  if: true,
  then: true,
  else: true,

  // Factoring
  anyOf: true,
  oneOf: true,
  allOf: true,
  discriminator: false,

  // Objects and properties
  unevaluatedProperties: true,
  patternProperties: true,
  propertyNames: true,
  minProperties: true,
  maxProperties: true,
  nonEmptyRequired: true,
  allPropertiesRequired: false,
  additionalProperties: true,
  forceAdditionalProperties: undefined,
  dependencies: false,
  dependentRequired: true,
  dependentSchemas: true,
  nonEmptyDependencies: false,
  addNullTypeToOptionalProperties: false,
  treatPropertiesWithNullTypeAsOptional: false,
  setOptionalPropertiesToNullable: false,
  treatNullablePropertiesAsOptional: false,
} satisfies JsonSchemaSpecification;

export type JsonSchemaDraft2020_12Specification =
  typeof jsonSchemaDraft2020_12Specification;
export type JsonSchemaDraft2020_12 =
  JsonSchema<JsonSchemaDraft2020_12Specification>;
