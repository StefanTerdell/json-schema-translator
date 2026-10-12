import { type Json, type JsonObject } from "./Json.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import {
  type All,
  type EmptyObject,
  type If,
  type IsLiteralString,
  type LiteralStringOrNever,
  type LooseStringLiteral,
  type NonEmptyArray,
} from "./UtilityTypes.ts";

/** Represents a JsonSchema as defined by the provided JsonSchemaSpecification. Depending on the settings and specific keyword this can either be a JsonSchemaObject or a boolean */
export type JsonSchema<
  Spec extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean = false,
> =
  | JsonSchemaObject<Spec>
  | (Spec["booleanSchemas"] extends true ? boolean : never)
  | (ForceAllowBooleanSchema extends true ? boolean : never)
  | (Spec["typeSchemas"] extends true ? JsonSchemaType<Spec> : never);

export type JsonSchemaPathItem = LooseStringLiteral<JsonSchemaKeyword> | number;

export type JsonSchemaPath = JsonSchemaPathItem[];

/** This type serves two purposes:
 * 1: Dynamically set the expected types of the keywords defined in the `$id` and `$defs` options
 * 2: Allow (or forbid) arbitrary values for unspecified keywords based on the `arbitraryJson` option
 */
export type JsonSchemaObject<Spec extends JsonSchemaSpecification> =
  JsonSchemaKeywordsObject<Spec> &
    (Spec["arbitraryJson"] extends true ? JsonObject : unknown);

/* All keywords defined from a in a JsonSchemaKeywordsObject based on a given JsonSchemaSpecification */
export type JsonSchemaKeyword<
  Spec extends JsonSchemaSpecification = JsonSchemaSpecification,
> =
  | LiteralStringOrNever<Spec["$id"]>
  | LiteralStringOrNever<Spec["$defs"]>
  | keyof JsonSchemaStaticKeywordsObject<Spec>;

export type JsonSchemaKeywordsObject<Spec extends JsonSchemaSpecification> = If<
  All<[IsLiteralString<Spec["$id"]>, IsLiteralString<Spec["$defs"]>]>,
  JsonSchemaDynamicKeywordsObject<Spec> & JsonSchemaStaticKeywordsObject<Spec>,
  JsonSchemaStaticKeywordsObject<Spec>
>;

export type JsonSchemaDynamicKeywordsObject<
  Spec extends JsonSchemaSpecification,
> = Spec["$id"] extends string
  ? Spec["$defs"] extends string
    ? {
        [Key in Spec["$defs"] | Spec["$id"]]?: Key extends Spec["$defs"]
          ? { [Key in string]: JsonSchema<Spec> }
          : Key extends Spec["$id"]
            ? string
            : unknown;
      }
    : {
        [Key in Spec["$id"]]?: string;
      }
  : Spec["$defs"] extends string
    ? {
        [Key in Spec["$defs"]]?: { [Key in string]: JsonSchema<Spec> };
      }
    : EmptyObject;

/** Represents a JsonSchema object as defined by the provided JsonSchemaSpecification with no arbitrary keys allowed */
export type JsonSchemaStaticKeywordsObject<
  Spec extends JsonSchemaSpecification,
> = {
  // type
  type?: If<
    Spec["singleType"],
    JsonSchemaType<Spec>,
    JsonSchemaType<Spec> | Array<JsonSchemaType<Spec>>
  >;
  nullable?: If<Spec["nullable"], boolean>;

  // strings:
  minLength?: If<Spec["minLength"], number>;
  maxLength?: If<Spec["maxLength"], number>;
  pattern?: If<Spec["pattern"], string>;
  format?: Spec["format"] extends true
    ? string
    : Spec["format"] extends (infer Format extends string)[]
      ? Spec["strictFormats"] extends true
        ? Format
        : LooseStringLiteral<Format>
      : unknown;

  // string content
  contentEncoding?: If<
    Spec["contentEncoding"],
    LooseStringLiteral<"quoted-printable" | "base16" | "base32" | "base64">
  >;
  contentMediaType?: If<Spec["contentMediaType"], string>;
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
  minimum?: If<Spec["minimum"], number>;
  exclusiveMinimum?: If<
    Spec["minimum"],
    If<
      Spec["exclusiveMinimum"],
      number,
      If<Spec["exclusiveMinimum"] extends "boolean" ? true : false, boolean>
    >
  >;
  maximum?: If<Spec["maximum"], number>;
  exclusiveMaximum?: If<
    Spec["maximum"],
    If<
      Spec["exclusiveMaximum"],
      number,
      If<Spec["exclusiveMaximum"] extends "boolean" ? true : false, boolean>
    >
  >;

  // objects:
  required?: If<Spec["nonEmptyRequired"], NonEmptyArray<string>, string[]>;
  properties?: Record<string, JsonSchema<Spec>>;
  additionalProperties?: If<
    Spec["additionalProperties"],
    JsonSchema<Spec, true>,
    Spec["forceAdditionalProperties"] extends undefined
      ? unknown
      : Spec["forceAdditionalProperties"]
  >;
  patternProperties?: Record<string, JsonSchema<Spec>>;
  unevaluatedProperties?: If<
    Spec["unevaluatedProperties"],
    JsonSchema<Spec, true>
  >;
  propertyNames?: If<Spec["propertyNames"], JsonSchema<Spec, true>>;
  maxProperties?: If<Spec["maxProperties"], number>;
  minProperties?: If<Spec["minProperties"], number>;

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
    Spec["dependentRequired"],
    Record<string, Array<string>>
  >;
  dependentSchemas?: If<
    Spec["dependentSchemas"],
    Record<string, JsonSchema<Spec>>
  >;

  // arrays:
  items?: If<
    Spec["prefixItems"],
    JsonSchema<Spec, true>,
    If<
      Spec["singleItems"],
      JsonSchema<Spec>,
      JsonSchema<Spec> | Array<JsonSchema<Spec>>
    >
  >;
  prefixItems?: If<Spec["prefixItems"], Array<JsonSchema<Spec>>>;
  additionalItems?: If<Spec["additionalItems"], JsonSchema<Spec, true>>;
  unevaluatedItems?: If<Spec["unevaluatedItems"], JsonSchema<Spec>>;
  contains?: If<Spec["contains"], JsonSchema<Spec>>;
  minContains?: If<All<[Spec["contains"], Spec["minContains"]]>, number>;
  maxContains?: If<All<[Spec["contains"], Spec["maxContains"]]>, number>;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // factoring:
  anyOf?: If<Spec["anyOf"], Array<JsonSchema<Spec>>>;
  oneOf?: If<Spec["oneOf"], Array<JsonSchema<Spec>>>;
  allOf?: If<Spec["allOf"], Array<JsonSchema<Spec>>>;
  discriminator?: If<
    Spec["discriminator"],
    { propertyName: string; mapping?: { [key: string]: string } }
  >;

  // conditionals
  if?: If<Spec["if"], JsonSchema<Spec>>;
  then?: If<Spec["then"], JsonSchema<Spec>>;
  else?: If<Spec["else"], JsonSchema<Spec>>;
  not?: If<Spec["not"], JsonSchema<Spec>>;

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
  readOnly?: If<Spec["readOnly"], boolean>;
  writeOnly?: If<Spec["writeOnly"], boolean>;
  $comment?: If<Spec["$comment"], string>;

  // constants
  enum?: If<Spec["nonEmptyEnum"], NonEmptyArray<Json>, Json[]>;
  const?: If<Spec["const"], Json>;

  // structuring
  $anchor?: If<Spec["$anchor"], string>;
  $ref?: string;
  $recursiveRef?: If<Spec["$recursiveRef"], string>;
  $recursiveAnchor?: If<
    All<[Spec["$recursiveRef"], Spec["$recursiveAnchor"]]>,
    string
  >;
  $dynamicRef?: If<Spec["$dynamicRef"], string>;
  $dynamicAnchor?: If<
    All<[Spec["$dynamicRef"], Spec["$dynamicAnchor"]]>,
    string
  >;

  // de-facto standard extensions
  errorMessage?: Spec["errorMessage"] extends "ajv"
    ? AjvErrorMessages
    : unknown;
  propertyOrdering?: If<Spec["propertyOrdering"], string[]>;
  markdownDescription?: string;
};

export type AjvErrorMessages = {
  [Key in LooseStringLiteral<JsonSchemaKeyword | "_">]:
    AjvErrorMessages | string;
};

/* Represents a single value of the `type` keyword in a Json Schema, optionally strict based on the `strictTypes` option */
export type JsonSchemaType<Spec extends JsonSchemaSpecification> = If<
  Spec["strictTypes"],
  Spec["type"][number],
  LooseStringLiteral<Spec["type"][number]>
>;

// /* Represents a single validated value of the `type` keyword in a Json Schema */
// export type JsonSchemaValidType<Spec extends JsonSchemaSpecification> =
//   | "string"
//   | "number"
//   | "object"
//   | "array"
//   | "boolean"
//   | If<Spec["null"], "null", never>
//   | If<Spec["integer"], "integer", never>;
