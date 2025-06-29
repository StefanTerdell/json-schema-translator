import { JsonSchemaKeyword } from "../../JsonSchema.ts";
import { JsonSchemaSpecification } from "../../JsonSchemaSpecification.ts";
import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxProperties: Mutator = (ctx) => {
  match(
    ctx,
    { maxProperties: true },
    {
      from(ctx) {
        ctx.handledKeys.add("maxProperties");
      },
      both(ctx) {
        if (ctx.from.schema.maxProperties !== undefined) {
          ctx.into.schema.maxProperties = ctx.from.schema.maxProperties;
        }
      },
    },
  );
};
