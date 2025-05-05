import { type JsonObject } from "../Json.ts";
import { type Mutator } from "./Mutator.ts";

export const translateIdKeyword: Mutator = (ctx) => {
  const id = (ctx.input.schema as JsonObject)[ctx.input.settings.$idPath];

  if (id !== undefined && typeof id === "string") {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    ctx.output.schema[ctx.output.settings.$idPath] = id;
  }

  ctx.handledKeys.add(ctx.input.settings.$idPath);
};
