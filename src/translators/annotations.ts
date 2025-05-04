import { Mutator } from "./Mutator.ts";

export const translateAnnotationKeywords: Mutator = (
  input,
  output,
  options,
) => {
  translateDefaultAnnotationKeywords(input, output, options);
  translateControlledAnnotationKeywords(input, output, options);
  translate$schemaKeyword(input, output, options);
};

const translateDefaultAnnotationKeywords: Mutator = (input, output) => {
  if (input.schema.title !== undefined) {
    output.schema.title = input.schema.title;
  }

  input.handledKeys.add("title");

  if (input.schema.description !== undefined) {
    output.schema.description = input.schema.description;
  }

  input.handledKeys.add("description");

  if (input.schema.default !== undefined) {
    output.schema.default = input.schema.default;
  }

  input.handledKeys.add("default");
};

const translateControlledAnnotationKeywords: Mutator = (input, output) => {
  if (input.settings.$comment) {
    if (output.settings.$comment && input.schema.$comment !== undefined) {
      output.schema.$comment = input.schema.$comment;
    }

    input.handledKeys.add("$comment");
  }

  if (input.settings.deprecated) {
    if (output.settings.deprecated && input.schema.deprecated !== undefined) {
      output.schema.deprecated = input.schema.deprecated;
    }

    input.handledKeys.add("deprecated");
  }

  if (input.settings.examples) {
    if (output.settings.examples && input.schema.examples !== undefined) {
      output.schema.examples = input.schema.examples;
    }

    input.handledKeys.add("examples");
  }

  if (input.settings.$vocabulary) {
    if (output.settings.$vocabulary && input.schema.$vocabulary !== undefined) {
      output.schema.$vocabulary = input.schema.$vocabulary;
    }

    input.handledKeys.add("$vocabulary");
  }

  if (input.settings.readAndWriteOnly) {
    if (
      output.settings.readAndWriteOnly &&
      input.schema.readOnly !== undefined
    ) {
      output.schema.readOnly = input.schema.readOnly;
    }

    input.handledKeys.add("readOnly");
  }

  if (input.settings.readAndWriteOnly) {
    if (
      output.settings.readAndWriteOnly &&
      input.schema.writeOnly !== undefined
    ) {
      output.schema.writeOnly = input.schema.writeOnly;
    }

    input.handledKeys.add("writeOnly");
  }
};

const translate$schemaKeyword: Mutator = (input, output) => {
  if (input.settings.$schema !== undefined) {
    if (
      output.settings.$schema !== undefined &&
      input.schema.$schema === input.settings.$schema
    ) {
      output.schema.$schema = output.settings.$schema;
    }

    input.handledKeys.add("$schema");
  }
};
