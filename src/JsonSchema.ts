import { type Json, type JsonObject } from "./Json.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import {
  type All,
  type If,
  type IsLiteral,
  type LiteralOrNever,
  type LooseStringLiteral,
  type NonEmptyArray,
} from "./utils.ts";

/** Represents a JsonSchema as defined by the provided JsonSchemaSpecification. Depending on the settings and specific keyword this can either be a JsonSchemaObject or a boolean */
export type JsonSchema<
  Spec extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean = false,
> =
  | JsonSchemaObject<Spec>
  | (Spec["booleanSchemas"] extends true ? boolean : never)
  | (ForceAllowBooleanSchema extends true ? boolean : never);

export type JsonSchemaPathItem = LooseStringLiteral<JsonSchemaKeyword> | number;

export type JsonSchemaPath = JsonSchemaPathItem[];

/** This type serves two purposes:
 * 1: Dynamically set the expected types of the keywords defined in the `$idPath` and `$defsPath` options
 * 2: Allow (or forbid) arbitrary values for unspecified keywords based on the `allowJson` option
 */
export type JsonSchemaObject<Spec extends JsonSchemaSpecification> =
  JsonSchemaKeywordsObject<Spec> &
    (Spec["allowJson"] extends true ? JsonObject : unknown);

/* All keywords defined from a in a JsonSchemaKeywordsObject based on a given JsonSchemaSpecification */
export type JsonSchemaKeyword<
  Spec extends JsonSchemaSpecification = JsonSchemaSpecification,
> =
  | LiteralOrNever<Spec["$idPath"]>
  | LiteralOrNever<Spec["$defsPath"]>
  | keyof JsonSchemaStaticKeywordsObject<Spec>;

export type JsonSchemaKeywordsObject<Spec extends JsonSchemaSpecification> = If<
  All<[IsLiteral<Spec["$idPath"]>, IsLiteral<Spec["$defsPath"]>]>,
  JsonSchemaDynamicKeywordsObject<Spec> & JsonSchemaStaticKeywordsObject<Spec>,
  JsonSchemaStaticKeywordsObject<Spec>
>;

export type JsonSchemaDynamicKeywordsObject<
  Spec extends JsonSchemaSpecification,
> = {
  [Key in Spec["$defsPath"] | Spec["$idPath"]]?: Key extends Spec["$defsPath"]
    ? { [Key in string]: JsonSchema<Spec> }
    : Key extends Spec["$idPath"]
      ? string
      : never;
};

/** Represents a JsonSchema object as defined by the provided JsonSchemaSpecification with no arbitrary keys allowed */
export type JsonSchemaStaticKeywordsObject<
  Spec extends JsonSchemaSpecification,
> = {
  // type
  type?: JsonSchemaType<Spec> | Array<JsonSchemaType<Spec>>;
  nullable?: If<Spec["nullable"], boolean>;

  // strings:
  minLength?: If<Spec["minAndMaxLength"], number>;
  maxLength?: If<Spec["minAndMaxLength"], number>;
  pattern?: If<Spec["pattern"], string>;
  format?: Spec["format"] extends true
    ? string
    : Spec["format"] extends (infer F extends string)[]
      ? LooseStringLiteral<F>
      : unknown;

  // string content
  contentEncoding?: If<
    Spec["contentMediaTypeAndEncoding"],
    LooseStringLiteral<"quoted-printable" | "base16" | "base32" | "base64">
  >;
  contentMediaType?: If<Spec["contentMediaTypeAndEncoding"], string>;
  contentSchema?: If<Spec["contentSchema"], JsonSchema<Spec>>;
  media?: If<
    Spec["media"],
    {
      binaryEncoding?: string;
      type?: string;
    }
  >;

  // numbers:
  multipleOf?: If<Spec["multipleOf"], number>;
  minimum?: If<Spec["minimumAndMaximum"], number>;
  maximum?: If<Spec["minimumAndMaximum"], number>;
  exclusiveMinimum?: Spec["exclusiveMinimumAndMaximum"] extends true
    ? number
    : Spec["exclusiveMinimumAndMaximum"] extends "boolean"
      ? boolean
      : unknown;
  exclusiveMaximum?: Spec["exclusiveMinimumAndMaximum"] extends true
    ? number
    : Spec["exclusiveMinimumAndMaximum"] extends "boolean"
      ? boolean
      : unknown;

  // objects:
  required?: If<Spec["nonEmptyRequired"], NonEmptyArray<string>, string[]>;
  properties?: Record<string, JsonSchema<Spec>>;
  additionalProperties?: If<
    Spec["additionalProperties"],
    Spec["forceAdditionalProperties"] extends undefined
      ? JsonSchema<Spec, true>
      : Spec["forceAdditionalProperties"]
  >;
  patternProperties?: Record<string, JsonSchema<Spec>>;
  unevaluatedProperties?: If<Spec["unevaluatedProperties"], JsonSchema<Spec>>;
  propertyNames?: If<
    Spec["propertyNames"],
    Omit<JsonSchemaObject<Spec>, "type"> | boolean
  >;
  maxProperties?: If<Spec["minAndMaxProperties"], number>;
  minProperties?: If<Spec["minAndMaxProperties"], number>;

  // object conditionals
  dependencies?: If<
    Spec["dependencies"],
    Record<
      string,
      | If<Spec["nonEmptyDependencies"], NonEmptyArray<string>, string[]>
      | JsonSchema<Spec>
    >
  >;
  dependentRequired?: If<
    All<[Spec["dependentRequiredAndSchemas"], Spec["dependencies"]]>,
    Record<string, Array<string>>
  >;
  dependentSchemas?: If<
    All<[Spec["dependentRequiredAndSchemas"], Spec["dependencies"]]>,
    Record<string, JsonSchema<Spec>>
  >;

  // arrays:
  items?: If<
    Spec["prefixItems"],
    JsonSchema<Spec>,
    JsonSchema<Spec> | Array<JsonSchema<Spec>>
  >;
  prefixItems?: If<Spec["prefixItems"], Array<JsonSchema<Spec>>>;
  additionalItems?: JsonSchema<Spec, true>;
  unevaluatedItems?: If<Spec["unevaluatedItems"], JsonSchema<Spec>>;
  contains?: If<Spec["contains"], JsonSchema<Spec>>;
  minContains?: If<Spec["minAndMaxContains"], number>;
  maxContains?: If<Spec["minAndMaxContains"], number>;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // factoring:
  anyOf?: Array<JsonSchema<Spec>>;
  oneOf?: Array<JsonSchema<Spec>>;
  allOf?: Array<JsonSchema<Spec>>;

  // conditionals
  if?: JsonSchema<Spec>;
  then?: JsonSchema<Spec>;
  else?: JsonSchema<Spec>;
  not?: JsonSchema<Spec>;

  // annotations
  $schema?: Spec["$schema"] extends string
    ? LooseStringLiteral<Spec["$schema"]>
    : unknown;
  $vocabulary?: If<Spec["$vocabulary"], string>;
  title?: string;
  description?: string;
  default?: Json;
  examples?: If<Spec["examples"], Array<Json>>;
  deprecated?: If<Spec["deprecated"], boolean>;
  readOnly?: If<Spec["readAndWriteOnly"], boolean>;
  writeOnly?: If<Spec["readAndWriteOnly"], boolean>;
  $comment?: If<Spec["$comment"], string>;

  // constants
  enum?: If<Spec["nonEmptyEnum"], NonEmptyArray<Json>, Json[]>;
  const?: If<Spec["const"], Json>;

  // structuring
  $anchor?: If<Spec["$anchor"], string>;
  $ref?: string;
  $recursiveAnchor?: If<Spec["$recursiveAnchorAndRef"], boolean>;
  $recursiveRef?: If<Spec["$recursiveAnchorAndRef"], string>;
  $dynamicAnchor?: If<Spec["$dynamicAnchorAndRef"], string>;
  $dynamicRef?: If<Spec["$dynamicAnchorAndRef"], string>;

  // de-facto standard extensions
  errorMessage?: Spec["errorMessages"] extends "ajv"
    ? AjvErrorMessages
    : unknown;
};

export type AjvErrorMessages = {
  [Key in LooseStringLiteral<JsonSchemaKeyword | "_">]:
    | AjvErrorMessages
    | string;
};

/* Represents a single valid value of the "type" keyword in a Json Schema */
export type JsonSchemaType<Spec extends JsonSchemaSpecification> =
  LooseStringLiteral<
    | "string"
    | "number"
    | "object"
    | "array"
    | "boolean"
    | If<Spec["nullType"], "null", never>
    | If<Spec["integerType"], "integer", never>
  >;
