import { type Mutator } from "./Mutator.ts";

export const translateStructuringKeywords: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.schema.$ref !== undefined) {
    output.schema.$ref = input.schema.$ref;
  }

  handledKeys.add("$ref");

  if (input.settings.$anchor) {
    if (output.settings.$anchor && input.schema.$anchor !== undefined) {
      output.schema.$anchor = input.schema.$anchor;
    }

    handledKeys.add("$anchor");
  }

  if (input.settings.$recursiveRef) {
    if (
      output.settings.$recursiveRef &&
      input.schema.$recursiveRef !== undefined
    ) {
      output.schema.$recursiveRef = input.schema.$recursiveRef;
    }

    if (input.settings.$recursiveAnchor) {
      if (
        output.settings.$recursiveRef &&
        output.settings.$recursiveAnchor &&
        input.schema.$recursiveAnchor !== undefined
      ) {
        output.schema.$recursiveAnchor = input.schema.$recursiveAnchor;
      }

      handledKeys.add("$recursiveAnchor");
    }

    handledKeys.add("$recursiveRef");
  }

  if (input.settings.$dynamicRef) {
    if (output.settings.$dynamicRef && input.schema.$dynamicRef !== undefined) {
      output.schema.$dynamicRef = input.schema.$dynamicRef;
    }

    if (input.settings.$dynamicAnchor) {
      if (
        output.settings.$dynamicRef &&
        output.settings.$dynamicAnchor &&
        input.schema.$dynamicAnchor !== undefined
      ) {
        output.schema.$dynamicAnchor = input.schema.$dynamicAnchor;
      }

      handledKeys.add("$dynamicAnchor");
    }

    handledKeys.add("$dynamicRef");
  }
};
