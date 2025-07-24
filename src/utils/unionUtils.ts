import { Json } from "../types/Json.ts";

type Schema = {
  type?: string | string[];
  properties?: Record<string, Schema>;
  items?: Schema | Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  const?: Json;
  enum?: Json[];
};

type Specification = {
  singleType: boolean;
  stringConstantsOnly: boolean;
  anyOf: boolean;
  oneOf: boolean;
  allOf: boolean;
  enum: boolean;
  const: boolean;
};

type SchemaKeywords = keyof Schema;
type SchemaPathItem = SchemaKeywords | number;
type SchemaPath = SchemaPathItem[];

type UnionLocations = {
  type?: Schema[];
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  const?: Schema[];
};

export function createUnionContext(
  schema: Schema,
  specification: Specification,
): UnionContext {
  return {
    schema,
    specification,
    path: [],
    unions: new Map(),
  };
}

type UnionContext = {
  schema: Schema;
  specification: Specification;
  path: SchemaPath;
  unions: Map<string, UnionLocations>;
};

function getUnionLocations(ctx: UnionContext): UnionLocations {
  const pathString = ctx.path.join("/");
  let flags = ctx.unions.get(pathString);

  if (!flags) {
    flags = {};

    ctx.unions.set(pathString, flags);
  }

  return flags;
}

export function hasConstants(ctx: UnionContext): boolean {
  return (
    ctx.schema.const !== undefined ||
    ctx.schema.enum !== undefined ||
    getUnionLocations(ctx).const !== undefined
  );
}

export function addType(ctx: UnionContext, type: string): boolean {
  const locations = getUnionLocations(ctx);

  if (!ctx.specification.singleType && Array.isArray(ctx.schema.type)) {
    if (!ctx.schema.type.includes(type)) {
      ctx.schema.type.push(type);
    }

    return true;
  } else if (typeof ctx.schema.type === "string") {
    if (ctx.specification.singleType) {
      const types = addExclusiveMembers(
        ctx,
        "anyOfOrOneOf",
        { type: ctx.schema.type },
        { type },
      );

      if (types) {
        delete ctx.schema.type;
        locations.type = types;
        return true;
      } else {
        return false;
      }
    } else {
      ctx.schema.type = [ctx.schema.type, type];
      return true;
    }
  } else if (locations.type) {
    locations.type.push({ type });

    return true;
  } else if (ctx.schema.type === undefined) {
    ctx.schema.type = type;

    return true;
  }

  return false;
}

export function addConstant(ctx: UnionContext, constant: Json): boolean {
  if (ctx.specification.stringConstantsOnly && typeof constant !== "string") {
    return false;
  }

  const locations = getUnionLocations(ctx);

  if (locations.const) {
    locations.const.push({ const: constant });

    return true;
  }

  if (ctx.specification.enum && ctx.schema.enum !== undefined) {
    if (!ctx.schema.enum.includes(constant)) {
      ctx.schema.enum.push(constant);
    }

    return true;
  }

  if (ctx.specification.const) {
    if (ctx.schema.const === undefined) {
      ctx.schema.const = constant;

      return true;
    }

    if (ctx.specification.enum) {
      ctx.schema.enum = [ctx.schema.const, constant];

      delete ctx.schema.const;

      return true;
    }

    const consts = addExclusiveMembers(
      ctx,
      "anyOfOrOneOf",
      {
        const: ctx.schema.const,
      },
      {
        const: constant,
      },
    );

    if (consts) {
      delete ctx.schema.const;

      locations.const = consts;

      return true;
    }
  }

  if (ctx.specification.enum) {
    ctx.schema.enum = [constant];
  }

  return false;
}

export function addExclusiveAnyOf(
  ctx: UnionContext,
  ...members: [Schema, ...Schema[]]
) {
  return addExclusiveMembers(ctx, "anyOf", ...members);
}

export function addExclusiveOneOf(
  ctx: UnionContext,
  ...members: [Schema, ...Schema[]]
) {
  return addExclusiveMembers(ctx, "oneOf", ...members);
}

function addExclusiveMembers(
  ctx: UnionContext,
  union: "anyOfOrOneOf" | "oneOfOrAnyOf" | "anyOf" | "oneOf",
  ...members: [Schema, ...Schema[]]
): Schema[] | undefined {
  if (union === "anyOfOrOneOf") {
    return (
      addExclusiveMembers(ctx, "anyOf", ...members) ??
      addExclusiveMembers(ctx, "oneOf", ...members)
    );
  } else if (union === "oneOfOrAnyOf") {
    return (
      addExclusiveMembers(ctx, "oneOf", ...members) ??
      addExclusiveMembers(ctx, "anyOf", ...members)
    );
  }

  if (!ctx.specification[union]) {
    return undefined;
  }

  const locations = getUnionLocations(ctx);

  if (ctx.schema[union]) {
    const allOf = addExlusiveAllOf(
      ctx,
      { [union]: ctx.schema[union] },
      { [union]: members },
    );

    if (allOf) {
      delete ctx.schema[union];
      locations[union] = allOf;
      return members;
    } else {
      return undefined;
    }
  } else if (locations[union]) {
    locations[union].push({
      [union]: members,
    });

    return members;
  } else {
    ctx.schema[union] = members;

    return members;
  }
}

export function addExlusiveAllOf(
  ctx: UnionContext,
  ...members: [Schema, ...Schema[]]
): Schema[] | undefined {
  if (!ctx.specification.allOf) {
    return undefined;
  }

  const locations = getUnionLocations(ctx);

  if (ctx.schema.allOf) {
    const union =
      addExclusiveAnyOf(ctx, { allOf: ctx.schema.allOf }, { allOf: members }) ??
      addExclusiveOneOf(ctx, { allOf: ctx.schema.allOf }, { allOf: members });

    if (union) {
      delete ctx.schema.allOf;
      locations.allOf = union;
      return members;
    }
  } else if (locations.allOf) {
    locations.allOf.push({
      allOf: members,
    });

    return members;
  } else {
    ctx.schema.allOf = members;

    return members;
  }
}
