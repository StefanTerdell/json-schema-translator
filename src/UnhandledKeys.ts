import { type JsonSchemaKeyword, type JsonSchemaPath } from "./JsonSchema.ts";
import { type LooseStringLiteral } from "./utils.ts";

export type UnhandledKeyReason = "conflict" | "disallowed";
export type UnhandledKeysMap = Map<JsonSchemaPath, UnhandledKeyReason>;
export type HandledKeysSet = Set<LooseStringLiteral<JsonSchemaKeyword>>;
