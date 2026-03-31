import { type JsonSchemaPath } from "../types/JsonSchema.ts";

export type DroppedKeysMap = Map<JsonSchemaPath, string>;

export type DroppedKeysOption =
  | "ignore"
  | "warn"
  | "throw"
  | DroppedKeysMap
  | ((droppedKeys: DroppedKeysMap) => void);

/** @internal */
export function getDroppedKeysMap(option: DroppedKeysOption): DroppedKeysMap {
  if (typeof option === "object") {
    return option;
  }

  return new Map();
}

/** @internal */
export function handleDroppedKeysMap(
  option: DroppedKeysOption,
  map: DroppedKeysMap,
) {
  if (map.size) {
    if (option === "throw") {
      const pathsAndKeys = Array.from(
        map,
        ([path, keyword]) =>
          `${path.reduce(
            (acc, curr) =>
              typeof curr === "number"
                ? `${acc}[${curr}]`
                : acc
                  ? `${acc}.${curr}`
                  : curr,
            "",
          )}: ${keyword}`,
      ).join("\n");

      throw new Error(`Dropped keys:\n${pathsAndKeys}`);
    } else if (option === "warn") {
      console.warn("Dropped keys:", map);
    } else if (typeof option === "function") {
      option(map);
    } else if (typeof option === "object") {
      // Map was passed directly — entries are already in it
    } else if (option !== "ignore") {
      throw new Error(`Unknown droppedKeys type: ${option}`);
    }
  }
}
