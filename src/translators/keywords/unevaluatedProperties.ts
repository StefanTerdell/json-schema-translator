import { matchContext } from "../../utils/contextUtils.ts";
import { isAnySchema } from "../../utils/schemaUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateUnevaluatedProperties: Mutator = (ctx) => {
  matchContext(
    ctx,
    { unevaluatedProperties: true },
    {
      from(ctx) {
        ctx.handledKeys.add("unevaluatedProperties");
      },
      both(ctx) {
        if (ctx.from.schema.unevaluatedProperties !== undefined) {
          ctx.into.schema.unevaluatedProperties = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.unevaluatedProperties,
            },
            path: [...ctx.path, "unevaluatedProperties"],
            forceAllowBooleanSchema: false,
          });
        }
      },
      onlyFrom(ctx) {
        matchContext(
          ctx,
          { additionalProperties: true },
          {
            into(ctx) {
              if (
                ctx.from.schema.unevaluatedProperties !== undefined &&
                (ctx.into.schema.additionalProperties === undefined ||
                  isAnySchema({
                    ...ctx.into,
                    schema: ctx.into.schema.additionalProperties,
                  }))
              ) {
                ctx.into.schema.additionalProperties = translateSchema({
                  ...ctx,
                  from: {
                    ...ctx.from,
                    schema: ctx.from.schema.unevaluatedProperties,
                  },
                  path: [...ctx.path, "unevaluatedProperties"],
                  forceAllowBooleanSchema: true,
                });
              }
            },
          },
        );
      },
    },
  );
};
