import { CopyFn } from "../misc/copy.ts";
import { type DroppedKeysMap } from "../misc/DroppedKeys.ts";
import { UnhandledKeysMap } from "../misc/UnhandledKeys.ts";
import type { JsonSchema, JsonSchemaPath } from "../types/JsonSchema.ts";
import type { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { BaseContext2, type BaseContext } from "./BaseContext.ts";

export class TranslatorContext2<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
> extends BaseContext2<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> {
  from: {
    specification: InputJsonSchemaSpecification;
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
  };
  into: {
    specification: OutputJsonSchemaSpecification;
  };
  forceAllowBooleanSchema: ForceAllowBooleanSchema;

  constructor(
    unhandledKeys: UnhandledKeysMap,
    droppedKeys: DroppedKeysMap,
    copy: CopyFn,
    seen: Map<
      JsonSchema<InputJsonSchemaSpecification>,
      JsonSchema<OutputJsonSchemaSpecification>
    >,
    path: JsonSchemaPath,
    from: {
      specification: InputJsonSchemaSpecification;
      schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
    },
    into: {
      specification: OutputJsonSchemaSpecification;
    },
    forceAllowBooleanSchema: ForceAllowBooleanSchema,
  ) {
    super(unhandledKeys, droppedKeys, copy, seen, path);
    this.from = from;
    this.into = into;
    this.forceAllowBooleanSchema = forceAllowBooleanSchema;
  }
}

/** @internal */
export type TranslatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
> = BaseContext<InputJsonSchemaSpecification, OutputJsonSchemaSpecification> & {
  from: {
    schema: JsonSchema<InputJsonSchemaSpecification, ForceAllowBooleanSchema>;
  };
  forceAllowBooleanSchema: ForceAllowBooleanSchema;
};
