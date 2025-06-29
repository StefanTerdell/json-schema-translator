import { copy } from "../../copy.ts";
import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateContentEncodingAndContentMediaTypeAndContentSchemaAndMedia: Mutator =
  (ctx) => {
    match(
      ctx,
      { media: true },
      {
        from(ctx) {
          ctx.handledKeys.add("media");
        },
        both(ctx) {
          if (ctx.from.schema.media !== undefined) {
            ctx.into.schema.media = copy(ctx.copyJson, ctx.from.schema.media);
          }
        },
        onlyFrom(ctx) {
          match(
            ctx,
            { contentEncoding: true },
            {
              into(ctx) {
                if (ctx.from.schema.media?.binaryEncoding !== undefined) {
                  ctx.into.schema.contentEncoding =
                    ctx.from.schema.media.binaryEncoding;
                }
              },
            },
          );

          match(
            ctx,
            { contentMediaType: true },
            {
              into(ctx) {
                if (ctx.from.schema.media?.type !== undefined) {
                  ctx.into.schema.contentMediaType = ctx.from.schema.media.type;
                }
              },
            },
          );
        },
        onlyInto(ctx) {
          match(
            ctx,
            { contentEncoding: true },
            {
              from(ctx) {
                ctx.handledKeys.add("contentEncoding");

                if (ctx.from.schema.contentEncoding != undefined) {
                  if (ctx.into.schema.media === undefined) {
                    ctx.into.schema.media = {};
                  }

                  ctx.into.schema.media.binaryEncoding =
                    ctx.from.schema.contentEncoding;
                }
              },
            },
          );

          match(
            ctx,
            { contentMediaType: true },
            {
              from(ctx) {
                ctx.handledKeys.add("contentMediaType");

                if (ctx.from.schema.contentMediaType != undefined) {
                  if (ctx.into.schema.media === undefined) {
                    ctx.into.schema.media = {};
                  }

                  ctx.into.schema.media.type = ctx.from.schema.contentMediaType;
                }
              },
            },
          );
        },
        none(ctx) {
          match(
            ctx,
            { contentEncoding: true },
            {
              from(ctx) {
                ctx.handledKeys.add("contentEncoding");
              },
              both(ctx) {
                if (ctx.from.schema.contentEncoding !== undefined) {
                  ctx.into.schema.contentEncoding =
                    ctx.from.schema.contentEncoding;
                }
              },
            },
          );

          match(
            ctx,
            { contentMediaType: true },
            {
              from(ctx) {
                ctx.handledKeys.add("contentMediaType");
              },
              both(ctx) {
                if (ctx.from.schema.contentMediaType !== undefined) {
                  ctx.into.schema.contentMediaType =
                    ctx.from.schema.contentMediaType;
                }
              },
            },
          );

          match(
            ctx,
            { contentSchema: true },
            {
              from(ctx) {
                ctx.handledKeys.add("contentSchema");
              },
              both(ctx) {
                if (ctx.from.schema.contentSchema !== undefined) {
                  ctx.into.schema.contentSchema = translateSchema({
                    ...ctx,
                    from: {
                      ...ctx.from,
                      schema: ctx.from.schema.contentSchema,
                    },
                    path: [...ctx.path, "contentSchema"],
                    forceAllowBooleanSchema: false,
                  });
                }
              },
            },
          );
        },
      },
    );
  };
