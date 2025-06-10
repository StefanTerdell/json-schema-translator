import { isAnySchema } from "../schemaUtils.ts";
import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateConditionalKeywords: Mutator = (ctx) => {
  if (ctx.input.settings.if) {
    if (ctx.output.settings.if && ctx.input.schema.if !== undefined) {
      const ifSchema = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.if,
        },
        path: [...ctx.path, "if"],
        forceAllowBooleanSchema: false,
      });

      ctx.output.schema.if = ifSchema;
    }

    ctx.handledKeys.add("if");

    if (ctx.input.settings.then) {
      if (ctx.output.settings.then && ctx.input.schema.then !== undefined) {
        const thenSchema = translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema: ctx.input.schema.then,
          },
          path: [...ctx.path, "then"],
          forceAllowBooleanSchema: false,
        });

        ctx.output.schema.then = thenSchema;
      }

      ctx.handledKeys.add("then");
    }

    if (ctx.input.settings.else) {
      if (ctx.output.settings.else && ctx.input.schema.else !== undefined) {
        const elseSchema = translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema: ctx.input.schema.else,
          },
          path: [...ctx.path, "else"],
          forceAllowBooleanSchema: false,
        });

        ctx.output.schema.else = elseSchema;
      }

      ctx.handledKeys.add("else");
    }
  }

  if (ctx.input.schema.not !== undefined) {
    const notSchema = translateSchema({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.not,
      },
      path: [...ctx.path, "not"],
      forceAllowBooleanSchema: false,
    });

    if (
      ctx.output.settings.verboseNot === true &&
      isAnySchema(notSchema, ctx.output.settings)
    ) {
      if (ctx.output.settings.singleType) {
        const eitherType = ctx.output.settings.type.map((type) => ({
          type,
        }));

        if (ctx.output.settings.anyOf) {
          // @ts-expect-error :p
          ctx.output.schema.not = {
            anyOf: eitherType,
          };
        } else if (ctx.output.settings.oneOf) {
          // @ts-expect-error :p
          ctx.output.schema.not = {
            oneOf: eitherType,
          };
        }
      } else {
        // @ts-expect-error :p
        ctx.output.schema.not = {
          type: ctx.output.settings.type,
        };
      }
    } else {
      ctx.output.schema.not = notSchema;
    }
  }

  ctx.handledKeys.add("not");
};
