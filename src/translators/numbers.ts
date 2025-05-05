import { Mutator } from "./Mutator.ts";

export const translateNumberKeywords: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.schema.multipleOf !== undefined) {
    output.schema.multipleOf = input.schema.multipleOf;
  }

  handledKeys.add("multipleOf");

  if (input.settings.booleanExclusiveMinimumAndMaximum) {
    if (output.settings.booleanExclusiveMinimumAndMaximum) {
      if (input.schema.exclusiveMaximum !== undefined) {
        output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
      }

      if (input.schema.exclusiveMinimum !== undefined) {
        output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
      }

      if (input.schema.minimum !== undefined) {
        output.schema.minimum = input.schema.minimum;
      }

      if (input.schema.maximum !== undefined) {
        output.schema.maximum = input.schema.maximum;
      }
    } else {
      if (input.schema.maximum !== undefined) {
        if (input.schema.exclusiveMaximum) {
          // @ts-expect-error ISSUE: Narrowing :p
          output.schema.exclusiveMaximum = input.schema.maximum;
        } else {
          output.schema.maximum = input.schema.maximum;
        }
      }

      if (input.schema.minimum !== undefined) {
        if (input.schema.exclusiveMinimum) {
          // @ts-expect-error ISSUE: Narrowing :p
          output.schema.exclusiveMinimum = input.schema.minimum;
        } else {
          output.schema.minimum = input.schema.minimum;
        }
      }
    }
  } else {
    if (output.settings.booleanExclusiveMinimumAndMaximum) {
      if (input.schema.exclusiveMaximum !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.maximum = input.schema.exclusiveMaximum;
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMaximum = true;
      } else if (input.schema.maximum !== undefined) {
        output.schema.maximum = input.schema.maximum;
      }

      if (input.schema.exclusiveMinimum !== undefined) {
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.minimum = input.schema.exclusiveMinimum;
        // @ts-expect-error ISSUE: Narrowing :p
        output.schema.exclusiveMinimum = true;
      } else if (input.schema.minimum !== undefined) {
        output.schema.minimum = input.schema.minimum;
      }
    } else {
      if (input.schema.exclusiveMaximum !== undefined) {
        output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
      }

      if (input.schema.exclusiveMinimum !== undefined) {
        output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
      }

      if (input.schema.minimum !== undefined) {
        output.schema.minimum = input.schema.minimum;
      }

      if (input.schema.maximum !== undefined) {
        output.schema.maximum = input.schema.maximum;
      }
    }
  }

  handledKeys.add("minimum");
  handledKeys.add("exclusiveMinimum");
  handledKeys.add("maximum");
  handledKeys.add("exclusiveMaximum");
};
