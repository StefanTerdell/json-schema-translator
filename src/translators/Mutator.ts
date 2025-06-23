import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { MutatorContext } from "./MutatorContext.ts";

export type Mutator = <
  const InputJsonSchemaSpecification extends JsonSchemaSpecification,
  const OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification
  >,
) => void;
