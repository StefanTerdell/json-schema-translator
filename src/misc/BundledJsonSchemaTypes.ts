import { JsonSchemaSpecification } from "../types/JsonSchemaSpecification.ts";
import {
  JsonSchemaDraft2019_09,
  JsonSchemaDraft2019_09Specification,
  jsonSchemaDraft2019_09Specification,
} from "../specifications/draft2019_09.ts";
import {
  JsonSchemaDraft2020_12,
  JsonSchemaDraft2020_12Specification,
  jsonSchemaDraft2020_12Specification,
} from "../specifications/draft2020_12.ts";
import {
  JsonSchemaDraft4,
  JsonSchemaDraft4Specification,
  jsonSchemaDraft4Specification,
} from "../specifications/draft4.ts";
import {
  JsonSchemaDraft6,
  JsonSchemaDraft6Specification,
  jsonSchemaDraft6Specification,
} from "../specifications/draft6.ts";
import {
  JsonSchemaDraft7,
  JsonSchemaDraft7Specification,
  jsonSchemaDraft7Specification,
} from "../specifications/draft7.ts";
import {
  GoogleAiJsonSchema,
  GoogleAiJsonSchemaSpecification,
  googleAiJsonSchemaSpecification,
} from "../specifications/google_ai.ts";
import {
  OpenAiStructuredOutputSchema,
  OpenAiStructuredOutputSchemaSpecification,
  openAiStructuredOutputSchemaSpecification,
} from "../specifications/open_ai_structured_output.ts";

export type BundledJsonSchemaTypes = {
  draft4: JsonSchemaDraft4;
  draft6: JsonSchemaDraft6;
  draft7: JsonSchemaDraft7;
  draft2019_09: JsonSchemaDraft2019_09;
  draft2020_12: JsonSchemaDraft2020_12;
  googleAi: GoogleAiJsonSchema;
  openAiStructuredOutput: OpenAiStructuredOutputSchema;
};

export type BundledJsonSchemaSpecifications = {
  draft4: JsonSchemaDraft4Specification;
  draft6: JsonSchemaDraft6Specification;
  draft7: JsonSchemaDraft7Specification;
  draft2019_09: JsonSchemaDraft2019_09Specification;
  draft2020_12: JsonSchemaDraft2020_12Specification;
  googleAi: GoogleAiJsonSchemaSpecification;
  openAiStructuredOutput: OpenAiStructuredOutputSchemaSpecification;
} & Record<keyof BundledJsonSchemaTypes, JsonSchemaSpecification>;

export const bundledJsonSchemaSpecifications: BundledJsonSchemaSpecifications =
  {
    draft4: jsonSchemaDraft4Specification,
    draft6: jsonSchemaDraft6Specification,
    draft7: jsonSchemaDraft7Specification,
    draft2019_09: jsonSchemaDraft2019_09Specification,
    draft2020_12: jsonSchemaDraft2020_12Specification,
    googleAi: googleAiJsonSchemaSpecification,
    openAiStructuredOutput: openAiStructuredOutputSchemaSpecification,
  };
