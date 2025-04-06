import { JsonSchemaKeywords } from "./JsonSchema.ts";

export type JsonSchemaSettingsError<T extends { [key: string]: unknown }> =
  CheckAll<
    [
      JsonSchemaKeywordConflict<T, "$idPath">,
      JsonSchemaKeywordConflict<T, "$defsPath">,
    ]
  >;

export type JsonSchemaKeywordConflict<
  T extends { [key: string]: unknown },
  Key extends keyof T & string,
> = T[Key] extends JsonSchemaKeywords & string
  ? `Value of option '${Key}' conflicts with protected json schema keyword ('${T[Key]}')!`
  : null;

export type CheckAll<T> = T extends [infer Head, ...infer Tail]
  ? Head extends string
    ? Head
    : CheckAll<Tail>
  : null;

// const asldljasdl: JsonSchemaSettingsError<{ $idPath: "type" }> = null;

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
