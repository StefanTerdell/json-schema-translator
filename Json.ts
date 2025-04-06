export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [Key in string]?: Json };
export type Json = JsonPrimitive | JsonArray | JsonObject;
