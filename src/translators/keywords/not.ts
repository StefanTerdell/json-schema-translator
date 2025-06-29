import { isAnySchema } from "../../utils/schemaUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateNot: Mutator = (ctx) => {
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
