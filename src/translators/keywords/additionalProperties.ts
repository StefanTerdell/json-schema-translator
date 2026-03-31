import { matchContext } from "../../utils/contextUtils.ts";
import { schemaHasType } from "../../utils/schemaUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateAdditionalProperties: Mutator = (ctx) => {
  matchContext(
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
          ctx.into.specification.forceAdditionalProperties !== undefined &&
          schemaHasType(ctx.from.schema, "object")
        ) {
          ctx.into.schema.additionalProperties =
            ctx.into.specification.forceAdditionalProperties;
        } else if (ctx.from.schema.additionalProperties !== undefined) {
          ctx.droppedKeys.set(
            [...ctx.path, "additionalProperties"],
            { keyword: "additionalProperties", value: ctx.from.schema.additionalProperties },
          );
        }
      },
    },
  );
};
