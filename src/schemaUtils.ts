import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { EmptyObject, isObject, hasKeys } from "./utils.ts";

export type AnySchema<T extends JsonSchemaSpecification> =
  T["verboseNot"] extends true
    ? T["singleType"] extends true
      ? T["anyOf"] extends true
        ? { anyOf: { type: T["type"][number] }[] }
        : T["oneOf"] extends true
          ? { oneOf: { type: T["type"][number] }[] }
          : EmptyObject
      : { type: T["type"][number][] }
    : EmptyObject;

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
export const isAnySchema = <T extends JsonSchemaSpecification>(
  schema: unknown,
  specification: T,
): schema is true | AnySchema<T> => {
  if (schema === true) {
    return true;
  }

  if (!isObject(schema)) {
    return false;
  }

  if (Object.keys(schema).length === 0) {
    return true;
  }

  if (isAnySchemaByType(schema, specification)) {
    return true;
  }

  if (isAnySchemaByXOf(schema, specification, "anyOf")) {
    return true;
  }

  if (isAnySchemaByXOf(schema, specification, "oneOf")) {
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
export const isNeverSchema = <T extends JsonSchemaSpecification>(
  schema: unknown,
  specification: T,
): schema is false | { not: AnySchema<T> } => {
  if (schema === false) {
    return true;
  }

  if (!isObject(schema, ["not"], true)) {
    return false;
  }

  return isAnySchema(schema.not, specification);
};
const isAnySchemaByType = <T extends JsonSchemaSpecification>(
  schema: object,
  specification: T,
): boolean => {
  if (!hasKeys(schema, ["type"], true)) {
    return false;
  }

  const types = Array.isArray(schema.type) ? schema.type : [schema.type];

  return specification.type.every((type) => types.includes(type));
};
const isAnySchemaByXOf = <T extends JsonSchemaSpecification>(
  schema: object,
  specification: T,
  key: "anyOf" | "oneOf",
): boolean => {
  if (!specification[key]) {
    return false;
  }

  if (!hasKeys(schema, [key], true)) {
    return false;
  }

  const value = (schema as Record<typeof key, unknown>)[key];

  if (!Array.isArray(value)) {
    return false;
  }

  const types = value.map(
    (subSchema) =>
      isObject(subSchema, ["type"], true) &&
      typeof subSchema.type === "string" &&
      subSchema.type,
  );

  return specification.type.every((type) => types.includes(type));
};
