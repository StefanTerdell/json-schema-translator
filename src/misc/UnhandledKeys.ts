import {
  type JsonSchemaKeyword,
  type JsonSchemaPath,
} from "../types/JsonSchema.ts";
import { type LooseStringLiteral } from "../types/UtilityTypes.ts";

export type UnhandledKeyReason = "conflict" | "disallowed";

export type UnhandledKeyEntry = {
  keyword: string;
  value: unknown;
  reason: UnhandledKeyReason;
};

export type UnhandledKeysMap = Map<JsonSchemaPath, UnhandledKeyEntry>;
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
      const lines = Array.from(
        map,
        ([path, { keyword, reason }]) =>
          `${path.reduce(
            (acc, curr) =>
              typeof curr === "number"
                ? `${acc}[${curr}]`
                : acc
                  ? `${acc}.${curr}`
                  : curr,
            "",
          )}: ${keyword} (${reason})`,
      ).join("\n");

      throw new Error(`Unhandled keys:\n${lines}`);
    } else if (option === "warn") {
      console.warn("Unhandled keys:", map);
    } else if (typeof option === "function") {
      option(map);
    } else if (option !== "ignore") {
      throw new Error(`Unknown unhandledKeys type: ${option}`);
    }
  }
}
