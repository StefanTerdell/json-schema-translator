import { copy } from "./copy.ts";
import { type AjvErrorMessages } from "./JsonSchema.ts";
import { type Mutator } from "./translators/Mutator.ts";

export const copyErrorMessage: Mutator = (ctx) => {
  if (ctx.input.settings.errorMessages === "ajv") {
    if (ctx.output.settings.errorMessages === "ajv") {
      const isAjvErrorMessage = (obj: object): obj is AjvErrorMessages =>
        Object.values(obj).every(
          (value) =>
            typeof value === "string" ||
            (typeof value === "object" && value && isAjvErrorMessage(value)),
        );

      const errorMessage = ctx.input.schema.errorMessage;

      if (
        typeof errorMessage === "object" &&
        errorMessage &&
        isAjvErrorMessage(errorMessage)
      ) {
        ctx.output.schema.errorMessage = copy(ctx, errorMessage);
        ctx.handledKeys.add("errorMessage");
      }
    }
  }
};
