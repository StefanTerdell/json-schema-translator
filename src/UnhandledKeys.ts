import { JsonSchemaPath } from "./JsonSchema.ts";

export type UnhandledKeyReason = "conflict" | "disallowed";
export type UnhandledKeysMap = Map<JsonSchemaPath, UnhandledKeyReason>;
