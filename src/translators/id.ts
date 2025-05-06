import { type JsonObject } from "../Json.ts";
import { type Mutator } from "./Mutator.ts";

export const translateIdKeyword: Mutator = (ctx) => {
  if (typeof ctx.input.settings.$id === "string") {
    const id = (ctx.input.schema as JsonObject)[ctx.input.settings.$id];

    if (
      id !== undefined &&
      typeof id === "string" &&
      typeof ctx.output.settings.$id === "string"
    ) {
      // @ts-expect-error ISSUE: Narrowing breaks down across generics
      ctx.output.schema[ctx.output.settings.$id] = id;
    }

    ctx.handledKeys.add(ctx.input.settings.$id);
  }
};
