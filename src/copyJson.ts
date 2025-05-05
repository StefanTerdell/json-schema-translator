import { copy } from "./copy.ts";
import { Mutator } from "./translators/Mutator.ts";

export const copyJson: Mutator = (ctx) => {
  if (ctx.input.settings.allowJson) {
    for (const key of Object.keys(ctx.input.schema).filter(
      (key) => !ctx.handledKeys.has(key),
    )) {
      if (ctx.output.settings.allowJson) {
        if (!(key in ctx.output.schema)) {
          // @ts-expect-error CBA
          ctx.output.schema[key] = copy(ctx, ctx.input.schema[key]);
        } else {
          ctx.unhandledKeys.set([...ctx.path, key], "conflict");
        }
      } else {
        ctx.unhandledKeys.set([...ctx.path, key], "disallowed");
      }

      ctx.handledKeys.add(key);
    }
  }
};
