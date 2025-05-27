import { Json, JsonArray } from "./Json.ts";

class JsonSchemaInstance {
  // Varying paths
  $defs?: Record<string, JsonSchemaInstance>;
  $id?: string;

  // Shared
  type?: string[];

  // Strings
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  contentEncoding?: string;
  contentMediaType?: string;
  contentSchema?: JsonSchemaInstance;

  // Numbers
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;

  // Objects
  required?: string[];
  properties?: Record<string, JsonSchemaInstance>;
  additionalProperties?: JsonSchemaInstance;
  patternProperties?: Record<string, JsonSchemaInstance>;
  unevaluatedProperties?: JsonSchemaInstance;
  propertyNames?: JsonSchemaInstance;
  maxProperties?: number;
  minProperties?: number;
  dependentRequired?: Record<string, string[]>;
  dependentSchemas?: Record<string, JsonSchemaInstance>;

  // Arrays
  prefixItems?: JsonSchemaInstance[];
  items?: JsonSchemaInstance;
  additionalItems?: JsonSchemaInstance;
  unevaluatedItems?: JsonSchemaInstance;
  contains?: JsonSchemaInstance;
  minContains?: number;
  maxContains?: number;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // Factoring
  anyOf?: JsonSchemaInstance[];
  oneOf?: JsonSchemaInstance[];
  allOf?: JsonSchemaInstance[];

  // Conditional
  if?: JsonSchemaInstance;
  then?: JsonSchemaInstance;
  else?: JsonSchemaInstance;
  not?: JsonSchemaInstance;

  // Annotations
  $schema?: string;
  $vocabulary?: string;
  title?: string;
  description?: string;
  default?: Json;
  examples?: JsonArray;
  deprecated?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  $comment?: string;

  // Constants
  enum?: JsonArray;
  const?: Json;

  // Structuring
  $anchor?: string;
  $ref?: string;
  $recursiveAnchor?: string;
  $recursiveRef?: string;
  $dynamicAnchor?: string;
  $dynamicRef?: string;
}
