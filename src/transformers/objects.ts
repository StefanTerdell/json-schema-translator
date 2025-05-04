import { JsonSchema } from "../JsonSchema.ts";
import { NonEmptyArray } from "../utils.ts";
import { translateSchema } from "./schema.ts";
import { TransformerFunction } from "./TransformFunction.ts";

export const transformObjects: TransformerFunction = (input, output) => {
  if (input.schema.properties) {
    const { properties, required } = Object.keys(
      input.schema.properties,
    ).reduce(
      (
        acc: {
          properties: Record<string, JsonSchema<typeof output.settings>>;
          required: string[];
        },
        key,
      ) => {
        const schema = translateSchema(
          {
            settings: input.settings,
            schema: input.schema.properties![key],
          },
          {
            settings: output.settings,
            forceAllowBooleanSchema: false,
          },
        );

        if (output.settings.addAllOptionalToRequired) {
          acc.required.push(key);
        } else {
          const isOptionalByNullable =
            output.settings.nullable &&
            output.settings.addNullableToOptional &&
            typeof schema === "object" &&
            schema.nullable === true;

          const isOptionalByNullType =
            output.settings.nullType &&
            output.settings.addNullTypeToOptional &&
            typeof schema === "object" &&
            (schema.type === "null" ||
              (Array.isArray(schema.type) && schema.type.includes("null")));

          if (
            input.schema.required?.includes(key) &&
            !isOptionalByNullable &&
            !isOptionalByNullType
          ) {
            acc.required.push(key);
          }
        }

        acc.properties[key] = schema;

        return acc;
      },
      { properties: {}, required: [] },
    );

    if (Object.keys(properties).length > 0) {
      output.schema.properties = properties;

      if (required.length > 0 || !output.settings.nonEmptyRequired) {
        output.schema.required = required as NonEmptyArray<string>;
      }
    }
  }

  if (input.schema.additionalProperties !== undefined) {
    output.schema.additionalProperties = translateSchema(
      {
        settings: input.settings,
        schema: input.schema.additionalProperties,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: true,
      },
    );
  }

  if (input.schema.patternProperties !== undefined) {
    output.schema.patternProperties = Object.keys(
      input.schema.patternProperties,
    ).reduce((acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
      acc[key] = translateSchema(
        {
          settings: input.settings,
          schema: input.schema.patternProperties![key],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
        },
      );

      return acc;
    }, {});
  }

  if (
    input.settings.unevaluatedProperties &&
    output.settings.unevaluatedProperties &&
    input.schema.unevaluatedProperties !== undefined
  ) {
    output.schema.unevaluatedProperties = translateSchema(
      {
        settings: input.settings,
        // @ts-expect-error ISSUE: Narrowing :p
        schema: input.schema.unevaluatedProperties,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );
  }

  if (
    input.settings.propertyNames &&
    output.settings.propertyNames &&
    input.schema.propertyNames !== undefined
  ) {
    const propertyNames = translateSchema(
      {
        settings: input.settings,
        // @ts-expect-error ISSUE: Narrowing :p
        schema: input.schema.propertyNames,
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: false,
      },
    );

    if (typeof propertyNames === "object" && "type" in propertyNames) {
      delete propertyNames.type;
    }

    // @ts-expect-error ISSUE: Messy type not allowing "type" kw
    output.settings.propertyNames = propertyNames;
  }

  output.schema.maxProperties = input.schema.maxProperties;
  output.schema.minProperties = input.schema.minProperties;

  const dependentRequired = input.settings.dependentRequiredAndSchemas
    ? (input.schema.dependentRequired ?? {})
    : Object.keys(input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, NonEmptyArray<string>>, key) => {
          const required = input.schema.dependencies?.[key];

          if (
            Array.isArray(required) &&
            (required.length || !output.settings.nonEmptyDependencies)
          ) {
            acc[key] = required as NonEmptyArray<string>;
          }

          return acc;
        },
        {},
      );

  const dependentSchemas = input.settings.dependentRequiredAndSchemas
    ? Object.keys(input.schema.dependentSchemas ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
          // @ts-expect-error: god damnit
          const schema = input.schema.dependentSchemas[key] as JsonSchema<
            typeof input.settings
          >;

          acc[key] = translateSchema(
            {
              settings: input.settings,
              schema,
            },
            {
              settings: output.settings,
              forceAllowBooleanSchema: false,
            },
          );

          return acc;
        },
        {},
      )
    : Object.keys(input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
          const schema = input.schema.dependencies![key];

          if (!Array.isArray(schema)) {
            acc[key] = translateSchema(
              {
                settings: input.settings,
                schema,
              },
              {
                settings: output.settings,
                forceAllowBooleanSchema: false,
              },
            );
          }

          return acc;
        },
        {},
      );

  if (output.settings.dependentRequiredAndSchemas) {
    if (Object.keys(dependentRequired).length) {
      output.schema.dependentRequired = dependentRequired;
    }

    if (Object.keys(dependentSchemas).length) {
      output.schema.dependentSchemas = dependentSchemas;
    }
  } else {
    const dependencies = {
      ...dependentRequired,
      ...dependentSchemas,
    };

    if (Object.keys(dependencies).length) {
      output.schema.dependencies = dependencies;
    }
  }
};
