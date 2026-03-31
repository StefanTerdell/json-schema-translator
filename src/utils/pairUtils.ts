import type { Pair } from "../translators/Pair.ts";
import type { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import { matchDeep } from "./matchDeep.ts";
import type { Respecify } from "./schemaUtils.ts";
import type { ToggledBooleanLiterals } from "../types/UtilityTypes.ts";

export function matchPair<
  Spec extends JsonSchemaSpecification,
  Assertions extends Partial<JsonSchemaSpecification>,
>(
  pair: Pair<Spec>,
  assertions: Assertions,
  matches?: {
    true?: (pair: Pair<Respecify<Spec, Assertions>>) => void;
    false?: (
      pair: Pair<Respecify<Spec, ToggledBooleanLiterals<Assertions>>>,
    ) => void;
  },
): boolean {
  if (matchDeep(pair.specification, assertions)) {
    // deno-lint-ignore no-explicit-any
    matches?.true?.(pair as any);

    return true;
  } else {
    // deno-lint-ignore no-explicit-any
    matches?.false?.(pair as any);

    return false;
  }
}
