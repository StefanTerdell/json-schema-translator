const fromSchemaParam = Symbol(0);
const intoSchemaParam = Symbol(1);
const fromSpecParam = Symbol(2);
const intoSpecParam = Symbol(3);

export type FromSchemaParam = typeof fromSchemaParam;
export type IntoSchemaParam = typeof intoSchemaParam;
export type FromSpecParam = typeof fromSpecParam;
export type IntoSpecParam = typeof intoSpecParam;

type ResolveParameter<
  Ctx extends {
    from: { settings: unknown; schema: unknown };
    into: { settings: unknown; schema: unknown };
  },
  Parameter,
> = Parameter extends [unknown, ...unknown[]]
  ? ResolveParameters<Ctx, Parameter>
  : Parameter extends (infer Item)[]
    ? ResolveParameter<Ctx, Item>[]
    : Parameter extends FromSpecParam
      ? Ctx["from"]["settings"]
      : Parameter extends IntoSpecParam
        ? Ctx["into"]["settings"]
        : Parameter extends FromSchemaParam
          ? Ctx["from"]["schema"]
          : Parameter extends IntoSchemaParam
            ? Ctx["into"]["schema"]
            : Parameter;

export type ResolveParameters<
  Ctx extends {
    from: { settings: unknown; schema: unknown };
    into: { settings: unknown; schema: unknown };
  },
  Parameters extends unknown[],
  Acc extends unknown[] = [],
> = Parameters extends [infer Head, ...infer Tail extends unknown[]]
  ? ResolveParameters<Ctx, Tail, [...Acc, ResolveParameter<Ctx, Head>]>
  : Acc;
