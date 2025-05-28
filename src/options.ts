import {
  BundledJsonSchemaSpecifications,
  bundledJsonSchemaSpecifications,
  BundledJsonSchemaTypes,
} from "./BundledJsonSchemaTypes.ts";
import { JsonSchema } from "./JsonSchema.ts";
import { JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import {
  jsonSchemaDraft4Specification,
  JsonSchemaDraft4Specification,
} from "./specifications/draft4.ts";
import { translateJsonSchema } from "./translateJsonSchema.ts";
import { EmptyObject } from "./utils.ts";

export type JsonSchemaSpecifications = {
  [Key in string]: JsonSchemaSpecification;
};

export type JsonSchemaFromSpecifications<
  Specification extends
    | keyof AdditionalSpecifications
    | keyof BundledJsonSchemaTypes
    | JsonSchemaSpecification,
  AdditionalSpecifications extends JsonSchemaSpecifications,
> = Specification extends keyof AdditionalSpecifications
  ? JsonSchema<AdditionalSpecifications[Specification]>
  : Specification extends keyof BundledJsonSchemaTypes
    ? BundledJsonSchemaTypes[Specification]
    : Specification extends JsonSchemaSpecification
      ? JsonSchema<Specification>
      : never;

type SpecificationOrName<
  AdditionalSpecifications extends JsonSchemaSpecifications = EmptyObject,
> =
  | keyof BundledJsonSchemaSpecifications
  | keyof AdditionalSpecifications
  | JsonSchemaSpecification;

function resolveSpecification<
  SpecificationOrNameArg extends SpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends JsonSchemaSpecifications,
>(
  specificationOrName: SpecificationOrNameArg,
  specifications: AdditionalSpecifications | undefined,
): JsonSchemaSpecification {
  if (typeof specificationOrName === "string") {
    if (specifications && specificationOrName in specifications) {
      return specifications[specificationOrName];
    }

    if (specificationOrName in bundledJsonSchemaSpecifications) {
      return bundledJsonSchemaSpecifications[
        specificationOrName as keyof BundledJsonSchemaSpecifications
      ];
    }
  }

  if (typeof specificationOrName === "object") {
    return specificationOrName;
  }

  throw new Error("Specification not found");
}

type ResolveSpecification<
  T extends SpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends JsonSchemaSpecifications = EmptyObject,
> = T extends JsonSchemaSpecification
  ? T
  : T extends keyof AdditionalSpecifications
    ? AdditionalSpecifications[T]
    : T extends keyof BundledJsonSchemaSpecifications
      ? BundledJsonSchemaSpecifications[T]
      : never;

function jst<
  InputSpecificationOrName extends SpecificationOrName,
  OutputSpecificationOrName extends SpecificationOrName,
  InputSpecification extends
    JsonSchemaSpecification = ResolveSpecification<InputSpecificationOrName>,
  OutputSpecification extends
    JsonSchemaSpecification = ResolveSpecification<OutputSpecificationOrName>,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecificationOrName: InputSpecificationOrName,
  outputSpecificationOrName: OutputSpecificationOrName,
  specifications?: EmptyObject,
): JsonSchema<OutputSpecification>;
function jst<
  InputSpecificationOrName extends
    SpecificationOrName<AdditionalSpecifications>,
  OutputSpecificationOrName extends
    SpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends JsonSchemaSpecifications,
  InputSpecification extends JsonSchemaSpecification = ResolveSpecification<
    InputSpecificationOrName,
    AdditionalSpecifications
  >,
  OutputSpecification extends JsonSchemaSpecification = ResolveSpecification<
    OutputSpecificationOrName,
    AdditionalSpecifications
  >,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecificationOrName: InputSpecificationOrName,
  outputSpecificationOrName: OutputSpecificationOrName,
  specifications: AdditionalSpecifications,
): JsonSchema<OutputSpecification>;
function jst<
  InputSpecificationOrName extends
    SpecificationOrName<AdditionalSpecifications>,
  OutputSpecificationOrName extends
    SpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends JsonSchemaSpecifications = EmptyObject,
  InputSpecification extends JsonSchemaSpecification = ResolveSpecification<
    InputSpecificationOrName,
    AdditionalSpecifications
  >,
  OutputSpecification extends JsonSchemaSpecification = ResolveSpecification<
    OutputSpecificationOrName,
    AdditionalSpecifications
  >,
>(
  schema: JsonSchema<InputSpecification>,
  inputSpecificationOrName: InputSpecificationOrName,
  outputSpecificationOrName: OutputSpecificationOrName,
  specifications: AdditionalSpecifications | undefined,
): JsonSchema<OutputSpecification> {
  const inputSpecification = resolveSpecification(
    inputSpecificationOrName,
    specifications,
  ) as InputSpecification;
  const outputSpecification = resolveSpecification(
    outputSpecificationOrName,
    specifications,
  ) as OutputSpecification;

  return translateJsonSchema(schema, inputSpecification, outputSpecification);
}

const x = jst({}, "draft4", "draft6");

type Options<
  AdditionalSpecifications extends
    | JsonSchemaSpecifications
    | undefined = undefined,
> = {
  someOption?: boolean;
} & (AdditionalSpecifications extends undefined
  ? { additional?: undefined }
  : { additional: AdditionalSpecifications });

const o: Options<{ x: JsonSchemaDraft4Specification }> = {
  someOption: true,
  additional: { x: jsonSchemaDraft4Specification },
};

const o2: Options = {
  someOption: true,
  additional: undefined,
};

// S, S
function translateJsonSchemaNameOrSpec<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(schema: JsonSchema<I>, input: I, output: O, options?: Options): JsonSchema<O>;
// S, B
function translateJsonSchemaNameOrSpec<
  I extends JsonSchemaSpecification,
  O extends keyof BundledJsonSchemaTypes,
>(
  schema: JsonSchema<I>,
  i: I,
  o: O,
  options?: Options,
): BundledJsonSchemaTypes[O];
// S, A
function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends JsonSchemaSpecification,
  O extends keyof A,
>(schema: JsonSchema<I>, i: I, o: O, options: Options<A>): JsonSchema<A[O]>;

// B, S
function translateJsonSchemaNameOrSpec<
  I extends keyof BundledJsonSchemaTypes,
  O extends JsonSchemaSpecification,
>(
  schema: BundledJsonSchemaTypes[I],
  i: I,
  o: O,
  options?: Options,
): JsonSchema<O>;
// B, B
function translateJsonSchemaNameOrSpec<
  I extends keyof BundledJsonSchemaTypes,
  O extends keyof BundledJsonSchemaTypes,
>(
  schema: BundledJsonSchemaTypes[I],
  i: I,
  o: O,
  options?: Options,
): BundledJsonSchemaTypes[O];
// B, A
function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends keyof BundledJsonSchemaTypes,
  O extends keyof A,
>(
  schema: BundledJsonSchemaTypes[I],
  i: I,
  o: O,
  options: Options<A>,
): JsonSchema<A[O]>;

// A, S
function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends JsonSchemaSpecification,
>(schema: JsonSchema<A[I]>, i: I, o: O, options: Options<A>): JsonSchema<O>;
// A, B
function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends keyof BundledJsonSchemaTypes,
>(
  schema: JsonSchema<A[I]>,
  i: I,
  o: O,
  options: Options<A>,
): BundledJsonSchemaTypes[O];
// A, A
function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends keyof A,
>(schema: JsonSchema<A[I]>, i: I, o: O, options: Options<A>): JsonSchema<A[O]>;

function translateJsonSchemaNameOrSpec<
  A extends JsonSchemaSpecifications,
  I extends keyof A | keyof BundledJsonSchemaTypes | JsonSchemaSpecification,
  O extends keyof A | keyof BundledJsonSchemaTypes | JsonSchemaSpecification,
  ISp extends ResolveSpecification<I, A> = ResolveSpecification<I, A>,
  OSp extends ResolveSpecification<O, A> = ResolveSpecification<O, A>,
>(schema: JsonSchema<ISp>, i: I, o: O, options?: Options<A>): JsonSchema<OSp> {
  const inputSpecification = resolveSpecification(
    i,
    options?.additional as A | undefined,
  ) as ISp;

  const outputSpecification = resolveSpecification(
    o,
    options?.additional as A | undefined,
  ) as OSp;

  return translateJsonSchema(schema, inputSpecification, outputSpecification);
}

// S, S
function translateJsonSchemaNameOrSpecGenerator<
  I extends JsonSchemaSpecification,
  O extends JsonSchemaSpecification,
>(i: I, o: O): (schema: JsonSchema<I>) => JsonSchema<O>;
// S, B
function translateJsonSchemaNameOrSpecGenerator<
  I extends JsonSchemaSpecification,
  O extends keyof BundledJsonSchemaTypes,
>(i: I, o: O): (schema: JsonSchema<I>) => BundledJsonSchemaTypes[O];
// S, A
function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends JsonSchemaSpecification,
  O extends keyof A,
>(i: I, o: O, a: A): (schema: JsonSchema<I>) => JsonSchema<A[O]>;

// B, S
function translateJsonSchemaNameOrSpecGenerator<
  I extends keyof BundledJsonSchemaTypes,
  O extends JsonSchemaSpecification,
>(i: I, o: O): (schema: BundledJsonSchemaTypes[I]) => JsonSchema<O>;
// B, B
function translateJsonSchemaNameOrSpecGenerator<
  I extends keyof BundledJsonSchemaTypes,
  O extends keyof BundledJsonSchemaTypes,
>(i: I, o: O): (schema: BundledJsonSchemaTypes[I]) => BundledJsonSchemaTypes[O];
// B, A
function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends keyof BundledJsonSchemaTypes,
  O extends keyof A,
>(i: I, o: O, a: A): (schema: BundledJsonSchemaTypes[I]) => JsonSchema<A[O]>;

// A, S
function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends JsonSchemaSpecification,
>(i: I, o: O, a: A): (schema: JsonSchema<A[I]>) => JsonSchema<O>;
// A, B
function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends keyof BundledJsonSchemaTypes,
>(i: I, o: O, a: A): (schema: JsonSchema<A[I]>) => BundledJsonSchemaTypes[O];
// A, A
function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends keyof A,
  O extends keyof A,
>(i: I, o: O, a: A): (schema: JsonSchema<A[I]>) => JsonSchema<A[O]>;

function translateJsonSchemaNameOrSpecGenerator<
  A extends JsonSchemaSpecifications,
  I extends keyof A | keyof BundledJsonSchemaTypes | JsonSchemaSpecification,
  O extends keyof A | keyof BundledJsonSchemaTypes | JsonSchemaSpecification,
  ISp extends ResolveSpecification<I, A> = ResolveSpecification<I, A>,
  OSp extends ResolveSpecification<O, A> = ResolveSpecification<O, A>,
>(i: I, o: O, a?: A): (schema: JsonSchema<ISp>) => JsonSchema<OSp> {
  const inputSpecification = resolveSpecification(i, a) as ISp;
  const outputSpecification = resolveSpecification(o, a) as OSp;

  return (schema) =>
    translateJsonSchema(schema, inputSpecification, outputSpecification);
}

const l = translateJsonSchemaNameOrSpec(
  { prefixItems: null },
  "draft4",
  "draft7",
);
