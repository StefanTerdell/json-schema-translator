import { type BundledJsonSchemaTypes } from "./misc/BundledJsonSchemaTypes.ts";
import {
  getDroppedKeysMap,
  handleDroppedKeysMap,
} from "./misc/DroppedKeys.ts";
import { type JsonSchema } from "./types/JsonSchema.ts";
import { type JsonSchemaSpecification } from "./types/JsonSchemaSpecification.ts";
import {
  type AdditionalJsonSchemaSpecifications,
  defaultJsonSchemaTranslationOptionsBase,
  type JsonSchemaTranslationOptions,
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
export function translateJsonSchema<
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecification extends JsonSchemaSpecification,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecification: InputSpecification,
  outputSpecification: OutputSpecification,
  options?: JsonSchemaTranslationOptions,
): JsonSchema<OutputSpecification>;
// S, B
export function translateJsonSchema<
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecification: InputSpecification,
  outputSpecificationName: OutputSpecificationName,
  options?: JsonSchemaTranslationOptions,
): BundledJsonSchemaTypes[OutputSpecificationName];
// S, A
export function translateJsonSchema<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecification extends JsonSchemaSpecification,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecification: InputSpecification,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;

// B, S
export function translateJsonSchema<
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecification extends JsonSchemaSpecification,
>(
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  inputSpecificationName: InputSpecificationName,
  outputSpecification: OutputSpecification,
  options?: JsonSchemaTranslationOptions,
): JsonSchema<OutputSpecification>;
// B, B
export function translateJsonSchema<
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options?: JsonSchemaTranslationOptions,
): BundledJsonSchemaTypes[OutputSpecificationName];
// B, A
export function translateJsonSchema<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof BundledJsonSchemaTypes,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  schema: BundledJsonSchemaTypes[InputSpecificationName],
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;
// A, S
export function translateJsonSchema<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecification extends JsonSchemaSpecification,
>(
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  inputSpecificationName: InputSpecificationName,
  outputSpecification: OutputSpecification,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): JsonSchema<OutputSpecification>;
// A, B
export function translateJsonSchema<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecificationName extends keyof BundledJsonSchemaTypes,
>(
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): BundledJsonSchemaTypes[OutputSpecificationName];
// A, A
export function translateJsonSchema<
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  InputSpecificationName extends keyof AdditionalSpecifications,
  OutputSpecificationName extends keyof AdditionalSpecifications,
>(
  schema: JsonSchema<AdditionalSpecifications[InputSpecificationName]>,
  inputSpecificationName: InputSpecificationName,
  outputSpecificationName: OutputSpecificationName,
  options: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): JsonSchema<AdditionalSpecifications[OutputSpecificationName]>;
// impl
export function translateJsonSchema<
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
  inputSchema: JsonSchema<InputSpecification>,
  inputSpecificationOrName: InputSpecificationOrName,
  outputSpecificationOrName: OutputSpecificationOrName,
  options?: JsonSchemaTranslationOptions<AdditionalSpecifications>,
): JsonSchema<OutputSpecification> {
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

  const unhandledKeysMap = getUnhandledKeysMap(mergedOptions.unhandledKeys);
  const droppedKeysMap = getDroppedKeysMap(mergedOptions.droppedKeys);

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
    droppedKeys: droppedKeysMap,
    copyJson: mergedOptions.copyJson,
    seen: new Map(),
  });

  handleUnhandledKeysMap(mergedOptions.unhandledKeys, unhandledKeysMap);
  handleDroppedKeysMap(mergedOptions.droppedKeys, droppedKeysMap);

  return outputSchema;
}
