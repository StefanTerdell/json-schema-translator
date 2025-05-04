import { JsonSchemaObject, JsonSchema } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { translateSchema } from "./schema.ts";

export const transformDefinitions = <
  InputJsonSchemaSettings extends JsonSchemaSettings,
  OutputJsonSchemaSettings extends JsonSchemaSettings,
>(
  input: {
    settings: InputJsonSchemaSettings;
    schema: JsonSchemaObject<InputJsonSchemaSettings>;
  },
  output: {
    settings: OutputJsonSchemaSettings;
    schema: JsonSchemaObject<OutputJsonSchemaSettings>;
  },
) => {
  const inputDefs = input.schema[input.settings.$defsPath] as
    | Record<string, JsonSchema<InputJsonSchemaSettings>>
    | undefined;

  if (inputDefs !== undefined) {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    output.schema[output.settings.$defsPath] = Object.keys(inputDefs).reduce(
      (defs: Record<string, JsonSchema<OutputJsonSchemaSettings>>, key) => {
        const schema = inputDefs[key];

        defs[key] = translateSchema(
          {
            schema,
            settings: input.settings,
          },
          {
            settings: output.settings,
            forceAllowBooleanSchema: false,
          },
        );

        return defs;
      },
      {},
    );
  }
};
