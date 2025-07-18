import { type JsonSchema, type JsonSchemaPath } from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import {
  getUnhandledKeysMap,
  UnhandledKeysOption,
  type UnhandledKeysMap,
} from "../UnhandledKeys.ts";
import { type JsonSchemaTranslationOptionsBase } from "../JsonSchemaTranslationOptions.ts";
import { CopyFn, getCopyFn } from "../copy.ts";

export class BaseContext2<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> {
  unhandledKeys: UnhandledKeysMap;
  copy: CopyFn;

  constructor(options: JsonSchemaTranslationOptionsBase) {
    this.unhandledKeys = getUnhandledKeysMap(options.unhandledKeys);
    this.copy = getCopyFn(options.copyJson);
  }
}

/** @internal */
export type BaseContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = JsonSchemaTranslationOptionsBase & {
  unhandledKeys: UnhandledKeysMap;
  path: JsonSchemaPath;
  from: {
    settings: InputJsonSchemaSpecification;
  };
  into: {
    settings: OutputJsonSchemaSpecification;
  };
  seen: Map<
    JsonSchema<InputJsonSchemaSpecification>,
    JsonSchema<OutputJsonSchemaSpecification>
  >;
};
