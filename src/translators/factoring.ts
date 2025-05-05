import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { Mutator } from "./Mutator.ts";

export const translateFactoringKeywords: Mutator = (ctx) => {
  if (ctx.input.schema.anyOf !== undefined) {
    ctx.output.schema.anyOf = ctx.input.schema.anyOf.map((schema, index) =>
      translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema,
        },
        path: [...ctx.path, "anyOf", index],
        forceAllowBooleanSchema: false,
      }),
    );
  }

  ctx.handledKeys.add("anyOf");

  if (ctx.input.schema.allOf !== undefined) {
    ctx.output.schema.allOf = ctx.input.schema.allOf.map((schema, index) =>
      translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema,
        },
        path: [...ctx.path, "allOf", index],
        forceAllowBooleanSchema: false,
      }),
    );
  }

  ctx.handledKeys.add("allOf");

  if (ctx.input.schema.oneOf !== undefined) {
    ctx.output.schema.oneOf = ctx.input.schema.oneOf.map((schema, index) =>
      translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema,
        },
        path: [...ctx.path, "oneOf", index],
        forceAllowBooleanSchema: false,
      }),
    );
  }

  ctx.handledKeys.add("oneOf");
};
