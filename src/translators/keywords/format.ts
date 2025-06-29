import { Mutator } from "../Mutator.ts";

export const translateFormat: Mutator = ({
  from: input,
  into: output,
  handledKeys,
}) => {
  if (input.settings.format) {
    if (output.settings.format && input.schema.format !== undefined) {
      if (
        !input.settings.strictFormats ||
        !Array.isArray(input.settings.format) ||
        (input.settings.format.includes(input.schema.format as string) &&
          (!output.settings.strictFormats ||
            !Array.isArray(output.settings.format) ||
            output.settings.format.includes(output.schema.format as string)))
      ) {
        output.schema.format = input.schema.format;
      }
    }

    handledKeys.add("format");
  }
};
