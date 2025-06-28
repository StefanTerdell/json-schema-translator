import { Mutator } from "./Mutator.ts";

import { translateAnnotationKeywords } from "./keywords/annotations.ts";
import { translateArrayKeywords } from "./keywords/arrays.ts";
import { translateConditionalKeywords } from "./keywords/conditionals.ts";
import { translateConstantKeywords } from "./keywords/enumAndConst.ts";
import { translateDefinitionsKeyword } from "./keywords/definitions.ts";
import { translateFactoringKeywords } from "./keywords/factoring.ts";
import { translateIdKeyword } from "./keywords/id.ts";
import { translateNullableKeyword } from "./keywords/nullable.ts";
import { translateNumberKeywords } from "./keywords/numbers.ts";
import { translateObjectKeywords } from "./keywords/objects.ts";
import { translateStringKeywords } from "./keywords/strings.ts";
import { translateStructuringKeywords } from "./keywords/structuring.ts";
import { translateTypeKeyword } from "./keywords/type.ts";

export const translateKeywords: Mutator = (ctx) => {
  translateIdKeyword(ctx);
  translateDefinitionsKeyword(ctx);
  translateTypeKeyword(ctx);
  translateNullableKeyword(ctx);
  translateFactoringKeywords(ctx);
  translateConditionalKeywords(ctx);
  translateAnnotationKeywords(ctx);
  translateConstantKeywords(ctx);
  translateStructuringKeywords(ctx);
  translateStringKeywords(ctx);
  translateNumberKeywords(ctx);
  translateArrayKeywords(ctx);
  translateObjectKeywords(ctx);
};
