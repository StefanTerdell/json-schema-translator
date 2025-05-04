import { JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchema.ts";
import { Mutator } from "./Mutator.ts";

export const translateStringKeywords: Mutator = (input, output, options) => {
  if (input.schema.maxLength !== undefined) {
    output.schema.maxLength = input.schema.maxLength;
  }

  input.handledKeys.add("maxLength");

  if (input.schema.minLength !== undefined) {
    output.schema.minLength = input.schema.minLength;
  }

  input.handledKeys.add("minLength");

  if (input.schema.pattern !== undefined) {
    output.schema.pattern = input.schema.pattern;
  }

  input.handledKeys.add("pattern");

  if (input.settings.format) {
    if (output.settings.format && input.schema.format !== undefined) {
      // TODO: Check array for matches? If no match, warn or error out? If so, should 'type' get the same treatment?
      output.schema.format = input.schema.format;
    }

    input.handledKeys.add("format");
  }

  const media = input.settings.media
    ? (
        input.schema as unknown as JsonSchemaKeywordsObject<
          JsonSchemaSpecification & { media: true }
        >
      ).media
    : undefined;

  const contentEncoding = input.settings.contentMediaTypeAndEncoding
    ? input.schema.contentEncoding
    : media?.binaryEncoding;

  const contentMediaType = input.settings.contentMediaTypeAndEncoding
    ? input.schema.contentMediaType
    : media?.type;

  if (output.settings.media && (contentEncoding || contentMediaType)) {
    // @ts-expect-error ISSUE: Narrowing breaks across generics
    output.schema.media = {
      binaryEncoding: contentEncoding,
      type: contentMediaType,
    };
  } else if (output.settings.contentMediaTypeAndEncoding) {
    output.schema.contentEncoding = contentEncoding;
    output.schema.contentMediaType = contentMediaType;
  }

  if (input.settings.media) {
    input.handledKeys.add("media");
  }

  if (input.settings.contentMediaTypeAndEncoding) {
    input.handledKeys.add("contentEncoding");
    input.handledKeys.add("contentMediaType");
  }

  if (input.settings.contentSchema) {
    if (
      output.settings.contentSchema &&
      input.schema.contentSchema !== undefined
    ) {
      output.schema.contentSchema = translateJsonSchemaInternal(
        {
          settings: input.settings,
          schema: input.schema.contentSchema!,
          path: [...input.path, "contentSchema"],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
        options,
      );
    }

    input.handledKeys.add("contentSchema");
  }
};
