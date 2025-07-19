import { Pair } from "../translators/Pair.ts";
import { JsonSchema } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { matchDeep } from "./matchDeep.ts";
import { Respecify } from "./schemaUtils.ts";
import { ToggledBooleanLiterals } from "./UtilityTypes.ts";

type PairUnionMutator = <
  Spec extends JsonSchemaSpecification,
  // Had to loosen this a bit but it irks me lol
  Member extends JsonSchema<Spec>,
>(
  pair: Pair<Spec>,
  members: Member[],
) => boolean;

export const addUnionMembersToPair: PairUnionMutator = (pair, members) => {
  if (addAnyOfMembersToPair(pair, members)) {
    return true;
  }

  return addOneOfMembersToPair(pair, members);
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
                // deno-lint-ignore no-explicit-any
              ] as any)
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
