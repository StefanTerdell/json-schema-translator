import { type Json } from "../Json.ts";
import { isNonEmptyArray, type NonEmptyArray } from "../utils.ts";
import { type Mutator } from "./Mutator.ts";
import { match } from "./MutatorContext.ts";

export const translateConstantKeywords: Mutator = (ctx) => {
  match(
    ctx,
    {
      enum: true,
    },
    {
      onFrom(ctx) {
        // from supports enum
        ctx.handledKeys.add("enum");
      },
      onFromAndInto(ctx) {
        // both support enum
        match(
          ctx,
          { const: true },
          {
            onFrom(ctx) {
              // both supports enum and from supports const
              ctx.handledKeys.add("const");
            },
            onFromAndInto(ctx) {
              // both support enum and const
              if (ctx.from.schema.enum !== undefined) {
                if (
                  !ctx.into.settings.nonEmptyEnum ||
                  ctx.from.schema.enum.length
                ) {
                  ctx.into.schema.enum = ctx.from.schema.enum;
                }
              }

              if (ctx.from.schema.const !== undefined) {
                ctx.into.schema.const = ctx.from.schema.const;
              }
            },
            onFromNotInto(ctx) {},
            onIntoNotFrom(ctx) {},
            onNeither(ctx) {
              if (ctx.from.schema.enum !== undefined) {
                if (
                  !ctx.into.settings.nonEmptyEnum ||
                  ctx.from.schema.enum.length
                ) {
                  ctx.into.schema.enum = ctx.from.schema.enum;
                }
              }
            },
          },
        );
      },
      onFromNotInto(ctx) {
        match(
          ctx,
          { const: true },
          {
            onFrom(ctx) {
              ctx.handledKeys.add("const");
            },
            onFromAndInto(ctx) {
              if (ctx.from.schema.const !== undefined) {
                ctx.into.schema.const = ctx.from.schema.const;
              } else if (ctx.from.schema.enum?.length === 1) {
                ctx.into.schema.const = ctx.from.schema.enum[0];
              }
            },
            onIntoNotFrom(ctx) {
              if (ctx.from.schema.enum?.length === 1) {
                ctx.into.schema.const = ctx.from.schema.enum[0];
              }
            },
          },
        );
      },
    },
  );

  const { from, into, handledKeys } = ctx;

  const values: Json[] = from.schema.enum ?? [];

  if (from.settings.const) {
    if (from.schema.const !== undefined) {
      values.push(from.schema.const);
    }

    handledKeys.add("const");
  }

  if (isNonEmptyArray(values)) {
    if (values.length === 1) {
      if (into.settings.const) {
        into.schema.const = values[0];
      } else {
        into.schema.enum = values as NonEmptyArray<Json>;
      }
    } else {
      into.schema.enum = values as NonEmptyArray<Json>;
    }
  } else if (from.schema.enum !== undefined && !into.settings.nonEmptyEnum) {
    // @ts-expect-error ISSUE: Narrowing breaks across generics
    into.schema.enum = [];
  }

  handledKeys.add("enum");
};
