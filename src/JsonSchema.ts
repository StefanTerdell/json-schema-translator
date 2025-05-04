import { Json } from "./Json.ts";
import { JsonSchemaSettings } from "./JsonSchemaSettings.ts";
import { LooseStringLiteral, NonEmptyArray } from "./utils.ts";

/* Represents a JsonSchema as defined by the provided JsonSchemaSettings. Depending on the settings and specific keyword this can either be a JsonSchemaObject or a boolean */
export type JsonSchema<
  Options extends JsonSchemaSettings,
  ForceAllowBooleanSchema extends boolean = false,
> =
  | JsonSchemaObject<Options>
  | (Options["booleanSchemas"] extends true ? boolean : never)
  | (ForceAllowBooleanSchema extends true ? boolean : never);

/* A less strict version of JsonSchemaKeywordsObject allowing for arbitrary values and keywords not protected by the specification */
export type JsonSchemaObject<T extends JsonSchemaSettings> = {
  [Key in string]?: Key extends keyof JsonSchemaKeywordsObject<T>
    ? JsonSchemaKeywordsObject<T>[Key]
    : Key extends T["$defsPath"]
      ? { [Key in string]?: JsonSchema<T> }
      : Key extends T["$idPath"]
        ? string
        : Json;
};

// JsonSchemaKeywordsObject<T> & {
//   [Key in Exclude<T["$defsPath"], JsonSchemaKeywords>]?: {
//     [Key in string]?: JsonSchema<T>;
//   };
// } & {
//   [Key in Exclude<T["$idPath"], JsonSchemaKeywords>]?: string;
// } & {
//   [Key in string]?: Json;
// };

/* All keywords defined in JsonSchemaKeywordsObject */
// deno-lint-ignore no-explicit-any
export type JsonSchemaKeywords = keyof JsonSchemaKeywordsObject<any>;

/* Represents a JsonSchema object as defined by the provided JsonSchemaSettings with no arbitrary keys allowed */
export type JsonSchemaKeywordsObject<T extends JsonSchemaSettings> = {
  // type
  type?: JsonSchemaType<T> | Array<JsonSchemaType<T>>;
  nullable?: T["nullable"] extends true ? boolean : unknown;

  // strings:
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: T["format"] extends true
    ? string
    : T["format"] extends (infer F extends string)[]
      ? LooseStringLiteral<F>
      : unknown;

  // string content
  contentEncoding?: T["contentMediaTypeAndEncoding"] extends true
    ? LooseStringLiteral<"quoted-printable" | "base16" | "base32" | "base64">
    : unknown;
  contentMediaType?: T["contentMediaTypeAndEncoding"] extends true
    ? string
    : unknown;
  contentSchema?: T["contentSchema"] extends true ? JsonSchema<T> : unknown;
  media?: T["media"] extends true
    ? {
        binaryEncoding?: string;
        type?: string;
      }
    : unknown;

  // numbers:
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: T["booleanExclusiveMinimumAndMaximum"] extends true
    ? boolean
    : number;
  exclusiveMaximum?: T["booleanExclusiveMinimumAndMaximum"] extends true
    ? boolean
    : number;
  maximum?: number;

  // objects:
  required?: T["nonEmptyRequired"] extends true
    ? NonEmptyArray<string>
    : string[];
  properties?: Record<string, JsonSchema<T>>;
  additionalProperties?: JsonSchema<T, true>;
  patternProperties?: Record<string, JsonSchema<T>>;
  unevaluatedProperties?: T["unevaluatedProperties"] extends true
    ? JsonSchema<T>
    : unknown;
  propertyNames?: T["propertyNames"] extends true
    ? Omit<JsonSchemaObject<T>, "type"> | boolean
    : unknown;
  maxProperties?: number;
  minProperties?: number;

  // object conditionals
  dependencies?: Record<
    string,
    | (T["nonEmptyDependencies"] extends true
        ? NonEmptyArray<string>
        : string[])
    | JsonSchema<T>
  >;
  dependentRequired?: T["dependentRequiredAndSchemas"] extends true
    ? Record<string, Array<string>>
    : unknown;
  dependentSchemas?: T["dependentRequiredAndSchemas"] extends true
    ? Record<string, JsonSchema<T>>
    : unknown;

  // arrays:
  items?: T["prefixItems"] extends true
    ? JsonSchema<T>
    : JsonSchema<T> | Array<JsonSchema<T>>;
  prefixItems?: T["prefixItems"] extends true ? Array<JsonSchema<T>> : unknown;
  additionalItems?: JsonSchema<T, true>;
  unevaluatedItems?: T["unevaluatedItems"] extends true
    ? JsonSchema<T>
    : unknown;
  contains?: T["contains"] extends true ? JsonSchema<T> : unknown;
  minContains?: T["minAndMaxContains"] extends true ? number : unknown;
  maxContains?: T["minAndMaxContains"] extends true ? number : unknown;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // factoring:
  anyOf?: Array<JsonSchema<T>>;
  oneOf?: Array<JsonSchema<T>>;
  allOf?: Array<JsonSchema<T>>;

  // conditionals
  if?: JsonSchema<T>;
  then?: JsonSchema<T>;
  else?: JsonSchema<T>;
  not?: JsonSchema<T>;

  // annotations
  $schema?: T["$schema"];
  $vocabulary?: T["$vocabulary"] extends true ? string : unknown;
  title?: string;
  description?: string;
  default?: Json;
  examples?: T["examples"] extends true ? Array<Json> : unknown;
  deprecated?: T["deprecated"] extends true ? boolean : unknown;
  readOnly?: T["readAndWriteOnly"] extends true ? boolean : unknown;
  writeOnly?: T["readAndWriteOnly"] extends true ? boolean : unknown;
  $comment?: T["$comment"] extends true ? string : unknown;

  // constants
  enum?: T["nonEmptyEnum"] extends true ? NonEmptyArray<Json> : Json[];
  const?: T["const"] extends true ? Json : unknown;

  // structuring
  $anchor?: T["$anchor"] extends true ? string : unknown;
  $ref?: string;
  $recursiveAnchor?: T["$recursiveAnchorAndRef"] extends true
    ? string
    : unknown;
  $recursiveRef?: T["$recursiveAnchorAndRef"] extends true ? string : unknown;
  $dynamicAnchor?: T["$dynamicAnchorAndRef"] extends true ? string : unknown;
  $dynamicRef?: T["$dynamicAnchorAndRef"] extends true ? string : unknown;
};

/* Represents a single valid value of the "type" keyword in a Json Schema */
export type JsonSchemaType<Settings extends JsonSchemaSettings> =
  LooseStringLiteral<
    | "string"
    | "number"
    | "object"
    | "array"
    | "boolean"
    | (Settings["nullType"] extends true ? "null" : never)
    | (Settings["integerType"] extends true ? "integer" : never)
  >;
