import { type Json } from "../Json.ts";
import { isNonEmptyArray, type NonEmptyArray } from "../utils.ts";
import { type Mutator } from "./Mutator.ts";

export const translateConstantKeywords: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  const values: Json[] = input.schema.enum ?? [];

  if (input.settings.const) {
    if (input.schema.const !== undefined) {
      values.push(input.schema.const);
    }

    handledKeys.add("const");
  }

  if (isNonEmptyArray(values)) {
    if (values.length === 1) {
      if (output.settings.const) {
        output.schema.const = values[0];
      } else {
        output.schema.enum = values as NonEmptyArray<Json>;
      }
    } else {
      output.schema.enum = values as NonEmptyArray<Json>;
    }
  } else if (input.schema.enum !== undefined && !output.settings.nonEmptyEnum) {
    // @ts-expect-error ISSUE: Narrowing breaks across generics
    output.schema.enum = [];
  }

  handledKeys.add("enum");
};
