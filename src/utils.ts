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

/** Derive a type from an object type where all
 * `true` literal values have been flipped to
 * `false` and vise versa.
 *
 * All values of other types than `true` or `false` are dropped.
 *
 * @example
 * ```typescript
 * ({ foo: true, bar: 123 }) satisfies ToggleBooleanValues<{ foo: false }>
 * ```
 */
export type ToggledBooleanLiterals<Object extends object> = {
  [Key in KeysWithExactValue<Object, true>]: false;
} & {
  [Key in KeysWithExactValue<Object, false>]: true;
};

type KeysWithExactValue<Object extends object, Value> = {
  [Key in keyof Object]: Object[Key] extends Value
    ? Value extends Object[Key]
      ? Key
      : never
    : never;
}[keyof Object];

/** Replace the value type of one or more properties
 * of an object type.
 *
 *@example
 * ```typescript
 * ({ foo: true, bar: 123 }) satisfies Replace<
 *   { foo: string; bar: number },
 *   { foo: boolean }
 * >;
 * ```
 */
export type Replace<
  Source extends Base,
  Target extends Partial<Base>,
  Base extends object = { [Key in keyof Source]: unknown },
> = {
  [Key in keyof Base]: Target[Key] extends Base[Key]
    ? Target[Key]
    : Source[Key];
};

export function replace<
  Source extends object,
  Target extends { [Key in keyof Source]?: unknown },
>(source: Source, target: Target): Replace<Source, Target> {
  return Object.keys(source).reduce(
    (acc: Record<PropertyKey, unknown>, key) => {
      if (key in target) {
        acc[key] = target[key as keyof Target];
      } else {
        acc[key] = source[key as keyof Source];
      }

      return acc;
    },
    {},
  ) as Replace<Source, Target>;
}
