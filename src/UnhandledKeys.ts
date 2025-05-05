import { JsonSchemaKeyword, JsonSchemaPath } from "./JsonSchema.ts";
import { LooseStringLiteral } from "./utils.ts";

export type UnhandledKeyReason = "conflict" | "disallowed";
export type UnhandledKeysMap = Map<JsonSchemaPath, UnhandledKeyReason>;
export type HandledKeysSet = Set<LooseStringLiteral<JsonSchemaKeyword>>;
