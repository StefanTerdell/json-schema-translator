import { type JsonSchema, type JsonSchemaPath } from "../types/JsonSchema.ts";
import { type JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import {
  getUnhandledKeysMap,
  type UnhandledKeysMap,
} from "../misc/UnhandledKeys.ts";
import { type JsonSchemaTranslationOptionsBase } from "../types/JsonSchemaTranslationOptions.ts";
import { CopyFn, getCopyFn } from "../misc/copy.ts";

export class BaseContext2<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> {
  unhandledKeys: UnhandledKeysMap;
  copy: CopyFn;
  path: JsonSchemaPath;
  seen: Map<
    JsonSchema<InputJsonSchemaSpecification>,
    JsonSchema<OutputJsonSchemaSpecification>
  >;

  constructor(
    unhandledKeys: UnhandledKeysMap,
    copy: CopyFn,
    seen: Map<
      JsonSchema<InputJsonSchemaSpecification>,
      JsonSchema<OutputJsonSchemaSpecification>
    >,
    path: JsonSchemaPath,
  ) {
    this.unhandledKeys = unhandledKeys;
    this.copy = copy;
    this.seen = seen;
    this.path = path;
  }

  static fromOptions(options: JsonSchemaTranslationOptionsBase) {
    return new BaseContext2(
      getUnhandledKeysMap(options.unhandledKeys),
      getCopyFn(options.copyJson),
      new Map(),
      [],
    );
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
    specification: InputJsonSchemaSpecification;
  };
  into: {
    specification: OutputJsonSchemaSpecification;
  };
  seen: Map<
    JsonSchema<InputJsonSchemaSpecification>,
    JsonSchema<OutputJsonSchemaSpecification>
  >;
};
