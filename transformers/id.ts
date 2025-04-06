import { JsonSchemaObject } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";

export const transformId = <
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
  const id = input.schema[input.settings.$idPath];

  if (id !== undefined) {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    output.schema[output.settings.$idPath] = id;
  }
};
