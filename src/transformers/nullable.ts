import { TransformerFunction } from "./TransformFunction.ts";

export const transformNullable: TransformerFunction = (input, output) => {
  if (input.settings.nullable && input.schema.nullable) {
    if (output.settings.nullable) {
      output.schema.nullable = true;
    } else if (output.settings.nullType) {
      if (output.schema.type === undefined) {
        output.schema.type === "null";
      } else if (Array.isArray(output.schema.type)) {
        if (!output.schema.type.includes("null")) {
          output.schema.type.push("null");
        }
      } else {
        output.schema.type = [output.schema.type, "null"];
      }
    }
  }
};
