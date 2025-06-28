import { Mutator } from "./Mutator.ts";

import { translateArrayKeywords } from "./keywords/arrays.ts";
import { translateConditionalKeywords } from "./keywords/conditionals.ts";
import { translateConstantKeywords } from "./keywords/enumAndConst.ts";
import { translateDefinitions } from "./keywords/definitions.ts";
import { translateFactoringKeywords } from "./keywords/factoring.ts";
import { translateId } from "./keywords/id.ts";
import { translateNullableKeyword } from "./keywords/nullable.ts";
import { translateNumberKeywords } from "./keywords/numbers.ts";
import { translateObjectKeywords } from "./keywords/objects.ts";
import { translateStringKeywords } from "./keywords/strings.ts";
import { translateStructuringKeywords } from "./keywords/structuring.ts";
import { translateTypeKeyword } from "./keywords/type.ts";
import { translateTitle } from "./keywords/title.ts";
import { translateDescriptionAndMarkdownDescription } from "./keywords/descriptionAndMarkdownDescription.ts";
import { translateDefault } from "./keywords/default.ts";
import { translate$comment } from "./keywords/$comment.ts";
import { translateDeprecated } from "./keywords/deprecated.ts";
import { translate$vocabulary } from "./keywords/$vocabulary.ts";
import { translateExamples } from "./keywords/examples.ts";
import { translateWriteOnly } from "./keywords/writeOnly.ts";
import { translateReadOnly } from "./keywords/readOnly.ts";
import { translate$schema } from "./keywords/$schema.ts";

export const translateKeywords: Mutator = (ctx) => {
  translateId(ctx);
  translateDefinitions(ctx);
  translateTypeKeyword(ctx);
  translateNullableKeyword(ctx);
  translateFactoringKeywords(ctx);
  translateConditionalKeywords(ctx);

  // translateAnnotationKeywords(ctx);
  translateTitle(ctx);
  translateDescriptionAndMarkdownDescription(ctx);
  translateDefault(ctx);
  translate$vocabulary(ctx);
  translate$comment(ctx);
  translateDeprecated(ctx);
  translateExamples(ctx);
  translateWriteOnly(ctx);
  translateReadOnly(ctx);
  translate$schema(ctx);

  translateConstantKeywords(ctx);
  translateStructuringKeywords(ctx);
  translateStringKeywords(ctx);
  translateNumberKeywords(ctx);
  translateArrayKeywords(ctx);
  translateObjectKeywords(ctx);
};
