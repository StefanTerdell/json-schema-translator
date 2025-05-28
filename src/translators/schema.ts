import { AjvErrorMessages, type JsonSchema } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { translateAnnotationKeywords } from "../translators/annotations.ts";
import { translateArrayKeywords } from "../translators/arrays.ts";
import { translateConditionalKeywords } from "../translators/conditionals.ts";
import { translateConstantKeywords } from "../translators/constants.ts";
import { translateDefinitionsKeyword } from "../translators/definitions.ts";
import { translateFactoringKeywords } from "../translators/factoring.ts";
import { translateIdKeyword } from "../translators/id.ts";
import { type MutatorContext } from "../translators/Mutator.ts";
import { translateNullableKeyword } from "../translators/nullable.ts";
import { translateNumberKeywords } from "../translators/numbers.ts";
import { translateObjectKeywords } from "../translators/objects.ts";
import { translateStringKeywords } from "../translators/strings.ts";
import { translateStructuringKeywords } from "../translators/structuring.ts";
import { translateTypeKeyword } from "../translators/type.ts";
import { type TranslateJsonSchemaContext } from "../TranslateJsonSchemaContext.ts";
import { collapseIntoBooleanSchema } from "../collapseIntoBooleanSchema.ts";
import { type Mutator } from "./Mutator.ts";
import { copy } from "../copy.ts";

/** @internal */
export type TranslateNodeContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
> = TranslateJsonSchemaContext<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> & {
  input: {
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
  ctx: TranslateNodeContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification,
    ForceAllowBooleanSchema
  >,
): JsonSchema<OutputJsonSchemaSpecification, ForceAllowBooleanSchema> => {
  const alreadyTranslated = ctx.seen.get(ctx.input.schema);

  if (alreadyTranslated) {
    return alreadyTranslated;
  }

  const mctx: MutatorContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification
  > = {
    ...ctx,
    input: {
      ...ctx.input,
      schema:
        typeof ctx.input.schema === "boolean"
          ? ctx.input.schema
            ? {}
            : { not: {} }
          : ctx.input.schema,
    },
    output: {
      ...ctx.output,
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
    mctx.output,
    ctx.forceAllowBooleanSchema,
  );

  ctx.seen.set(ctx.input.schema, outputSchema);

  return outputSchema;
};

const copyJson: Mutator = (ctx) => {
  if (ctx.input.settings.arbitraryJson) {
    for (const key of Object.keys(ctx.input.schema).filter(
      (key) => !ctx.handledKeys.has(key),
    )) {
      if (ctx.output.settings.arbitraryJson) {
        if (!(key in ctx.output.schema)) {
          // @ts-expect-error CBA
          ctx.output.schema[key] = copy(ctx.copyJson, ctx.input.schema[key]);
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
  if (ctx.input.settings.errorMessage === "ajv") {
    if (ctx.output.settings.errorMessage === "ajv") {
      const isAjvErrorMessage = (obj: object): obj is AjvErrorMessages =>
        Object.values(obj).every(
          (value) =>
            typeof value === "string" ||
            (typeof value === "object" && value && isAjvErrorMessage(value)),
        );

      const errorMessage = ctx.input.schema.errorMessage;

      if (
        typeof errorMessage === "object" &&
        errorMessage &&
        isAjvErrorMessage(errorMessage)
      ) {
        ctx.output.schema.errorMessage = copy(ctx.copyJson, errorMessage);
        ctx.handledKeys.add("errorMessage");
      }
    }
  }
};
