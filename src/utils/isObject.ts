import { hasKeys } from "./hasKeys.ts";

/** Asserts that the passed value...
 * 1. is an object
 * 2. is not null
 * 3. (optionally) contains all of the provided keys
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
