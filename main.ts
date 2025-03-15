type Loose<T extends string> = T extends JsonSchemaKeywords
  ? never
  : // deno-lint-ignore ban-types
    T | (string & {});

type JsonSchemaSettings = {
  // shared
  $schema: string | undefined;
  $idPath: Loose<"id" | "$id">;
  booleanSchemas: boolean;
  integerType: boolean;
  nullType: boolean;
  nullable: boolean;

  // annotations
  $comment: boolean;
  deprecated: boolean;
  examples: boolean;
  $vocabulary: boolean;
  readWriteOnly: boolean;

  // array
  contains: boolean;
  minAndMaxContains: boolean;
  prefixItems: boolean;
  unevaluatedItems: boolean;

  // number
  booleanExclusiveMinimumAndMaximum: boolean;

  // content
  contentMediaTypeAndEncoding: boolean;
  contentSchema: boolean;
  media: boolean;

  // constants
  nonEmptyEnum: boolean;
  const: boolean;

  // structuring
  $dynamicAnchorAndRef: boolean;
  $recursiveAnchorAndRef: boolean;
  $defsPath: Loose<"$defs" | "definitions">;
  $anchor: boolean;

  // string
  format: boolean | string[];

  // conditional
  ifThenElse: boolean;

  // object
  nonEmptyRequired: boolean;
  nonEmptyDependencies: boolean;

  addNullTypeToOptional: boolean;
  addNullableToOptional: boolean;
  addAllOptionalToRequired: boolean;

  dependentRequiredAndSchemas: boolean;
  unevaluatedProperties: boolean;
  propertyNames: boolean;
};

class JsonSchemaSettingsAsserter<T extends JsonSchemaSettings> {
  constructor(private settings: T) {}

  // shared
  $schema(): T["$schema"] | undefined {
    return this.settings["$schema"];
  }

  $idPath(): T["$idPath"] | undefined {
    return this.settings["$idPath"];
  }

  booleanSchemas(
    schema: unknown,
  ): schema is JsonSchema<T & { booleanSchemas: true }> {
    return this.settings.booleanSchemas;
  }

  integerType(schema: unknown): schema is JsonSchema<T> {
    return this.settings.integerType;
  }
  nullType(schema: unknown): schema is JsonSchema<T> {
    return this.settings.nullType;
  }
  nullable(schema: unknown): schema is JsonSchema<T> {
    return this.settings.nullable;
  }

  // annotations
  $comment(schema: unknown): schema is JsonSchema<T> {
    return this.settings.$comment;
  }
  deprecated(schema: unknown): schema is JsonSchema<T> {
    return this.settings.deprecated;
  }
  examples(schema: unknown): schema is JsonSchema<T> {
    return this.settings.examples;
  }
  $vocabulary(schema: unknown): schema is JsonSchema<T> {
    return this.settings.$vocabulary;
  }
  readWriteOnly(schema: unknown): schema is JsonSchema<T> {
    return this.settings.readWriteOnly;
  }

  // array
  contains(schema: unknown): schema is JsonSchema<T> {
    return this.settings.contains;
  }
  minAndMaxContains(schema: unknown): schema is JsonSchema<T> {
    return this.settings.minAndMaxContains;
  }
  prefixItems(schema: unknown): schema is JsonSchema<T> {
    return this.settings.prefixItems;
  }
  unevaluatedItems(schema: unknown): schema is JsonSchema<T> {
    return this.settings.unevaluatedItems;
  }

  // number
  booleanExclusiveMinimumAndMaximum(schema: unknown): schema is JsonSchema<T> {
    return this.settings.booleanExclusiveMinimumAndMaximum;
  }

  // content
  contentMediaTypeAndEncoding(schema: unknown): schema is JsonSchema<T> {
    return this.settings.contentMediaTypeAndEncoding;
  }
  contentSchema(schema: unknown): schema is JsonSchema<T> {
    return this.settings.contentSchema;
  }
  media(schema: unknown): schema is JsonSchema<T> {
    return this.settings.media;
  }

  // constants
  nonEmptyEnum(schema: unknown): schema is JsonSchema<T> {
    return this.settings.nonEmptyEnum;
  }
  const(schema: unknown): schema is JsonSchema<T> {
    return this.settings.const;
  }

  // structuring
  $dynamicAnchorAndRef(schema: unknown): schema is JsonSchema<T> {
    return this.settings.$dynamicAnchorAndRef;
  }
  $recursiveAnchorAndRef(schema: unknown): schema is JsonSchema<T> {
    return this.settings.$recursiveAnchorAndRef;
  }
  $defsPath(): T["$defsPath"] {
    return this.settings.$defsPath;
  }

  $anchor(schema: unknown): schema is JsonSchema<T> {
    return this.settings.$anchor;
  }

  // string
  // format: boolean | string[];

  // // conditional
  // ifThenElse: boolean;

  // // object
  // nonEmptyRequired: boolean;
  // nonEmptyDependencies: boolean;

  // addNullTypeToOptional: boolean;
  // addNullableToOptional: boolean;
  // addAllOptionalToRequired: boolean;

  // dependentRequiredAndSchemas: boolean;
  // unevaluatedProperties: boolean;
  // propertyNames: boolean;
}

// & ValidateOptionsAddNullType &
//  ValidateOptionsRequired &
//  ValidateContains;
// type ValidateOptionsAddNullType =
//   | {
//       optionsAddNullType: true;
//       useNullType: true;
//     }
//   | {
//       optionsAddNullType: false;
//     }
//   | {
//       error: "optionsAddNullType must be false unless useNullType is true";
//     };
// type ValidateOptionsRequired =
//   | {
//       optionsRequired: true;
//       optionsAddNullType: true;
//     }
//   | {
//       optionsRequired: true;
//       optionsAddNullableKeyword: true;
//     }
//   | {
//       optionsRequired: false;
//     }
//   | {
//       error: "optionsRequired must be false unless optionsAddNullType or optionsAddNullableKeyword is true";
//     };
// type ValidateContains =
//   | {
//       useMinMaxContains: true;
//       useContains: true;
//     }
//   | {
//       useMinMaxContains: false;
//     };

type JsonSchemaType<Settings extends JsonSchemaSettings> = Loose<
  | "string"
  | "number"
  | "object"
  | "array"
  | "boolean"
  | (Settings["nullType"] extends true ? "null" : never)
  | (Settings["integerType"] extends true ? "integer" : never)
>;

type JsonSchema<
  Options extends JsonSchemaSettings,
  ForceAllowBooleanSchema extends boolean = false,
> =
  | JsonSchemaObject<Options>
  | (Options["booleanSchemas"] extends true ? boolean : never)
  | (ForceAllowBooleanSchema extends true ? boolean : never);

type Json =
  | string
  | number
  | boolean
  | null
  | Array<Json>
  | { [Key in string]?: Json };

type JsonSchemaKeywordsObject<T extends JsonSchemaSettings> = {
  // shared
  $schema?: T["$schema"];
  $vocabulary?: T["$vocabulary"] extends true ? string : unknown;
  type?: JsonSchemaType<T> | Array<JsonSchemaType<T>>;
  nullable?: T["nullable"] extends true ? boolean : unknown;

  // strings:
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: T["format"] extends true
    ? string
    : T["format"] extends (infer F extends string)[]
      ? Loose<F>
      : unknown;

  // numbers:
  multipleOf?: number;
  minimum?: number;
  exclusiveMinimum?: T["booleanExclusiveMinimumAndMaximum"] extends true
    ? boolean
    : number;
  exclusiveMaximum?: T["booleanExclusiveMinimumAndMaximum"] extends true
    ? boolean
    : number;
  maximum?: number;
  // objects:

  required?: T["nonEmptyRequired"] extends true
    ? [string, ...string[]]
    : string[];
  properties?: Record<string, JsonSchema<T>>;
  additionalProperties?: JsonSchema<T, true>;
  patternProperties?: Record<string, JsonSchema<T>>;
  unevaluatedPropertes?: T["unevaluatedProperties"] extends true
    ? JsonSchema<T>
    : unknown;
  propertyNames?: T["propertyNames"] extends true
    ? Omit<JsonSchemaObject<T>, "type"> | boolean
    : unknown;
  maxProperties?: number;
  minProperties?: number;

  // arrays:
  items?:
    | JsonSchema<T>
    | (T["prefixItems"] extends true ? unknown : Array<JsonSchema<T>>);
  prefixItems?: T["prefixItems"] extends true ? Array<JsonSchema<T>> : unknown;
  additionalItems?: JsonSchema<T, true>;
  unevaluatedItems?: T["unevaluatedItems"] extends true
    ? JsonSchema<T>
    : unknown;
  contains?: T["contains"] extends true ? JsonSchema<T> : unknown;
  minContains?: T["minAndMaxContains"] extends true ? number : unknown;
  maxContains?: T["minAndMaxContains"] extends true ? number : unknown;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // composition:
  anyOf?: Array<JsonSchema<T>>;
  oneOf?: Array<JsonSchema<T>>;
  allOf?: Array<JsonSchema<T>>;
  not?: JsonSchema<T>;

  // conditionals
  dependencies?: Record<
    string,
    | (T["nonEmptyDependencies"] extends true
        ? [string, ...string[]]
        : string[])
    | JsonSchema<T>
  >;
  dependentRequired?: T["dependentRequiredAndSchemas"] extends true
    ? Record<string, Array<string>>
    : unknown;
  dependentSchemas?: T["dependentRequiredAndSchemas"] extends true
    ? Record<string, JsonSchema<T>>
    : unknown;

  if?: JsonSchema<T>;
  then?: JsonSchema<T>;
  else?: JsonSchema<T>;

  // annotations
  title?: string;
  description?: string;
  default?: Json;
  examples?: T["examples"] extends true ? Array<Json> : unknown;
  deprecated?: T["deprecated"] extends true ? boolean : unknown;
  readOnly?: T["readWriteOnly"] extends true ? boolean : unknown;
  writeOnly?: T["readWriteOnly"] extends true ? boolean : unknown;
  $comment?: T["$comment"] extends true ? string : unknown;

  // contants
  enum?: T["nonEmptyEnum"] extends true ? [Json, ...Json[]] : Json[];
  const?: T["const"] extends true ? Json : unknown;

  // content
  contentEncoding?: T["contentMediaTypeAndEncoding"] extends true
    ? Loose<"quoted-printable" | "base16" | "base32" | "base64">
    : unknown;
  contentMediaType?: T["contentMediaTypeAndEncoding"] extends true
    ? string
    : unknown;
  contentSchema?: T["contentSchema"] extends true ? JsonSchema<T> : unknown;
  media?: T["media"] extends true
    ? {
        binaryEncoding?: string;
        type?: string;
      }
    : unknown;

  // structuring
  $anchor?: T["$anchor"] extends true ? string : unknown;
  $ref?: string;
  $recursiveAnchor?: T["$recursiveAnchorAndRef"] extends true
    ? string
    : unknown;
  $recursiveRef?: T["$recursiveAnchorAndRef"] extends true ? string : unknown;
  $dynamicAnchor?: T["$dynamicAnchorAndRef"] extends true ? string : unknown;
  $dynamicRef?: T["$dynamicAnchorAndRef"] extends true ? string : unknown;
};

// deno-lint-ignore no-explicit-any
type JsonSchemaKeywords = keyof JsonSchemaKeywordsObject<any>;

type JsonSchemaObject<T extends JsonSchemaSettings> =
  JsonSchemaKeywordsObject<T> & {
    [Key in Exclude<T["$defsPath"], JsonSchemaKeywords>]?: {
      [Key in string]?: JsonSchema<T>;
    };
  } & {
    [Key in Exclude<T["$idPath"], JsonSchemaKeywords>]?: string;
  } & {
    [Key in string]?: Json;
  };

class JsonSchemaDraft2020_12Transformer<
  IntoSettings extends JsonSchemaSettings,
> {
  constructor(private intoSettings: IntoSettings) {}

  // public transform(from: JsonSchemaDraft2020_12): JsonSchema<IntoSettings> {
  //   if (typeof from === "boolean") {
  //     if (this.intoSettings.booleanSchemas) {
  //       // @ts-expect-error: stfu
  //       return from;
  //     } else {
  //       // @ts-expect-error: stfu
  //       return from ? {} : { not: {} };
  //     }
  //   }

  //   // const fromId = from[this.fromSettings.$idPath];

  //   const into: JsonSchema<IntoSettings> = {};

  //   if (typeof fromId === "string") {
  //     // @ts-expect-error: stfu
  //     into[this.intoSettings.$idPath] = fromId;
  //   }

  //   if (from.type || from.nullable === true) {
  //     if (Array.isArray(from.type)) {
  //       if (this.intoSettings.nullType) {
  //         into.type = from.type;
  //       } else {
  //         into.type = from.type.filter((type) => type !== "null");
  //       }
  //       if (from.type.includes("null") && this.intoSettings.nullable) {
  //         into.nullable = true;
  //       }
  //     } else if (from.type === "null") {
  //       if (this.intoSettings.nullType) {
  //         into.type = "null";
  //       }
  //       if (this.intoSettings.nullable) {
  //         into.nullable = true;
  //       }
  //     }
  //     if (this.intoSettings.nullType) {
  //       into.type = from.type;
  //     } else if (Array.isArray(from.type)) {
  //       into.type = from.type.filter((type) => type !== "null");
  //     } else if (from.type !== "nu") {
  //       into.type;
  //     }
  //   }

  //   return into;
  // }
}

const jsonSchemaDraft4Settings = {
  $defsPath: "definitions",
  booleanExclusiveMinimumAndMaximum: true,
  $idPath: "id",
  $schema: "https://json-schema.org/draft-04/schema",
  nonEmptyEnum: false,
  nonEmptyRequired: true,
  nonEmptyDependencies: true,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: false,
  $anchor: false,
  booleanSchemas: false,
  const: false,
  contains: false,
  contentMediaTypeAndEncoding: false,
  contentSchema: false,
  deprecated: false,
  $dynamicAnchorAndRef: false,
  examples: false,
  format: [
    "date-time",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uri",
    //
  ],
  ifThenElse: false,
  integerType: true,
  media: false,
  minAndMaxContains: false,
  nullType: true,
  nullable: false,
  prefixItems: false,
  propertyNames: false,
  readWriteOnly: false,
  $recursiveAnchorAndRef: false,
  dependentRequiredAndSchemas: false,
  unevaluatedItems: false,
  unevaluatedProperties: false,
  $vocabulary: false,
} satisfies JsonSchemaSettings;

const jsonSchemaDraft6Settings = {
  $defsPath: "definitions",
  booleanExclusiveMinimumAndMaximum: false,
  $idPath: "$id",
  $schema: "https://json-schema.org/draft-06/schema",
  nonEmptyEnum: false,
  nonEmptyRequired: false,
  nonEmptyDependencies: false,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: false,
  $anchor: false,
  booleanSchemas: false,
  const: true,
  contains: true,
  contentMediaTypeAndEncoding: false,
  contentSchema: false,
  deprecated: false,
  $dynamicAnchorAndRef: false,
  examples: true,
  format: [
    "date-time",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "json-pointer",
    "uri",
    "uri-reference",
    "uri-template",
    //
  ] as const,
  ifThenElse: false,
  integerType: true,
  media: true,
  minAndMaxContains: false,
  nullType: true,
  nullable: false,
  prefixItems: false,
  propertyNames: true,
  readWriteOnly: false,
  $recursiveAnchorAndRef: false,
  dependentRequiredAndSchemas: false,
  unevaluatedItems: false,
  unevaluatedProperties: false,
  $vocabulary: false,
} satisfies JsonSchemaSettings;

const jsonSchemaDraft7Settings = {
  $defsPath: "definitions",
  booleanExclusiveMinimumAndMaximum: false,
  $idPath: "$id",
  $schema: "https://json-schema.org/draft-07/schema",
  nonEmptyEnum: false,
  nonEmptyRequired: false,
  nonEmptyDependencies: false,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: true,
  $anchor: false,
  booleanSchemas: false,
  const: true,
  contains: true,
  contentMediaTypeAndEncoding: true,
  contentSchema: false,
  deprecated: false,
  $dynamicAnchorAndRef: false,
  examples: true,
  format: [
    "date",
    "date-time",
    "email",
    "hostname",
    "idn-email",
    "idn-hostname",
    "ipv4",
    "ipv6",
    "iri",
    "iri-reference",
    "json-pointer",
    "regex",
    "relative-json-pointer",
    "time",
    "uri",
    "uri-reference",
    "uri-template",
  ] as const,
  ifThenElse: true,
  integerType: true,
  media: false,
  minAndMaxContains: false,
  nullType: true,
  nullable: false,
  prefixItems: false,
  propertyNames: true,
  readWriteOnly: true,
  $recursiveAnchorAndRef: false,
  dependentRequiredAndSchemas: false,
  unevaluatedItems: false,
  unevaluatedProperties: false,
  $vocabulary: false,
} satisfies JsonSchemaSettings;

const jsonSchemaDraft2019_09Settings = {
  $defsPath: "$defs",
  booleanExclusiveMinimumAndMaximum: false,
  $idPath: "$id",
  $schema: "https://json-schema.org/draft/2019-09/schema",
  nonEmptyEnum: false,
  nonEmptyRequired: false,
  nonEmptyDependencies: false,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: true,
  $anchor: true,
  booleanSchemas: false,
  const: true,
  contains: true,
  contentMediaTypeAndEncoding: true,
  contentSchema: true,
  deprecated: true,
  $dynamicAnchorAndRef: false,
  examples: true,
  format: [
    "date",
    "date-time",
    "duration",
    "email",
    "hostname",
    "idn-email",
    "idn-hostname",
    "ipv4",
    "ipv6",
    "iri",
    "iri-reference",
    "json-pointer",
    "regex",
    "relative-json-pointer",
    "time",
    "uri",
    "uri-reference",
    "uri-template",
    "uuid",
  ] as const,
  ifThenElse: true,
  integerType: true,
  media: false,
  minAndMaxContains: true,
  nullType: true,
  nullable: false,
  prefixItems: false,
  propertyNames: true,
  readWriteOnly: true,
  $recursiveAnchorAndRef: true,
  dependentRequiredAndSchemas: true,
  unevaluatedItems: true,
  unevaluatedProperties: true,
  $vocabulary: true,
} satisfies JsonSchemaSettings;

const jsonSchemaDraft2020_12Settings = {
  $defsPath: "$defs",
  booleanExclusiveMinimumAndMaximum: false,
  $idPath: "$id",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  nonEmptyEnum: false,
  nonEmptyRequired: false,
  nonEmptyDependencies: false,
  addNullableToOptional: false,
  addNullTypeToOptional: false,
  addAllOptionalToRequired: false,
  $comment: true,
  $anchor: true,
  booleanSchemas: true,
  const: true,
  contains: true,
  contentMediaTypeAndEncoding: true,
  contentSchema: true,
  deprecated: true,
  $dynamicAnchorAndRef: true,
  examples: true,
  format: [
    "date",
    "date-time",
    "duration",
    "email",
    "hostname",
    "idn-email",
    "idn-hostname",
    "ipv4",
    "ipv6",
    "iri",
    "iri-reference",
    "json-pointer",
    "regex",
    "relative-json-pointer",
    "time",
    "uri",
    "uri-reference",
    "uri-template",
    "uuid",
  ] as const,
  ifThenElse: true,
  integerType: true,
  media: false,
  minAndMaxContains: true,
  nullType: true,
  nullable: false,
  prefixItems: true,
  propertyNames: true,
  readWriteOnly: true,
  $recursiveAnchorAndRef: true,
  dependentRequiredAndSchemas: true,
  unevaluatedItems: true,
  unevaluatedProperties: true,
  $vocabulary: true,
} satisfies JsonSchemaSettings;

type JsonSchemaDraft2020_12 = JsonSchema<typeof jsonSchemaDraft2020_12Settings>;

const x: JsonSchemaDraft2020_12 = true;

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}

const hmm = new JsonSchemaSettingsAsserter(jsonSchemaDraft7Settings);

function hmmmm<T extends JsonSchemaSettings>(
  settings: T,
  schema: JsonSchema<T>,
) {
  const schemaClass = new JsonSchemaSettingsAsserter(settings);

  if (schemaClass.booleanSchemas(schema)) {
    schema;
  }
}

function transformDraft2020_12<IntoSettings extends JsonSchemaSettings>(
  from: JsonSchemaDraft2020_12,
  intoSettings: IntoSettings,
): JsonSchema<IntoSettings> {
  if (typeof from === "boolean") {
    if (intoSettings.booleanSchemas) {
      // @ts-expect-error: stfu
      return from;
    } else {
      // @ts-expect-error: stfu
      return from ? {} : { not: {} };
    }
  }

  const into: JsonSchemaObject<IntoSettings> = {};

  if (intoSettings.$schema) {
    into.$schema = intoSettings.$schema;
  }

  if (from.$vocabulary) {
    if (intoSettings.$vocabulary) {
      into.$vocabulary = from.$vocabulary;
    }
  }

  if (from.$id !== undefined) {
    // @ts-expect-error: stfu
    into[intoSettings.$idPath] = from.$id;
  }

  if (from.type) {
    if (Array.isArray(from.type)) {
      into.type = from.type.reduce(
        (types: JsonSchemaType<IntoSettings>[], type) => {
          if (type === "null") {
            if (intoSettings.nullable) {
              into.nullable = true;
            }

            if (intoSettings.nullType) {
              types.push(type);
            }
          } else if (type === "integer") {
            if (intoSettings.integerType) {
              types.push(type);
            } else {
              if (!types.includes("number")) {
                types.push("number");
              }

              into.multipleOf = 1;
            }
          } else {
            types.push(type);
          }

          return types;
        },
        [],
      );
    } else {
      if (from.type === "null") {
        if (intoSettings.nullable) {
          into.nullable = true;
        }

        if (intoSettings.nullType) {
          into.type = from.type;
        }
      } else if (from.type === "integer") {
        if (intoSettings.integerType) {
          into.type = from.type;
        } else {
          into.type = "number";
          into.multipleOf = 1;
        }
      }
    }
  }

  if (from.$anchor !== undefined) {
    if (intoSettings.$anchor) {
      into.$anchor = from.$anchor;
    }
  }

  if (from.$comment !== undefined) {
    if (intoSettings.$comment) {
      into.$comment = from.$comment;
    }
  }

  if (from.$defs) {
    // @ts-expect-error: stfu
    into[intoSettings.$defsPath] = Object.keys(from.$defs).reduce(
      (acc: { [key: string]: JsonSchema<IntoSettings> }, key) => {
        // @ts-expect-error: stfu
        acc[key] = transformDraft2020_12(from.$defs![key], intoSettings);

        return acc;
      },
      {},
    );
  }

  if (from.$dynamicAnchor !== undefined) {
    if (intoSettings.$dynamicAnchorAndRef) {
      into.$dynamicAnchor = from.$dynamicAnchor;
    }
  }

  if (from.$dynamicRef !== undefined) {
    if (intoSettings.$dynamicAnchorAndRef) {
      into.$dynamicRef = from.$dynamicRef;
    }
  }

  if (from.$recursiveAnchor !== undefined) {
    if (intoSettings.$recursiveAnchorAndRef) {
      into.$recursiveAnchor = from.$recursiveAnchor;
    }
  }

  if (from.$recursiveRef !== undefined) {
    if (intoSettings.$recursiveAnchorAndRef) {
      into.$recursiveRef = from.$recursiveRef;
    }
  }

  if (from.$ref !== undefined) {
    into.$ref = from.$ref;
  }

  if (from.allOf !== undefined) {
    into.allOf = from.allOf.map((x) => transformDraft2020_12(x, intoSettings));
  }

  if (from.anyOf !== undefined) {
    into.anyOf = from.anyOf.map((x) => transformDraft2020_12(x, intoSettings));
  }

  if (from.oneOf !== undefined) {
    into.oneOf = from.oneOf.map((x) => transformDraft2020_12(x, intoSettings));
  }

  if (intoSettings.ifThenElse) {
    if (from.if !== undefined) {
      into.if = transformDraft2020_12(from.if, intoSettings);
    }

    if (from.then !== undefined) {
      into.then = transformDraft2020_12(from.then, intoSettings);
    }

    if (from.else !== undefined) {
      into.else = transformDraft2020_12(from.else, intoSettings);
    }
  }

  if (from.not !== undefined) {
    into.not = transformDraft2020_12(from.not, intoSettings);
  }

  if (from.const !== undefined) {
    if (intoSettings.const) {
      into.const = from.const;
    } else {
      into.enum = [from.const];
    }
  }

  if (from.enum !== undefined) {
    if (from.enum.length || !intoSettings.nonEmptyEnum) {
      // @ts-expect-error: stfu
      into.enum = into.enum ? [into.enum[0], ...from.enum] : from.enum;
    }
  }

  if (from.default !== undefined) {
    into.default = from.default;
  }

  if (from.examples !== undefined) {
    into.examples = from.examples;
  }

  if (from.title !== undefined) {
    into.title = from.title;
  }

  if (from.description !== undefined) {
    into.description = from.description;
  }

  // String stuff

  if (from.format !== undefined) {
    if (
      intoSettings.format === true ||
      (Array.isArray(intoSettings.format) &&
        intoSettings.format.includes(from.format))
    ) {
      // @ts-expect-error: stfu
      into.format = from.format;
    }
  }

  if (from.maxLength !== undefined) {
    into.maxLength = from.maxLength;
  }

  if (from.minLength !== undefined) {
    into.minLength = from.minLength;
  }

  if (from.pattern !== undefined) {
    into.pattern = from.pattern;
  }

  // if (from.contentEncoding)
  //   if (intoSettings.media) {
  //     into.media;
  //   }
  //

  if (intoSettings.booleanSchemas) {
    const keys = Object.keys(into);

    if (keys.length === 0) {
      // @ts-expect-error: stfu
      return true;
    }

    if (keys.length === 1 && "not" in into && into.not !== undefined) {
      if (typeof into.not === "boolean") {
        // @ts-expect-error: stfu
        return !into.not;
      } else if (!Object.keys(into.not).length) {
        // @ts-expect-error: stfu
        return false;
      }
    }
  }

  return into;
}
