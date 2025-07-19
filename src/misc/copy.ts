import { Json } from "../types/Json.ts";

export type CopyFn = <T = Json>(value: T) => T;
export type CopyOption = "shallow" | "stringifyAndParse" | CopyFn;

export const copy = <T,>(option: CopyOption, value: T): T => {
  const copyFn: CopyFn | undefined =
    typeof option === "function"
      ? option
      : option === "shallow"
        ? (json) => json
        : option === "stringifyAndParse"
          ? (json) => JSON.parse(JSON.stringify(json))
          : undefined;

  if (!copyFn) {
    throw new Error(`Unknown copy type: ${option}`);
  }

  return copyFn(value);
};
