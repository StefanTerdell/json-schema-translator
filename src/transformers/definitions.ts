import { JsonSchema } from "../JsonSchema.ts";
import { generateSchema } from "./schema.ts";
import { Mutator } from "./Mutator.ts";

export const translateDefinitionsKeyword: Mutator = (input, output) => {
  type InputSettings = typeof input.settings;
  type OutputSettings = typeof output.settings;

  // @ts-expect-error dynamic paths wip
  const inputDefs = input.schema[input.settings.$defsPath] as
    | Record<string, JsonSchema<InputSettings>>
    | undefined;

  if (inputDefs !== undefined) {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    output.schema[output.settings.$defsPath] = Object.keys(inputDefs).reduce(
      (defs: Record<string, JsonSchema<OutputSettings>>, key) => {
        const schema = inputDefs[key];

        defs[key] = generateSchema(
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
        );

        return defs;
      },
      {},
    );
  }

  input.handledKeys.add(input.settings.$defsPath);
};
