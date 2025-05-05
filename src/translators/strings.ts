import { JsonSchemaStaticKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { Mutator } from "./Mutator.ts";

export const translateStringKeywords: Mutator = (ctx) => {
  translateBasicKeywords(ctx);
  translateContentKeywords(ctx);
};

const translateBasicKeywords: Mutator = ({ input, output, handledKeys }) => {
  if (input.settings.minAndMaxLength) {
    if (output.settings.minAndMaxLength) {
      if (input.schema.maxLength !== undefined) {
        output.schema.maxLength = input.schema.maxLength;
      }

      if (input.schema.minLength !== undefined) {
        output.schema.minLength = input.schema.minLength;
      }
    }

    handledKeys.add("maxLength");
    handledKeys.add("minLength");
  }

  if (input.settings.pattern) {
    if (output.settings.pattern && input.schema.pattern !== undefined) {
      output.schema.pattern = input.schema.pattern;
    }

    handledKeys.add("pattern");
  }

  if (input.settings.format) {
    if (output.settings.format && input.schema.format !== undefined) {
      // TODO: Check array for matches? If no match, warn or error out? If so, should 'type' get the same treatment?
      output.schema.format = input.schema.format;
    }

    handledKeys.add("format");
  }
};

const translateContentKeywords: Mutator = (ctx) => {
  const media = ctx.input.settings.media
    ? (
        ctx.input.schema as unknown as JsonSchemaStaticKeywordsObject<
          JsonSchemaSpecification & { media: true }
        >
      ).media
    : undefined;

  const contentEncoding = ctx.input.settings.contentMediaTypeAndEncoding
    ? ctx.input.schema.contentEncoding
    : media?.binaryEncoding;

  const contentMediaType = ctx.input.settings.contentMediaTypeAndEncoding
    ? ctx.input.schema.contentMediaType
    : media?.type;

  if (ctx.output.settings.media && (contentEncoding || contentMediaType)) {
    // @ts-expect-error ISSUE: Narrowing breaks across generics
    ctx.output.schema.media = {
      binaryEncoding: contentEncoding,
      type: contentMediaType,
    };
  } else if (ctx.output.settings.contentMediaTypeAndEncoding) {
    ctx.output.schema.contentEncoding = contentEncoding;
    ctx.output.schema.contentMediaType = contentMediaType;
  }

  if (ctx.input.settings.media) {
    ctx.handledKeys.add("media");
  }

  if (ctx.input.settings.contentMediaTypeAndEncoding) {
    ctx.handledKeys.add("contentEncoding");
    ctx.handledKeys.add("contentMediaType");
  }

  if (ctx.input.settings.contentSchema) {
    if (
      ctx.output.settings.contentSchema &&
      ctx.input.schema.contentSchema !== undefined
    ) {
      ctx.output.schema.contentSchema = translateJsonSchemaInternal({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.contentSchema!,
        },
        path: [...ctx.path, "contentSchema"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("contentSchema");
  }
};
