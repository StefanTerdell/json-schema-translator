import { JsonSchemaStaticKeywordsObject } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateStringKeywords: Mutator = (ctx) => {
  translateBasicKeywords(ctx);
  translateContentKeywords(ctx);
};

const translateBasicKeywords: Mutator = ({ input, output, handledKeys }) => {
  if (input.settings.minLength) {
    if (output.settings.minLength) {
      if (input.schema.minLength !== undefined) {
        output.schema.minLength = input.schema.minLength;
      }
    }

    handledKeys.add("minLength");
  }

  if (input.settings.maxLength) {
    if (output.settings.maxLength) {
      if (input.schema.maxLength !== undefined) {
        output.schema.maxLength = input.schema.maxLength;
      }
    }

    handledKeys.add("maxLength");
  }

  if (input.settings.pattern) {
    if (output.settings.pattern && input.schema.pattern !== undefined) {
      output.schema.pattern = input.schema.pattern;
    }

    handledKeys.add("pattern");
  }

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

const translateContentKeywords: Mutator = (ctx) => {
  const media = ctx.input.settings.media
    ? (
        ctx.input.schema as unknown as JsonSchemaStaticKeywordsObject<
          JsonSchemaSpecification & { media: true }
        >
      ).media
    : undefined;

  const contentEncoding = ctx.input.settings.contentEncoding
    ? ctx.input.schema.contentEncoding
    : media?.binaryEncoding;

  const contentMediaType = ctx.input.settings.contentMediaType
    ? ctx.input.schema.contentMediaType
    : media?.type;

  if (ctx.output.settings.media) {
    if (contentEncoding !== undefined) {
      if (contentMediaType !== undefined) {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.output.schema.media = {
          binaryEncoding: contentEncoding,
          type: contentMediaType,
        };
      } else {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.output.schema.media = {
          binaryEncoding: contentEncoding,
        };
      }
    } else {
      if (contentMediaType !== undefined) {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.output.schema.media = {
          type: contentMediaType,
        };
      }
    }
  } else {
    if (ctx.output.settings.contentEncoding && contentEncoding !== undefined) {
      ctx.output.schema.contentEncoding = contentEncoding;
    }

    if (
      ctx.output.settings.contentMediaType &&
      contentMediaType !== undefined
    ) {
      ctx.output.schema.contentMediaType = contentMediaType;
    }
  }

  if (ctx.input.settings.media) {
    ctx.handledKeys.add("media");
  }

  if (ctx.input.settings.contentEncoding) {
    ctx.handledKeys.add("contentEncoding");
  }

  if (ctx.input.settings.contentMediaType) {
    ctx.handledKeys.add("contentMediaType");
  }

  if (ctx.input.settings.contentSchema) {
    if (
      ctx.output.settings.contentSchema &&
      ctx.input.schema.contentSchema !== undefined
    ) {
      ctx.output.schema.contentSchema = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          // @ts-expect-error narrowing
          schema: ctx.input.schema.contentSchema,
        },
        path: [...ctx.path, "contentSchema"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("contentSchema");
  }
};
