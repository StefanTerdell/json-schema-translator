import {
  JsonSchema,
  JsonSchemaPath,
  type JsonSchemaKeywordsObject,
  type JsonSchemaStaticKeywordsObject,
} from "../types/JsonSchema.ts";
import { type JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { BaseContext2, type BaseContext } from "./BaseContext.ts";
import {
  UnhandledKeysMap,
  type HandledKeysSet,
} from "../misc/UnhandledKeys.ts";
import { CopyFn } from "../misc/copy.ts";
import { TranslatorContext2 } from "./TranslatorContext.ts";

export class MutatorContext2<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> extends BaseContext2<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> {
  from: {
    specification: InputJsonSchemaSpecification;
    schema: JsonSchemaStaticKeywordsObject<InputJsonSchemaSpecification>;
  };
  into: {
    specification: OutputJsonSchemaSpecification;
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };

  constructor(
    unhandledKeys: UnhandledKeysMap,
    copy: CopyFn,
    seen: Map<
      JsonSchema<InputJsonSchemaSpecification>,
      JsonSchema<OutputJsonSchemaSpecification>
    >,
    path: JsonSchemaPath,
    from: {
      specification: InputJsonSchemaSpecification;
      schema: JsonSchemaStaticKeywordsObject<InputJsonSchemaSpecification>;
    },
    into: {
      specification: OutputJsonSchemaSpecification;
      schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
    },
  ) {
    super(unhandledKeys, copy, seen, path);
    this.from = from;
    this.into = into;
  }

  intoTranslatorContext<ForceAllowBooleanSchema extends boolean>(
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>,
    path: JsonSchemaPath,
    forceBooleanSchema: ForceAllowBooleanSchema,
  ) {
    return new TranslatorContext2(
      this.unhandledKeys,
      this.copy,
      this.seen,
      [...this.path, ...path],
      {
        specification: this.from.specification,
        schema,
      },
      {
        specification: this.into.specification,
      },
      forceBooleanSchema,
    );
  }
}

/** @internal */
export type MutatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = BaseContext<InputJsonSchemaSpecification, OutputJsonSchemaSpecification> & {
  handledKeys: HandledKeysSet;
  from: {
    schema: JsonSchemaStaticKeywordsObject<InputJsonSchemaSpecification>;
  };
  into: {
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };
};
