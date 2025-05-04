import { JsonSchema } from "../JsonSchema.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchema.ts";
import { Mutator } from "./Mutator.ts";

export const translateDefinitionsKeyword: Mutator = (
  input,
  output,
  options,
) => {
  type InputSpecification = typeof input.settings;
  type OutputSpecification = typeof output.settings;

  // @ts-expect-error dynamic paths wip
  const inputDefs = input.schema[input.settings.$defsPath] as
    | Record<string, JsonSchema<InputSpecification>>
    | undefined;

  if (inputDefs !== undefined) {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    output.schema[output.settings.$defsPath] = Object.keys(inputDefs).reduce(
      (defs: Record<string, JsonSchema<OutputSpecification>>, key) => {
        const schema = inputDefs[key];

        defs[key] = translateJsonSchemaInternal(
          {
            schema,
            settings: input.settings,
            path: [...input.path, input.settings.$defsPath, key],
          },
          {
            settings: output.settings,
            forceAllowBooleanSchema: false,
            unhandledKeys: output.unhandledKeys,
          },
          options,
        );

        return defs;
      },
      {},
    );
  }

  input.handledKeys.add(input.settings.$defsPath);
};
