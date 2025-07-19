import { Json } from "../types/Json.ts";

export type CopyFn = <T = Json>(value: T) => T;
export type CopyOption = "shallow" | "stringifyAndParse" | CopyFn;

export const getCopyFn = (option: CopyOption): CopyFn => {
  if (typeof option === "function") {
    return option;
  }

  if (option === "shallow") {
    return (x) =>
      Array.isArray(x)
        ? ([...x] as typeof x)
        : typeof x === "object" && x !== null
          ? { ...x }
          : x;
  }

  if (option === "stringifyAndParse") {
    return (x) => JSON.parse(JSON.stringify(x));
  }

  throw new Error(`Unknown copy option: ${option}`);
};

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
