import { type Mutator } from "./Mutator.ts";

export const translateNullableKeyword: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.settings.nullable) {
    if (input.schema.nullable === true) {
      if (output.settings.nullable) {
        output.schema.nullable = true;
      } else if (output.settings.null) {
        if (output.schema.type === undefined) {
          output.schema.type === "null";
        } else if (Array.isArray(output.schema.type)) {
          // @ts-expect-error narrowing
          if (!output.schema.type.includes("null")) {
            // @ts-expect-error narrowing
            output.schema.type.push("null");
          }
        } else {
          // @ts-expect-error narrowing
          output.schema.type = [output.schema.type, "null"];
        }
      }
    }

    handledKeys.add("nullable");
  }
};
