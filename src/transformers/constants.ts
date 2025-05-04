import { Json } from "../Json.ts";
import { isNonEmptyArray, NonEmptyArray } from "../utils.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformConstants: TransformerFunction = (input, output) => {
  const values: Json[] = input.schema.enum ?? [];

  if (input.settings.const && input.schema.const !== undefined) {
    values.push(input.schema.const);
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
};
