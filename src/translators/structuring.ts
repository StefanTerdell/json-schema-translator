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

  if (input.settings.$recursiveAnchorAndRef) {
    if (output.settings.$recursiveAnchorAndRef) {
      if (input.schema.$recursiveAnchor !== undefined) {
        output.schema.$recursiveAnchor = input.schema.$recursiveAnchor;
      }

      if (input.schema.$recursiveRef !== undefined) {
        output.schema.$recursiveRef = input.schema.$recursiveRef;
      }
    }

    handledKeys.add("$recursiveAnchor");
    handledKeys.add("$recursiveRef");
  }

  if (input.settings.$dynamicAnchorAndRef) {
    if (output.settings.$dynamicAnchorAndRef) {
      if (input.schema.$dynamicAnchor !== undefined) {
        output.schema.$dynamicAnchor = input.schema.$dynamicAnchor;
      }

      if (input.schema.$dynamicRef !== undefined) {
        output.schema.$dynamicRef = input.schema.$dynamicRef;
      }
    }

    handledKeys.add("$dynamicAnchor");
    handledKeys.add("$dynamicRef");
  }
};
