import { TransformerFunction } from "./TransformFunction.ts";

export const transformAnnotations: TransformerFunction = (input, output) => {
  transformDefaultAnnotations(input, output);
  transformControlledAnnotations(input, output);
  transform$schemaAnnotation(input, output);
};

const transformDefaultAnnotations: TransformerFunction = (input, output) => {
  if (input.schema.title !== undefined) {
    output.schema.title = input.schema.title;
  }

  if (input.schema.description !== undefined) {
    output.schema.description = input.schema.description;
  }

  if (input.schema.default !== undefined) {
    output.schema.default = input.schema.default;
  }
};

const transformControlledAnnotations: TransformerFunction = (input, output) => {
  if (input.settings.$comment && input.schema.$comment !== undefined) {
    if (output.settings.$comment) {
      output.schema.$comment = input.schema.$comment;
    }
  }

  if (input.settings.deprecated && input.schema.deprecated !== undefined) {
    if (output.settings.deprecated) {
      output.schema.deprecated = input.schema.deprecated;
    }
  }

  if (input.settings.examples && input.schema.examples !== undefined) {
    if (output.settings.examples) {
      output.schema.examples = input.schema.examples;
    }
  }

  if (input.settings.$vocabulary && input.schema.$vocabulary !== undefined) {
    if (output.settings.$vocabulary) {
      output.schema.$vocabulary = input.schema.$vocabulary;
    }
  }

  if (input.settings.readAndWriteOnly && input.schema.readOnly !== undefined) {
    if (output.settings.readAndWriteOnly) {
      output.schema.readOnly = input.schema.readOnly;
    }
  }

  if (input.settings.readAndWriteOnly && input.schema.writeOnly !== undefined) {
    if (output.settings.readAndWriteOnly) {
      output.schema.writeOnly = input.schema.writeOnly;
    }
  }
};

const transform$schemaAnnotation: TransformerFunction = (input, output) => {
  if (
    input.settings.$schema !== undefined &&
    input.schema.$schema === input.settings.$schema
  ) {
    output.schema.$schema = output.settings.$schema;
  }
};
