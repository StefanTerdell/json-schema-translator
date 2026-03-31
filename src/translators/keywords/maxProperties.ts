import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateMaxProperties: Mutator = (ctx) => {
  matchContext(
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
      onlyFrom(ctx) {
        if (ctx.from.schema.maxProperties !== undefined) {
          ctx.droppedKeys.set([...ctx.path, "maxProperties"], { keyword: "maxProperties", value: ctx.from.schema.maxProperties });
        }
      },
    },
  );
};
