import { type JsonObject } from "../Json.ts";
import { type Mutator } from "./Mutator.ts";

export const translateIdKeyword: Mutator = (ctx) => {
  if (typeof ctx.from.settings.$id === "string") {
    const id = (ctx.from.schema as JsonObject)[ctx.from.settings.$id];

    if (
      id !== undefined &&
      typeof id === "string" &&
      typeof ctx.into.settings.$id === "string"
    ) {
      // @ts-expect-error ISSUE: Narrowing breaks down across generics
      ctx.into.schema[ctx.into.settings.$id] = id;
    }

    ctx.handledKeys.add(ctx.from.settings.$id);
  }
};
