import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { MutatorContext, Specify } from "./MutatorContext.ts";

export type Mutator<
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
  ReturnType extends unknown = boolean | undefined | void,
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
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
  ...args: Parameters
) => ReturnType;
