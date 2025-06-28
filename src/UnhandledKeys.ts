import { type JsonSchemaKeyword, type JsonSchemaPath } from "./JsonSchema.ts";
import { type LooseStringLiteral } from "./utils/UtilityTypes.ts";

export type UnhandledKeyReason = "conflict" | "disallowed";
export type UnhandledKeysMap = Map<JsonSchemaPath, UnhandledKeyReason>;
export type HandledKeysSet = Set<LooseStringLiteral<JsonSchemaKeyword>>;

export type UnhandledKeysOption =
  | "ignore"
  | "warn"
  | "throw"
  | UnhandledKeysMap
  | ((unhandledKeys: UnhandledKeysMap) => void);

/** @internal */
export function getUnhandledKeysMap(
  option: UnhandledKeysOption,
): UnhandledKeysMap {
  if (typeof option === "object") {
    return option;
  }

  return new Map();
}

/** @internal */
export function handleUnhandledKeysMap(
  option: UnhandledKeysOption,
  map: UnhandledKeysMap,
) {
  if (map.size) {
    if (option === "throw") {
      const pathsAndReasons = Array.from(
        map,
        ([path, reason]) =>
          `${path.reduce(
            (acc, curr) =>
              typeof curr === "number"
                ? `${acc}[${curr}]`
                : acc
                  ? `${acc}.${curr}`
                  : curr,
            "",
          )}: ${reason}`,
      ).join("\n");

      throw new Error(`Unhandled keys:\n${pathsAndReasons}`);
    } else if (option === "warn") {
      console.warn("Unhandled keys:", map);
    } else if (typeof option === "function") {
      option(map);
    } else if (option !== "ignore") {
      throw new Error(`Unknown unhandledKeys type: ${option}`);
    }
  }
}
