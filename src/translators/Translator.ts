import { JsonSchema } from "../JsonSchema.ts";
import { JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { Specify } from "../utils/schemaUtils.ts";
import { TranslatorContext } from "./TranslatorContext.ts";

export type Translator<
  Assertions extends
    | { from: Partial<JsonSchemaSpecification> }
    | { into: Partial<JsonSchemaSpecification> }
    | {
        from: Partial<JsonSchemaSpecification>;
        into: Partial<JsonSchemaSpecification>;
      }
    | Partial<JsonSchemaSpecification>
    | null = null,
  Parameters extends unknown[] = [],
> = <
  const FromSpecification extends Assertions extends {
    from: infer Assertions extends Partial<JsonSchemaSpecification>;
  }
    ? Specify<Assertions>
    : Assertions extends Partial<JsonSchemaSpecification>
      ? Specify<Assertions>
      : JsonSchemaSpecification,
  const IntoSpecification extends Assertions extends {
    into: infer Assertions extends Partial<JsonSchemaSpecification>;
  }
    ? Specify<Assertions>
    : Assertions extends Partial<JsonSchemaSpecification>
      ? Specify<Assertions>
      : JsonSchemaSpecification,
  ForceAllowBooleanSchema extends boolean,
>(
  ctx: TranslatorContext<
    FromSpecification,
    IntoSpecification,
    ForceAllowBooleanSchema
  >,
  ...args: Parameters
) => JsonSchema<IntoSpecification, ForceAllowBooleanSchema>;
