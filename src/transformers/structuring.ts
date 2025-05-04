import { TransformerFunction } from "./TransformFunction.ts";

export const transformStructuring: TransformerFunction = (input, output) => {
  output.schema.$ref = input.schema.$ref;

  if (input.settings.$anchor && output.settings.$anchor) {
    output.schema.$anchor = input.schema.$anchor;
  }

  if (
    input.settings.$recursiveAnchorAndRef &&
    output.settings.$recursiveAnchorAndRef
  ) {
    output.schema.$recursiveAnchor = input.schema.$recursiveAnchor;
    output.schema.$recursiveRef = input.schema.$recursiveRef;
  }

  if (
    input.settings.$dynamicAnchorAndRef &&
    output.settings.$dynamicAnchorAndRef
  ) {
    output.schema.$dynamicAnchor = input.schema.$dynamicAnchor;
    output.schema.$dynamicRef = input.schema.$dynamicRef;
  }
};
