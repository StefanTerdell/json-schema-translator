import { JsonSchema } from "../../src/types/JsonSchema.ts";
import { JsonSchemaSpecification } from "../../src/types/JsonSchemaSpecification.ts";
import { MutatorContext } from "../../src/translators/MutatorContext.ts";

export function testCtx<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(x: {
  input:
    | {
        schema: JsonSchema<I>;
        settings: I;
      }
    | I;
  output:
    | {
        schema: JsonSchema<O>;
        settings: O;
      }
    | O;
}): MutatorContext<I, O> {
  return {
    copyJson: "shallow",
    handledKeys: new Set(),
    from: (Object.keys(x.input).every(
      (key) => key === "schema" || key === "settings",
    )
      ? x.input
      : {
          schema: {},
          settings: x.input,
          // deno-lint-ignore no-explicit-any
        }) as any,
    into: (Object.keys(x.output).every(
      (key) => key === "schema" || key === "settings",
    )
      ? x.output
      : {
          schema: {},
          settings: x.output,
          // deno-lint-ignore no-explicit-any
        }) as any,
    path: [],
    seen: new Map(),
    unhandledKeys: new Map(),
    droppedKeys: new Map(),
    unionLocations: new Map(),
  };
}
