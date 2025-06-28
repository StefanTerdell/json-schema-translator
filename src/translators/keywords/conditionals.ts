import { isAnySchema } from "../../utils/schemaUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateConditionalKeywords: Mutator = (ctx) => {
  if (ctx.from.settings.if) {
    if (ctx.into.settings.if && ctx.from.schema.if !== undefined) {
      const ifSchema = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema: ctx.from.schema.if,
        },
        path: [...ctx.path, "if"],
        forceAllowBooleanSchema: false,
      });

      ctx.into.schema.if = ifSchema;
    }

    ctx.handledKeys.add("if");

    if (ctx.from.settings.then) {
      if (ctx.into.settings.then && ctx.from.schema.then !== undefined) {
        const thenSchema = translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema: ctx.from.schema.then,
          },
          path: [...ctx.path, "then"],
          forceAllowBooleanSchema: false,
        });

        ctx.into.schema.then = thenSchema;
      }

      ctx.handledKeys.add("then");
    }

    if (ctx.from.settings.else) {
      if (ctx.into.settings.else && ctx.from.schema.else !== undefined) {
        const elseSchema = translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema: ctx.from.schema.else,
          },
          path: [...ctx.path, "else"],
          forceAllowBooleanSchema: false,
        });

        ctx.into.schema.else = elseSchema;
      }

      ctx.handledKeys.add("else");
    }
  }

  if (ctx.from.schema.not !== undefined) {
    const notSchema = translateSchema({
      ...ctx,
      from: {
        ...ctx.from,
        schema: ctx.from.schema.not,
      },
      path: [...ctx.path, "not"],
      forceAllowBooleanSchema: false,
    });

    if (
      ctx.into.settings.verboseNot === true &&
      isAnySchema(notSchema, ctx.into.settings)
    ) {
      if (ctx.into.settings.singleType) {
        const eitherType = ctx.into.settings.type.map((type) => ({
          type,
        }));

        if (ctx.into.settings.anyOf) {
          // @ts-expect-error :p
          ctx.into.schema.not = {
            anyOf: eitherType,
          };
        } else if (ctx.into.settings.oneOf) {
          // @ts-expect-error :p
          ctx.into.schema.not = {
            oneOf: eitherType,
          };
        }
      } else {
        // @ts-expect-error :p
        ctx.into.schema.not = {
          type: ctx.into.settings.type,
        };
      }
    } else {
      ctx.into.schema.not = notSchema;
    }
  }

  ctx.handledKeys.add("not");
};
