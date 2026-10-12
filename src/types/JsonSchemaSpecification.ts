import type { JsonSchema } from "./JsonSchema.ts";
import type { LooseStringLiteral } from "./UtilityTypes.ts";

type SharedOptions = {
  /** Option - Disable/enable allowing arbitrary JSON values in non-keyword properties of the schema object */
  arbitraryJson?: boolean;
  /** Option - Disable/enable allowing `true` or `false` to appear anywhere in the schema hierarchy, as opposed to only in `"additionalItems"` or `"additionalProperties"` */
  booleanSchemas?: boolean;
  /** Option - Disable/enable allowing the use of a valid `type` keyword value as complete schemas themselves */
  typeSchemas?: boolean;
};

type AnnotationKeywords = {
  /** Keyword - The output schema `$schema` property will only be set if it is set as a string in the output specification. If it is set as a string in the input specification it will only be set if the input schemas `$schema` value matches that of the input specifiction. */
  $schema: string | false;
  /** Keyword - Disable/enable the `$comment` keyword */
  $comment: boolean;
  /** Keyword - Disable/enable the `deprecated` keyword */
  deprecated: boolean;
  /** Keyword - Disable/enable the `examples` keyword */
  examples: boolean;
  /** Keyword - Disable/enable the `$vocabulary` keyword */
  $vocabulary: boolean;
  /** Keyword - Disable/enable the `readOnly` keyword */
  readOnly: boolean;
  /** Keyword - Disable/enable the `writeOnly` keyword */
  writeOnly: boolean;
};

type ExtensionOptions = {
  // Extensions
  /** Option - Disable/enable the "nullable" keyword as defined by Open API 3.0 */
  nullable?: boolean;
  /** Option - Disable/enable the `discriminator` keyword as defined by Open API 3.0 */
  discriminator?: boolean;
  /** Option - Optionally set which format to accept error messages in */
  errorMessage?: "ajv" | false;
  /** Option - Optionally enable the `propertyOrdering` keyword. Will be copied if enabled in both schema specifications and based on the keys of `properties` if enabled only in output */
  propertyOrdering?: boolean;
  /** Option - Always create `propertyOrdering` from the order of the `properties` keyword properties if the input specification doesn't provide it. Does nothing if the `propertyOrdering` keyword isn't enabled.  */
  derivePropertyOrderingFromKeys?: boolean;
  /** Option - Optionally enable the `markdownDescription` keyword. Will be copied if enabled in both schema scpecifications or moved into 'description' if enabled only in the input and if the input schema does not have a `description` */
  markdownDescription?: boolean;
};

type TypeKeywords = {
  /** Define which values are allowed in the `type` keyword */
  type: LooseStringLiteral<
    "string" | "number" | "integer" | "boolean" | "null" | "object" | "array"
  >[];
};

type TypeOptions = {
  /** Option - Enable validation of the `type` keyword value. */
  strictTypes?: boolean;
  /** Option - Disable the ability to assign multiple types to the `type` keyword by using an array */
  singleType?: boolean;
  /** Option - Provide a default schema in place of an empty schema where any value would be allowed */
  forceAnySchema?: JsonSchema<JsonSchemaSpecification, true>;
};

type ArrayKeywords = {
  /** Disable/enable the `prefixItems` keyword. If enabled, the `items` keyword will only accept a single schema as opposed to an optional array of schemas */
  prefixItems: boolean;
  /** Disable/enable the `additionalItems` keyword. */
  additionalItems: boolean;
  /** Disable/enable the `maxItems` keyword */
  maxItems: boolean;
  /** Disable/enable the `minItems` keyword */
  minItems: boolean;
  /** Disable/enable the `unevaluatedItems` keyword */
  unevaluatedItems: boolean;
  /** Disable/enable the `uniqueItems` keyword */
  uniqueItems: boolean;
  /** Disable/enable the `contains` keyword. If disabled the `minContains` and `maxContains` keywords are also disabled, and their options have no effect. */
  contains: boolean;
  /** Disable/enable the `minContains` keyword. If the `contains` keyword is disabled this option has no effect and the keyword is disabled. */
  minContains: boolean;
  /** Disable/enable the `maxContains` keyword. If the `contains` keyword is disabled this option has no effect and the keyword is disabled. */
  maxContains: boolean;
};

type ArrayOptions = {
  /** Option - Disable the ability to assign multiple schemas to the `items` keyword by using an array */
  singleItems?: boolean;
};

type FormatKeywords = {
  /** Keyword - Disable/enable the `format` keyword. Can optionally be set to an array of strings to enable autocomplete. For validation of these values see the `strictFormats` option. */
  format: boolean | string[];
};

type FormatOptions = {
  /** Option - Enable validation of the `format` keyword value. The `format` keyword must be an array of valid formats for this option to have any effect. */
  strictFormats?: boolean;
};

type NumberKeywords = {
  /** Keyword - Disable/enable the `multipleOf` keyword */
  multipleOf: boolean;
  /** Keyword - Disable/enable the `minimum` keyword. If disabled the `exclusiveMinimum` keyword is also disabled. */
  minimum: boolean;
  /** Keyword - Disable/enable the exclusiveMinimum` keyword. `exclusiveMinimum` can also be set to `"boolean"` which requires the schema value (if set) to be either `true` or `false`. If the `minimum` keyword is disabled the `exclusiveMinimum` keyword is also disabled and this option has no effect. */
  exclusiveMinimum: boolean;
  /** Disable/enable the `maximum` keyword. If disabled the `exclusiveMaximum` keyword is also disabled. */
  maximum: boolean;
  /** Disable/enable the exclusiveMaximum` keyword. `exclusiveMaximum` can also be set to `"boolean"` which requires the schema value (if set) to be either `true` or `false`. If the `maximum` keyword is disabled the `exclusiveMaximum` keyword is also disabled and this option has no effect. */
  exclusiveMaximum: boolean;
};

type NumberOptions = {
  booleanExclusiveMinimum?: boolean;
  booleanExclusiveMaximum?: boolean;
};

type StringKeywords = {
  /** Keyword - Disable/enable the `minLength` keyword. */
  minLength: boolean;
  /** Keyword - Disable/enable the `maxLength` keyword. */
  maxLength: boolean;
  /** Keyword - Disable/enable the `pattern` keyword. */
  pattern: boolean;
  /** Keyword - Disable/enable the `media` keyword. If enabled, the `contentMediaType`, `contentEncoding` and `contentSchema` keywords are treated as disabled. */
  media: boolean;
  /** Keyword - Disable/enable the `contentMediaType` keyword. If the `media` keyword is enabled, the `contentMediaType` keyword is disabled and this option has no effect. */
  contentMediaType: boolean;
  /** Keyword - Disable/enable the `contentEncoding` keyword. If the `media` keyword is enabled, the `contentEncoding` keyword is disabled and this option has no effect. */
  contentEncoding: boolean;
  /** Keyword - Disable/enable the `contentSchema` keyword. If the `media` keyword is enabled, the `contentSchema` keyword is disabled and this option has no effect. */
  contentSchema: boolean;
};

type ConstKeywords = {
  // Constants
  /** Keyword - Disable/enable the `const` keyword. */
  const: boolean;
  /** Keyword - Disable/enable the `enum` keyword. It can also be set to `strings` to only accept an array of strings in the schema value. */
  enum: boolean;
};

type ConstOptions = {
  /** Option - Disable/enable enforcing non-empty arrays in the `enum` keyword schema value. If the `enum` keyword is disabled, this option has no effect. */
  nonEmptyEnum?: boolean;
  stringConstants?: boolean;
};

type StructuringKeywords = {
  /** Keyword - Set the path of the `$id` keyword. In older specifications this was known as `id`, in newer `$id`, but it can take any arbitrary value. It can also be set to `false` to disable it entirely */
  $id: LooseStringLiteral<"id" | "$id"> | false;
  /** Keyword - Set the path of the `$defs` keyword. In older specifications this was known as `definitions`, in newer `$defs`, but it can take any arbitrary value. It can also be set to `false` to disable it entirely */
  $defs: LooseStringLiteral<"definitions" | "$defs"> | false;
  /** Keyword - Disable/enable the `$anchor` keyword */
  $anchor: boolean;
  /** Keyword - Disable/enable the `$dynamicRef` keyword. If disabled, the `$dynamicAnchor` keyword is also disabled. */
  $dynamicRef: boolean;
  /** Keyword - Disable/enable the `$dynamicAnchor` keyword. If the `$dynamicRef` keyword is disabled this option has no effect. */
  $dynamicAnchor: boolean;
  /** Keyword - Disable/enable the `$recursiveRef` keyword. If disabled, the `$recursiveAnchor` keyword is also disabled. */
  $recursiveRef: boolean;
  /** Keyword - Disable/enable the `$recursiveAnchor` keyword. If the `$recursiveRef` keyword is disabled this option has no effect. */
  $recursiveAnchor: boolean;
};

type ConditionalKeywords = {
  /** Keyword - Disable/enable the `if` keyword. If disabled, the `then` and `else` keywords are also disabled. */
  if: boolean;
  /** Keyword - Disable/enable the `then` keyword. If the `if` keyword is disabled the `then` keyword is also disabled and this option has no effect. */
  then: boolean;
  /** Keyword - Disable/enable the `else` keyword. If the `if` keyword is disabled the `else` keyword is also disabled and this option has no effect. */
  else: boolean;
};

type FactoringKeywords = {
  /** Keyword - Disable/enable the `anyOf` keyword */
  anyOf: boolean;
  /** Keyword - Disable/enable the `oneOf` keyword */
  oneOf: boolean;
  /** Keyword - Disable/enable the `allOf` keyword */
  allOf: boolean;
  /** Keyword - Disable/enable the `not` keyword */
  not: boolean;
};

type ObjectKeywords = {
  /** Keyword - Disable/enable the `unevaluatedProperties` keyword */
  unevaluatedProperties: boolean;
  /** Keyword - Disable/enable the `patternProperties` keyword */
  patternProperties: boolean;
  /** Keyword - Disable/enable the `propertyNames` keyword */
  propertyNames: boolean;
  /** Keyword - Disable/enable the `minProperties` keyword */
  minProperties: boolean;
  /** Keyword - Disable/enable the `maxProperties` keyword */
  maxProperties: boolean;
  /** Keyword - Disable/enable the `additionalProperties` keyword */
  additionalProperties: boolean;
  /** Keyword - Disable/enable the `dependencies` keyword. */
  dependencies: boolean;
  /** Keyword - Disable/enable the `dependentRequired` keyword. */
  dependentRequired: boolean;
  /** Keyword - Disable/enable the `dependentSchemas` keyword. If enabled in the output settings `dependencies` will not be used for dependent required properties. */
  dependentSchemas: boolean;
};

type ObjectOptions = {
  /** Option - Optionally force setting `additionalProperties` schema value to a boolean value in any schema that includes an `object` type. `additionalProperties` must be set to `false` for this option to be active. */
  forceAdditionalProperties?: boolean;
  /** Option - Disable/enable enforcing non-empty arrays in the `required` keyword schema value. */
  nonEmptyRequired?: boolean;
  /** Option - Add all properties to the list of required ones */
  allPropertiesRequired?: boolean;
  /** Option  - Disable/enable enforcing non-empty arrays in the `dependencies` keyword schema value. If enabled in the output settings `dependencies` will not be used for dependent schemas. */
  nonEmptyDependencies?: boolean;
  /** Option - Disable/enable ensuring the `null` type is present in all optional schemas. This includes adding it as an option of an `enum` array, if that keyword is enabled. If the `null` option is disabled this option has no effect. */
  addNullTypeToOptionalProperties?: boolean;
  /** Option - Disable/enable removing all properties with a `null` type from the list of `required` properties. If the `null` option is disabled this option has no effect. */
  treatPropertiesWithNullTypeAsOptional?: boolean;
  /** Option - Disable/enable ensuring the `nullable` schema value is set to `true` in all optional schemas. If the `nullable` option is disabled this option has no effect. */
  setOptionalPropertiesToNullable?: boolean;
  /** Option - Disable/enable removing all properties with a `nullable` value set to `true` from the list of `required` properties. If the `nullable` option is disabled this option has no effect. */
  treatNullablePropertiesAsOptional?: boolean;
  /** Option - Disable/enable removing all properties with no permissible values ("never"-schemas) */
  excludeNeverProperties?: boolean;
};

export type JsonSchemaSpecification = SharedOptions &
  AnnotationKeywords &
  ExtensionOptions &
  TypeKeywords &
  TypeOptions &
  ArrayKeywords &
  ArrayOptions &
  FormatKeywords &
  FormatOptions &
  NumberKeywords &
  NumberOptions &
  StringKeywords &
  ConstKeywords &
  ConstOptions &
  StructuringKeywords &
  ConditionalKeywords &
  FactoringKeywords &
  ObjectKeywords &
  ObjectOptions;

export const jsonSchemaSpecification: JsonSchemaSpecification = {
  // Shared
  nullable: false,
  arbitraryJson: false,
  booleanSchemas: false,
  typeSchemas: false,

  // Annotations
  $schema: false,
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
  prefixItems: false,
  additionalItems: false,
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
  enum: false,
  nonEmptyEnum: false,

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
  anyOf: false,
  oneOf: false,
  allOf: false,
  not: false,

  // Objects and properties
  unevaluatedProperties: false,
  patternProperties: false,
  propertyNames: false,
  minProperties: false,
  maxProperties: false,
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
  excludeNeverProperties: false,
};
