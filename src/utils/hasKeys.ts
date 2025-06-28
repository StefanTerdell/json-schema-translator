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
