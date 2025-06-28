import { AjvErrorMessages } from "../JsonSchema.ts";
import { type MutatorContext } from "../translators/MutatorContext.ts";
import { collapseIntoBooleanSchema } from "../collapseIntoBooleanSchema.ts";
import { type Mutator } from "./Mutator.ts";
import { copy } from "../copy.ts";
import { translateKeywords } from "./keywwords.ts";
import { Translator } from "./Translator.ts";

/** @internal */
export const translateSchema: Translator = (ctx) => {
  const alreadyTranslated = ctx.seen.get(ctx.from.schema);

  if (alreadyTranslated) {
    return alreadyTranslated;
  }

  const mutatorCtx: MutatorContext<
    typeof ctx.from.settings,
    typeof ctx.into.settings
  > = {
    ...ctx,
    from: {
      ...ctx.from,
      schema:
        typeof ctx.from.schema === "boolean"
          ? ctx.from.schema
            ? {}
            : { not: {} }
          : ctx.from.schema,
    },
    into: {
      ...ctx.into,
      schema: {},
    },
    handledKeys: new Set(),
  };

  translateKeywords(mutatorCtx);
  copyErrorMessage(mutatorCtx);
  copyUnhandledKeys(mutatorCtx);

  const outputSchema = collapseIntoBooleanSchema(
    mutatorCtx.into,
    ctx.forceAllowBooleanSchema,
  );

  ctx.seen.set(ctx.from.schema, outputSchema);

  return outputSchema;
};

const copyUnhandledKeys: Mutator = (ctx) => {
  if (ctx.from.settings.arbitraryJson) {
    for (const key of Object.keys(ctx.from.schema).filter(
      (key) => !ctx.handledKeys.has(key),
    )) {
      if (ctx.into.settings.arbitraryJson) {
        if (!(key in ctx.into.schema)) {
          // @ts-expect-error CBA
          ctx.into.schema[key] = copy(ctx.copyJson, ctx.from.schema[key]);
        } else {
          ctx.unhandledKeys.set([...ctx.path, key], "conflict");
        }
      } else {
        ctx.unhandledKeys.set([...ctx.path, key], "disallowed");
      }

      ctx.handledKeys.add(key);
    }
  }
};

const copyErrorMessage: Mutator = (ctx) => {
  if (ctx.from.settings.errorMessage === "ajv") {
    if (ctx.into.settings.errorMessage === "ajv") {
      const isAjvErrorMessage = (obj: object): obj is AjvErrorMessages =>
        Object.values(obj).every(
          (value) =>
            typeof value === "string" ||
            (typeof value === "object" && value && isAjvErrorMessage(value)),
        );

      const errorMessage = ctx.from.schema.errorMessage;

      if (
        typeof errorMessage === "object" &&
        errorMessage &&
        isAjvErrorMessage(errorMessage)
      ) {
        ctx.into.schema.errorMessage = copy(ctx.copyJson, errorMessage);
        ctx.handledKeys.add("errorMessage");
      }
    }
  }
};
