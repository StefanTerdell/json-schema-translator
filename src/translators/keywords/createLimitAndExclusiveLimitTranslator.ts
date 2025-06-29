import { Mutator } from "../Mutator.ts";

/** @internal */
export function createLimitAndExclusiveLimitTranslator(
  limit: "minimum" | "maximum",
): Mutator {
  const exclusiveLimit =
    limit === "minimum" ? "exclusiveMinimum" : "exclusiveMaximum";
  const booleanExclusiveLimit =
    limit === "minimum" ? "booleanExclusiveMinimum" : "booleanExclusiveMaximum";
  const leastPermissive =
    limit === "minimum"
      ? (a: number, b: number) => Math.max(a, b)
      : (a: number, b: number) => Math.min(a, b);

  return ({ from: input, into: output, handledKeys }) => {
    if (input.settings[limit]) {
      // input supports the limit
      if (output.settings[limit]) {
        // both input and output supports the limit
        if (input.settings[exclusiveLimit]) {
          // input supports the exclusive limit
          if (output.settings[exclusiveLimit]) {
            // both input and output supports the exclusive limit
            if (input.settings[booleanExclusiveLimit]) {
              if (output.settings[booleanExclusiveLimit]) {
                // both input and output use booleans for the exclusive limit values

                if (input.schema[limit] !== undefined) {
                  output.schema[limit] = input.schema[limit];
                }

                if (input.schema[exclusiveLimit] !== undefined) {
                  output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
                }
              } else {
                // only input use booleans for the exclusive limit values

                if (input.schema[limit] !== undefined) {
                  if (input.schema[exclusiveLimit] === true) {
                    // @ts-expect-error :p
                    output.schema[exclusiveLimit] = input.schema[limit];
                  } else {
                    output.schema[limit] = input.schema[limit];
                  }
                }
              }
            } else {
              if (output.settings[booleanExclusiveLimit]) {
                // only output use booleans for the exclusive limit values

                if (typeof input.schema[exclusiveLimit] === "number") {
                  // @ts-expect-error :p
                  output.schema[exclusiveLimit] = true;

                  if (typeof input.schema[limit] === "number") {
                    output.schema[limit] = leastPermissive(
                      input.schema[limit],
                      input.schema[exclusiveLimit],
                    );
                  } else {
                    output.schema[limit] = input.schema[exclusiveLimit];
                  }
                }
              } else {
                // neither input nor output use booleans for the exclusive limit values

                if (input.schema[limit] !== undefined) {
                  output.schema[limit] = input.schema[limit];
                }

                if (input.schema[exclusiveLimit] !== undefined) {
                  output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
                }
              }
            }
          } else {
            // only input supports the exclusive limit
            if (typeof input.schema[limit] === "number") {
              if (typeof input.schema[exclusiveLimit] === "number") {
                output.schema[limit] = leastPermissive(
                  input.schema[limit],
                  input.schema[exclusiveLimit],
                );
              } else {
                output.schema[limit] = input.schema[limit];
              }
            }
          }

          handledKeys.add(exclusiveLimit);
        } else {
          if (output.settings[exclusiveLimit]) {
            // only output supports the exclusive limit

            if (input.schema[limit] !== undefined) {
              output.schema[limit] = input.schema[limit];
            }
          } else {
            // nethier input nor output supports the exclusive limit

            if (input.schema[limit] !== undefined) {
              output.schema[limit] = input.schema[limit];
            }
          }
        }
      } else {
        // only input supports the limit
        if (input.settings[exclusiveLimit]) {
          // input supports the exclusive limit
          if (output.settings[exclusiveLimit]) {
            // both input and output support the exclusive limit

            if (input.settings[booleanExclusiveLimit]) {
              if (output.settings[booleanExclusiveLimit]) {
                // both input and output use booleans for exclusive limit values
                if (input.schema[exclusiveLimit] !== undefined) {
                  // since the limit value will not be copied an exclusive limit value will do nothing, so it's copied pretty much on principle.
                  output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
                }
              } else {
                // only input uses booleans for exclusive limit values
                // No-op: since the limit value will not be copied an exclusive limit value can not be inferred from it
              }
            } else {
              if (output.settings[booleanExclusiveLimit]) {
                // only output uses booleans for exclusive limit values
                // No-op: since the limit value will not be copied, an exclusive limit value would do nothing
              } else {
                // neither input nor output use booleans for exclusive limit values
                if (input.schema[exclusiveLimit] !== undefined) {
                  output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
                }
              }
            }
          } else {
            // only input supports the exclusive limit
            // No-op: output supports neither limit or exclusive limit
          }

          handledKeys.add(exclusiveLimit);
        } else {
          // input does not support the exclusive limit
          if (output.settings[exclusiveLimit]) {
            // only output supports the exclusive limit
            if (output.settings[booleanExclusiveLimit]) {
              // output uses booleans for exclusive limit values
              // no-op: even if there is a limit there's no way to know if it is intended as exclusive or not
            } else {
              // output does not use booleans for exclusive limit values
              // no-op: even if there is a limit there's no way to know if it is intended as exclusive or not
            }
          } else {
            // nethier input nor output support the exclusive limit
            // no-op
          }
        }
      }

      handledKeys.add(limit);
    } else {
      // input does not support the limit
      if (output.settings[limit]) {
        // only output supports the limit
        if (input.settings[exclusiveLimit]) {
          // input supports exclusive limit
          if (input.settings[booleanExclusiveLimit]) {
            // input uses booleans for exclusive limit values
            if (output.settings[booleanExclusiveLimit]) {
              // both input and output use booleans for exclusive limit values
              if (input.schema[exclusiveLimit] !== undefined) {
                output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
              }
            } else {
              // only input uses booleans for exclusive limit values
              // no-op: there is no limit to infer an exclusive limit value from
            }
          } else {
            // input does not use booleans for exclusive limit values
            if (output.settings[booleanExclusiveLimit]) {
              // only output uses booleans for exclusive limit values
              if (typeof input.schema[exclusiveLimit] === "number") {
                // @ts-expect-error :p
                output.schema[exclusiveLimit] = true;
                output.schema[limit] = input.schema[exclusiveLimit];
              }
            } else {
              // neither input nor output use booleans for exclusive limit values
              if (input.schema[exclusiveLimit] !== undefined) {
                output.schema[exclusiveLimit] = input.schema[exclusiveLimit];
              }
            }
          }

          handledKeys.add(exclusiveLimit);
        } else {
          // input does not support the exclusive limit
          if (output.settings[exclusiveLimit]) {
            // only output supports the exclusive limit
            if (output.settings[booleanExclusiveLimit]) {
              // output uses booleans for exclusive limit values
              // no-op: there's no limit to flag as exclusive or not
            } else {
              // output does not use booleans for exclusive limit values
              // no-op: even if there is a limit there's no way to know if it is intended as exclusive or not
            }
          }
        }
      } else {
        // neither input nor output supports the limit
      }
    }
  };
}
