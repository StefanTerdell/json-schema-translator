import { copy } from "../../misc/copy.ts";
import { matchContext } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateDependentRequired: Mutator = (ctx) => {
  matchContext(
    ctx,
    {
      dependentRequired: true,
    },
    {
      from(ctx) {
        ctx.handledKeys.add("dependentRequired");
      },
      both(ctx) {
        if (ctx.from.schema.dependentRequired !== undefined) {
          ctx.into.schema.dependentRequired = copy(
            ctx.copyJson,
            ctx.from.schema.dependentRequired,
          );
        }
      },
      onlyFrom(ctx) {
        matchContext(
          ctx,
          { dependencies: true },
          {
            into(ctx) {
              if (ctx.from.schema.dependentRequired !== undefined) {
                for (const key in ctx.from.schema.dependentRequired) {
                  if (ctx.into.schema.dependencies === undefined) {
                    ctx.into.schema.dependencies = {};
                  }

                  ctx.into.schema.dependencies[key] = [
                    ...ctx.from.schema.dependentRequired[key],
                  ];
                }
              }
            },
          },
        );
      },
    },
  );
};
