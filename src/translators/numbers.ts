import { type Mutator } from "./Mutator.ts";

export const translateNumberKeywords: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.settings.multipleOf) {
    if (output.settings.multipleOf && input.schema.multipleOf !== undefined) {
      output.schema.multipleOf = input.schema.multipleOf;
    }

    handledKeys.add("multipleOf");
  }

  if (input.settings.minimumAndMaximum) {
    if (output.settings.minimumAndMaximum) {
      if (input.settings.exclusiveMinimumAndMaximum === true) {
        if (output.settings.exclusiveMinimumAndMaximum === true) {
          // Both input and output uses numbers for exclusive limits

          if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }

          if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }

          if (input.schema.exclusiveMinimum !== undefined) {
            output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
          }

          if (input.schema.exclusiveMaximum !== undefined) {
            output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
          }
        }

        if (output.settings.exclusiveMinimumAndMaximum === "boolean") {
          // Input uses numbers for exclusive limits while output uses flags

          if (input.schema.exclusiveMinimum !== undefined) {
            if (input.schema.minimum !== undefined) {
              output.schema.minimum = Math.max(
                Number(input.schema.exclusiveMinimum),
                Number(input.schema.minimum),
              );
            } else {
              output.schema.minimum = input.schema.exclusiveMinimum;
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMinimum = true;
            }
          } else if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }

          if (input.schema.exclusiveMaximum !== undefined) {
            if (input.schema.maximum !== undefined) {
              output.schema.maximum = Math.min(
                Number(input.schema.exclusiveMaximum),
                Number(input.schema.maximum),
              );
            } else {
              output.schema.maximum = input.schema.exclusiveMaximum;
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMaximum = true;
            }
          } else if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }
        }
      }

      if (input.settings.exclusiveMinimumAndMaximum === "boolean") {
        if (output.settings.exclusiveMinimumAndMaximum === true) {
          // Input uses flags for exclusive limits while output uses numbers

          if (input.schema.minimum !== undefined) {
            if (input.schema.exclusiveMinimum === true) {
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMinimum = input.schema.minimum;
            } else {
              output.schema.minimum = input.schema.minimum;
            }
          }

          if (input.schema.maximum !== undefined) {
            if (input.schema.exclusiveMaximum === true) {
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMaximum = input.schema.maximum;
            } else {
              output.schema.maximum = input.schema.maximum;
            }
          }
        }

        if (output.settings.exclusiveMinimumAndMaximum === "boolean") {
          // Both input and output use flags for exclusive limits

          if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }

          if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }

          if (input.schema.exclusiveMinimum !== undefined) {
            output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
          }

          if (input.schema.exclusiveMaximum !== undefined) {
            output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
          }
        }
      }
    }

    handledKeys.add("minimum");
    handledKeys.add("exclusiveMinimum");
    handledKeys.add("maximum");
    handledKeys.add("exclusiveMaximum");
  }
};
