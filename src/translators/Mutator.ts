import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { MutatorContext } from "./MutatorContext.ts";

export type Mutator = <
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
>(
  ctx: MutatorContext<
    InputJsonSchemaSpecification,
    OutputJsonSchemaSpecification
  >,
) => void;
