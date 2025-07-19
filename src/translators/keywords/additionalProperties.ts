import { match, hasType } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAdditionalProperties: Mutator = (ctx) => {
  match(
    ctx,
    {
      additionalProperties: true,
    },
    {
      from(ctx) {
        ctx.handledKeys.add("additionalProperties");
      },
      both(ctx) {
        if (ctx.from.schema.additionalProperties !== undefined) {
          ctx.into.schema.additionalProperties = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.additionalProperties,
            },
            path: [...ctx.path, "additionalProperties"],
            forceAllowBooleanSchema: true,
          });
        }
      },
      notInto(ctx) {
        if (
          ctx.into.settings.forceAdditionalProperties !== undefined &&
          hasType(ctx.from.schema, "object")
        ) {
          ctx.into.schema.additionalProperties =
            ctx.into.settings.forceAdditionalProperties;
        }
      },
    },
  );
};
