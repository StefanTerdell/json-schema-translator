import { type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";

export const openAiStructuredOutputSchemaSpecification = {
  // Shared
  nullable: false,
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
  strictTypes: true,
  forceAnySchema: true,

  // Arrays
  prefixItems: false,
  additionalItems: true,
  maxItems: false,
  minItems: false,
  unevaluatedItems: false,
  uniqueItems: false,
  contains: false,
  minContains: false,
  maxContains: false,

  // Format
  format: false,
  strictFormats: false,

  // Numbers
  multipleOf: false,
  minimum: false,
  exclusiveMinimum: false,
  maximum: false,
  exclusiveMaximum: false,

  // Strings
  minLength: false,
  maxLength: false,
  pattern: false,
  media: false,
  contentMediaType: false,
  contentEncoding: false,
  contentSchema: false,

  // Constants
  const: false,
  enum: true,
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
  not: true,

  // Objects and properties
  unevaluatedProperties: false,
  patternProperties: false,
  propertyNames: false,
  minProperties: false,
  maxProperties: false,
  nonEmptyRequired: false,
  allPropertiesRequired: true,
  additionalProperties: false,
  forceAdditionalProperties: false,
  dependencies: false,
  dependentRequired: false,
  dependentSchemas: false,
  nonEmptyDependencies: false,
  addNullTypeToOptionalProperties: true,
  treatPropertiesWithNullTypeAsOptional: false,
  setOptionalPropertiesToNullable: false,
  treatNullablePropertiesAsOptional: false,
  excludeNeverProperties: true,
} satisfies JsonSchemaSpecification;

export type OpenAiStructuredOutputSchemaSpecification =
  typeof openAiStructuredOutputSchemaSpecification;
export type OpenAiStructuredOutputSchema =
  JsonSchema<OpenAiStructuredOutputSchemaSpecification>;
