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

  if (input.settings.minimum) {
    if (output.settings.minimum) {
      if (input.settings.exclusiveMinimum === true) {
        if (output.settings.exclusiveMinimum === true) {
          // Both input and output uses numbers for exclusive limits

          if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }

          if (input.schema.exclusiveMinimum !== undefined) {
            output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
          }
        }

        if (output.settings.exclusiveMinimum === "boolean") {
          // Input uses numbers for exclusive limits while output uses flags

          if (input.schema.exclusiveMinimum !== undefined) {
            if (input.schema.minimum !== undefined) {
              output.schema.minimum = Math.max(
                Number(input.schema.exclusiveMinimum),
                Number(input.schema.minimum),
              );
            } else {
              // @ts-expect-error narrowing
              output.schema.minimum = input.schema.exclusiveMinimum;
              // @ts-expect-error narrowing
              output.schema.exclusiveMinimum = true;
            }
          } else if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }
        }
      }

      if (input.settings.exclusiveMinimum === "boolean") {
        if (output.settings.exclusiveMinimum === true) {
          // Input uses flags for exclusive limits while output uses numbers

          if (input.schema.minimum !== undefined) {
            if (input.schema.exclusiveMinimum === true) {
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMinimum = input.schema.minimum;
            } else {
              output.schema.minimum = input.schema.minimum;
            }
          }
        }

        if (output.settings.exclusiveMinimum === "boolean") {
          // Both input and output use flags for exclusive limits

          if (input.schema.minimum !== undefined) {
            output.schema.minimum = input.schema.minimum;
          }

          if (input.schema.exclusiveMinimum !== undefined) {
            output.schema.exclusiveMinimum = input.schema.exclusiveMinimum;
          }
        }
      }
    }

    handledKeys.add("minimum");
    handledKeys.add("exclusiveMinimum");
  }

  if (input.settings.maximum) {
    if (output.settings.maximum) {
      if (input.settings.exclusiveMaximum === true) {
        if (output.settings.exclusiveMaximum === true) {
          // Both input and output uses numbers for exclusive limits

          if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }

          if (input.schema.exclusiveMaximum !== undefined) {
            output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
          }
        }

        if (output.settings.exclusiveMaximum === "boolean") {
          // Input uses numbers for exclusive limits while output uses flags

          if (input.schema.exclusiveMaximum !== undefined) {
            if (input.schema.maximum !== undefined) {
              output.schema.maximum = Math.max(
                Number(input.schema.exclusiveMaximum),
                Number(input.schema.maximum),
              );
            } else {
              // @ts-expect-error narrowing
              output.schema.maximum = input.schema.exclusiveMaximum;
              // @ts-expect-error narrowing
              output.schema.exclusiveMaximum = true;
            }
          } else if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }
        }
      }

      if (input.settings.exclusiveMaximum === "boolean") {
        if (output.settings.exclusiveMaximum === true) {
          // Input uses flags for exclusive limits while output uses numbers

          if (input.schema.maximum !== undefined) {
            if (input.schema.exclusiveMaximum === true) {
              // @ts-expect-error ISSUE: Narrowing :p
              output.schema.exclusiveMaximum = input.schema.maximum;
            } else {
              output.schema.maximum = input.schema.maximum;
            }
          }
        }

        if (output.settings.exclusiveMaximum === "boolean") {
          // Both input and output use flags for exclusive limits

          if (input.schema.maximum !== undefined) {
            output.schema.maximum = input.schema.maximum;
          }

          if (input.schema.exclusiveMaximum !== undefined) {
            output.schema.exclusiveMaximum = input.schema.exclusiveMaximum;
          }
        }
      }
    }

    handledKeys.add("maximum");
    handledKeys.add("exclusiveMaximum");
  }
};
