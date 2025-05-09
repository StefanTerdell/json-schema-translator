import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const googleAiJsonSchemaSpecification = {
  // Shared
  nullable: true,
  arbitraryJson: false,
  booleanSchemas: false,

  // Annotations
  $schema: false,
  $comment: false,
  deprecated: false,
  examples: true,
  $vocabulary: false,
  readOnly: false,
  writeOnly: false,

  // Extensions
  errorMessage: false,
  propertyOrdering: true,
  markdownDescription: false,

  // Types
  integer: true,
  null: true,
  strictTypes: true,

  // Arrays
  prefixItems: false,
  additionalItems: false,
  maxItems: true,
  minItems: true,
  unevaluatedItems: false,
  uniqueItems: false,
  contains: false,
  minContains: false,
  maxContains: false,

  // Format
  format: ["float", "double", "int32", "int64", "enum", "date-time"],
  strictFormats: true,

  // Numbers
  multipleOf: false,
  minimum: true,
  exclusiveMinimum: false,
  maximum: true,
  exclusiveMaximum: false,

  // Strings
  minLength: false,
  maxLength: false,
  pattern: true,
  media: false,
  contentMediaType: false,
  contentEncoding: false,
  contentSchema: false,

  // Constants
  const: false,
  enum: "strings",
  nonEmptyEnum: false,

  // Structuring
  $id: "$id" as const,
  $defs: "$defs" as const,
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
  oneOf: false,
  allOf: false,

  // Objects and properties
  unevaluatedProperties: false,
  patternProperties: false,
  propertyNames: false,
  minProperties: true,
  maxProperties: true,
  nonEmptyRequired: false,
  allPropertiesRequired: false,
  additionalProperties: false,
  forceAdditionalProperties: undefined,
  dependencies: false,
  dependentRequired: false,
  dependentSchemas: false,
  nonEmptyDependencies: false,
  addNullTypeToOptionalProperties: false,
  treatPropertiesWithNullTypeAsOptional: false,
  setOptionalPropertiesToNullable: false,
  treatNullablePropertiesAsOptional: false,
} satisfies JsonSchemaSpecification;

export type GoogleAiJsonSchemaSpecification =
  typeof googleAiJsonSchemaSpecification;
export type OpenAiStructuredOutputSchema =
  JsonSchema<GoogleAiJsonSchemaSpecification>;
