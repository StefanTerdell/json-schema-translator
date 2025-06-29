import type { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { Mutator } from "../translators/Mutator.ts";
import { type MutatorContext } from "../translators/MutatorContext.ts";
import { matchDeep } from "./matchDeep.ts";
import { type Respecify } from "./schemaUtils.ts";
import { type ToggledBooleanLiterals } from "./UtilityTypes.ts";

export const addType: Mutator<null, [type: string], boolean> = (
  ctx,
  newType,
) => {
  if (
    ctx.into.settings.type.includes(newType) ||
    !ctx.into.settings.strictTypes
  ) {
    if (ctx.into.schema.type === undefined) {
      ctx.into.schema.type = newType;
    } else if (Array.isArray(ctx.into.schema.type)) {
      if (!ctx.into.schema.type.includes(newType)) {
        ctx.into.schema.type.push(newType);
      }
    } else {
      const currentType = ctx.into.schema.type satisfies string;

      match(
        ctx,
        { singleType: true },
        {
          into(ctx) {
            addUnionMembers(ctx, [{ type: currentType }, { type: newType }]);
          },
          notInto(ctx) {
            ctx.into.schema.type = [currentType, newType];
          },
        },
      );
    }

    return true;
  } else {
    return false;
  }
};

export const addUnionMembers: Mutator<null, [members: unknown[]], boolean> = (
  ctx,
  members,
) => {
  let added = false;

  match(
    ctx,
    { anyOf: true },
    {
      into(ctx) {
        added = addAnyOfMembers(ctx, members);
      },
      notInto(ctx) {
        match(
          ctx,
          { oneOf: true },
          {
            into(ctx) {
              added = addOneOfMembers(ctx, members);
            },
          },
        );
      },
    },
  );

  return added;
};

export const addOneOfMembers: Mutator<
  { into: { oneOf: true } },
  [members: unknown[]],
  boolean
> = (ctx, members) => {
  if (ctx.into.schema.oneOf) {
    match(
      ctx,
      { allOf: true },
      {
        into(ctx) {
          if (
            addAllOfMembers(ctx, [
              {
                oneOf: ctx.into.schema.oneOf,
              },
              { oneOf: members },
            ])
          ) {
            delete ctx.into.schema.oneOf;
          }
        },
        notInto() {
          // deno-lint-ignore no-explicit-any
          for (const member of members as any[]) {
            ctx.into.schema.oneOf!.push(member);
          }
        },
      },
    );
  } else {
    // deno-lint-ignore no-explicit-any
    ctx.into.schema.oneOf = members as any[];
  }

  return true;
};

export const addAllOfMembers: Mutator<
  { into: { allOf: true } },
  [members: unknown[]],
  boolean
> = (ctx, members) => {
  if (ctx.into.schema.allOf) {
    // deno-lint-ignore no-explicit-any
    for (const member of members as any[]) {
      ctx.into.schema.allOf.push(member);
    }
  } else {
    // deno-lint-ignore no-explicit-any
    ctx.into.schema.allOf = members as any[];
  }

  return true;
};

export const addAnyOfMembers: Mutator<
  { into: { anyOf: true } },
  [members: unknown[]],
  boolean
> = (ctx, members) => {
  if (ctx.into.schema.anyOf) {
    match(
      ctx,
      { allOf: true },
      {
        into(ctx) {
          if (
            addAllOfMembers(ctx, [
              {
                anyOf: ctx.into.schema.anyOf,
              },
              { anyOf: members },
            ])
          ) {
            delete ctx.into.schema.anyOf;
          }
        },
        notInto() {
          // deno-lint-ignore no-explicit-any
          for (const member of members as any[]) {
            ctx.into.schema.anyOf!.push(member);
          }
        },
      },
    );
  } else {
    // deno-lint-ignore no-explicit-any
    ctx.into.schema.anyOf = members as any[];
  }

  return true;
};

export function match<
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
  Assertions extends Partial<JsonSchemaSpecification>,
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
  assertions: Assertions,
  matches: {
    from?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        IntoSpecification
      >,
    ) => void;

    notFrom?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        IntoSpecification
      >,
    ) => void;

    onlyFrom?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;

    into?: (
      ctx: MutatorContext<
        FromSpecification,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;

    notInto?: (
      ctx: MutatorContext<
        FromSpecification,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;

    onlyInto?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;

    both?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;
    none?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;
  },
) {
  const from = matchDeep(ctx.from.settings, assertions);
  const into = matchDeep(ctx.into.settings, assertions);

  // deno-lint-ignore no-explicit-any
  type Any = any;

  if (from) {
    matches.from?.(ctx as Any);
    if (into) {
      matches.into?.(ctx as Any);
      matches.both?.(ctx as Any);
    } else {
      matches.notInto?.(ctx as Any);
      matches.onlyFrom?.(ctx as Any);
    }
  } else {
    matches.notFrom?.(ctx as Any);
    if (into) {
      matches.into?.(ctx as Any);
      matches.onlyInto?.(ctx as Any);
    } else {
      matches.notInto?.(ctx as Any);
      matches.none?.(ctx as Any);
    }
  }
}
