import { JsonSchema, JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import type { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { Mutator } from "../translators/Mutator.ts";
import { type MutatorContext } from "../translators/MutatorContext.ts";
import { isObject } from "./isObject.ts";
import { matchDeep } from "./matchDeep.ts";
import { type Respecify } from "./schemaUtils.ts";
import { type ToggledBooleanLiterals } from "./UtilityTypes.ts";

export const hasNullable = (schema: unknown, checkUnions?: boolean) => {
  if (schema === true) {
    return true;
  }

  if (!isObject(schema)) {
    return false;
  }

  if ("nullable" in schema && schema.nullable === true) {
    return true;
  }

  if (checkUnions) {
    if (
      "anyOf" in schema &&
      Array.isArray(schema.anyOf) &&
      schema.anyOf.some((schema) => hasNullable(schema, true))
    ) {
      return true;
    }

    if (
      "oneOf" in schema &&
      Array.isArray(schema.oneOf) &&
      schema.oneOf.some((schema) => hasNullable(schema, true))
    ) {
      return true;
    }
  }

  return false;
};

export const hasType = (
  schema: unknown,
  type: JsonSchemaSpecification["type"][number],
  checkUnions?: boolean,
): boolean => {
  if (schema === true) {
    return true;
  }

  if (!isObject(schema)) {
    return false;
  }

  if ("type" in schema) {
    if (schema.type === type) {
      return true;
    }

    if (Array.isArray(schema.type) && schema.type.includes(type)) {
      return true;
    }
  }

  if (checkUnions) {
    if (
      "anyOf" in schema &&
      Array.isArray(schema.anyOf) &&
      schema.anyOf.some((schema) => hasType(schema, type, true))
    ) {
      return true;
    }

    if (
      "oneOf" in schema &&
      Array.isArray(schema.oneOf) &&
      schema.oneOf.some((schema) => hasType(schema, type, true))
    ) {
      return true;
    }
  }

  return false;
};

export const pick = <T extends object, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> => {
  return Object.keys(object).reduce(
    (acc: Record<PropertyKey, unknown>, key) => {
      if (keys.includes(key as K)) {
        acc[key] = object[key as K];
      }

      return acc;
    },
    {},
    // deno-lint-ignore no-explicit-any
  ) as any;
};

export const addTypeToPair = <
  Spec extends JsonSchemaSpecification,
  Type extends Spec["type"][number],
>(
  pair: Pair<Spec>,
  type: Type,
) => {
  if (
    !pair.specification.strictTypes ||
    pair.specification.type.includes(type)
  ) {
    let added = true;

    if (pair.schema.type === undefined) {
      pair.schema.type = type;
    } else if (Array.isArray(pair.schema.type)) {
      if (!pair.schema.type.includes(type)) {
        pair.schema.type.push(type);
      }
    } else {
      const currentType = pair.schema.type satisfies string;

      matchPair(
        pair,
        { singleType: true },
        {
          true(pair) {
            if (
              addUnionMembersToPair(pair, [
                { type: pair.schema.type },
                { type: type },
              ])
            ) {
              delete pair.schema.type;
            } else {
              added = false;
            }
          },
          false(pair) {
            pair.schema.type = [currentType, type];
          },
        },
      );
    }

    return added;
  } else {
    return false;
  }
};

export const addType: Mutator<null, [type: string, isBar: boolean], boolean> = (
  ctx,
  newType,
  isBar?: boolean,
) => {
  if (
    !ctx.into.settings.strictTypes ||
    ctx.into.settings.type.includes(newType)
  ) {
    let added = true;

    if (ctx.into.schema.type === undefined) {
      ctx.into.schema.type = newType;
    } else if (Array.isArray(ctx.into.schema.type)) {
      if (!ctx.into.schema.type.includes(newType)) {
        ctx.into.schema.type.push(newType);
      }
    } else {
      const currentType = ctx.into.schema.type satisfies string;

      if (isBar) {
        console.log("bar has current type", currentType);
      }

      match(
        ctx,
        { singleType: true },
        {
          into(ctx) {
            added = addUnionMembers(ctx, [
              { type: currentType },
              { type: newType },
            ]);
          },
          notInto(ctx) {
            ctx.into.schema.type = [currentType, newType];
          },
        },
      );
    }

    return added;
  } else {
    return false;
  }
};

export const addUnionMembersToPair: PairUnionMutator = (pair, members) => {
  if (addAnyOfMembersToPair(pair, members)) {
    return true;
  }

  return addOneOfMembersToPair(pair, members);
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

export const addAllOfMembersToPair = <Spec extends JsonSchemaSpecification>(
  pair: Pair<Spec>,
  members: JsonSchema<Spec>[],
): boolean => {
  let added = false;

  matchPair(
    pair,
    { allOf: true },
    {
      true(pair) {
        if (!pair.schema.allOf && members.length) {
          pair.schema.allOf = [];
        }

        for (const member of members) {
          // @ts-expect-error: Members are from pre-asserted spec, but since its the same spec this is safe
          pair.schema.allOf.push(member);
        }

        added = true;
      },
    },
  );

  return added;
};

type PairUnionMutator = <
  Spec extends JsonSchemaSpecification,
  // Had to loosen this a bit but it irks me lol
  Member extends JsonSchemaKeywordsObject<JsonSchemaSpecification>,
>(
  pair: Pair<Spec>,
  members: Member[],
) => boolean;

export const addAnyOfMembersToPair: PairUnionMutator = (pair, members) => {
  let added = false;

  matchPair(
    pair,
    { anyOf: true },
    {
      true(pair) {
        if (!pair.schema.anyOf && members.length) {
          pair.schema.anyOf = [];
        }

        for (const member of members) {
          // @ts-expect-error: Members are from pre-asserted spec, but since its the same spec this is safe
          pair.schema.anyOf.push(member);
        }

        added = true;
      },
    },
  );

  return added;
};
export const addOneOfMembersToPair: PairUnionMutator = (pair, members) => {
  let added = false;

  matchPair(
    pair,
    { oneOf: true },
    {
      true(pair) {
        if (!pair.schema.oneOf && members.length) {
          pair.schema.oneOf = [];
        }

        for (const member of members) {
          // @ts-expect-error: Members are from pre-asserted spec, but since its the same spec this is safe
          pair.schema.oneOf.push(member);
        }

        added = true;
      },
    },
  );

  return added;
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

export type Pair<
  Spec extends JsonSchemaSpecification,
  ForceKeywordsObject extends boolean = true,
> = {
  specification: Spec;
  schema: ForceKeywordsObject extends false
    ? JsonSchema<Spec>
    : JsonSchemaKeywordsObject<Spec>;
};

export function matchPair<
  Spec extends JsonSchemaSpecification,
  Assertions extends Partial<JsonSchemaSpecification>,
>(
  pair: Pair<Spec>,
  assertions: Assertions,
  matches?: {
    true?: (pair: Pair<Respecify<Spec, Assertions>>) => void;
    false?: (
      pair: Pair<Respecify<Spec, ToggledBooleanLiterals<Assertions>>>,
    ) => void;
  },
): boolean {
  if (matchDeep(pair.specification, assertions)) {
    // deno-lint-ignore no-explicit-any
    matches?.true?.(pair as any);

    return true;
  } else {
    // deno-lint-ignore no-explicit-any
    matches?.false?.(pair as any);

    return false;
  }
}

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
  const from =
    (matches.from ||
      matches.notFrom ||
      matches.onlyFrom ||
      matches.both ||
      matches.none) &&
    matchDeep(ctx.from.settings, assertions);

  const into =
    (matches.into ||
      matches.notInto ||
      matches.onlyInto ||
      matches.both ||
      matches.none) &&
    matchDeep(ctx.into.settings, assertions);

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
