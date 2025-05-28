import {
  type BundledJsonSchemaSpecifications,
  bundledJsonSchemaSpecifications,
} from "./BundledJsonSchemaTypes.ts";
import { type JsonSchemaSpecification } from "./JsonSchemaSpecification.ts";
import { type AdditionalJsonSchemaSpecifications } from "./JsonSchemaTranslationOptions.ts";
import { type EmptyObject } from "./utils.ts";

/** @internal */
export type ResolveSpecification<
  SpecificationOrName extends
    JsonSchemaSpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends
    AdditionalJsonSchemaSpecifications = EmptyObject,
> = SpecificationOrName extends JsonSchemaSpecification
  ? SpecificationOrName
  : SpecificationOrName extends keyof AdditionalSpecifications
    ? AdditionalSpecifications[SpecificationOrName]
    : SpecificationOrName extends keyof BundledJsonSchemaSpecifications
      ? BundledJsonSchemaSpecifications[SpecificationOrName]
      : never;

type JsonSchemaSpecificationOrName<
  AdditionalSpecifications extends
    AdditionalJsonSchemaSpecifications = EmptyObject,
> =
  | keyof BundledJsonSchemaSpecifications
  | keyof AdditionalSpecifications
  | JsonSchemaSpecification;

/** @internal */
export function resolveSpecification<
  SpecificationOrName extends
    JsonSchemaSpecificationOrName<AdditionalSpecifications>,
  AdditionalSpecifications extends AdditionalJsonSchemaSpecifications,
  Specification extends ResolveSpecification<
    SpecificationOrName,
    AdditionalSpecifications
  >,
>(
  specificationOrName: SpecificationOrName,
  additionalSpecifications: AdditionalSpecifications | undefined,
): Specification {
  switch (typeof specificationOrName) {
    case "object":
      return specificationOrName as Specification;
    case "string":
    case "number":
    case "symbol":
      if (
        additionalSpecifications &&
        specificationOrName in additionalSpecifications
      ) {
        return additionalSpecifications[specificationOrName] as Specification;
      } else if (specificationOrName in bundledJsonSchemaSpecifications) {
        return bundledJsonSchemaSpecifications[
          specificationOrName as keyof BundledJsonSchemaSpecifications
        ] as Specification;
      }
  }

  throw new Error("Specification not found");
}
