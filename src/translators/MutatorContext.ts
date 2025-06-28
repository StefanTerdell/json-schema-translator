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
  const FromSpecification extends JsonSchemaSpecification,
  const IntoSpecification extends JsonSchemaSpecification,
  const Assertions extends Partial<JsonSchemaSpecification>,
>(
  ctx: MutatorContext<FromSpecification, IntoSpecification>,
  assertions: Assertions,
  matches: {
    from?: (
      ctx: Omit<
        MutatorContext<
          Respecify<FromSpecification, Assertions>,
          IntoSpecification
        >,
        "into"
      >,
    ) => void;

    notFrom?: (
      ctx: Omit<
        MutatorContext<
          Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
          IntoSpecification
        >,
        "into"
      >,
    ) => void;

    onlyFrom?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;

    into?: (
      ctx: Omit<
        MutatorContext<
          FromSpecification,
          Respecify<IntoSpecification, Assertions>
        >,
        "from"
      >,
    ) => void;

    notInto?: (
      ctx: Omit<
        MutatorContext<
          FromSpecification,
          Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
        >,
        "from"
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
    matches.from?.(ctx as Any);
    if (into) {
      matches.into?.(ctx as Any);
      matches.both?.(ctx as Any);
    } else {
      matches.notInto?.(ctx as Any);
      matches.onlyFrom?.(ctx as Any);
    }
  } else {
    matches.notFrom?.(ctx as Any);
    if (into) {
      matches.into?.(ctx as Any);
      matches.onlyInto?.(ctx as Any);
    } else {
      matches.notInto?.(ctx as Any);
      matches.none?.(ctx as Any);
    }
  }
}
