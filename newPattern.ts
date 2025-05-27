import { JsonObject } from "./Json.ts";
import { Json } from "./Json.ts";
import { Replace } from "./utils.ts";

type Settings = {
  prefixItems: boolean;
  booleanSchemas: boolean;
  $defsPath: string;
  $idPath: string;
};

type PartialSettings = {
  [Key in keyof Settings]?: Settings[Key];
};

type SettingsOverride<S extends Settings, O extends PartialSettings> = {
  [Key in keyof Settings]: O[Key] extends Settings[Key] ? O[Key] : S[Key];
};

type SettingsReversed<S extends PartialSettings> = {
  [Key in keyof S]?: S[Key] extends true
    ? false
    : S[Key] extends false
      ? true
      : never;
} & {
  $defsPath: string;
  $idPath: string;
};

type StrictSchemaObjectKeywords<S extends Settings> =
  | (S["prefixItems"] extends true ? "prefixItems" : never)
  | "items"
  | "additionalItems"
  | (S["$idPath"] extends "" ? never : S["$idPath"])
  | (S["$defsPath"] extends "" ? never : S["$defsPath"]);

type StrictSchemaObject<S extends Settings> = {
  prefixItems?: S["prefixItems"] extends true ? Array<Schema<S>> : never;
  items?: S["prefixItems"] extends true
    ? Schema<S>
    : Schema<S> | Array<Schema<S>>;
  additionalItems?: Schema<S> | boolean;
  not?: Schema<S>;
};

type SchemaObject<S extends Settings> =
  // {
  //   [Key in string]?: Key extends StrictSchemaObjectKeywords<S> ? never : Json;
  // } &

  (S["$idPath"] extends ""
    ? never
    : {
        [Key in S["$idPath"]]?: string;
      }) &
    (S["$defsPath"] extends ""
      ? never
      : {
          [Key in S["$defsPath"]]?: Record<string, Schema<S>>;
        }) &
    StrictSchemaObject<S>;

type Schema<S extends Settings> = S["booleanSchemas"] extends true
  ? SchemaObject<S> | boolean
  : SchemaObject<S>;

// class SchemaInstance<S extends Settings, I extends Schema<S> = Schema<S>> {
//   public schema: I;
//   public settings: S;

//   constructor(settings: S, schema: I) {
//     this.settings = settings;
//     this.schema = schema;
//   }

//   public is<O extends { [Key in keyof Settings]?: Settings[Key] }>(
//     settings: O,
//   ): this is SchemaInstance<SettingsOverride<S, O>> {
//     return Object.keys(settings).every(
//       (key) =>
//         settings[key as keyof Settings] ===
//         this.settings[key as keyof Settings],
//     );
//   }
// }

class SchemaObjectInstance<
  S extends Settings,
  I extends SchemaObject<S> = SchemaObject<S>,
> {
  public schema: I;
  public settings: S;

  constructor(settings: S, schema: I) {
    this.settings = settings;
    this.schema = schema;
  }

  public is<O extends { [Key in keyof Settings]?: Settings[Key] }>(
    matchingPartialSettings: O,
  ): this is SchemaObjectInstance<SettingsOverride<S, O>> {
    return Object.keys(matchingPartialSettings).every(
      (key) =>
        matchingPartialSettings[key as keyof Settings] ===
        this.settings[key as keyof Settings],
    );
  }

  public if<O extends Partial<Settings>>(
    matchingPartialSettings: O,
    cases: {
      then: (instance: SchemaObjectInstance<SettingsOverride<S, O>>) => void;
      else: (
        instance: SchemaObjectInstance<
          SettingsOverride<S, SettingsReversed<O>>
        >,
      ) => void;
    },
  ) {
    if (this.is(matchingPartialSettings)) {
      cases.then(this);
    } else {
      cases.else(this);
    }
  }
}

const a = new SchemaObjectInstance(
  {
    prefixItems: true,
    booleanSchemas: true,
    $defsPath: "$defs",
    $idPath: "$id",
  } as const,
  {},
);

const asB = a.is({ booleanSchemas: false });

if (asB) {
  a.schema.additionalItems;
  a.schema.items?.$id;
  a.schema.$defs?.["x"].additionalItems;
}

function translateSchema<A extends Settings, B extends Settings>(
  settingsA: A,
  schemaA: Schema<A>,
  settingsB: B,
): Schema<B> {
  if (typeof schemaA === "boolean") {
    if (settingsB.booleanSchemas) {
      return schemaA;
    } else {
      return (schemaA ? {} : { not: {} }) as Schema<B>;
    }
  } else {
    const instanceA = new SchemaObjectInstance(
      settingsA,
      schemaA as SchemaObject<A>,
    );

    const instanceB = new SchemaObjectInstance(
      settingsB,
      {} as SchemaObject<B>,
    );

    return instanceB.schema;
  }
}

function mutateArrayKeywords<A extends Settings, B extends Settings>(
  a: SchemaObjectInstance<A>,
  b: SchemaObjectInstance<B>,
) {
  a.if(
    { prefixItems: true },
    {
      then: (a) => {
        b.if(
          { prefixItems: true },
          {
            then: (b) => {
              b.schema.items = a.schema.items;
              b.schema.prefixItems = a.schema.prefixItems;
              b.schema.additionalItems = a.schema.additionalItems;
            },
            else: (b) => {
              // @ts-expect-error: derp
              b.schema.items = a.schema.prefixItems;
              b.schema.additionalItems = a.schema.items;
            },
          },
        );
      },
      else: (a) => {
        b.if(
          { prefixItems: true },
          {
            then: (b) => {
              // @ts-expect-error: derp
              b.schema.items = a.schema.items;
              // @ts-expect-error: derp
              b.schema.prefixItems = a.schema.prefixItems;
              // @ts-expect-error: derp
              b.schema.additionalItems = a.schema.additionalItems;
            },
            else: (b) => {
              b.schema.items = a.schema.items;
              b.schema.prefixItems = a.schema.prefixItems;
              b.schema.additionalItems = a.schema.additionalItems;
            },
          },
        );
      },
    },
  );

  return b;
}
