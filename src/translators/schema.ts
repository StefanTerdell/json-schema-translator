import { AjvErrorMessages, type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { translateAnnotationKeywords } from "../translators/annotations.ts";
import { translateArrayKeywords } from "../translators/arrays.ts";
import { translateConditionalKeywords } from "../translators/conditionals.ts";
import { translateConstantKeywords } from "../translators/constants.ts";
import { translateDefinitionsKeyword } from "../translators/definitions.ts";
import { translateFactoringKeywords } from "../translators/factoring.ts";
import { translateIdKeyword } from "../translators/id.ts";
import { type MutatorContext } from "../translators/MutatorContext.ts";
import { translateNullableKeyword } from "../translators/nullable.ts";
import { translateNumberKeywords } from "../translators/numbers.ts";
import { translateObjectKeywords } from "../translators/objects.ts";
import { translateStringKeywords } from "../translators/strings.ts";
import { translateStructuringKeywords } from "../translators/structuring.ts";
import { translateTypeKeyword } from "../translators/type.ts";
import { type TranslatorContext } from "../TranslatorContext.ts";
import { collapseIntoBooleanSchema } from "../collapseIntoBooleanSchema.ts";
import { type Mutator } from "./Mutator.ts";
import { copy } from "../copy.ts";

/** @internal */
export type TranslateSchemaContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
> = TranslatorContext<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> & {
  from: {
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
  };
  forceAllowBooleanSchema: ForceAllowBooleanSchema;
};

/** @internal */
export const translateSchema = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
>(
  ctx: TranslateSchemaContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification,
    ForceAllowBooleanSchema
  >,
): JsonSchema<OutputJsonSchemaSpecification, ForceAllowBooleanSchema> => {
  const alreadyTranslated = ctx.seen.get(ctx.from.schema);

  if (alreadyTranslated) {
    return alreadyTranslated;
  }

  const mctx: MutatorContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification
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

  translateIdKeyword(mctx);
  translateDefinitionsKeyword(mctx);
  translateTypeKeyword(mctx);
  translateNullableKeyword(mctx);
  translateFactoringKeywords(mctx);
  translateConditionalKeywords(mctx);
  translateAnnotationKeywords(mctx);
  translateConstantKeywords(mctx);
  translateStructuringKeywords(mctx);
  translateStringKeywords(mctx);
  translateNumberKeywords(mctx);
  translateArrayKeywords(mctx);
  translateObjectKeywords(mctx);

  copyErrorMessage(mctx);
  copyJson(mctx);

  const outputSchema = collapseIntoBooleanSchema(
    mctx.into,
    ctx.forceAllowBooleanSchema,
  );

  ctx.seen.set(ctx.from.schema, outputSchema);

  return outputSchema;
};

const copyJson: Mutator = (ctx) => {
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
