import { type CopyOption } from "./copy.ts";
import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { type UnhandledKeysOption } from "./UnhandledKeys.ts";

export type JsonSchemaTranslationOptions<
  AdditionalSpecifications extends
    | AdditionalJsonSchemaSpecifications
    | undefined = undefined,
> = Partial<JsonSchemaTranslationOptionsBase> &
  (AdditionalSpecifications extends undefined
    ? { additional?: AdditionalJsonSchemaSpecifications }
    : { additional: AdditionalSpecifications });

export type AdditionalJsonSchemaSpecifications = {
  [key: string | number | symbol]: JsonSchemaSpecification;
};

/** @internal */
export type JsonSchemaTranslationOptionsBase = {
  unhandledKeys: UnhandledKeysOption;
  copyJson: CopyOption;
};

/** @internal */
export const defaultJsonSchemaTranslationOptionsBase: JsonSchemaTranslationOptionsBase =
  {
    unhandledKeys: "ignore",
    copyJson: "stringifyAndParse",
  };
