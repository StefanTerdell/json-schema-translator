import { type CopyOption } from "../misc/copy.ts";
import { type DroppedKeysOption } from "../misc/DroppedKeys.ts";
import { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { type UnhandledKeysOption } from "../misc/UnhandledKeys.ts";

export type JsonSchemaTranslationOptions<
  AdditionalSpecifications extends
    | AdditionalJsonSchemaSpecifications
    | undefined = undefined,
> = Partial<JsonSchemaTranslationOptionsBase> &
  (AdditionalSpecifications extends undefined
    ? { specifications?: AdditionalJsonSchemaSpecifications }
    : { specifications: AdditionalSpecifications });

export type AdditionalJsonSchemaSpecifications = {
  [key: string | number | symbol]: JsonSchemaSpecification;
};

/** @internal */
export type JsonSchemaTranslationOptionsBase = {
  unhandledKeys: UnhandledKeysOption;
  droppedKeys: DroppedKeysOption;
  copyJson: CopyOption;
};

/** @internal */
export const defaultJsonSchemaTranslationOptionsBase: JsonSchemaTranslationOptionsBase =
  {
    unhandledKeys: "ignore",
    droppedKeys: "ignore",
    copyJson: "stringifyAndParse",
  };
