// deno-lint-ignore ban-types
export type LooseStringLiteral<T extends string> = T | (string & {});

export type NonEmptyArray<T> = [T, ...T[]];

export function isNonEmptyArray<T>(arr: T[]): arr is NonEmptyArray<T> {
  return arr.length > 0;
}

export type EmptyObject = Record<PropertyKey, never>;

export type IsLiteralString<T> = T extends string
  ? "" extends T
    ? "X" extends T
      ? false
      : true
    : true
  : false;

export type LiteralStringOrNever<T> =
  IsLiteralString<T> extends true ? T : never;

export type All<T extends boolean[]> = T extends true[] ? true : false;

export type If<Condition, Then, Else = unknown> = Condition extends true
  ? Then
  : Else;

/** Asserts that the the passed object...
 * 1. contains all of the provided keys
 * 2. (optionally) contains no other keys.
 */
export const hasKeys = <WithKey extends PropertyKey | never = never>(
  object: object,
  withKeys: WithKey[],
  exactKeys?: boolean,
): object is {
  [Key in WithKey]: unknown;
} => {
  const keys: PropertyKey[] = Object.keys(object);

  if (exactKeys && keys.length !== withKeys.length) {
    return false;
  }

  return withKeys.every((key) => keys.includes(key));
};

/** Asserts that the passed value...
 * 1. is an object
 * 2. is not null
 * 3. contains all of the provided keys
 * 4. (optionally) contains no other keys.
 */
export const isObject = <WithKey extends PropertyKey | never = never>(
  object: unknown,
  withKeys?: WithKey[],
  exactKeys?: boolean,
): object is {
  [Key in WithKey]: unknown;
} => {
  if (typeof object !== "object" || object === null) {
    return false;
  }

  if (withKeys === undefined) {
    return true;
  }

  return hasKeys(object, withKeys, exactKeys);
};
