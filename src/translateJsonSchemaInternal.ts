import { JsonSchema, JsonSchemaKeywordsObject } from "./JsonSchema.ts";
import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { copyErrorMessage } from "./copyErrorMessage.ts";
import { copyJson } from "./copyJson.ts";
import { translateAnnotationKeywords } from "./translators/annotations.ts";
import { translateArrayKeywords } from "./translators/arrays.ts";
import { translateConditionalKeywords } from "./translators/conditionals.ts";
import { translateConstantKeywords } from "./translators/constants.ts";
import { translateDefinitionsKeyword } from "./translators/definitions.ts";
import { translateFactoringKeywords } from "./translators/factoring.ts";
import { translateIdKeyword } from "./translators/id.ts";
import { MutatorContext } from "./translators/Mutator.ts";
import { translateNullableKeyword } from "./translators/nullable.ts";
import { translateNumberKeywords } from "./translators/numbers.ts";
import { translateObjectKeywords } from "./translators/objects.ts";
import { translateStringKeywords } from "./translators/strings.ts";
import { translateStructuringKeywords } from "./translators/structuring.ts";
import { translateTypeKeyword } from "./translators/type.ts";
import { isAnySchema, isNeverSchema } from "./utils.ts";
import { TranslateJsonSchemaContext } from "./TranslateJsonSchemaContext.ts";

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

  return collapsePrimitiveSchema(mctx, ctx.forceAllowBooleanSchema);
};
const collapsePrimitiveSchema = <
  Specification extends JsonSchemaSpecification,
  ForceAllowBooleanSchemas extends boolean,
>(
  ctx: {
    output: {
      schema: JsonSchemaKeywordsObject<Specification>;
      settings: Specification;
    };
  },
  forceAllowBooleanSchemas: ForceAllowBooleanSchemas,
): JsonSchema<Specification, ForceAllowBooleanSchemas> => {
  if (ctx.output.settings.booleanSchemas) {
    if (isAnySchema(ctx.output.schema)) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = true;

      return schema;
    }

    if (isNeverSchema(ctx.output.schema)) {
      const schema: JsonSchema<
        Specification & { booleanSchemas: true },
        ForceAllowBooleanSchemas
      > = false;

      return schema;
    }
  }

  if (forceAllowBooleanSchemas) {
    if (isAnySchema(ctx.output.schema)) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        true;

      return schema;
    }

    if (isNeverSchema(ctx.output.schema)) {
      const schema: JsonSchema<Specification, ForceAllowBooleanSchemas & true> =
        false;

      return schema;
    }
  }

  return ctx.output.schema;
};
