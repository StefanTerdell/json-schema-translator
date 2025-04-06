import { TransformerFunction } from "./TransformFunction.ts";

export const transformNumbers: TransformerFunction = (input, output) => {
  output.schema.multipleOf = input.schema.multipleOf;

  if (input.settings.booleanExclusiveMinimumAndMaximum) {
    if (output.settings.booleanExclusiveMinimumAndMaximum) {
      output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
      output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
      output.schema.minimum = input.schema.minimum;
      output.schema.maximum = input.schema.maximum;
    } else {
      if (input.schema.exclusiveMaximum) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMaximum = input.schema.maximum;
      } else {
        output.schema.maximum = input.schema.maximum;
      }

      if (input.schema.exclusiveMinimum) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMinimum = input.schema.minimum;
      } else {
        output.schema.minimum = input.schema.minimum;
      }
    }
  } else {
    if (output.settings.booleanExclusiveMinimumAndMaximum) {
      if (input.schema.exclusiveMaximum !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.maximum = input.schema.exclusiveMaximum;
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMaximum = true;
      } else {
        output.schema.maximum = input.schema.maximum;
      }

      if (input.schema.exclusiveMinimum !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.minimum = input.schema.exclusiveMinimum;
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMinimum = true;
      } else {
        output.schema.minimum = input.schema.minimum;
      }
    } else {
      output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
      output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
      output.schema.minimum = input.schema.minimum;
      output.schema.maximum = input.schema.maximum;
    }
  }
};
