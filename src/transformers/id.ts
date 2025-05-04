import { Mutator } from "./Mutator.ts";

export const translateIdKeyword: Mutator = (input, output) => {
  // @ts-expect-error ISSUE: Narrowing breaks down across generics
  const id = input.schema[input.settings.$idPath];

  if (id !== undefined) {
    // @ts-expect-error ISSUE: Narrowing breaks down across generics
    output.schema[output.settings.$idPath] = id;
  }

  input.handledKeys.add(input.settings.$idPath);
};
