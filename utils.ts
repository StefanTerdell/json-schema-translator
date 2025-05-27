import { JsonSchema } from "./JsonSchema.ts";
import { JsonSchemaSettings } from "./JsonSchemaSettings.ts";

// deno-lint-ignore ban-types
export type LooseStringLiteral<T extends string> = T | (string & {});

export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

export type EmptyObject = Record<PropertyKey, never>;

export type Replace<
  T extends object,
  O extends { [Key in keyof T]?: unknown },
> = {
  [Key in keyof T]: Key extends keyof O ? O[Key] : T[Key];
};

/** Returns true if the passed value is JSON Schema object that either has:
 * - `"type": "null"`
 * - an array of allowed types including `"null"`
 * - `"nullable": true`
 */
export const isExplicitlyNullableSchema = <Settings extends JsonSchemaSettings>(
  schema: JsonSchema<Settings>,
): boolean => {
  return (
    typeof schema === "object" &&
    (schema.type === "null" ||
      (Array.isArray(schema.type) && schema.type.includes("null")) ||
      schema.nullable === true)
  );
};

/** Returns true if the passed value represents a JSON Schema that:
 * 1. Permits any value
 * 2. Contains no annotations
 *
 * In other words, the function checks if the schema is one of:
 * - `true`
 * - `{}`
 */
export const isAnySchema = (schema: unknown): schema is true | EmptyObject => {
  return (
    schema === true ||
    (typeof schema === "object" &&
      schema !== null &&
      Object.keys(schema).length === 0)
  );
};

/** Returns true if the passed value represents a JSON Schema that:
 * 1. Permits no values at all
 * 2. Contains no annotations
 *
 * In other words, the function checks if the schema is one of:
 * - `false`
 * - `{ "not": true }`
 * - `{ "not": {} }`
 */
export const isNeverSchema = (
  schema: unknown,
): schema is false | { not: EmptyObject } => {
  return (
    schema === false ||
    (typeof schema === "object" &&
      schema !== null &&
      Object.keys(schema).length === 1 &&
      "not" in schema &&
      isAnySchema(schema.not))
  );
};
