import { type JsonSchema } from "./JsonSchema.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { copyErrorMessage } from "./copyErrorMessage.ts";
import { copyJson } from "./copyJson.ts";
import { translateAnnotationKeywords } from "./translators/annotations.ts";
import { translateArrayKeywords } from "./translators/arrays.ts";
import { translateConditionalKeywords } from "./translators/conditionals.ts";
import { translateConstantKeywords } from "./translators/constants.ts";
import { translateDefinitionsKeyword } from "./translators/definitions.ts";
import { translateFactoringKeywords } from "./translators/factoring.ts";
import { translateIdKeyword } from "./translators/id.ts";
import { type MutatorContext } from "./translators/Mutator.ts";
import { translateNullableKeyword } from "./translators/nullable.ts";
import { translateNumberKeywords } from "./translators/numbers.ts";
import { translateObjectKeywords } from "./translators/objects.ts";
import { translateStringKeywords } from "./translators/strings.ts";
import { translateStructuringKeywords } from "./translators/structuring.ts";
import { translateTypeKeyword } from "./translators/type.ts";
import { type TranslateJsonSchemaContext } from "./TranslateJsonSchemaContext.ts";
import { collapseIntoBooleanSchema } from "./collapseIntoBooleanSchema.ts";

/** @internal */
export type TranslateJsonSchemaInternalContext<
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

export const translateJsonSchemaInternal = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
>(
  ctx: TranslateJsonSchemaInternalContext<
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
