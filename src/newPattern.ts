type KeysExtendingValues<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

type JsonSchemaSpecification = {
  type: string[];
  prefixItems: boolean;
  singleType?: boolean;
};

type BooleanJsonSchemaSpecificationKeys = KeysExtendingValues<
  JsonSchemaSpecification,
  boolean | undefined
>;

type IfSet<
  S extends JsonSchemaSpecification,
  K extends keyof JsonSchemaSpecification,
  True,
  False = unknown,
> = S[K] extends true ? (true extends S[K] ? True : False) : False;

type JsonSchema<S extends JsonSchemaSpecification> = {
  type?: IfSet<
    S,
    "singleType",
    S["type"][number],
    S["type"][number] | S["type"][number][]
  >;

  prefixItems?: IfSet<S, "prefixItems", JsonSchema<S>[]>;
  items?: IfSet<
    S,
    "prefixItems",
    JsonSchema<S>,
    JsonSchema<S> | JsonSchema<S>[]
  >;
  additionalItems?: JsonSchema<S>;
  anyOf?: JsonSchema<S>[];
};

type SchemaPair<Specification extends JsonSchemaSpecification> = {
  specification: Specification;
  schema: JsonSchema<Specification>;
};

type UnknownPair<Specification extends JsonSchemaSpecification> = {
  specification: unknown;
  schema: unknown;
  carry?: Specification & never;
};

// type WithKV<T extends object, K extends keyof T, V extends T[K]> = Omit<T, K> &
//   Record<K, V>;

type Replace<
  S extends B,
  K extends keyof B,
  V,
  B = JsonSchemaSpecification,
> = B & (Omit<S, K> & { [Key in K]?: V });

function assertTrue<
  Specification extends JsonSchemaSpecification,
  Key extends keyof JsonSchemaSpecification &
    BooleanJsonSchemaSpecificationKeys,
>(
  pair: SchemaPair<Replace<Specification, Key, boolean>>,
  flag: Key,
): pair is SchemaPair<Replace<Specification, Key, true>> {
  return Boolean(pair.specification[flag] === true);
}

function assertTrue2<
  Specification extends JsonSchemaSpecification,
  Key extends keyof JsonSchemaSpecification &
    BooleanJsonSchemaSpecificationKeys,
>(
  pair: UnknownPair<Replace<Specification, Key, boolean>>,
  flag: Key,
): pair is SchemaPair<Replace<Specification, Key, true>> {
  // @ts-ignore:
  return Boolean(pair.specification[flag] === true);
}

function assertFalse2<
  Specification extends JsonSchemaSpecification,
  Key extends keyof JsonSchemaSpecification &
    BooleanJsonSchemaSpecificationKeys,
>(
  pair: UnknownPair<Replace<Specification, Key, boolean>>,
  flag: Key,
): pair is SchemaPair<Replace<Specification, Key, false>> {
  // @ts-ignore:
  return !pair.specification[flag];
}

function assertFalse<
  Specification extends JsonSchemaSpecification,
  Key extends keyof JsonSchemaSpecification &
    BooleanJsonSchemaSpecificationKeys,
>(
  pair: SchemaPair<Replace<Specification, Key, boolean>>,
  flag: Key,
): pair is SchemaPair<Replace<Specification, Key, false>> {
  return !(pair.specification[flag] === true);
}

function translateSchema<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(inputSpec: I, inputSchema: JsonSchema<I>, outputSpec: O): JsonSchema<O> {
  const input: SchemaPair<I> = {
    specification: inputSpec,
    schema: inputSchema,
  };
  const output: SchemaPair<O> = {
    specification: outputSpec,
    schema: {},
  };

  translateTypeKeyword(input, output);
  translateArrayKeywords(input, output);

  return output.schema;
}

function translateTypeKeyword<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(input: SchemaPair<I>, output: SchemaPair<O>) {
  if (
    assertFalse(input, "singleType") &&
    assertTrue(output, "singleType") &&
    Array.isArray(input.schema.type)
  ) {
    input.schema.type satisfies
      | undefined
      | (typeof input.specification.type)[number]
      | (typeof input.specification.type)[number][];

    output.schema.type satisfies
      | undefined
      | (typeof output.specification.type)[number];

    output.schema.type = input.schema.type[0];
  } else if (
    assertFalse(output, "singleType") &&
    input.schema.type !== undefined
  ) {
    output.schema.type = input.schema.type;
  }

  // if (assertSetting(input, "singleType")) {
  //   if (assertSetting(output, "singleType")) {
  //     output.schema.type = input.schema.type;
  //   } else {
  //     output.schema.type = input.schema.type;
  //   }
  // } else {
  //   if (assertSetting(output, "singleType")) {
  //     if (Array.isArray(input.schema.type)) {
  //       output.schema.type = input.schema.type[0];
  //     } else {
  //       output.schema.type = input.schema.type;
  //     }
  //   } else {
  //     output.schema.type = input.schema.type;
  //   }
  // }
}

function translateArrayKeywords<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(inputArg: SchemaPair<I>, outputArg: SchemaPair<O>) {
  const input: UnknownPair<I> = inputArg;
  const output: UnknownPair<O> = outputArg;

  if (assertTrue2(input, "prefixItems")) {
    if (assertTrue2(output, "prefixItems")) {
      output.schema.prefixItems = input.schema.prefixItems?.map((s) =>
        translateSchema(input.specification, s, output.specification),
      );

      if (input.schema.items !== undefined) {
        output.schema.items = translateSchema(
          input.specification,
          input.schema.items,
          output.specification,
        );
      }

      if (input.schema.additionalItems !== undefined) {
        output.schema.additionalItems = translateSchema(
          input.specification,
          input.schema.additionalItems,
          output.specification,
        );
      }
    } else if (assertFalse2(output, "prefixItems")) {
      if (input.schema.prefixItems) {
        output.schema.items = input.schema.prefixItems;

        if (input.schema.items) {
          if (input.schema.additionalItems) {
            output.schema.additionalItems = {
              anyOf: [input.schema.items, input.schema.additionalItems],
            };
          } else {
            output.schema.additionalItems = input.schema.items;
          }
        }
      }
    }
  } else {
    if (assertTrue(output, "prefixItems")) {
      if (Array.isArray(input.schema.items)) {
        output.schema.prefixItems = input.schema.items;
      } else {
        output.schema.items = input.schema.items;
      }

      output.schema.additionalItems = input.schema.additionalItems;
    } else {
    }
  }
}
