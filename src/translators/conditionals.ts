import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateConditionalKeywords: Mutator = (ctx) => {
  if (ctx.input.settings.if) {
    if (ctx.output.settings.if && ctx.input.schema.if !== undefined) {
      const x = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.if,
        },
        path: [...ctx.path, "if"],
        forceAllowBooleanSchema: false,
      });

      ctx.output.schema.if = x;
    }

    ctx.handledKeys.add("if");

    if (ctx.input.settings.then) {
      if (ctx.output.settings.then && ctx.input.schema.then !== undefined) {
        const x = translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema: ctx.input.schema.then,
          },
          path: [...ctx.path, "then"],
          forceAllowBooleanSchema: false,
        });

        ctx.output.schema.then = x;
      }

      ctx.handledKeys.add("then");
    }

    if (ctx.input.settings.else) {
      if (ctx.output.settings.else && ctx.input.schema.else !== undefined) {
        const x = translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema: ctx.input.schema.else,
          },
          path: [...ctx.path, "else"],
          forceAllowBooleanSchema: false,
        });

        ctx.output.schema.else = x;
      }

      ctx.handledKeys.add("else");
    }
  }

  if (ctx.input.schema.not !== undefined) {
    const x = translateSchema({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.not,
      },
      path: [...ctx.path, "not"],
      forceAllowBooleanSchema: false,
    });

    ctx.output.schema.not = x;
  }

  ctx.handledKeys.add("not");
};
