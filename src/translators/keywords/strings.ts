import { JsonSchemaKeywordsOnlyObject } from "../../JsonSchema.ts";
import { JsonSchemaSpecification } from "../../JsonSchemaSpecification.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateStringKeywords: Mutator = (ctx) => {
  translateBasicKeywords(ctx);
  translateContentKeywords(ctx);
};

const translateBasicKeywords: Mutator = ({
  from: input,
  into: output,
  handledKeys,
}) => {
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
  const media = ctx.from.settings.media
    ? (
        ctx.from.schema as unknown as JsonSchemaKeywordsOnlyObject<
          JsonSchemaSpecification & { media: true }
        >
      ).media
    : undefined;

  const contentEncoding = ctx.from.settings.contentEncoding
    ? ctx.from.schema.contentEncoding
    : media?.binaryEncoding;

  const contentMediaType = ctx.from.settings.contentMediaType
    ? ctx.from.schema.contentMediaType
    : media?.type;

  if (ctx.into.settings.media) {
    if (contentEncoding !== undefined) {
      if (contentMediaType !== undefined) {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.into.schema.media = {
          binaryEncoding: contentEncoding,
          type: contentMediaType,
        };
      } else {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.into.schema.media = {
          binaryEncoding: contentEncoding,
        };
      }
    } else {
      if (contentMediaType !== undefined) {
        // @ts-expect-error ISSUE: Narrowing breaks across generics
        ctx.into.schema.media = {
          type: contentMediaType,
        };
      }
    }
  } else {
    if (ctx.into.settings.contentEncoding && contentEncoding !== undefined) {
      ctx.into.schema.contentEncoding = contentEncoding;
    }

    if (ctx.into.settings.contentMediaType && contentMediaType !== undefined) {
      ctx.into.schema.contentMediaType = contentMediaType;
    }
  }

  if (ctx.from.settings.media) {
    ctx.handledKeys.add("media");
  }

  if (ctx.from.settings.contentEncoding) {
    ctx.handledKeys.add("contentEncoding");
  }

  if (ctx.from.settings.contentMediaType) {
    ctx.handledKeys.add("contentMediaType");
  }

  if (ctx.from.settings.contentSchema) {
    if (
      ctx.into.settings.contentSchema &&
      ctx.from.schema.contentSchema !== undefined
    ) {
      ctx.into.schema.contentSchema = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          // @ts-expect-error narrowing
          schema: ctx.from.schema.contentSchema,
        },
        path: [...ctx.path, "contentSchema"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("contentSchema");
  }
};
