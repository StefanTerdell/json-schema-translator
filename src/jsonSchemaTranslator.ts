import { type BundledJsonSchemaTypes } from "./misc/BundledJsonSchemaTypes.ts";
import { type JsonSchema } from "./types/JsonSchema.ts";
import { type JsonSchemaSpecification } from "./types/JsonSchemaSpecification.ts";
import {
  type AdditionalJsonSchemaSpecifications,
  defaultJsonSchemaTranslationOptionsBase,
  type JsonSchemaTranslationOptions,
  type JsonSchemaTranslationOptionsBase,
} from "./types/JsonSchemaTranslationOptions.ts";
import {
  resolveSpecification,
  type ResolveSpecification,
} from "./utils/resolveSpecification.ts";
import { translateSchema } from "./translators/translateSchema.ts";
import {
  getUnhandledKeysMap,
  handleUnhandledKeysMap,
} from "./misc/UnhandledKeys.ts";

// S, S
export function jsonSchemaTranslator<
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecification extends JsonSchemaSpecification,
>(
  inputSpecification: InputSpecification,
  outputSpecification: OutputSpecification,
  options?: JsonSchemaTranslationOptions,
): (
  schema: JsonSchema<InputSpecification>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<OutputSpecification>;
// S, B
export function jsonSchemaTranslator<
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  inputSpecification: InputSpecification,
  outputSpecificationName: OutputSpecificationName,
  options?: JsonSchemaTranslationOptions,
): (
  schema: JsonSchema<InputSpecification>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => BundledJsonSchemaTypes[OutputSpecificationName];
// S, A
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  inputSpecification: InputSpecification,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: JsonSchema<InputSpecification>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;
// B, S
export function jsonSchemaTranslator<
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecification extends JsonSchemaSpecification,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecification: OutputSpecification,
  options?: JsonSchemaTranslationOptions,
): (
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<OutputSpecification>;
// B, B
export function jsonSchemaTranslator<
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options?: JsonSchemaTranslationOptions,
): (
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => BundledJsonSchemaTypes[OutputSpecificationName];
// B, A
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;
// A, S
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecification extends JsonSchemaSpecification,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecification: OutputSpecification,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<OutputSpecification>;
// A, B
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => BundledJsonSchemaTypes[OutputSpecificationName];
// A, A
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;
// impl
export function jsonSchemaTranslator<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationOrName extends
    | keyof AdditionalSpecifications
    | keyof BundledJsonSchemaTypes
    | JsonSchemaSpecification,
  OutputSpecificationOrName extends
    | keyof AdditionalSpecifications
    | keyof BundledJsonSchemaTypes
    | JsonSchemaSpecification,
  InputSpecification extends ResolveSpecification<
    InputSpecificationOrName,
    AdditionalSpecifications
  > = ResolveSpecification<InputSpecificationOrName, AdditionalSpecifications>,
  OutputSpecification extends ResolveSpecification<
    OutputSpecificationOrName,
    AdditionalSpecifications
  > = ResolveSpecification<OutputSpecificationOrName, AdditionalSpecifications>,
>(
  inputSpecificationOrName: InputSpecificationOrName,
  outputSpecificationOrName: OutputSpecificationOrName,
  options?: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): (
  schema: JsonSchema<InputSpecification>,
  optionOverrides?: Partial<JsonSchemaTranslationOptionsBase>,
) => JsonSchema<OutputSpecification> {
  const mergedOptions = {
    ...defaultJsonSchemaTranslationOptionsBase,
    ...options,
    additional: options?.specifications as AdditionalSpecifications | undefined,
  };

  const inputSpecification = resolveSpecification<
    InputSpecificationOrName,
    AdditionalSpecifications,
    InputSpecification
  >(inputSpecificationOrName, mergedOptions.additional);

  const outputSpecification = resolveSpecification<
    OutputSpecificationOrName,
    AdditionalSpecifications,
    OutputSpecification
  >(outputSpecificationOrName, mergedOptions.additional);

  return function translateJsonSchema(inputSchema, optionOverrides) {
    const overriddenOptions = {
      ...mergedOptions,
      ...optionOverrides,
    };

    const unhandledKeysMap = getUnhandledKeysMap(
      overriddenOptions.unhandledKeys,
    );

    const outputSchema = translateSchema({
      from: {
        schema: inputSchema,
        specification: inputSpecification,
      },
      into: {
        specification: outputSpecification,
      },
      path: [],
      forceAllowBooleanSchema: false,
      unhandledKeys: unhandledKeysMap,
      copyJson: overriddenOptions.copyJson,
      seen: new Map(),
    });

    handleUnhandledKeysMap(overriddenOptions.unhandledKeys, unhandledKeysMap);

    return outputSchema;
  };
}
