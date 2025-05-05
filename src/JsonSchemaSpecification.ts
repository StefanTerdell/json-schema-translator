import { type LooseStringLiteral } from "./utils.ts";

export type JsonSchemaSpecification = {
  // shared
  $schema: string | undefined;
  $idPath: LooseStringLiteral<"id" | "$id">;
  booleanSchemas: boolean;
  integerType: boolean;
  nullType: boolean;
  nullable: boolean;
  allowJson: boolean;

  // de-facto standard extensions
  errorMessages: "ajv" | false;

  // annotations
  $comment: boolean;
  deprecated: boolean;
  examples: boolean;
  $vocabulary: boolean;
  readAndWriteOnly: boolean;

  // array
  contains: boolean;
  minAndMaxContains: boolean;
  prefixItems: boolean;
  unevaluatedItems: boolean;
  minAndMaxItems: boolean;
  uniqueItems: boolean;

  // number
  exclusiveMinimumAndMaximum: boolean | "boolean";
  minimumAndMaximum: boolean;
  multipleOf: boolean;

  // content
  contentMediaTypeAndEncoding: boolean;
  contentSchema: boolean;
  media: boolean;

  // constants
  nonEmptyEnum: boolean;
  const: boolean;

  // structuring
  $dynamicAnchorAndRef: boolean;
  $recursiveAnchorAndRef: boolean;
  $defsPath: LooseStringLiteral<"$defs" | "definitions">;
  $anchor: boolean;

  // string
  format: boolean | string[];
  minAndMaxLength: boolean;
  pattern: boolean;

  // conditional
  ifThenElse: boolean;

  // object
  nonEmptyRequired: boolean;
  nonEmptyDependencies: boolean;

  addNullTypeToOptional: boolean;
  addNullableToOptional: boolean;
  makeNullTypeOptional: boolean;
  makeNullableOptional: boolean;
  allPropertiesRequired: boolean;

  dependencies: boolean;
  dependentRequiredAndSchemas: boolean;
  unevaluatedProperties: boolean;
  patternProperties: boolean;
  propertyNames: boolean;
  minAndMaxProperties: boolean;
  additionalProperties: boolean;
  forceAdditionalProperties: undefined | boolean;
};
