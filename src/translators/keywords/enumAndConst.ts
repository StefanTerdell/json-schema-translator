import { matchContext } from "../../utils/contextUtils.ts";
import { addUnionMembersToPair } from "../../utils/pairUtils.ts";
import { type Mutator } from "../Mutator.ts";

const copyEnum: Mutator<{ enum: true }> = (ctx) => {
  if (ctx.from.schema.enum !== undefined) {
    if (!ctx.into.specification.nonEmptyEnum || ctx.from.schema.enum.length) {
      ctx.into.schema.enum = ctx.from.schema.enum;

      return true;
    }
  }
};

const copyConst: Mutator<{ const: true }> = (ctx) => {
  if (ctx.from.schema.const !== undefined) {
    ctx.into.schema.const = ctx.from.schema.const;
    return true;
  }
};

const copyEnumToConst: Mutator<{
  from: { enum: true };
  into: { const: true };
}> = (ctx) => {
  if (ctx.from.schema.enum) {
    if (ctx.from.schema.enum.length === 1) {
      ctx.into.schema.const = ctx.from.schema.enum[0];
      return true;
    } else if (ctx.from.schema.enum.length > 1) {
      return addUnionMembersToPair(
        ctx.into,
        ctx.from.schema.enum.map((value) => ({
          const: value,
          // deno-lint-ignore no-explicit-any
        })) as any,
      );
    }
  }
};

export const translateEnumAndConst: Mutator = (ctx) => {
  matchContext(
    ctx,
    {
      enum: true,
    },
    {
      from(ctx) {
        // from supports enum
        ctx.handledKeys.add("enum");
      },
      both(ctx) {
        // both support enum
        matchContext(
          ctx,
          { const: true },
          {
            from(ctx) {
              // both supports enum and from supports const
              ctx.handledKeys.add("const");
            },
            both(ctx) {
              // both support enum and const
              copyEnum(ctx);
              copyConst(ctx);
            },
            onlyFrom(ctx) {
              // Both support enum, only from supports const

              if (!copyEnum(ctx)) {
                if (ctx.from.schema.const !== undefined) {
                  ctx.into.schema.enum = [ctx.from.schema.const];
                }
              }
            },
            onlyInto(ctx) {
              // Both support enum, only into supports const
              if (!copyEnum(ctx)) {
                copyEnumToConst(ctx);
              }
            },
            none(ctx) {
              // Both support enum, none support const
              copyEnum(ctx);
            },
          },
        );
      },
      onlyFrom(ctx) {
        // Only from supports enum
        matchContext(
          ctx,
          { const: true },
          {
            from(ctx) {
              // From supports enum and const
              ctx.handledKeys.add("const");
            },
            both(ctx) {
              // From supports enum, both suppports const
              if (ctx.from.schema.const !== undefined) {
                ctx.into.schema.const = ctx.from.schema.const;
              } else {
                copyEnumToConst(ctx);
              }
            },
            onlyInto(ctx) {
              // From supports enum, only into supports const
              copyEnumToConst(ctx);
            },
          },
        );
      },
    },
  );
};
