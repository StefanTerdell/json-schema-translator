import {
  type JsonSchemaKeywordsObject,
  type JsonSchemaKeywordsOnlyObject,
} from "../JsonSchema.ts";
import { type JsonSchemaSpecification } from "../JsonSchemaSpecification.ts";
import { matchDeep } from "../matchDeep.ts";
import { type TranslatorContext } from "../TranslatorContext.ts";
import { type HandledKeysSet } from "../UnhandledKeys.ts";
import { Replace, ToggledBooleanLiterals } from "../utils.ts";

/** @internal */
export type MutatorContext<
  InputJsonSchemaSpecification extends JsonSchemaSpecification,
  OutputJsonSchemaSpecification extends JsonSchemaSpecification,
> = TranslatorContext<
  InputJsonSchemaSpecification,
  OutputJsonSchemaSpecification
> & {
  handledKeys: HandledKeysSet;
  from: {
    schema: JsonSchemaKeywordsOnlyObject<InputJsonSchemaSpecification>;
  };
  into: {
    schema: JsonSchemaKeywordsObject<OutputJsonSchemaSpecification>;
  };
};

type Respecify<
  Source extends JsonSchemaSpecification,
  Target extends Partial<JsonSchemaSpecification>,
> = Replace<Source, Target, JsonSchemaSpecification>;

export function match<
  FromSpecification extends JsonSchemaSpecification,
  IntoSpecification extends JsonSchemaSpecification,
  Assertions extends Partial<JsonSchemaSpecification>,
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
  assertions: Assertions,
  matches: {
    from?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        IntoSpecification
      >,
    ) => void;
    onlyFrom?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;

    into?: (
      ctx: MutatorContext<
        FromSpecification,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;

    onlyInto?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;

    both?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;
    none?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;
  },
) {
  const from = matchDeep(ctx.from.settings, assertions);
  const into = matchDeep(ctx.into.settings, assertions);

  // deno-lint-ignore no-explicit-any
  type Any = any;

  if (from) {
    if (into) {
      matches.from?.(ctx as Any);
      matches.into?.(ctx as Any);
      matches.both?.(ctx as Any);
    } else {
      matches.from?.(ctx as Any);
      matches.onlyFrom?.(ctx as Any);
    }
  } else {
    if (into) {
      matches.into?.(ctx as Any);
      matches.onlyInto?.(ctx as Any);
    } else {
      matches.none?.(ctx as Any);
    }
  }
}
