// deno-lint-ignore ban-types
export type LooseStringLiteral<T extends string> = T | (string & {});

export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

export type EmptyObject = Record<PropertyKey, never>;

export type IsLiteral<T extends string> = "" extends T
  ? "X" extends T
    ? false
    : true
  : true;

export type LiteralOrNever<T extends string> =
  IsLiteral<T> extends true ? T : never;

export type All<T extends boolean[]> = T extends true[] ? true : false;

export type If<
  Condition extends boolean,
  Then,
  Else = unknown,
> = Condition extends true ? Then : Else;

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
