import { type JsonObject } from "../Json.ts";
import { type JsonSchema } from "../JsonSchema.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { type Mutator } from "./Mutator.ts";

export const translateDefinitionsKeyword: Mutator = (ctx) => {
  type OutputSpecification = typeof ctx.output.settings;
  type InputSpecification = typeof ctx.input.settings;

  const inputDefs = (ctx.input.schema as JsonObject)[
    ctx.input.settings.$defsPath
  ] as Record<string, JsonSchema<InputSpecification>> | undefined;

  if (inputDefs !== undefined) {
    const outputDefs = Object.keys(inputDefs).reduce(
      (outputDefs: Record<string, JsonSchema<OutputSpecification>>, key) => {
        outputDefs[key] = translateJsonSchemaInternal({
          ...ctx,
          input: {
            ...ctx.input,
            schema: inputDefs[key],
          },
          forceAllowBooleanSchema: false,
        });

        return outputDefs;
      },
      {},
    );

    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    ctx.output.schema[ctx.output.settings.$defsPath] = outputDefs;
  }

  ctx.handledKeys.add(ctx.input.settings.$defsPath);
};
