// deno-lint-ignore-file no-explicit-any

import { JsonSchema } from "../index.ts";
import { UnionLocations } from "../misc/UnionLocations.ts";
import { MutatorContext } from "../translators/MutatorContext.ts";
import { Json } from "../types/Json.ts";
import { JsonSchemaKeywordsObject } from "../types/JsonSchema.ts";
import { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { matchContext } from "./contextUtils.ts";

export function getUnionLocations<
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
): Readonly<UnionLocations<IntoSpecification>> {
  return ctx.unionLocations.get(ctx.into.schema) ?? {};
}

export function setUnionLocation<
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
  union: keyof UnionLocations<IntoSpecification>,
  members: JsonSchemaKeywordsObject<IntoSpecification>[],
) {
  const locations = ctx.unionLocations.get(ctx.into.schema);

  if (locations) {
    locations[union] = members;
  } else {
    ctx.unionLocations.set(ctx.into.schema, {
      [union]: members,
    });
  }
}

export function hasConstants<
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(ctx: MutatorContext<From, Into>): boolean {
  return (
    ctx.into.schema.const !== undefined ||
    ctx.into.schema.enum !== undefined ||
    getUnionLocations(ctx).const !== undefined
  );
}

export function addType<
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(ctx: MutatorContext<From, Into>, type: string): boolean {
  const locations = getUnionLocations(ctx);

  if (
    !ctx.into.specification.singleType &&
    Array.isArray(ctx.into.schema.type)
  ) {
    if (!ctx.into.schema.type.includes(type)) {
      ctx.into.schema.type.push(type);
      return true;
    } else {
      return false;
    }
  } else if (typeof ctx.into.schema.type === "string") {
    if (ctx.into.specification.singleType) {
      const types = addExclusiveAnyOfOrOneOf(ctx, [
        { type: ctx.into.schema.type },
        { type } as any,
      ]);

      if (types) {
        delete ctx.into.schema.type;
        setUnionLocation(ctx, "type", types);
        return true;
      } else {
        return false;
      }
    } else {
      ctx.into.schema.type = [ctx.into.schema.type, type] as any;
      return true;
    }
  } else if (locations.type) {
    locations.type.push({ type } as any);

    return true;
  } else if (ctx.into.schema.type === undefined) {
    ctx.into.schema.type = type;

    return true;
  }

  return false;
}

export function addConstant<
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(ctx: MutatorContext<From, Into>, constant: Json): boolean {
  if (ctx.into.specification.stringConstants && typeof constant !== "string") {
    return false;
  }

  const locations = getUnionLocations(ctx);

  if (locations.const) {
    locations.const.push({ const: constant } as any);

    return true;
  }

  if (ctx.into.specification.enum && ctx.into.schema.enum !== undefined) {
    if (!ctx.into.schema.enum.includes(constant)) {
      ctx.into.schema.enum.push(constant);
    }

    return true;
  }

  if (ctx.into.specification.const) {
    if (ctx.into.schema.const === undefined) {
      ctx.into.schema.const = constant;

      return true;
    }

    if (ctx.into.specification.enum) {
      ctx.into.schema.enum = [ctx.into.schema.const, constant];

      delete ctx.into.schema.const;

      return true;
    }

    const consts = addExclusiveAnyOfOrOneOf(ctx, [
      {
        const: ctx.into.schema.const,
      },
      {
        const: constant,
      } as any,
    ]);

    if (consts) {
      delete ctx.into.schema.const;

      setUnionLocation(ctx, "const", consts);

      return true;
    }
  }

  if (ctx.into.specification.enum) {
    ctx.into.schema.enum = [constant];
  }

  return false;
}

type AddExclusive = <
  From extends JsonSchemaSpecification,
  Into extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<From, Into>,
  members: JsonSchema<Into>[],
) => JsonSchemaKeywordsObject<Into>[] | undefined;

export const addExclusiveAnyOfOrOneOf: AddExclusive = (ctx, members) =>
  addExclusiveAnyOf(ctx, members) ?? addExclusiveOneOf(ctx, members);

export const addExclusiveAnyOf: AddExclusive = (ctx, members) => {
  let output: typeof members | undefined = undefined;

  matchContext(
    ctx,
    { anyOf: true },
    {
      into(ctx) {
        if (ctx.into.schema.anyOf) {
          const allOf = addExclusiveAllOf(ctx, [
            { anyOf: ctx.into.schema.anyOf },
            { anyOf: members } as any,
          ]);

          if (allOf) {
            delete ctx.into.schema.anyOf;
            setUnionLocation(ctx, "anyOf", allOf);
            output = members;
          } else {
            output = undefined;
          }

          return;
        }

        const locations = getUnionLocations(ctx);

        if (locations.anyOf) {
          locations.anyOf.push({
            anyOf: members,
          } as any);
        } else {
          ctx.into.schema.anyOf = members as any;
        }

        output = members;
      },
    },
  );

  return output;
};

export const addExclusiveOneOf: AddExclusive = (ctx, members) => {
  let output: typeof members | undefined = undefined;

  matchContext(
    ctx,
    { oneOf: true },
    {
      into(ctx) {
        if (ctx.into.schema.oneOf) {
          const allOf = addExclusiveAllOf(ctx, [
            { oneOf: ctx.into.schema.oneOf },
            { oneOf: members } as any,
          ]);

          if (allOf) {
            delete ctx.into.schema.oneOf;
            setUnionLocation(ctx, "oneOf", allOf);
            output = members;
          } else {
            output = undefined;
          }

          return;
        }

        const locations = getUnionLocations(ctx);

        if (locations.oneOf) {
          locations.oneOf.push({
            oneOf: members,
          } as any);
        } else {
          ctx.into.schema.oneOf = members as any;
        }

        output = members;
      },
    },
  );

  return output;
};

export const addExclusiveAllOf: AddExclusive = (ctx, members) => {
  let output: typeof members | undefined = undefined;

  matchContext(
    ctx,
    { allOf: true },
    {
      into(ctx) {
        if (ctx.into.schema.allOf) {
          const union = addExclusiveAnyOfOrOneOf(ctx, [
            { allOf: ctx.into.schema.allOf },
            { allOf: members } as any,
          ]);

          if (union) {
            delete ctx.into.schema.allOf;
            setUnionLocation(ctx, "allOf", union);
            output = members;
          }

          return;
        }

        const locations = getUnionLocations(ctx);

        if (locations.allOf) {
          locations.allOf.push({
            allOf: members,
          } as any);
        } else {
          ctx.into.schema.allOf = members as any;
        }

        output = members;
      },
    },
  );

  return output;
};
