import { JsonObject } from "../../types/Json.ts";
import { Mutator } from "../Mutator.ts";

export const translateId: Mutator = (ctx) => {
  if (typeof ctx.from.specification.$id === "string") {
    const id = (ctx.from.schema as JsonObject)[ctx.from.specification.$id];

    if (
      id !== undefined &&
      typeof id === "string" &&
      typeof ctx.into.specification.$id === "string"
    ) {
      // @ts-expect-error ISSUE: Narrowing breaks down across generics
      ctx.into.schema[ctx.into.specification.$id] = id;
    }

    ctx.handledKeys.add(ctx.from.specification.$id);
  }
};
