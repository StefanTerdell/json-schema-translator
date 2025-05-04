import { JsonSchemaKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSettings } from "../JsonSchemaSettings.ts";
import { translateSchema } from "./schema.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformStrings: TransformerFunction = (input, output) => {
  output.schema.maxLength = input.schema.maxLength;
  output.schema.minLength = input.schema.minLength;
  output.schema.pattern = input.schema.pattern;

  if (output.settings.format) {
    // TODO: Check array for matches? If no match, warn or error out? If so, should 'type' get the same treatment?
    output.schema.format = input.schema.format;
  }

  const media = input.settings.media
    ? (
        input.schema as unknown as JsonSchemaKeywordsObject<
          JsonSchemaSettings & { media: true }
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

  if (
    input.settings.contentSchema &&
    output.settings.contentSchema &&
    input.schema.contentSchema !== undefined
  ) {
    output.schema.contentSchema = translateSchema(
      {
        settings: input.settings,
        schema: input.schema.contentSchema!,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }
};
