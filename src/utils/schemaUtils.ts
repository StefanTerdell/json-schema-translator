import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { Replace } from "./UtilityTypes.ts";
import { isObject } from "./isObject.ts";
import { hasKeys } from "./hasKeys.ts";
import { matchDeep } from "./matchDeep.ts";
import { Pair } from "../translators/Pair.ts";
import { matchPair } from "./pairUtils.ts";

export type Respecify<
  Source extends JsonSchemaSpecification,
  Target extends Partial<JsonSchemaSpecification>,
> = Replace<Source, Target, JsonSchemaSpecification>;

export type Specify<Target extends Partial<JsonSchemaSpecification>> =
  Respecify<JsonSchemaSpecification, Target>;

// export type AnySchema<T extends JsonSchemaSpecification> =
//   T["verboseNot"] extends true
//     ? T["singleType"] extends true
//       ? T["anyOf"] extends true
//         ? { anyOf: { type: T["type"][number] }[] }
//         : T["oneOf"] extends true
//           ? { oneOf: { type: T["type"][number] }[] }
//           : EmptyObject
//       : { type: T["type"][number][] }
//     : EmptyObject;

/** Returns true if the passed value represents a JSON Schema that:
 * 1. Permits any value
 * 2. Contains no annotations
 *
 * In other words, the function checks if the schema is one of:
 * - `true`
 * - `{}`
 *
 * Or, given the specification permits it:
 * - `{ "type": [ ... ] }`
 * - `{ "anyOf": [ { "type": ... }, { "type": ... }, ... ] }`
 * - `{ "oneOf": [ { "type": ... }, { "type": ... }, ... ] }`
 */
export const isAnySchema = <
  T extends JsonSchemaSpecification,
  KeywordObject extends boolean,
>(
  pair: Pair<T, KeywordObject>,
): boolean => {
  if (pair.specification.forceAnySchema !== undefined) {
    if (matchDeep(pair.schema, pair.specification.forceAnySchema)) {
      return true;
    }
  }

  if (pair.schema === true) {
    return true;
  }

  if (!isObject(pair.schema)) {
    return false;
  }

  if (Object.keys(pair.schema).length === 0) {
    return true;
  }

  if (isAnySchemaByType(pair)) {
    return true;
  }

  if (isAnySchemaByXOf(pair, "anyOf")) {
    return true;
  }

  if (isAnySchemaByXOf(pair, "oneOf")) {
    return true;
  }

  return false;
};

/** Returns true if the passed value represents a JSON Schema that:
 * 1. Permits no values at all
 * 2. Contains no annotations
 *
 * In other words, the function checks if the schema is one of:
 * - `false`
 * - `{ "not": true }`
 * - `{ "not": {} }`
 *
 * Or, given the specification permits it:
 * - `{ "not": { "type": [ ... ] } }`
 * - `{ "not": { "anyOf": [ { "type": ... }, { "type": ... }, ... ] } }`
 * - `{ "not": { "oneOf": [ { "type": ... }, { "type": ... }, ... ] } }`
 */
export const isNeverSchema = <Spec extends JsonSchemaSpecification>(
  pair: Pair<Spec, boolean>,
): boolean => {
  if (pair.schema === false) {
    return true;
  }

  if (typeof pair.schema !== "object" || pair.schema.not === undefined) {
    return false;
  }

  let result = false;

  matchPair(
    pair,
    { not: true },
    {
      true(pair) {
        result =
          pair.schema.not !== undefined &&
          isAnySchema({
            ...pair,
            schema: pair.schema.not,
          });
      },
    },
  );

  return result;
};

const isAnySchemaByType = <
  Spec extends JsonSchemaSpecification,
  KeywordObject extends boolean,
>(
  pair: Pair<Spec, KeywordObject>,
): boolean => {
  if (typeof pair.schema === "boolean") {
    return false;
  }

  if (!hasKeys(pair.schema, ["type"], true)) {
    return false;
  }

  const types = Array.isArray(pair.schema.type)
    ? pair.schema.type
    : [pair.schema.type];

  return pair.specification.type.every((type) => types.includes(type));
};

const isAnySchemaByXOf = <
  T extends JsonSchemaSpecification,
  KeywordObject extends boolean,
>(
  pair: Pair<T, KeywordObject>,
  key: "anyOf" | "oneOf",
): boolean => {
  if (typeof pair.schema === "boolean") {
    return false;
  }

  if (!pair.specification[key]) {
    return false;
  }

  if (!hasKeys(pair.schema, [key], true)) {
    return false;
  }

  const value = (pair.schema as Record<typeof key, unknown>)[key];

  if (!Array.isArray(value)) {
    return false;
  }

  const types = value.map(
    (subSchema) =>
      isObject(subSchema, ["type"], true) &&
      typeof subSchema.type === "string" &&
      subSchema.type,
  );

  return pair.specification.type.every((type) => types.includes(type));
};

export const isNullableSchema = (schema: unknown, checkUnions?: boolean) => {
  if (schema === true) {
    return true;
  }

  if (!isObject(schema)) {
    return false;
  }

  if ("nullable" in schema && schema.nullable === true) {
    return true;
  }

  if (checkUnions) {
    if (
      "anyOf" in schema &&
      Array.isArray(schema.anyOf) &&
      schema.anyOf.some((schema) => isNullableSchema(schema, true))
    ) {
      return true;
    }

    if (
      "oneOf" in schema &&
      Array.isArray(schema.oneOf) &&
      schema.oneOf.some((schema) => isNullableSchema(schema, true))
    ) {
      return true;
    }
  }

  return false;
};

export const schemaHasType = (
  schema: unknown,
  type: JsonSchemaSpecification["type"][number],
  checkUnions?: boolean,
): boolean => {
  if (schema === true) {
    return true;
  }

  if (!isObject(schema)) {
    return false;
  }

  if ("type" in schema) {
    if (schema.type === type) {
      return true;
    }

    if (Array.isArray(schema.type) && schema.type.includes(type)) {
      return true;
    }
  }

  if (checkUnions) {
    if (
      "anyOf" in schema &&
      Array.isArray(schema.anyOf) &&
      schema.anyOf.some((schema) => schemaHasType(schema, type, true))
    ) {
      return true;
    }

    if (
      "oneOf" in schema &&
      Array.isArray(schema.oneOf) &&
      schema.oneOf.some((schema) => schemaHasType(schema, type, true))
    ) {
      return true;
    }
  }

  return false;
};
