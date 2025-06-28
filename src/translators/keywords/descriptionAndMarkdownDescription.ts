import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

const translateDescription: Mutator<null, [], boolean> = (ctx) => {
  ctx.handledKeys.add("description");

  if (ctx.from.schema.description !== undefined) {
    ctx.into.schema.description = ctx.from.schema.description;

    return true;
  }

  return false;
};

export const translateDescriptionAndMarkdownDescription: Mutator = (ctx) => {
  match(
    ctx,
    { markdownDescription: true },
    {
      from(ctx) {
        ctx.handledKeys.add("markdownDescription");
      },
      onlyFrom(ctx) {
        if (!translateDescription(ctx)) {
          if (ctx.from.schema.markdownDescription !== undefined) {
            ctx.into.schema.description = ctx.from.schema.markdownDescription;
          }
        }
      },
      both(ctx) {
        translateDescription(ctx);

        if (ctx.from.schema.markdownDescription !== undefined) {
          ctx.into.schema.markdownDescription =
            ctx.from.schema.markdownDescription;
        }
      },
    },
  );
};
