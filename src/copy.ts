import {
  type CopyFn,
  type TranslateJsonSchemaOptions,
} from "./translateJsonSchema.ts";

export const copy = <T,>(ctx: TranslateJsonSchemaOptions, value: T): T => {
  const copyFn: CopyFn | undefined =
    typeof ctx.copyJson === "function"
      ? ctx.copyJson
      : ctx.copyJson === "shallow"
        ? (json) => json
        : ctx.copyJson === "stringifyAndParse"
          ? (json) => JSON.parse(JSON.stringify(json))
          : undefined;

  if (!copyFn) {
    throw new Error(`Unknown copyJson option: ${ctx.copyJson}`);
  }

  return copyFn(value);
};
