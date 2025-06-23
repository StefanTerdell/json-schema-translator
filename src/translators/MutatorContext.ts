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
    onFrom?: (
      ctx: Omit<
        MutatorContext<
          Respecify<FromSpecification, Assertions>,
          IntoSpecification
        >,
        "into"
      >,
    ) => void;
    onFromNotInto?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, ToggledBooleanLiterals<Assertions>>
      >,
    ) => void;

    onInto?: (
      ctx: Omit<
        MutatorContext<
          FromSpecification,
          Respecify<IntoSpecification, Assertions>
        >,
        "from"
      >,
    ) => void;

    onIntoNotFrom?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, ToggledBooleanLiterals<Assertions>>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;

    onFromAndInto?: (
      ctx: MutatorContext<
        Respecify<FromSpecification, Assertions>,
        Respecify<IntoSpecification, Assertions>
      >,
    ) => void;
    onNeither?: (
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
      matches.onFrom?.(ctx as Any);
      matches.onInto?.(ctx as Any);
      matches.onFromAndInto?.(ctx as Any);
    } else {
      matches.onFrom?.(ctx as Any);
      matches.onFromNotInto?.(ctx as Any);
    }
  } else {
    if (into) {
      matches.onInto?.(ctx as Any);
      matches.onIntoNotFrom?.(ctx as Any);
    } else {
      matches.onNeither?.(ctx as Any);
    }
  }
}
