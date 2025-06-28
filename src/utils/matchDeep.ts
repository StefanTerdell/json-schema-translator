/**
 * Returns true if...
 * - both values are the same,
 * - both are objects and B contains only a subset of deeply matching properties of A
 * - both are arrays and all of B's items are deeply matching A's items
 */
export function matchDeep(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a === "object") {
    if (typeof b !== "object") {
      return false;
    }

    if (a === null || b === null) {
      return false;
    }

    if (
      a instanceof Date ||
      a instanceof String ||
      a instanceof Number ||
      a instanceof Boolean
    ) {
      // Some shenanigans are needed if the values are one of the weird built-in constructors
      return b instanceof a.constructor && a <= b && a >= b;
    }

    if (a instanceof RegExp) {
      return (
        b instanceof RegExp && a.source === b.source && a.flags === b.flags
      );
    }

    if (Array.isArray(a)) {
      if (!Array.isArray(b)) {
        return false;
      }

      return b.every((item, index) => matchDeep(a[index], item));
    }

    const otherKeys = Object.keys(b);

    return otherKeys.every(
      (key) =>
        key in a &&
        matchDeep(a[key as keyof typeof a], b[key as keyof typeof b]),
    );
  }

  if (typeof a === "function") {
    return typeof b === "function" && a.toString() === b.toString();
  }

  return false;
}
