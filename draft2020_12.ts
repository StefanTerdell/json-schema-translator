import { JsonSchema } from "./JsonSchema.ts";
import { JsonSchemaSettings } from "./JsonSchemaSettings.ts";

export const jsonSchemaDraft2020_12Settings = {
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
  readAndWriteOnly: true,
  $recursiveAnchorAndRef: true,
  dependentRequiredAndSchemas: true,
  unevaluatedItems: true,
  unevaluatedProperties: true,
  $vocabulary: true,
} satisfies JsonSchemaSettings;

export type JsonSchemaDraft2020_12Settings =
  typeof jsonSchemaDraft2020_12Settings;
export type JsonSchemaDraft2020_12 = JsonSchema<JsonSchemaDraft2020_12Settings>;

// type Settings = {
//   asBoolean: boolean;
// };

// type Replace<T extends object, O extends { [Key in keyof T]?: unknown }> = {
//   [Key in keyof T]: Key extends keyof O ? O[Key] : T[Key];
// };

// type Output<S extends Settings> = S["asBoolean"] extends true
//   ? boolean
//   : number;

// // function transform<S extends Settings>(from: boolean, settings: S): Output<S> {
//   if (settings.asBoolean) {
//     const result: Output<Settings & { asBoolean: true }> = from;

//     return result as Output<S>;
//   } else {
//     const result: Output<Replace<Settings, { asBoolean: false }>> = from
//       ? 1
//       : 0;

//     return result as Output<S>;
//   }
// }

// const res = transform(true, { asBoolean: false } as const);

// function transformBooleanSchema<IntoSettings extends JsonSchemaSettings>(
//   from: boolean,
//   settings: IntoSettings,
// ): JsonSchema<IntoSettings> {
//   return settings.booleanSchemas ? from : {};
// }

// function transformDraft2020_12<IntoSettings extends JsonSchemaSettings>(
//   from: JsonSchemaDraft2020_12,
//   intoSettings: IntoSettings,
// ): JsonSchema<IntoSettings> {
//   if (typeof from === "boolean") {
//     if (intoSettings.booleanSchemas) {
//       const result: JsonSchema<
//         Replace<IntoSettings, { booleanSchemas: true }>
//       > = from;

//       return result;
//     } else {
//       const result: JsonSchema<IntoSettings> = from ? {} : { not: {} };

//       // @ts-expect-error: stfu
//       return from ? {} : { not: {} };
//     }
//   }

//   const into: JsonSchemaObject<IntoSettings> = {};

//   if (intoSettings.$schema) {
//     into.$schema = intoSettings.$schema;
//   }

//   if (from.$vocabulary) {
//     if (intoSettings.$vocabulary) {
//       into.$vocabulary = from.$vocabulary;
//     }
//   }

//   if (from.$id !== undefined) {
//     // @ts-expect-error: stfu
//     into[intoSettings.$idPath] = from.$id;
//   }

//   if (from.type) {
//     if (Array.isArray(from.type)) {
//       into.type = from.type.reduce(
//         (types: JsonSchemaType<IntoSettings>[], type) => {
//           if (type === "null") {
//             if (intoSettings.nullable) {
//               into.nullable = true;
//             }

//             if (intoSettings.nullType) {
//               types.push(type);
//             }
//           } else if (type === "integer") {
//             if (intoSettings.integerType) {
//               types.push(type);
//             } else {
//               if (!types.includes("number")) {
//                 types.push("number");
//               }

//               into.multipleOf = 1;
//             }
//           } else {
//             types.push(type);
//           }

//           return types;
//         },
//         [],
//       );
//     } else {
//       if (from.type === "null") {
//         if (intoSettings.nullable) {
//           into.nullable = true;
//         }

//         if (intoSettings.nullType) {
//           into.type = from.type;
//         }
//       } else if (from.type === "integer") {
//         if (intoSettings.integerType) {
//           into.type = from.type;
//         } else {
//           into.type = "number";
//           into.multipleOf = 1;
//         }
//       }
//     }
//   }

//   if (from.$anchor !== undefined) {
//     if (intoSettings.$anchor) {
//       into.$anchor = from.$anchor;
//     }
//   }

//   if (from.$comment !== undefined) {
//     if (intoSettings.$comment) {
//       into.$comment = from.$comment;
//     }
//   }

//   if (from.$defs) {
//     // @ts-expect-error: stfu
//     into[intoSettings.$defsPath] = Object.keys(from.$defs).reduce(
//       (acc: { [key: string]: JsonSchema<IntoSettings> }, key) => {
//         // @ts-expect-error: stfu
//         acc[key] = transformDraft2020_12(from.$defs![key], intoSettings);

//         return acc;
//       },
//       {},
//     );
//   }

//   if (from.$dynamicAnchor !== undefined) {
//     if (intoSettings.$dynamicAnchorAndRef) {
//       into.$dynamicAnchor = from.$dynamicAnchor;
//     }
//   }

//   if (from.$dynamicRef !== undefined) {
//     if (intoSettings.$dynamicAnchorAndRef) {
//       into.$dynamicRef = from.$dynamicRef;
//     }
//   }

//   if (from.$recursiveAnchor !== undefined) {
//     if (intoSettings.$recursiveAnchorAndRef) {
//       into.$recursiveAnchor = from.$recursiveAnchor;
//     }
//   }

//   if (from.$recursiveRef !== undefined) {
//     if (intoSettings.$recursiveAnchorAndRef) {
//       into.$recursiveRef = from.$recursiveRef;
//     }
//   }

//   if (from.$ref !== undefined) {
//     into.$ref = from.$ref;
//   }

//   if (from.allOf !== undefined) {
//     into.allOf = from.allOf.map((x) => transformDraft2020_12(x, intoSettings));
//   }

//   if (from.anyOf !== undefined) {
//     into.anyOf = from.anyOf.map((x) => transformDraft2020_12(x, intoSettings));
//   }

//   if (from.oneOf !== undefined) {
//     into.oneOf = from.oneOf.map((x) => transformDraft2020_12(x, intoSettings));
//   }

//   if (intoSettings.ifThenElse) {
//     if (from.if !== undefined) {
//       into.if = transformDraft2020_12(from.if, intoSettings);
//     }

//     if (from.then !== undefined) {
//       into.then = transformDraft2020_12(from.then, intoSettings);
//     }

//     if (from.else !== undefined) {
//       into.else = transformDraft2020_12(from.else, intoSettings);
//     }
//   }

//   if (from.not !== undefined) {
//     into.not = transformDraft2020_12(from.not, intoSettings);
//   }

//   if (from.const !== undefined) {
//     if (intoSettings.const) {
//       into.const = from.const;
//     } else {
//       into.enum = [from.const];
//     }
//   }

//   if (from.enum !== undefined) {
//     if (from.enum.length || !intoSettings.nonEmptyEnum) {
//       // @ts-expect-error: stfu
//       into.enum = into.enum ? [into.enum[0], ...from.enum] : from.enum;
//     }
//   }

//   if (from.default !== undefined) {
//     into.default = from.default;
//   }

//   if (from.examples !== undefined) {
//     into.examples = from.examples;
//   }

//   if (from.title !== undefined) {
//     into.title = from.title;
//   }

//   if (from.description !== undefined) {
//     into.description = from.description;
//   }

//   // String stuff
//   if (from.format !== undefined) {
//     if (
//       intoSettings.format === true ||
//       (Array.isArray(intoSettings.format) &&
//         intoSettings.format.includes(from.format))
//     ) {
//       // @ts-expect-error: stfu
//       into.format = from.format;
//     }
//   }

//   if (from.maxLength !== undefined) {
//     into.maxLength = from.maxLength;
//   }

//   if (from.minLength !== undefined) {
//     into.minLength = from.minLength;
//   }

//   if (from.pattern !== undefined) {
//     into.pattern = from.pattern;
//   }

//   // if (from.contentEncoding)
//   //   if (intoSettings.media) {
//   //     into.media;
//   //   }
//   //
//   if (intoSettings.booleanSchemas) {
//     const keys = Object.keys(into);

//     if (keys.length === 0) {
//       // @ts-expect-error: stfu
//       return true;
//     }

//     if (keys.length === 1 && "not" in into && into.not !== undefined) {
//       if (typeof into.not === "boolean") {
//         // @ts-expect-error: stfu
//         return !into.not;
//       } else if (!Object.keys(into.not).length) {
//         // @ts-expect-error: stfu
//         return false;
//       }
//     }
//   }

//   return into;
// }
