import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { Mutator } from "./Mutator.ts";

export const translateConditionalKeywords: Mutator = (ctx) => {
  if (ctx.input.schema.if !== undefined) {
    ctx.output.schema.if = translateJsonSchemaInternal({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.if,
      },
      path: [...ctx.path, "if"],
      forceAllowBooleanSchema: false,
    });
  }

  ctx.handledKeys.add("if");

  if (ctx.input.schema.then !== undefined) {
    ctx.output.schema.then = translateJsonSchemaInternal({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.then,
      },
      path: [...ctx.path, "then"],
      forceAllowBooleanSchema: false,
    });
  }

  ctx.handledKeys.add("then");

  if (ctx.input.schema.else !== undefined) {
    ctx.output.schema.else = translateJsonSchemaInternal({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.else,
      },
      path: [...ctx.path, "else"],
      forceAllowBooleanSchema: false,
    });
  }

  ctx.handledKeys.add("else");

  if (ctx.input.schema.not !== undefined) {
    ctx.output.schema.not = translateJsonSchemaInternal({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.not,
      },
      path: [...ctx.path, "not"],
      forceAllowBooleanSchema: false,
    });
  }

  ctx.handledKeys.add("not");
};
